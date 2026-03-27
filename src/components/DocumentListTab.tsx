import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Download,
  Eye,
  Upload,
  File,
  Files,
  FileText,
  Image,
  X,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Workflow,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  UserCheck,
  CircleX,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SearchableSelect } from './ui/searchable-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: 'Aguardando análise' | 'Analisado' | 'Finalizado';
  tags: string[];
  description: string;
  uploadedBy: string;
  workflows: string[];
}

type SortField = 'name' | 'description' | 'uploadDate' | 'status' | 'workflows';
type SortDirection = 'asc' | 'desc' | null;

export function DocumentListTab() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Checkbox selection states
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Sorting states
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Search and filter states
  const [documentSearch, setDocumentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [workflowsFilter, setWorkflowsFilter] = useState('all');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('all');

  const handleSearchChange = (value: string) => {
    setDocumentSearch(value);
    setCurrentPage(1);
  };
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };
  const handleWorkflowsFilterChange = (value: string) => {
    setWorkflowsFilter(value);
    setCurrentPage(1);
  };
  const handleDocumentTypeFilterChange = (value: string) => {
    setDocumentTypeFilter(value);
    setCurrentPage(1);
  };

  // Workflow selector dialog states
  const [workflowSelectorOpen, setWorkflowSelectorOpen] = useState(false);
  const [selectedDocumentForConsult, setSelectedDocumentForConsult] = useState<Document | null>(null);
  const [workflowSearchTerm, setWorkflowSearchTerm] = useState('');

  // Reprovar modal states
  const [isReprovarModalOpen, setIsReprovarModalOpen] = useState(false);
  const [selectedDocForReprovar, setSelectedDocForReprovar] = useState<Document | null>(null);
  const [reprovarJustificativa, setReprovarJustificativa] = useState('');
  const [reprovarEtapa, setReprovarEtapa] = useState('');
  const [reprovarAtribuir, setReprovarAtribuir] = useState('');
  const [reprovarUserSearch, setReprovarUserSearch] = useState('');

  const REPROVAR_USERS = [
    { value: 'ana-silva', name: 'Ana Silva', role: 'Analista', initials: 'AS', color: 'bg-[#0073ea]' },
    { value: 'carlos-mendes', name: 'Carlos Mendes', role: 'Supervisor', initials: 'CM', color: 'bg-[#0073ea]' },
    { value: 'juliana-costa', name: 'Juliana Costa', role: 'Revisora', initials: 'JC', color: 'bg-[#0073ea]' },
    { value: 'roberto-alves', name: 'Roberto Alves', role: 'Gerente', initials: 'RA', color: 'bg-[#0073ea]' },
    { value: 'fernanda-lima', name: 'Fernanda Lima', role: 'Analista', initials: 'FL', color: 'bg-[#0073ea]' },
  ];

  // Atribuir modal states
  const [isAtribuirModalOpen, setIsAtribuirModalOpen] = useState(false);
  const [selectedDocForAtribuir, setSelectedDocForAtribuir] = useState<Document | null>(null);
  const [selectedResponsavel, setSelectedResponsavel] = useState('');
  const [atribuirUserSearch, setAtribuirUserSearch] = useState('');

  // Bulk Atribuir modal states
  const [isBulkAtribuirModalOpen, setIsBulkAtribuirModalOpen] = useState(false);
  const [bulkSelectedResponsavel, setBulkSelectedResponsavel] = useState('');
  const [bulkAtribuirUserSearch, setBulkAtribuirUserSearch] = useState('');

  // Bulk Reprovar modal states
  const [isBulkReprovarModalOpen, setIsBulkReprovarModalOpen] = useState(false);
  const [bulkReprovarJustificativa, setBulkReprovarJustificativa] = useState('');

  // Documents data
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      name: 'Contrato_Fornecedor_2024.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      status: 'Analisado',
      tags: ['Contrato', 'Jurídico'],
      description: 'Contrato de fornecimento de materiais para 2024',
      uploadedBy: 'João Silva',
      workflows: ['Análise Jurídica', 'Aprovação Financeira']
    },
    {
      id: 2,
      name: 'Relatório_Financeiro_Q1.xlsx',
      type: 'Excel',
      size: '1.8 MB',
      uploadDate: '2024-01-14',
      status: 'Aguardando análise',
      tags: ['Financeiro', 'Relatório'],
      description: 'Relatório financeiro do primeiro trimestre',
      uploadedBy: 'Maria Santos',
      workflows: ['Revisão Financeira']
    },
    {
      id: 3,
      name: 'Apresentação_Projeto.pptx',
      type: 'PowerPoint',
      size: '5.2 MB',
      uploadDate: '2024-01-13',
      status: 'Aguardando análise',
      tags: ['Projeto', 'Apresentação'],
      description: 'Apresentação do novo projeto de expansão',
      uploadedBy: 'Pedro Costa',
      workflows: ['Aprovação de Projetos', 'Review Marketing']
    },
    {
      id: 4,
      name: 'Manual_Procedimentos.docx',
      type: 'Word',
      size: '892 KB',
      uploadDate: '2024-01-12',
      status: 'Analisado',
      tags: ['Manual', 'RH'],
      description: 'Manual de procedimentos internos atualizado',
      uploadedBy: 'Ana Maria',
      workflows: ['Validação RH']
    },
    {
      id: 5,
      name: 'Fatura_Janeiro_2024.pdf',
      type: 'PDF',
      size: '345 KB',
      uploadDate: '2024-01-11',
      status: 'Aguardando análise',
      tags: ['Fatura', 'Financeiro'],
      description: 'Fatura de serviços de janeiro 2024',
      uploadedBy: 'Carlos Oliveira',
      workflows: ['Processamento de Pagamentos']
    },
    {
      id: 6,
      name: 'Proposta_Comercial_2024.pdf',
      type: 'PDF',
      size: '1.5 MB',
      uploadDate: '2024-01-10',
      status: 'Analisado',
      tags: ['Comercial', 'Proposta'],
      description: 'Proposta comercial para cliente estratégico',
      uploadedBy: 'Laura Mendes',
      workflows: ['Aprovação Comercial']
    },
    {
      id: 7,
      name: 'Relatório_Auditoria_2023.pdf',
      type: 'PDF',
      size: '3.1 MB',
      uploadDate: '2024-01-09',
      status: 'Finalizado',
      tags: ['Auditoria', 'Compliance'],
      description: 'Relatório final de auditoria interna 2023',
      uploadedBy: 'Roberto Mendes',
      workflows: ['Compliance e Auditoria']
    },
    {
      id: 8,
      name: 'Ata_Reuniao_Diretoria.pdf',
      type: 'PDF',
      size: '1.2 MB',
      uploadDate: '2024-01-08',
      status: 'Analisado',
      tags: ['Ata', 'Diretoria'],
      description: 'Ata da reunião ordinária da diretoria executiva',
      uploadedBy: 'Fernanda Alves',
      workflows: ['Aprovação de Projetos']
    },
    {
      id: 9,
      name: 'Nota_Fiscal_Servicos_TI.pdf',
      type: 'PDF',
      size: '520 KB',
      uploadDate: '2024-01-07',
      status: 'Aguardando análise',
      tags: ['Nota Fiscal', 'TI'],
      description: 'Nota fiscal de serviços de infraestrutura de TI',
      uploadedBy: 'Ricardo Torres',
      workflows: ['Processamento de Pagamentos', 'Revisão Financeira']
    },
    {
      id: 10,
      name: 'Politica_Seguranca_2024.docx',
      type: 'Word',
      size: '2.1 MB',
      uploadDate: '2024-01-06',
      status: 'Analisado',
      tags: ['Política', 'Segurança'],
      description: 'Política de segurança da informação atualizada para 2024',
      uploadedBy: 'Lucas Mendes',
      workflows: ['Compliance e Auditoria', 'Validação RH']
    },
    {
      id: 11,
      name: 'Contrato_Aluguel_Sede.pdf',
      type: 'PDF',
      size: '3.8 MB',
      uploadDate: '2024-01-05',
      status: 'Finalizado',
      tags: ['Contrato', 'Imobiliário'],
      description: 'Contrato de aluguel da sede administrativa',
      uploadedBy: 'Juliana Pereira',
      workflows: ['Análise Jurídica']
    },
    {
      id: 12,
      name: 'Relatorio_Vendas_Q4.xlsx',
      type: 'Excel',
      size: '4.5 MB',
      uploadDate: '2024-01-04',
      status: 'Aguardando análise',
      tags: ['Vendas', 'Relatório'],
      description: 'Relatório consolidado de vendas do quarto trimestre',
      uploadedBy: 'Marcos Rodrigues',
      workflows: ['Aprovação Comercial', 'Revisão Financeira']
    },
    {
      id: 13,
      name: 'Certificado_ISO_9001.pdf',
      type: 'PDF',
      size: '980 KB',
      uploadDate: '2024-01-03',
      status: 'Finalizado',
      tags: ['Certificação', 'Qualidade'],
      description: 'Certificado de renovação da ISO 9001:2015',
      uploadedBy: 'Eduardo Martins',
      workflows: ['Controle de Qualidade']
    },
    {
      id: 14,
      name: 'Orcamento_Marketing_2024.xlsx',
      type: 'Excel',
      size: '1.6 MB',
      uploadDate: '2024-01-02',
      status: 'Analisado',
      tags: ['Orçamento', 'Marketing'],
      description: 'Orçamento anual do departamento de marketing',
      uploadedBy: 'Beatriz Campos',
      workflows: ['Aprovação Financeira', 'Review Marketing']
    },
    {
      id: 15,
      name: 'Laudo_Tecnico_Equipamentos.pdf',
      type: 'PDF',
      size: '2.7 MB',
      uploadDate: '2024-01-01',
      status: 'Aguardando análise',
      tags: ['Laudo', 'Técnico'],
      description: 'Laudo técnico de inspeção dos equipamentos industriais',
      uploadedBy: 'Gabriel Nunes',
      workflows: ['Controle de Qualidade']
    },
    {
      id: 16,
      name: 'Plano_Negocios_Expansao.pptx',
      type: 'PowerPoint',
      size: '8.3 MB',
      uploadDate: '2023-12-28',
      status: 'Analisado',
      tags: ['Plano', 'Estratégia'],
      description: 'Plano de negócios para expansão regional',
      uploadedBy: 'Amanda Silva',
      workflows: ['Aprovação de Projetos', 'Aprovação Financeira']
    },
    {
      id: 17,
      name: 'Termo_Confidencialidade.pdf',
      type: 'PDF',
      size: '450 KB',
      uploadDate: '2023-12-27',
      status: 'Finalizado',
      tags: ['Termo', 'Jurídico'],
      description: 'Termo de confidencialidade para parceiros comerciais',
      uploadedBy: 'Carla Ribeiro',
      workflows: ['Análise Jurídica']
    },
    {
      id: 18,
      name: 'Inventario_Ativos_2023.xlsx',
      type: 'Excel',
      size: '5.9 MB',
      uploadDate: '2023-12-26',
      status: 'Aguardando análise',
      tags: ['Inventário', 'Patrimônio'],
      description: 'Inventário completo de ativos fixos da empresa',
      uploadedBy: 'Thiago Martins',
      workflows: ['Compliance e Auditoria', 'Revisão Financeira']
    },
    {
      id: 19,
      name: 'Folha_Pagamento_Dezembro.pdf',
      type: 'PDF',
      size: '1.1 MB',
      uploadDate: '2023-12-25',
      status: 'Finalizado',
      tags: ['Folha', 'RH'],
      description: 'Folha de pagamento do mês de dezembro 2023',
      uploadedBy: 'Ana Maria',
      workflows: ['Validação RH', 'Processamento de Pagamentos']
    },
    {
      id: 20,
      name: 'Minuta_Contrato_Parceria.docx',
      type: 'Word',
      size: '1.4 MB',
      uploadDate: '2023-12-24',
      status: 'Aguardando análise',
      tags: ['Minuta', 'Parceria'],
      description: 'Minuta de contrato de parceria estratégica com fornecedor',
      uploadedBy: 'Pedro Costa',
      workflows: ['Análise Jurídica', 'Aprovação Comercial']
    },
  ]);

  // Available workflows for the workflow selector
  const availableWorkflows = [
    'Análise Jurídica',
    'Aprovação Financeira',
    'Revisão Financeira',
    'Aprovação de Projetos',
    'Review Marketing',
    'Validação RH',
    'Processamento de Pagamentos',
    'Aprovação Comercial',
    'Controle de Qualidade',
    'Compliance e Auditoria'
  ];

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredAndSortedDocuments.map(doc => doc.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectDocument = (id: number) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter(docId => docId !== id));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedDocuments, id];
      setSelectedDocuments(newSelected);
      if (newSelected.length === filteredAndSortedDocuments.length) {
        setSelectAll(true);
      }
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // If clicking the same field, cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      // New field, start with ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />;
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="w-4 h-4 text-woopi-ai-blue" />;
    }
    if (sortDirection === 'desc') {
      return <ChevronDown className="w-4 h-4 text-woopi-ai-blue" />;
    }
    return <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />;
  };

  const filterDocuments = (docs: Document[]) => {
    return docs.filter(doc => {
      const matchesSearch = 
        doc.name.toLowerCase().includes(documentSearch.toLowerCase()) ||
        doc.description.toLowerCase().includes(documentSearch.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
      
      const matchesWorkflow = workflowsFilter === 'all' || 
        doc.workflows.some(w => w === workflowsFilter);

      // Verificar se é documento em lote (id === 2 no mock)
      const isBatch = doc.id === 2;
      const matchesDocumentType = 
        documentTypeFilter === 'all' || 
        (documentTypeFilter === 'batch' && isBatch) ||
        (documentTypeFilter === 'single' && !isBatch);

      return matchesSearch && matchesStatus && matchesWorkflow && matchesDocumentType;
    });
  };

  const sortDocuments = (docs: Document[]) => {
    if (!sortField || !sortDirection) return docs;

    return [...docs].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Special handling for workflows (array)
      if (sortField === 'workflows') {
        aValue = a.workflows.join(', ');
        bValue = b.workflows.join(', ');
      }

      // Convert to string for comparison
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredAndSortedDocuments = sortDocuments(filterDocuments(documents));
  
  // Pagination
  const totalItems = filteredAndSortedDocuments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedDocuments = filteredAndSortedDocuments.slice(startIndex, endIndex);

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
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success('Documento excluído com sucesso');
  };

  const handleBulkDelete = () => {
    setDocuments(documents.filter(doc => !selectedDocuments.includes(doc.id)));
    setSelectedDocuments([]);
    setSelectAll(false);
    toast.success(`${selectedDocuments.length} documento(s) excluído(s) com sucesso`);
  };

  const handleConfirmBulkAtribuir = () => {
    if (!bulkSelectedResponsavel) {
      toast.error('Por favor, selecione um responsável.');
      return;
    }
    const userName = REPROVAR_USERS.find(u => u.value === bulkSelectedResponsavel)?.name ?? bulkSelectedResponsavel;
    toast.success(`${selectedDocuments.length} documento(s) atribuído(s) para: ${userName}`);
    setIsBulkAtribuirModalOpen(false);
    setBulkSelectedResponsavel('');
    setBulkAtribuirUserSearch('');
    setSelectedDocuments([]);
    setSelectAll(false);
  };

  const handleConfirmBulkReprovar = () => {
    if (!bulkReprovarJustificativa.trim()) {
      toast.error('Por favor, forneça uma justificativa para a reprovação.');
      return;
    }
    toast.error(`${selectedDocuments.length} documento(s) reprovado(s).`);
    setIsBulkReprovarModalOpen(false);
    setBulkReprovarJustificativa('');
    setSelectedDocuments([]);
    setSelectAll(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <File className="w-4 h-4 text-red-600" />;
      case 'excel':
      case 'xlsx':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'word':
      case 'docx':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'powerpoint':
      case 'pptx':
        return <FileText className="w-4 h-4 text-orange-600" />;
      case 'image':
      case 'jpg':
      case 'png':
        return <Image className="w-4 h-4 text-purple-600" />;
      default:
        return <File className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleConsultWorkflow = (doc: Document) => {
    setSelectedDocumentForConsult(doc);
    setWorkflowSelectorOpen(true);
  };

  const handleWorkflowSelection = (workflow: string) => {
    toast.loading('Iniciando consulta ao documento...', {
      duration: 2000,
    });
    
    setTimeout(() => {
      setWorkflowSelectorOpen(false);
      navigate(`/documentos/${selectedDocumentForConsult?.id}/analisar?workflow=${encodeURIComponent(workflow)}`);
    }, 2000);
  };

  const filteredWorkflows = availableWorkflows.filter(workflow =>
    workflow.toLowerCase().includes(workflowSearchTerm.toLowerCase())
  );

  const handleOpenReprovar = (doc: Document) => {
    setSelectedDocForReprovar(doc);
    setReprovarJustificativa('');
    setReprovarEtapa('');
    setReprovarAtribuir('');
    setReprovarUserSearch('');
    setIsReprovarModalOpen(true);
  };

  const handleConfirmReprovar = () => {
    if (!reprovarJustificativa.trim()) {
      toast.error('Por favor, forneça uma justificativa para a reprovação.');
      return;
    }
    if (!reprovarEtapa) {
      toast.error('Por favor, selecione a etapa de retorno.');
      return;
    }
    toast.error(`Documento reprovado. Retornando para: ${reprovarEtapa}`);
    setIsReprovarModalOpen(false);
    setSelectedDocForReprovar(null);
    setReprovarJustificativa('');
    setReprovarEtapa('');
    setReprovarAtribuir('');
    setReprovarUserSearch('');
  };

  const handleOpenAtribuir = (doc: Document) => {
    setSelectedDocForAtribuir(doc);
    setSelectedResponsavel('');
    setAtribuirUserSearch('');
    setIsAtribuirModalOpen(true);
  };

  const handleConfirmAtribuir = () => {
    if (!selectedResponsavel) {
      toast.error('Por favor, selecione um responsável.');
      return;
    }
    const userName = REPROVAR_USERS.find(u => u.value === selectedResponsavel)?.name ?? selectedResponsavel;
    toast.success(`Documento atribuído para: ${userName}`);
    setIsAtribuirModalOpen(false);
    setSelectedDocForAtribuir(null);
    setSelectedResponsavel('');
    setAtribuirUserSearch('');
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="woopi-ai-text-primary">
              Documentos ({filteredAndSortedDocuments.length})
            </CardTitle>
            <Button 
              className="woopi-ai-button-primary w-full md:w-auto"
              onClick={() => navigate('/documentos/carregar')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Documento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Bulk Actions Bar - Only show when items are selected */}
          {selectedDocuments.length > 0 && (
            <div className="mb-4 p-3 bg-woopi-ai-light-gray border border-woopi-ai-border rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-woopi-ai-blue text-white text-xs font-bold">
                    {selectedDocuments.length}
                  </div>
                  <span className="text-sm font-medium woopi-ai-text-primary">
                    {selectedDocuments.length === 1 ? 'documento selecionado' : 'documentos selecionados'}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    size="sm"
                    onClick={() => { setBulkSelectedResponsavel(''); setBulkAtribuirUserSearch(''); setIsBulkAtribuirModalOpen(true); }}
                    className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Atribuir
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => { setBulkReprovarJustificativa(''); setIsBulkReprovarModalOpen(true); }}
                    className="h-8 bg-red-600 hover:bg-red-700 text-white text-xs font-medium gap-1.5"
                  >
                    <CircleX className="w-3.5 h-3.5" />
                    Reprovar
                  </Button>
                  <div className="w-px h-5 bg-woopi-ai-border mx-1 hidden sm:block" />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 text-xs font-medium gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir {selectedDocuments.length} documento(s)?
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 woopi-ai-text-secondary" />
                  <Input
                    placeholder="Buscar por nome do documento, descrição ou workflows..."
                    value={documentSearch}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-10 border border-woopi-ai-border"
                  />
                  {documentSearch && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray hover:text-woopi-ai-dark-gray transition-colors"
                      title="Limpar busca"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                  <SelectTrigger className="w-full sm:w-48 border border-woopi-ai-border">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Status</SelectItem>
                    <SelectItem value="Aguardando análise">Aguardando análise</SelectItem>
                    <SelectItem value="Analisado">Analisado</SelectItem>
                    <SelectItem value="Finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
                
                <SearchableSelect
                  options={[
                    { label: "Todos os Workflows", value: "all" },
                    ...availableWorkflows.map(w => ({ label: w, value: w }))
                  ]}
                  value={workflowsFilter}
                  onValueChange={handleWorkflowsFilterChange}
                  placeholder="Workflows"
                  className="w-full sm:w-48 border-woopi-ai-border"
                />

                <Select value={documentTypeFilter} onValueChange={handleDocumentTypeFilterChange}>
                  <SelectTrigger className="w-full sm:w-48 border border-woopi-ai-border">
                    <SelectValue placeholder="Tipo de Documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <span>Todos os Documentos</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="batch">
                      <div className="flex items-center gap-2">
                        <Files className="w-4 h-4" />
                        <span>Documentos em Lote</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="single">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4" />
                        <span>Documentos Únicos</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto" style={{ minWidth: '900px' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      aria-label="Selecionar todos"
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-woopi-ai-light-gray transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nome</span>
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-woopi-ai-light-gray transition-colors"
                    onClick={() => handleSort('description')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Descrição</span>
                      {getSortIcon('description')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-woopi-ai-light-gray transition-colors"
                    onClick={() => handleSort('uploadDate')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Data Upload</span>
                      {getSortIcon('uploadDate')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-woopi-ai-light-gray transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-woopi-ai-light-gray transition-colors"
                    onClick={() => handleSort('workflows')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Workflows</span>
                      {getSortIcon('workflows')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-woopi-ai-gray">
                      Nenhum documento encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedDocuments.includes(doc.id)}
                          onCheckedChange={() => handleSelectDocument(doc.id)}
                          aria-label={`Selecionar ${doc.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="min-w-0 flex-1 flex items-center gap-2">
                          {doc.id === 2 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Files className="w-4 h-4 text-woopi-ai-blue flex-shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>documentos em lote</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          <p className="font-medium woopi-ai-text-primary truncate">
                            {doc.name.replace(/\.[^/.]+$/, "")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="woopi-ai-text-primary line-clamp-2">{doc.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="woopi-ai-text-secondary">
                          {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            doc.status === 'Finalizado' 
                              ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40' 
                              : doc.status === 'Analisado'
                                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                                : 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/40'
                          }
                        >
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {doc.workflows.map((workflow, index) => (
                            <Badge 
                              key={index}
                              variant="outline"
                              className="bg-card border-woopi-ai-border text-woopi-ai-dark-gray hover:bg-woopi-ai-light-gray text-xs px-2 py-1"
                            >
                              {workflow}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenAtribuir(doc)}
                                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                                >
                                  <UserCheck className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Atribuir</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenReprovar(doc)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                                >
                                  <CircleX className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Reprovar</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleConsultWorkflow(doc)}
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20"
                                >
                                  <Search className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Consultar</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
                <TooltipProvider>
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
                </TooltipProvider>
              ) : (
                <div className="order-2" />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workflow Selector Dialog */}
      <Dialog open={workflowSelectorOpen} onOpenChange={setWorkflowSelectorOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Selecione o Workflow</DialogTitle>
            <DialogDescription>
              Escolha qual workflow deseja utilizar para consultar o documento "{selectedDocumentForConsult?.name}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-woopi-ai-gray" />
              <Input
                type="text"
                placeholder="Buscar workflow..."
                value={workflowSearchTerm}
                onChange={(e) => setWorkflowSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {filteredWorkflows.length === 0 ? (
                  <div className="text-center py-8 text-woopi-ai-gray">
                    Nenhum workflow encontrado
                  </div>
                ) : (
                  filteredWorkflows.map((workflow) => (
                    <button
                      key={workflow}
                      onClick={() => handleWorkflowSelection(workflow)}
                      className="w-full text-left p-3 rounded-lg border border-woopi-ai-border hover:border-woopi-ai-blue hover:bg-blue-50 dark:hover:bg-[#2d3354] transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Workflow className="w-4 h-4 text-woopi-ai-gray group-hover:text-woopi-ai-blue" />
                          <span className="font-medium">{workflow}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-woopi-ai-gray group-hover:text-woopi-ai-blue" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reprovar Modal */}
      <Dialog open={isReprovarModalOpen} onOpenChange={(open) => {
        setIsReprovarModalOpen(open);
        if (!open) { setReprovarJustificativa(''); setReprovarEtapa(''); setSelectedDocForReprovar(null); }
      }}>
        <DialogContent className="sm:max-w-lg dark:bg-[#292f4c] dark:border-[#393e5c]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex-shrink-0">
                <CircleX className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-left text-lg font-bold dark:text-[#d5d8e0]">
                  Reprovar Documento
                </DialogTitle>
                <DialogDescription className="text-left dark:text-[#9196b0]">
                  Forneça uma justificativa e selecione para qual etapa o documento deve retornar.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="reprovar-justificativa-list" className="text-sm font-medium dark:text-[#d5d8e0]">
                Justificativa <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reprovar-justificativa-list"
                placeholder="Descreva o motivo da reprovação..."
                value={reprovarJustificativa}
                onChange={(e) => setReprovarJustificativa(e.target.value)}
                rows={4}
                className="resize-none dark:bg-[#1f2132] dark:border-[#393e5c] dark:text-[#d5d8e0] dark:placeholder-[#6b7280]"
              />
            </div>

            {/* Atribuir a */}
            <div className="space-y-2">
              <Label className="text-sm font-medium dark:text-[#d5d8e0]">
                Atribuir a{' '}
                <span className="text-xs font-normal text-gray-400 dark:text-gray-500">opcional</span>
              </Label>
              <div className="border border-gray-200 dark:border-[#393e5c] rounded-lg overflow-hidden bg-white dark:bg-[#1f2132]">
                <div className="relative border-b border-gray-100 dark:border-[#393e5c]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  <input
                    type="text"
                    value={reprovarUserSearch}
                    onChange={(e) => setReprovarUserSearch(e.target.value)}
                    placeholder="Buscar usuário..."
                    className="w-full h-8 pl-9 pr-3 text-xs bg-gray-50 dark:bg-[#1a1b2e] text-gray-800 dark:text-[#d5d8e0] placeholder-gray-400 dark:placeholder-[#6b7280] focus:outline-none"
                  />
                </div>
                <div className="max-h-36 overflow-y-auto dark:bg-[#1a1b2e]">
                  {REPROVAR_USERS.filter(u => u.name.toLowerCase().includes(reprovarUserSearch.toLowerCase())).map(user => {
                    const isSelected = reprovarAtribuir === user.value;
                    return (
                      <button
                        key={user.value}
                        type="button"
                        onClick={() => setReprovarAtribuir(isSelected ? '' : user.value)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-[#2d3354]'}`}
                      >
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${user.color}`}>
                          {user.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${isSelected ? 'text-[#0073ea] dark:text-[#4a9ff5]' : 'text-gray-800 dark:text-[#d5d8e0]'}`}>{user.name}</p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{user.role}</p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#0073ea] dark:text-[#4a9ff5] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              {reprovarAtribuir && (
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Atribuído a:</span>
                  <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-500/30 rounded-full px-2 py-0.5">
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{REPROVAR_USERS.find(u => u.value === reprovarAtribuir)?.name}</span>
                    <button type="button" onClick={() => setReprovarAtribuir('')} className="text-blue-400 hover:text-blue-600 ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium dark:text-[#d5d8e0]">
                Retornar para a etapa
              </Label>
              <Select value={reprovarEtapa} onValueChange={setReprovarEtapa}>
                <SelectTrigger className="dark:bg-[#1f2132] dark:border-[#393e5c] dark:text-[#d5d8e0]">
                  <SelectValue placeholder="Selecione a etapa..." />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#292f4c] dark:border-[#393e5c]">
                  <SelectItem value="Recebimento">Recebimento</SelectItem>
                  <SelectItem value="Análise">Análise</SelectItem>
                  <SelectItem value="Revisão">Revisão</SelectItem>
                  <SelectItem value="Validação Fiscal">Validação Fiscal</SelectItem>
                  <SelectItem value="Aprovação Gerencial">Aprovação Gerencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => { setIsReprovarModalOpen(false); setReprovarJustificativa(''); setReprovarEtapa(''); setReprovarAtribuir(''); setReprovarUserSearch(''); setSelectedDocForReprovar(null); }}
              className="dark:border-[#393e5c] dark:text-[#d5d8e0] dark:hover:bg-[#2d3354]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmReprovar}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Confirmar Reprovação
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Atribuir Modal */}
      <Dialog open={isBulkAtribuirModalOpen} onOpenChange={(open) => {
        setIsBulkAtribuirModalOpen(open);
        if (!open) { setBulkSelectedResponsavel(''); setBulkAtribuirUserSearch(''); }
      }}>
        <DialogContent className="sm:max-w-lg dark:bg-[#292f4c] dark:border-[#393e5c]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-left text-lg font-bold dark:text-[#d5d8e0]">
                  Atribuir Responsável
                </DialogTitle>
                <DialogDescription className="text-left dark:text-[#9196b0]">
                  Selecione o usuário responsável por todos os {selectedDocuments.length} documento(s) selecionado(s).
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium dark:text-[#d5d8e0]">
                Responsável <span className="text-red-500">*</span>
              </Label>
              <div className="border border-gray-200 dark:border-[#393e5c] rounded-lg overflow-hidden bg-white dark:bg-[#1f2132]">
                <div className="relative border-b border-gray-100 dark:border-[#393e5c]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  <input
                    type="text"
                    value={bulkAtribuirUserSearch}
                    onChange={(e) => setBulkAtribuirUserSearch(e.target.value)}
                    placeholder="Buscar usuário..."
                    className="w-full h-8 pl-9 pr-3 text-xs bg-gray-50 dark:bg-[#1a1b2e] text-gray-800 dark:text-[#d5d8e0] placeholder-gray-400 dark:placeholder-[#6b7280] focus:outline-none"
                  />
                </div>
                <div className="max-h-36 overflow-y-auto dark:bg-[#1a1b2e]">
                  {REPROVAR_USERS.filter(u => u.name.toLowerCase().includes(bulkAtribuirUserSearch.toLowerCase())).map(user => {
                    const isSelected = bulkSelectedResponsavel === user.value;
                    return (
                      <button
                        key={user.value}
                        type="button"
                        onClick={() => setBulkSelectedResponsavel(isSelected ? '' : user.value)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-[#2d3354]'}`}
                      >
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${user.color}`}>
                          {user.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${isSelected ? 'text-[#0073ea] dark:text-[#4a9ff5]' : 'text-gray-800 dark:text-[#d5d8e0]'}`}>{user.name}</p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{user.role}</p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#0073ea] dark:text-[#4a9ff5] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              {bulkSelectedResponsavel && (
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Atribuído a:</span>
                  <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-500/30 rounded-full px-2 py-0.5">
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{REPROVAR_USERS.find(u => u.value === bulkSelectedResponsavel)?.name}</span>
                    <button type="button" onClick={() => setBulkSelectedResponsavel('')} className="text-blue-400 hover:text-blue-600 ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3">
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Documentos afetados</p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-0.5">
                {selectedDocuments.length} documento(s) serão atribuídos ao responsável selecionado.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => { setIsBulkAtribuirModalOpen(false); setBulkSelectedResponsavel(''); setBulkAtribuirUserSearch(''); }}
              className="dark:border-[#393e5c] dark:text-[#d5d8e0] dark:hover:bg-[#2d3354]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmBulkAtribuir}
              className="bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              Confirmar Atribuição
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Reprovar Modal */}
      <Dialog open={isBulkReprovarModalOpen} onOpenChange={(open) => {
        setIsBulkReprovarModalOpen(open);
        if (!open) setBulkReprovarJustificativa('');
      }}>
        <DialogContent className="sm:max-w-lg dark:bg-[#292f4c] dark:border-[#393e5c]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex-shrink-0">
                <CircleX className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-left text-lg font-bold dark:text-[#d5d8e0]">
                  Reprovar Documentos
                </DialogTitle>
                <DialogDescription className="text-left dark:text-[#9196b0]">
                  Forneça uma justificativa comum para reprovar os {selectedDocuments.length} documento(s) selecionado(s).
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="bulk-reprovar-justificativa" className="text-sm font-medium dark:text-[#d5d8e0]">
                Justificativa <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="bulk-reprovar-justificativa"
                placeholder="Descreva o motivo da reprovação..."
                value={bulkReprovarJustificativa}
                onChange={(e) => setBulkReprovarJustificativa(e.target.value)}
                rows={4}
                className="resize-none dark:bg-[#1f2132] dark:border-[#393e5c] dark:text-[#d5d8e0] dark:placeholder-[#6b7280]"
              />
            </div>

            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
              <p className="text-xs text-red-700 dark:text-red-300 font-medium">Documentos afetados</p>
              <p className="text-sm text-red-900 dark:text-red-100 mt-0.5">
                {selectedDocuments.length} documento(s) serão reprovados com esta justificativa.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => { setIsBulkReprovarModalOpen(false); setBulkReprovarJustificativa(''); }}
              className="dark:border-[#393e5c] dark:text-[#d5d8e0] dark:hover:bg-[#2d3354]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmBulkReprovar}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Confirmar Reprovação
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Atribuir Modal */}
      <Dialog open={isAtribuirModalOpen} onOpenChange={(open) => {
        setIsAtribuirModalOpen(open);
        if (!open) { setSelectedResponsavel(''); setAtribuirUserSearch(''); setSelectedDocForAtribuir(null); }
      }}>
        <DialogContent className="sm:max-w-lg dark:bg-[#292f4c] dark:border-[#393e5c]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-left text-lg font-bold dark:text-[#d5d8e0]">
                  Atribuir Responsável
                </DialogTitle>
                <DialogDescription className="text-left dark:text-[#9196b0]">
                  Selecione o usuário que será responsável por este documento.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium dark:text-[#d5d8e0]">
                Responsável <span className="text-red-500">*</span>
              </Label>
              <div className="border border-gray-200 dark:border-[#393e5c] rounded-lg overflow-hidden bg-white dark:bg-[#1f2132]">
                <div className="relative border-b border-gray-100 dark:border-[#393e5c]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  <input
                    type="text"
                    value={atribuirUserSearch}
                    onChange={(e) => setAtribuirUserSearch(e.target.value)}
                    placeholder="Buscar usuário..."
                    className="w-full h-8 pl-9 pr-3 text-xs bg-gray-50 dark:bg-[#1a1b2e] text-gray-800 dark:text-[#d5d8e0] placeholder-gray-400 dark:placeholder-[#6b7280] focus:outline-none"
                  />
                </div>
                <div className="max-h-36 overflow-y-auto dark:bg-[#1a1b2e]">
                  {REPROVAR_USERS.filter(u => u.name.toLowerCase().includes(atribuirUserSearch.toLowerCase())).map(user => {
                    const isSelected = selectedResponsavel === user.value;
                    return (
                      <button
                        key={user.value}
                        type="button"
                        onClick={() => setSelectedResponsavel(isSelected ? '' : user.value)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-[#2d3354]'}`}
                      >
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${user.color}`}>
                          {user.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${isSelected ? 'text-[#0073ea] dark:text-[#4a9ff5]' : 'text-gray-800 dark:text-[#d5d8e0]'}`}>{user.name}</p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{user.role}</p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#0073ea] dark:text-[#4a9ff5] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              {selectedResponsavel && (
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Atribuído a:</span>
                  <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-500/30 rounded-full px-2 py-0.5">
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{REPROVAR_USERS.find(u => u.value === selectedResponsavel)?.name}</span>
                    <button type="button" onClick={() => setSelectedResponsavel('')} className="text-blue-400 hover:text-blue-600 ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {selectedDocForAtribuir && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Documento selecionado</p>
                <p className="text-sm text-blue-900 dark:text-blue-100 mt-0.5 truncate">{selectedDocForAtribuir.name}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => { setIsAtribuirModalOpen(false); setSelectedResponsavel(''); setAtribuirUserSearch(''); setSelectedDocForAtribuir(null); }}
              className="dark:border-[#393e5c] dark:text-[#d5d8e0] dark:hover:bg-[#2d3354]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmAtribuir}
              className="bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              Confirmar Atribuição
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}