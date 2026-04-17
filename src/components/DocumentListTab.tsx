import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Eye,
  File,
  Files,
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
  ShieldCheck,
  ShieldPlus,
  ExternalLink,
  Calendar,
  Clock,
  Briefcase,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
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

type SortField = 'name' | 'description' | 'uploadDate' | 'status' | 'workflows' | 'anonymization';
type SortDirection = 'asc' | 'desc' | null;

interface AnonymizationEntry {
  url: string;
  docName: string;
  type: string;
  workflowTitle: string;
  timestamp: Date;
}

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

  // Anonymization history: keyed by doc.id
  const [anonymizationHistory, setAnonymizationHistory] = useState<Record<number, AnonymizationEntry[]>>({
    1: [
      { url: '/documentos/1/anonimizado', docName: 'Contrato_Fornecedor_2024', type: 'Padrão', workflowTitle: 'Análise Jurídica', timestamp: new Date('2024-01-16T14:32:00') },
      { url: '/documentos/1/anonimizado', docName: 'Contrato_Fornecedor_2024', type: 'Completo', workflowTitle: 'Análise Jurídica', timestamp: new Date('2024-01-15T09:18:00') },
    ],
    4: [
      { url: '/documentos/4/anonimizado', docName: 'Manual_Procedimentos', type: 'Padrão', workflowTitle: 'Validação RH', timestamp: new Date('2024-01-13T11:05:00') },
    ],
    7: [
      { url: '/documentos/7/anonimizado', docName: 'Relatório_Auditoria_2023', type: 'Avançado', workflowTitle: 'Compliance e Auditoria', timestamp: new Date('2024-01-10T16:45:00') },
      { url: '/documentos/7/anonimizado', docName: 'Relatório_Auditoria_2023', type: 'Padrão', workflowTitle: 'Compliance e Auditoria', timestamp: new Date('2024-01-09T08:30:00') },
      { url: '/documentos/7/anonimizado', docName: 'Relatório_Auditoria_2023', type: 'Padrão', workflowTitle: 'Compliance e Auditoria', timestamp: new Date('2024-01-09T07:55:00') },
    ],
    11: [
      { url: '/documentos/11/anonimizado', docName: 'Contrato_Aluguel_Sede', type: 'Completo', workflowTitle: 'Análise Jurídica', timestamp: new Date('2024-01-06T13:20:00') },
    ],
    13: [
      { url: '/documentos/13/anonimizado', docName: 'Certificado_ISO_9001', type: 'Padrão', workflowTitle: 'Controle de Qualidade', timestamp: new Date('2024-01-04T10:00:00') },
    ],
  });
  const [anonymizationModalDocId, setAnonymizationModalDocId] = useState<number | null>(null);
  const [processingDocId, setProcessingDocId] = useState<number | null>(null);

  const handleAnonymize = (doc: Document) => {
    if (processingDocId !== null) return;
    setProcessingDocId(doc.id);
    setTimeout(() => {
      const docName = doc.name.replace(/\.[^/.]+$/, '');
      const newEntry: AnonymizationEntry = {
        url: `/documentos/${doc.id}/anonimizado`,
        docName,
        type: 'Padrão',
        workflowTitle: doc.workflows[0] ?? '',
        timestamp: new Date(),
      };
      setAnonymizationHistory(prev => ({
        ...prev,
        [doc.id]: [newEntry, ...(prev[doc.id] ?? [])],
      }));
      setProcessingDocId(null);
      const alreadyHad = (anonymizationHistory[doc.id] ?? []).length > 0;
      toast.success(alreadyHad ? 'Nova versão anonimizada gerada' : 'Documento anonimizado com sucesso', {
        description: docName,
      });
    }, 1200);
  };

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
      // Sort by most-recent anonymization timestamp (nulls last)
      if (sortField === 'anonymization') {
        const aEntries = anonymizationHistory[a.id] ?? [];
        const bEntries = anonymizationHistory[b.id] ?? [];
        const aTime = aEntries.length > 0 ? aEntries[0].timestamp.getTime() : -Infinity;
        const bTime = bEntries.length > 0 ? bEntries[0].timestamp.getTime() : -Infinity;
        // asc = oldest first; desc = newest first
        return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
      }

      let aValue: any = a[sortField as keyof Document];
      let bValue: any = b[sortField as keyof Document];

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
      const q = new URLSearchParams({
        workflow,
        from: 'workflow',
      });
      navigate(`/documentos/${selectedDocumentForConsult?.id}/analisar?${q.toString()}`);
    }, 2000);
  };

  const filteredWorkflows = availableWorkflows.filter(workflow =>
    workflow.toLowerCase().includes(workflowSearchTerm.toLowerCase())
  );

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
                  <TableHead
                    className="w-[130px] cursor-pointer select-none hover:bg-woopi-ai-light-gray transition-colors"
                    onClick={() => handleSort('anonymization')}
                  >
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: sortField === 'anonymization' ? '#059669' : undefined }}
                      />
                      <span>Anonimização</span>
                      {getSortIcon('anonymization')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-woopi-ai-gray">
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
                      <TableCell>
                        {(anonymizationHistory[doc.id] ?? []).length > 0 ? (
                          <button
                            type="button"
                            onClick={() => setAnonymizationModalDocId(doc.id)}
                            className="flex items-center gap-1.5 rounded-md px-2 h-6 text-[11px] font-medium transition-all border"
                            style={{ color: '#059669', borderColor: '#a7f3d0', background: '#ecfdf5' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#d1fae5'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#ecfdf5'; }}
                            title="Ver histórico de anonimizações"
                          >
                            <ShieldCheck className="w-3 h-3 flex-shrink-0" />
                            <span>Histórico</span>
                            {(anonymizationHistory[doc.id] ?? []).length > 1 && (
                              <span
                                className="flex items-center justify-center rounded-full text-[9px] font-bold min-w-[14px] h-3.5 px-1 leading-none"
                                style={{ background: '#059669', color: '#fff' }}
                              >
                                {(anonymizationHistory[doc.id] ?? []).length}
                              </span>
                            )}
                          </button>
                        ) : (
                          <span className="text-[11px] text-muted-foreground/50">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={processingDocId !== null}
                                  onClick={() => handleAnonymize(doc)}
                                  className={
                                    (anonymizationHistory[doc.id] ?? []).length === 0
                                      ? 'h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/20 transition-colors'
                                      : 'h-8 w-8 p-0 text-muted-foreground/60 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/20 transition-colors'
                                  }
                                >
                                  {processingDocId === doc.id
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <ShieldPlus className="w-4 h-4" />
                                  }
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{(anonymizationHistory[doc.id] ?? []).length === 0 ? 'Anonimizar documento' : 'Anonimizar novamente'}</p>
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
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Acessar</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <AlertDialog>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Excluir</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o documento "{doc.name}"?
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(doc.id)} className="bg-red-600 hover:bg-red-700">
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

      {/* Anonymization History Modal */}
      {anonymizationModalDocId !== null && (() => {
        const entries = anonymizationHistory[anonymizationModalDocId] ?? [];
        const docName = documents.find(d => d.id === anonymizationModalDocId)?.name?.replace(/\.[^/.]+$/, '') ?? 'Documento';
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setAnonymizationModalDocId(null); }}
          >
            <div
              className="relative flex flex-col rounded-2xl shadow-2xl overflow-hidden"
              style={{ width: 480, maxWidth: '95vw', maxHeight: '82vh', background: '#fff', border: '1.5px solid #d1fae5' }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-4 flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)', borderBottom: '1px solid #bbf7d0' }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 2px 8px rgba(16,185,129,0.3)' }}
                  >
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold" style={{ color: '#065f46' }}>Histórico de Anonimizações</h2>
                    <p className="text-[11px] truncate max-w-[220px]" style={{ color: '#34d399' }}>
                      {docName} · {entries.length} {entries.length === 1 ? 'versão' : 'versões'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAnonymizationModalDocId(null)}
                  className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors hover:bg-white/60"
                  style={{ color: '#6ee7b7' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cards list */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5" style={{ background: '#f9fafb' }}>
                {entries.map((entry, index) => {
                  const isFirst = index === 0;
                  const dateLabel = entry.timestamp.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
                  const timeLabel = entry.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => window.open(entry.url, '_blank')}
                      className="w-full text-left group rounded-xl border transition-all duration-150 overflow-hidden"
                      style={{
                        background: '#fff',
                        borderColor: isFirst ? '#6ee7b7' : '#e5e7eb',
                        boxShadow: isFirst ? '0 2px 12px rgba(16,185,129,0.10)' : '0 1px 4px rgba(0,0,0,0.04)',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.borderColor = '#6ee7b7';
                        el.style.boxShadow = '0 4px 16px rgba(16,185,129,0.15)';
                        el.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.borderColor = isFirst ? '#6ee7b7' : '#e5e7eb';
                        el.style.boxShadow = isFirst ? '0 2px 12px rgba(16,185,129,0.10)' : '0 1px 4px rgba(0,0,0,0.04)';
                        el.style.transform = 'translateY(0)';
                      }}
                    >
                      <div className="flex items-stretch">
                        <div
                          className="w-1 flex-shrink-0"
                          style={{ background: isFirst ? 'linear-gradient(180deg, #10b981, #059669)' : '#e5e7eb' }}
                        />
                        <div className="flex-1 px-4 py-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              {isFirst && (
                                <span
                                  className="flex-shrink-0 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full"
                                  style={{ background: '#d1fae5', color: '#059669' }}
                                >
                                  Mais recente
                                </span>
                              )}
                              <span className="text-xs font-semibold truncate" style={{ color: '#111827' }}>
                                {entry.docName}
                              </span>
                            </div>
                            <ExternalLink
                              className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity"
                              style={{ color: '#059669' }}
                            />
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" style={{ color: '#9ca3af' }} />
                              <span className="text-[11px] capitalize" style={{ color: '#6b7280' }}>{dateLabel}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" style={{ color: '#9ca3af' }} />
                              <span className="text-[11px]" style={{ color: '#6b7280' }}>{timeLabel}</span>
                            </div>
                            {entry.type && (
                              <span
                                className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                                style={{ background: '#f3f4f6', color: '#374151' }}
                              >
                                {entry.type}
                              </span>
                            )}
                          </div>
                          {entry.workflowTitle && (
                            <div className="mt-1 flex items-center gap-1">
                              <Briefcase className="w-3 h-3 flex-shrink-0" style={{ color: '#9ca3af' }} />
                              <span className="text-[11px] truncate" style={{ color: '#9ca3af' }}>{entry.workflowTitle}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div
                className="flex-shrink-0 flex items-center justify-between px-6 py-3"
                style={{ background: '#fff', borderTop: '1px solid #e5e7eb' }}
              >
                <span className="text-[11px]" style={{ color: '#9ca3af' }}>
                  Clique em um item para abrir em nova aba
                </span>
                <button
                  type="button"
                  onClick={() => setAnonymizationModalDocId(null)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  style={{ background: '#f3f4f6', color: '#374151' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#e5e7eb'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f3f4f6'; }}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        );
      })()}

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

    </div>
  );
}
