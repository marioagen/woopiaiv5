import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  ChevronsUpDown,
  MoreHorizontal,
  Workflow,
  Users,
  ExternalLink,
  Copy,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator, DropdownMenuLabel } from './ui/dropdown-menu';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { toast } from 'sonner@2.0.3';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';

interface WorkflowStep {
  id: number;
  nomeEtapa: string;
  perfilResponsavel: string;
  slaHoras: number;
}

interface WorkflowGestao {
  id: number;
  nomeWorkflow: string;
  timesAssociados: string[];
  usuarios: string[];
  etapas: WorkflowStep[];
  criadoEm: string;
  status: 'Ativo' | 'Inativo';
  ultimaExecucao?: string;
}

type SortField = 'nomeWorkflow' | 'timesAssociados' | 'criadoEm';
type SortDirection = 'asc' | 'desc';
type OrderBy = 'recent' | 'oldest' | 'alphabetical';

export function WorkflowGestaoPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const [sortField, setSortField] = useState<SortField>('nomeWorkflow');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // New filter states
  const [orderBy, setOrderBy] = useState<OrderBy>('recent');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<WorkflowGestao | null>(null);
  const [deleteDocAction, setDeleteDocAction] = useState<'delete' | 'move-to-stage'>('delete');
  const [deleteSelectedStage, setDeleteSelectedStage] = useState('');
  const [showDeleteFinalConfirm, setShowDeleteFinalConfirm] = useState(false);
  const [deleteFinalConfirmText, setDeleteFinalConfirmText] = useState('');

  // Mock: document counts per workflow
  const mockDocCountsPerWorkflow: Record<number, Record<number, number>> = {
    1: { 1: 5, 2: 7 },
    2: { 1: 3 },
    3: {},
    4: { 1: 2, 2: 8 },
    5: { 1: 1 },
    6: { 1: 4, 2: 2 },
    7: { 1: 6 },
    8: { 1: 3, 2: 5 },
    9: { 1: 2, 2: 1 },
    10: { 1: 9 },
    11: { 1: 1, 2: 3 },
    12: { 1: 7, 2: 4 },
    13: { 1: 12, 2: 3 },
    14: {},
    15: { 1: 2, 2: 1 },
    16: { 1: 15, 2: 8 },
    17: { 1: 5 },
  };

  const getDocsForWorkflow = (workflowId: number) => {
    const perStage = mockDocCountsPerWorkflow[workflowId] || {};
    const total = Object.values(perStage).reduce((sum, c) => sum + c, 0);
    return { perStage, total };
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Mock data
  const [workflows, setWorkflows] = useState<WorkflowGestao[]>([
    {
      id: 1,
      nomeWorkflow: 'Aprovação de Contratos',
      timesAssociados: ['RH', 'Jurídico'],
      usuarios: ['João Silva', 'Maria Santos', 'Pedro Costa'],
      etapas: [
        { id: 1, nomeEtapa: 'Análise Jurídica', perfilResponsavel: 'Advogado Sênior', slaHoras: 24 },
        { id: 2, nomeEtapa: 'Aprovação Financeira', perfilResponsavel: 'Gerente Financeiro', slaHoras: 48 }
      ],
      criadoEm: '2024-01-15',
      status: 'Ativo',
      ultimaExecucao: '2024-01-20'
    },
    {
      id: 2,
      nomeWorkflow: 'Análise de Documentos Fiscais',
      timesAssociados: ['Financeiro', 'Contabilidade'],
      usuarios: ['Ana Maria', 'Carlos Oliveira'],
      etapas: [
        { id: 1, nomeEtapa: 'Revisão Fiscal', perfilResponsavel: 'Contador', slaHoras: 12 }
      ],
      criadoEm: '2024-01-10',
      status: 'Ativo',
      ultimaExecucao: '2024-01-19'
    },
    {
      id: 3,
      nomeWorkflow: 'Revisão de Políticas Internas',
      timesAssociados: ['RH', 'Jurídico'],
      usuarios: ['Fernanda Lima', 'Roberto Mendes'],
      etapas: [],
      criadoEm: '2024-02-01',
      status: 'Inativo'
    },
    {
      id: 4,
      nomeWorkflow: 'Processamento de Relatórios',
      timesAssociados: ['Marketing', 'Desenvolvimento'],
      usuarios: ['Juliana Ferreira', 'Eduardo Santos', 'Marina Costa'],
      etapas: [
        { id: 1, nomeEtapa: 'Coleta de Dados', perfilResponsavel: 'Analista de Marketing', slaHoras: 8 },
        { id: 2, nomeEtapa: 'Desenvolvimento', perfilResponsavel: 'Desenvolvedor', slaHoras: 72 }
      ],
      criadoEm: '2024-01-20',
      status: 'Ativo',
      ultimaExecucao: '2024-01-21'
    },
    {
      id: 5,
      nomeWorkflow: 'Validação de Certificados',
      timesAssociados: ['RH', 'Qualidade'],
      usuarios: ['Luciana Oliveira'],
      etapas: [
        { id: 1, nomeEtapa: 'Verificação de Documentos', perfilResponsavel: 'Analista de RH', slaHoras: 24 }
      ],
      criadoEm: '2024-01-25',
      status: 'Ativo',
      ultimaExecucao: '2024-01-22'
    },
    {
      id: 6,
      nomeWorkflow: 'Onboarding de Colaboradores',
      timesAssociados: ['RH', 'TI'],
      usuarios: ['João Silva', 'Fernanda Lima'],
      etapas: [
        { id: 1, nomeEtapa: 'Coleta de Dados Pessoais', perfilResponsavel: 'Analista de RH', slaHoras: 8 },
        { id: 2, nomeEtapa: 'Configuração de Acessos', perfilResponsavel: 'Analista de TI', slaHoras: 4 }
      ],
      criadoEm: '2024-02-05',
      status: 'Ativo',
      ultimaExecucao: '2024-02-10'
    },
    {
      id: 7,
      nomeWorkflow: 'Auditoria de Compliance',
      timesAssociados: ['Jurídico', 'Qualidade'],
      usuarios: ['Roberto Mendes', 'Carlos Oliveira'],
      etapas: [
        { id: 1, nomeEtapa: 'Análise Regulatória', perfilResponsavel: 'Advogado', slaHoras: 48 }
      ],
      criadoEm: '2024-02-08',
      status: 'Ativo',
      ultimaExecucao: '2024-02-12'
    },
    {
      id: 8,
      nomeWorkflow: 'Gestão de Fornecedores',
      timesAssociados: ['Compras', 'Financeiro'],
      usuarios: ['Marina Costa', 'Eduardo Santos'],
      etapas: [
        { id: 1, nomeEtapa: 'Validação Cadastral', perfilResponsavel: 'Analista de Compras', slaHoras: 16 },
        { id: 2, nomeEtapa: 'Aprovação Financeira', perfilResponsavel: 'Gerente Financeiro', slaHoras: 24 }
      ],
      criadoEm: '2024-02-12',
      status: 'Ativo',
      ultimaExecucao: '2024-02-15'
    },
    {
      id: 9,
      nomeWorkflow: 'Aprovação de Despesas',
      timesAssociados: ['Financeiro', 'Diretoria'],
      usuarios: ['Ana Maria', 'Pedro Costa'],
      etapas: [
        { id: 1, nomeEtapa: 'Revisão do Gestor', perfilResponsavel: 'Gestor de Área', slaHoras: 12 },
        { id: 2, nomeEtapa: 'Aprovação Diretoria', perfilResponsavel: 'Diretor Financeiro', slaHoras: 24 }
      ],
      criadoEm: '2024-02-14',
      status: 'Ativo',
      ultimaExecucao: '2024-02-18'
    },
    {
      id: 10,
      nomeWorkflow: 'Análise de Crédito',
      timesAssociados: ['Financeiro', 'Risco'],
      usuarios: ['Carlos Oliveira', 'Juliana Ferreira'],
      etapas: [
        { id: 1, nomeEtapa: 'Score de Crédito', perfilResponsavel: 'Analista de Risco', slaHoras: 8 }
      ],
      criadoEm: '2024-02-18',
      status: 'Ativo',
      ultimaExecucao: '2024-02-20'
    },
    {
      id: 11,
      nomeWorkflow: 'Controle de Qualidade',
      timesAssociados: ['Qualidade', 'Produção'],
      usuarios: ['Luciana Oliveira', 'Roberto Mendes'],
      etapas: [
        { id: 1, nomeEtapa: 'Inspeção Inicial', perfilResponsavel: 'Inspetor de Qualidade', slaHoras: 4 },
        { id: 2, nomeEtapa: 'Laudo Técnico', perfilResponsavel: 'Engenheiro', slaHoras: 24 }
      ],
      criadoEm: '2024-02-20',
      status: 'Ativo',
      ultimaExecucao: '2024-02-22'
    },
    {
      id: 12,
      nomeWorkflow: 'Gestão de Incidentes',
      timesAssociados: ['TI', 'Suporte'],
      usuarios: ['Eduardo Santos', 'Marina Costa'],
      etapas: [
        { id: 1, nomeEtapa: 'Triagem', perfilResponsavel: 'Analista de Suporte', slaHoras: 2 },
        { id: 2, nomeEtapa: 'Resolução', perfilResponsavel: 'Especialista TI', slaHoras: 8 }
      ],
      criadoEm: '2024-02-22',
      status: 'Ativo',
      ultimaExecucao: '2024-02-25'
    },
    {
      id: 13,
      nomeWorkflow: 'Processo Seletivo',
      timesAssociados: ['RH'],
      usuarios: ['Fernanda Lima', 'João Silva'],
      etapas: [
        { id: 1, nomeEtapa: 'Triagem de CVs', perfilResponsavel: 'Recrutador', slaHoras: 48 },
        { id: 2, nomeEtapa: 'Entrevista Técnica', perfilResponsavel: 'Gestor de Área', slaHoras: 72 }
      ],
      criadoEm: '2024-03-01',
      status: 'Ativo',
      ultimaExecucao: '2024-03-05'
    },
    {
      id: 14,
      nomeWorkflow: 'Revisão de Contratos de Locação',
      timesAssociados: ['Jurídico', 'Administrativo'],
      usuarios: ['Roberto Mendes', 'Ana Maria'],
      etapas: [
        { id: 1, nomeEtapa: 'Análise de Cláusulas', perfilResponsavel: 'Advogado', slaHoras: 36 }
      ],
      criadoEm: '2024-03-05',
      status: 'Inativo'
    },
    {
      id: 15,
      nomeWorkflow: 'Emissão de Notas Fiscais',
      timesAssociados: ['Financeiro', 'Contabilidade'],
      usuarios: ['Carlos Oliveira', 'Juliana Ferreira'],
      etapas: [
        { id: 1, nomeEtapa: 'Conferência de Dados', perfilResponsavel: 'Assistente Fiscal', slaHoras: 4 },
        { id: 2, nomeEtapa: 'Validação Contábil', perfilResponsavel: 'Contador', slaHoras: 8 }
      ],
      criadoEm: '2024-03-08',
      status: 'Ativo',
      ultimaExecucao: '2024-03-10'
    },
    {
      id: 16,
      nomeWorkflow: 'Avaliação de Desempenho',
      timesAssociados: ['RH', 'Diretoria'],
      usuarios: ['Fernanda Lima', 'Pedro Costa'],
      etapas: [
        { id: 1, nomeEtapa: 'Autoavaliação', perfilResponsavel: 'Colaborador', slaHoras: 72 },
        { id: 2, nomeEtapa: 'Avaliação do Gestor', perfilResponsavel: 'Gestor', slaHoras: 48 }
      ],
      criadoEm: '2024-03-10',
      status: 'Ativo',
      ultimaExecucao: '2024-03-15'
    },
    {
      id: 17,
      nomeWorkflow: 'Gestão de Ativos',
      timesAssociados: ['TI', 'Administrativo'],
      usuarios: ['Eduardo Santos', 'Luciana Oliveira'],
      etapas: [
        { id: 1, nomeEtapa: 'Inventário', perfilResponsavel: 'Analista de TI', slaHoras: 24 }
      ],
      criadoEm: '2024-03-12',
      status: 'Ativo',
      ultimaExecucao: '2024-03-14'
    }
  ]);

  // Extract unique teams and users from workflows
  const allTeams = Array.from(new Set(workflows.flatMap(w => w.timesAssociados))).sort();
  const allUsers = Array.from(new Set(workflows.flatMap(w => w.usuarios))).sort();

  // Toggle functions for filters
  const toggleTeam = (team: string) => {
    setSelectedTeams(prev => 
      prev.includes(team) ? prev.filter(t => t !== team) : [...prev, team]
    );
    setCurrentPage(1);
  };

  const toggleUser = (user: string) => {
    setSelectedUsers(prev => 
      prev.includes(user) ? prev.filter(u => u !== user) : [...prev, user]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedTeams([]);
    setSelectedUsers([]);
    setOrderBy('recent');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm !== '' || selectedTeams.length > 0 || selectedUsers.length > 0;

  // Sorting and filtering
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-woopi-ai-gray" />;
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="w-4 h-4 text-woopi-ai-blue" />;
    }
    return <ChevronDown className="w-4 h-4 text-woopi-ai-blue" />;
  };

  const sortedAndFilteredWorkflows = workflows
    .filter((workflow) => {
      // Search filter (includes workflows name, teams, and users)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesName = workflow.nomeWorkflow.toLowerCase().includes(searchLower);
        const matchesTeam = workflow.timesAssociados.some(team => team.toLowerCase().includes(searchLower));
        const matchesUser = workflow.usuarios.some(user => user.toLowerCase().includes(searchLower));
        
        if (!matchesName && !matchesTeam && !matchesUser) {
          return false;
        }
      }
      
      // Team filter
      if (selectedTeams.length > 0) {
        const hasSelectedTeam = workflow.timesAssociados.some(team => selectedTeams.includes(team));
        if (!hasSelectedTeam) {
          return false;
        }
      }
      
      // User filter
      if (selectedUsers.length > 0) {
        const hasSelectedUser = workflow.usuarios.some(user => selectedUsers.includes(user));
        if (!hasSelectedUser) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply ordering based on orderBy selection
      switch (orderBy) {
        case 'recent':
          // Most recent first (descending by criadoEm)
          return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
        case 'oldest':
          // Oldest first (ascending by criadoEm)
          return new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime();
        case 'alphabetical':
          // Alphabetical order by name
          return a.nomeWorkflow.localeCompare(b.nomeWorkflow);
        default:
          return 0;
      }
    });

  // Pagination logic
  const totalItems = sortedAndFilteredWorkflows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedWorkflows = sortedAndFilteredWorkflows.slice(startIndex, endIndex);

  const getVisiblePages = (): (number | 'ellipsis')[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];

    if (safeCurrentPage <= 3) {
      pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
    } else if (safeCurrentPage >= totalPages - 2) {
      pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, 'ellipsis', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, 'ellipsis', totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    const target = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(target);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Navigation functions
  const openCreateForm = () => {
    navigate('/workflow/gestao/novo');
  };

  const openEditForm = (workflow: WorkflowGestao) => {
    navigate(`/workflow/gestao/editar/${workflow.id}`);
  };

  const handleDelete = (workflow: WorkflowGestao) => {
    setWorkflowToDelete(workflow);
    setDeleteDocAction('delete');
    setDeleteSelectedStage('');
    setIsDeleteModalOpen(true);
  };

  const handleAccess = (workflow: WorkflowGestao) => {
    navigate('/documentos/workflow');
  };

  const confirmDeleteWithDocs = () => {
    if (!workflowToDelete) return;

    // Always show final confirmation since docs will be deleted
    const { total } = getDocsForWorkflow(workflowToDelete.id);
    if (total > 0) {
      setShowDeleteFinalConfirm(true);
      return;
    }

    executeDelete();
  };

  const executeDelete = () => {
    if (!workflowToDelete) return;
    const { total } = getDocsForWorkflow(workflowToDelete.id);
    
    const docMsg = total > 0 ? `${total} documentos excluídos permanentemente. ` : '';
    setWorkflows(prev => prev.filter(w => w.id !== workflowToDelete.id));
    toast.success(`${docMsg}Esteira "${workflowToDelete.nomeWorkflow}" removida com sucesso.`);
    
    setIsDeleteModalOpen(false);
    setShowDeleteFinalConfirm(false);
    setDeleteFinalConfirmText('');
    setWorkflowToDelete(null);
    setDeleteDocAction('delete');
    setDeleteSelectedStage('');
  };

  const confirmDelete = () => {
    if (workflowToDelete) {
      const { total } = getDocsForWorkflow(workflowToDelete.id);
      if (total > 0) {
        // Has documents - handled by the Jira-like modal
        return;
      }
      // No documents, delete directly
      setWorkflows(prev => prev.filter(w => w.id !== workflowToDelete.id));
      toast.success(`Esteira "${workflowToDelete.nomeWorkflow}" removida com sucesso.`);
      setIsDeleteModalOpen(false);
      setWorkflowToDelete(null);
    }
  };

  const handleClone = (workflow: WorkflowGestao) => {
    // Navegar para o formulário de criação com os dados da esteira
    const cloneName = `Cópia de ${workflow.nomeWorkflow}`;
    const cloneTeams = workflow.timesAssociados;
    
    navigate('/workflow/gestao/novo', {
      state: {
        cloneData: {
          nomeWorkflow: cloneName,
          timesAssociados: cloneTeams
        }
      }
    });
    
    toast.success('Preparando clonagem da esteira...');
  };





  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="woopi-ai-text-primary">Gestão de esteiras</h1>
          <p className="woopi-ai-text-secondary">
            Gerencie e configure esteiras de processamento de documentos
          </p>
        </div>
        <Button 
          onClick={openCreateForm}
          className="woopi-ai-button-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Esteira
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="woopi-ai-card">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 woopi-ai-text-secondary" />
                <Input
                  placeholder="Buscar por nome da esteira, times ou usuários..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="pl-10 pr-10 border border-woopi-ai-border"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray hover:text-woopi-ai-dark-gray transition-colors"
                    title="Limpar busca"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                {/* Order By Select */}
                <div className="w-full sm:w-[200px]">
                  <Select value={orderBy} onValueChange={(value: OrderBy) => setOrderBy(value)}>
                    <SelectTrigger className="border-woopi-ai-border">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Mais Recente</SelectItem>
                      <SelectItem value="oldest">Mais Antigo</SelectItem>
                      <SelectItem value="alphabetical">Ordem Alfabética</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Teams Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="border-woopi-ai-border hover:bg-woopi-ai-light-gray"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Times
                      {selectedTeams.length > 0 && (
                        <Badge 
                          variant="secondary" 
                          className="ml-2 bg-[#0073ea] text-white hover:bg-[#0073ea]/90 rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs"
                        >
                          {selectedTeams.length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Filtrar por Times</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allTeams.length > 0 ? (
                      allTeams.map((team) => (
                        <DropdownMenuCheckboxItem
                          key={team}
                          checked={selectedTeams.includes(team)}
                          onCheckedChange={() => toggleTeam(team)}
                        >
                          {team}
                        </DropdownMenuCheckboxItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-woopi-ai-gray">
                        Nenhum time disponível
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Users Filter */}
                {/* REMOVED */}
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  onClick={clearAllFilters}
                  className="text-woopi-ai-gray hover:text-woopi-ai-dark-gray hover:bg-woopi-ai-light-gray whitespace-nowrap"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpar Filtros
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-woopi-ai-gray">Filtros ativos:</span>
                {selectedTeams.map((team) => (
                  <Badge 
                    key={team}
                    variant="secondary"
                    className="bg-[#0073ea] text-white hover:bg-[#0073ea]/90 gap-1"
                  >
                    <Users className="w-3 h-3" />
                    {team}
                    <button
                      type="button"
                      onClick={() => toggleTeam(team)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {selectedUsers.map((user) => (
                  <Badge 
                    key={user}
                    variant="secondary"
                    className="bg-[#0073ea] text-white hover:bg-[#0073ea]/90 gap-1"
                  >
                    <UserCheck className="w-3 h-3" />
                    {user}
                    <button
                      type="button"
                      onClick={() => toggleUser(user)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Workflows Table */}
      <Card className="woopi-ai-card">
        <CardHeader>
          <CardTitle className="woopi-ai-text-primary">
            Esteiras ({sortedAndFilteredWorkflows.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden md:block table-scroll-container" style={{ minWidth: '700px' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-woopi-ai-light-gray transition-colors"
                    onClick={() => handleSort('nomeWorkflow')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nome da Esteira</span>
                      {getSortIcon('nomeWorkflow')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-woopi-ai-light-gray transition-colors"
                    onClick={() => handleSort('timesAssociados')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Times Associados</span>
                      {getSortIcon('timesAssociados')}
                    </div>
                  </TableHead>
                  <TableHead className="w-20">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedWorkflows.length > 0 ? (
                  paginatedWorkflows.map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell>
                        <div className="font-medium woopi-ai-text-primary">{workflow.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="font-medium woopi-ai-text-primary">{workflow.nomeWorkflow}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {workflow.timesAssociados.map((team, index) => (
                            <Badge 
                              key={index}
                              variant="outline"
                              className="bg-card border-woopi-ai-border text-woopi-ai-dark-gray hover:bg-woopi-ai-light-gray text-xs px-2 py-1"
                            >
                              <Users className="w-3 h-3 mr-1" />
                              {team}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleAccess(workflow)}
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Acessar</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openEditForm(workflow)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-[#2d3354]"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDelete(workflow)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Excluir</p>
                            </TooltipContent>
                          </Tooltip>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-[#2d3354]"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleClone(workflow)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Clonar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Workflow className="w-8 h-8 text-woopi-ai-gray opacity-50" />
                        <span className="text-woopi-ai-gray">
                          {searchTerm 
                            ? 'Nenhuma esteira encontrada com os filtros aplicados' 
                            : 'Nenhuma esteira cadastrada'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4">
            {paginatedWorkflows.length > 0 ? (
              paginatedWorkflows.map((workflow) => (
                <div key={workflow.id} className="border border-woopi-ai-border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium woopi-ai-text-primary">{workflow.nomeWorkflow}</p>
                      </div>
                      <p className="text-xs woopi-ai-text-secondary mb-2">ID: {workflow.id}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-[#2d3354]"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAccess(workflow)}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Acessar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleClone(workflow)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Clonar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs woopi-ai-text-secondary">Times:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {workflow.timesAssociados.map((team, index) => (
                          <Badge 
                            key={index}
                            variant="outline"
                            className="bg-card text-xs"
                          >
                            {team}
                          </Badge>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <Workflow className="w-8 h-8 text-woopi-ai-gray opacity-50" />
                  <span className="text-woopi-ai-gray">
                    {searchTerm 
                      ? 'Nenhuma esteira encontrada com os filtros aplicados' 
                      : 'Nenhuma esteira cadastrada'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-3 pt-3 border-t border-woopi-ai-border">
              {/* Left: Info text + items per page selector */}
              <div className="flex items-center gap-4 order-1">
                <p className="text-sm woopi-ai-text-secondary whitespace-nowrap">
                  Mostrando <span className="font-medium woopi-ai-text-primary">{startIndex + 1}</span>–<span className="font-medium woopi-ai-text-primary">{endIndex}</span> de{' '}
                  <span className="font-medium woopi-ai-text-primary">{totalItems}</span>
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm woopi-ai-text-secondary whitespace-nowrap">por página:</span>
                  <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="w-[72px] h-8 border-woopi-ai-border text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right: Page navigation */}
              {totalPages > 1 ? (
                <div className="flex items-center gap-1 order-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        disabled={safeCurrentPage === 1}
                        className="h-8 w-8 p-0 border-woopi-ai-border disabled:opacity-40"
                      >
                        <ChevronsLeft className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Primeira página</p></TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(safeCurrentPage - 1)}
                        disabled={safeCurrentPage === 1}
                        className="h-8 w-8 p-0 border-woopi-ai-border disabled:opacity-40"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Página anterior</p></TooltipContent>
                  </Tooltip>

                  {getVisiblePages().map((page, idx) =>
                    page === 'ellipsis' ? (
                      <span key={`ellipsis-${idx}`} className="flex items-center justify-center w-8 h-8 text-sm woopi-ai-text-secondary select-none">
                        ...
                      </span>
                    ) : (
                      <Button
                        key={page}
                        variant={page === safeCurrentPage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={
                          page === safeCurrentPage
                            ? 'h-8 w-8 p-0 woopi-ai-button-primary text-sm font-medium'
                            : 'h-8 w-8 p-0 border-woopi-ai-border text-sm font-medium hover:bg-woopi-ai-light-gray'
                        }
                      >
                        {page}
                      </Button>
                    )
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(safeCurrentPage + 1)}
                        disabled={safeCurrentPage === totalPages}
                        className="h-8 w-8 p-0 border-woopi-ai-border disabled:opacity-40"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Próxima página</p></TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={safeCurrentPage === totalPages}
                        className="h-8 w-8 p-0 border-woopi-ai-border disabled:opacity-40"
                      >
                        <ChevronsRight className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Última página</p></TooltipContent>
                  </Tooltip>
                </div>
              ) : (
                <div className="order-2" />
              )}
            </div>
          )}
        </CardContent>
      </Card>



      {/* Delete Confirmation Dialog - Simple (no docs) */}
      {workflowToDelete && (() => {
        const { total } = getDocsForWorkflow(workflowToDelete.id);
        return total === 0;
      })() && (
        <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="woopi-ai-text-primary">Excluir esteira</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a esteira "{workflowToDelete.nomeWorkflow}"?
                Essa esteira não possui documentos em andamento.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                className="woopi-ai-button-error"
              >
                Excluir esteira
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete Confirmation Dialog - With docs (Jira-like) */}
      {workflowToDelete && (() => {
        const { total } = getDocsForWorkflow(workflowToDelete.id);
        return total > 0;
      })() && (
        <div className="contents">
          <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent className="max-w-lg mx-4">
              <DialogHeader className="space-y-4">
                <div className="mx-auto w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
                </div>
                <DialogTitle className="text-center text-lg woopi-ai-text-primary">
                  Excluir esteira "{workflowToDelete.nomeWorkflow}"
                </DialogTitle>
                <DialogDescription className="text-center text-sm text-woopi-ai-gray leading-relaxed">
                  Esta esteira possui <span className="font-semibold text-woopi-ai-dark-gray">{getDocsForWorkflow(workflowToDelete.id).total} documentos</span> em andamento.
                  Ao excluir a esteira, todos os documentos serão permanentemente removidos.
                </DialogDescription>
              </DialogHeader>

              {/* Document breakdown per stage */}
              <div className="flex flex-wrap gap-2 justify-center">
                {workflowToDelete.etapas.map((etapa, index) => {
                  const count = getDocsForWorkflow(workflowToDelete.id).perStage[etapa.id] || 0;
                  if (count === 0) return null;
                  return (
                    <div key={etapa.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#2d3354] border border-woopi-ai-border">
                      <div className="w-4 h-4 bg-woopi-ai-blue text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                        {index + 1}
                      </div>
                      <span className="text-xs text-woopi-ai-gray">{etapa.nomeEtapa}:</span>
                      <span className="text-xs font-semibold woopi-ai-text-primary">{count}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/40">
                <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-woopi-ai-gray leading-relaxed">
                  <span className="font-semibold text-red-600 dark:text-red-400">{getDocsForWorkflow(workflowToDelete.id).total} documentos</span> serão excluídos permanentemente junto com a esteira.
                  Esta ação é irreversível e não pode ser desfeita.
                </p>
              </div>

              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2">
                <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setDeleteDocAction('delete'); setDeleteSelectedStage(''); }} className="border-woopi-ai-border">
                  Cancelar
                </Button>
                <Button onClick={confirmDeleteWithDocs} className="bg-red-600 hover:bg-red-700 text-white">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir esteira e documentos
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Final confirmation for destructive delete of documents */}
          <Dialog open={showDeleteFinalConfirm} onOpenChange={setShowDeleteFinalConfirm}>
            <DialogContent className="max-w-lg mx-4">
              <DialogHeader className="space-y-4">
                <div className="mx-auto w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Trash2 className="w-7 h-7 text-red-600 dark:text-red-400" />
                </div>
                <DialogTitle className="text-center text-lg woopi-ai-text-primary">
                  Confirmar exclusão permanente
                </DialogTitle>
                <DialogDescription className="text-center text-sm text-woopi-ai-gray leading-relaxed">
                  Você está prestes a excluir permanentemente <span className="font-semibold text-woopi-ai-dark-gray">{getDocsForWorkflow(workflowToDelete.id).total} documentos</span> e a esteira "{workflowToDelete.nomeWorkflow}".
                  Essa ação é irreversível. Digite <span className="font-mono font-bold text-red-500">{workflowToDelete.nomeWorkflow}</span> para confirmar:
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input value={deleteFinalConfirmText} onChange={(e) => setDeleteFinalConfirmText(e.target.value)} placeholder={`Digite '${workflowToDelete.nomeWorkflow}' para confirmar`} className="border border-woopi-ai-border w-full" />
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2">
                <Button variant="outline" onClick={() => { setShowDeleteFinalConfirm(false); setDeleteFinalConfirmText(''); }} className="border-woopi-ai-border">
                  Cancelar
                </Button>
                <Button onClick={executeDelete} className="bg-red-600 hover:bg-red-700 text-white" disabled={deleteFinalConfirmText !== workflowToDelete.nomeWorkflow}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir permanentemente
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}