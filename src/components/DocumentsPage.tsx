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
  FileText,
  Image,
  X,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Workflow,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { useKeyboardShortcuts } from './ui/use-keyboard-shortcuts';

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

export function DocumentsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Refs for keyboard shortcuts
  const searchInputRef = useRef<HTMLInputElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

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

  // Workflow selector dialog states
  const [workflowSelectorOpen, setWorkflowSelectorOpen] = useState(false);
  const [selectedDocumentForConsult, setSelectedDocumentForConsult] = useState<Document | null>(null);
  const [workflowSearchTerm, setWorkflowSearchTerm] = useState('');

  // Documents data - RESTORED TO ORIGINAL
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
      name: 'Política_Segurança.pdf',
      type: 'PDF',
      size: '1.2 MB',
      uploadDate: '2024-01-10',
      status: 'Analisado',
      tags: ['Política', 'Segurança'],
      description: 'Política de segurança da informação',  
      uploadedBy: 'Fernanda Lima',
      workflows: ['Compliance', 'Auditoria Interna']
    },
    {
      id: 7,
      name: 'Planilha_Custos.xlsx',
      type: 'Excel',
      size: '967 KB',
      uploadDate: '2024-01-09',
      status: 'Aguardando análise',
      tags: ['Custos', 'Financeiro'],
      description: 'Planilha de controle de custos departamentais',
      uploadedBy: 'Roberto Mendes',
      workflows: ['Análise de Custos', 'Orçamento Anual']
    },
    {
      id: 8,
      name: 'Ata_Reunião_Janeiro.docx',
      type: 'Word',
      size: '234 KB',
      uploadDate: '2024-01-08',
      status: 'Aguardando análise',
      tags: ['Ata', 'Reunião'],
      description: 'Ata da reunião mensal de janeiro',
      uploadedBy: 'Juliana Ferreira',
      workflows: ['Distribuição de Atas', 'Arquivo Documental']
    },
    {
      id: 9,
      name: 'Relatório_Auditoria_2023.pdf',
      type: 'PDF',
      size: '3.1 MB',
      uploadDate: '2024-01-07',
      status: 'Finalizado',
      tags: ['Auditoria', 'Compliance'],
      description: 'Relatório final de auditoria interna 2023',
      uploadedBy: 'Roberto Mendes',
      workflows: ['Compliance e Auditoria']
    }
  ]);

  const availableTypes = ['PDF', 'Word', 'Excel', 'PowerPoint', 'ZIP', 'Image'];
  const availableTags = ['Contrato', 'Relatório', 'Manual', 'Política', 'Fatura', 'Ata', 'Certificado', 'Proposta', 'Cronograma', 'Especificação', 'Backup'];
  const statuses = ['Aguardando análise', 'Analisado', 'Finalizado'];
  
  // Extract unique workflows from documents
  const availableWorkflows = Array.from(new Set(documents.flatMap(doc => doc.workflows))).sort();

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Finalizado':
        return 'bg-green-100 text-green-700';
      case 'Analisado':
        return 'bg-blue-100 text-blue-700';
      case 'Aguardando análise':
        return 'bg-sky-100 text-sky-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-600" />;
      case 'word':
      case 'docx':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'excel':
      case 'xlsx':
        return <File className="w-4 h-4 text-green-600" />;
      case 'powerpoint':
      case 'pptx':
        return <File className="w-4 h-4 text-orange-600" />;
      case 'zip':
        return <File className="w-4 h-4 text-purple-600" />;
      case 'image':
      case 'jpg':
      case 'png':
        return <Image className="w-4 h-4 text-pink-600" />;
      default:
        return <File className="w-4 h-4 text-gray-600" />;
    }
  };

  // Sorting functions
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-woopi-ai-gray" />;
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="w-4 h-4 text-woopi-ai-blue" />;
    }
    if (sortDirection === 'desc') {
      return <ChevronDown className="w-4 h-4 text-woopi-ai-blue" />;
    }
    return <ChevronsUpDown className="w-4 h-4 text-woopi-ai-gray" />;
  };

  // Sorting logic
  const sortDocuments = (documents: Document[]) => {
    if (!sortField || !sortDirection) return documents;

    return [...documents].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'uploadDate':
          aValue = new Date(a.uploadDate);
          bValue = new Date(b.uploadDate);
          break;
        case 'status':
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        case 'workflows':
          aValue = a.workflows.join(', ').toLowerCase();
          bValue = b.workflows.join(', ').toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Enhanced filtering for documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(documentSearch.toLowerCase()) ||
                         doc.description.toLowerCase().includes(documentSearch.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(documentSearch.toLowerCase())) ||
                         doc.uploadedBy.toLowerCase().includes(documentSearch.toLowerCase()) ||
                         doc.workflows.some(workflow => workflow.toLowerCase().includes(documentSearch.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesWorkflows = workflowsFilter === 'all' || doc.workflows.includes(workflowsFilter);
    return matchesSearch && matchesStatus && matchesWorkflows;
  });

  // Apply sorting to filtered data
  const sortedDocuments = sortDocuments(filteredDocuments);

  // Pagination calculations
  const totalPages = Math.ceil(sortedDocuments.length / ITEMS_PER_PAGE);
  const paginatedDocuments = sortedDocuments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Checkbox functions
  const handleSelectDocument = (documentId: number) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(paginatedDocuments.map(doc => doc.id));
    }
    setSelectAll(!selectAll);
  };

  // Update selectAll state when individual selections change
  React.useEffect(() => {
    const allSelected = paginatedDocuments.length > 0 && 
      paginatedDocuments.every(doc => selectedDocuments.includes(doc.id));
    setSelectAll(allSelected);
  }, [selectedDocuments, paginatedDocuments]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset pagination when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [documentSearch, statusFilter, workflowsFilter]);

  // Clear search handler
  const clearDocumentSearch = () => {
    setDocumentSearch('');
  };

  // Pagination component
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    return (
      <Pagination className="w-full justify-center mt-4">
        <PaginationContent className="flex flex-wrap justify-center gap-1">
          <PaginationItem>
            <PaginationPrevious 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {visiblePages.map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page as number);
                  }}
                  isActive={currentPage === page}
                  className="min-w-[40px]"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) handlePageChange(currentPage + 1);
              }}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  // CRUD operations
  const handleEditDocument = (document: Document) => {
    toast.info(`Editando documento: ${document.name}`);
  };

  const handleDeleteDocument = (documentId: number) => {
    setDocuments(documents.filter(doc => doc.id !== documentId));
    toast.success('Documento excluído com sucesso!');
  };

  // Bulk delete function
  const handleBulkDelete = () => {
    setDocuments(documents.filter(doc => !selectedDocuments.includes(doc.id)));
    toast.success(`${selectedDocuments.length} documento(s) excluído(s) com sucesso!`);
    setSelectedDocuments([]);
    setSelectAll(false);
  };

  // Bulk Delete Confirmation Component
  const BulkDeleteConfirmationDialog = ({ children }: { children: React.ReactNode }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md mx-4">
        <AlertDialogHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <AlertDialogTitle className="text-woopi-ai-dark-gray">
            Você está prestes a deletar<br />{selectedDocuments.length} documento(s) do sistema
          </AlertDialogTitle>
          <AlertDialogDescription className="text-woopi-ai-gray">
            Esta ação não poderá ser desfeita.<br />
            Tem certeza que deseja<br />
            removê-los?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="text-woopi-ai-blue hover:text-woopi-ai-dark-blue">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleBulkDelete}
            className="woopi-ai-button-primary"
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const handleAnalyzeDocument = (document: Document) => {
    // Show loading toast
    toast.loading('Iniciando análise do documento...', {
      duration: 2000,
    });
    
    // Navigate to analysis page after short delay
    setTimeout(() => {
      navigate(`/documentos/${document.id}/analisar`);
    }, 2000);
  };

  const handleConsultDocument = (document: Document) => {
    // If document has only one workflow, navigate directly
    if (document.workflows.length === 1) {
      const workflow = document.workflows[0];
      navigate(`/documentos/${document.id}/analise/${encodeURIComponent(workflow)}`);
      toast.success(`Abrindo análise: ${workflow}`);
    } else {
      // If document has multiple workflows, show selector
      setSelectedDocumentForConsult(document);
      setWorkflowSelectorOpen(true);
    }
  };

  const handleWorkflowSelection = (workflow: string) => {
    if (selectedDocumentForConsult) {
      navigate(`/documentos/${selectedDocumentForConsult.id}/analise/${encodeURIComponent(workflow)}`);
      toast.success(`Abrindo análise: ${workflow}`);
      setWorkflowSelectorOpen(false);
      setSelectedDocumentForConsult(null);
    }
  };

  // Keyboard shortcuts handlers
  useKeyboardShortcuts({
    onSearchFocus: () => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        searchInputRef.current.select();
      }
    },
    onAddButtonClick: () => {
      if (addButtonRef.current) {
        addButtonRef.current.click();
      }
    }
  });

  return (
    <TooltipProvider>
      {/* Workflow Selector Dialog */}
      <Dialog open={workflowSelectorOpen} onOpenChange={(open) => {
        setWorkflowSelectorOpen(open);
        if (!open) {
          setWorkflowSearchTerm('');
        }
      }}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-woopi-ai-dark-gray text-center">
              Selecione o Workflow
            </DialogTitle>
            <DialogDescription className="text-woopi-ai-gray text-center">
              Este documento está associado a múltiplos workflows.<br />
              Escolha qual deseja visualizar:
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {/* Search field */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-woopi-ai-gray" />
                <Input
                  placeholder="Buscar workflow..."
                  value={workflowSearchTerm}
                  onChange={(e) => setWorkflowSearchTerm(e.target.value)}
                  className="pl-10 pr-10 border-woopi-ai-border"
                />
                {workflowSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setWorkflowSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray hover:text-woopi-ai-dark-gray transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Workflows list with scroll */}
            <ScrollArea className="max-h-[400px] pr-4">
              <div className="space-y-2">
                {selectedDocumentForConsult?.workflows
                  .filter(workflow => 
                    workflow.toLowerCase().includes(workflowSearchTerm.toLowerCase())
                  )
                  .map((workflow, index) => (
                    <button
                      key={index}
                      onClick={() => handleWorkflowSelection(workflow)}
                      className="w-full p-4 text-left border border-gray-200 dark:border-[#393e5c] rounded-lg hover:border-[#0073ea] hover:bg-blue-50 dark:hover:bg-[#2d3354] transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-[#0073ea] transition-colors">
                            <Workflow className="w-5 h-5 text-[#0073ea] group-hover:text-white" />
                          </div>
                          <div>
                            <p className="woopi-ai-text-primary group-hover:text-[#0073ea]">
                              {workflow}
                            </p>
                            <p className="text-xs text-gray-500">
                              Clique para visualizar
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#0073ea]" />
                      </div>
                    </button>
                  ))}
                
                {/* No results message */}
                {selectedDocumentForConsult?.workflows
                  .filter(workflow => 
                    workflow.toLowerCase().includes(workflowSearchTerm.toLowerCase())
                  ).length === 0 && (
                    <div className="text-center py-8 text-woopi-ai-gray">
                      <Workflow className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p>Nenhum workflow encontrado</p>
                    </div>
                  )}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setWorkflowSelectorOpen(false);
                setSelectedDocumentForConsult(null);
                setWorkflowSearchTerm('');
              }}
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="relative h-full overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold woopi-ai-text-primary">Documentos</h1>
                  <p className="woopi-ai-text-secondary text-sm md:text-base">Gerencie documentos e extraia informações</p>
                </div>
                

              </div>
              
              <div className="flex gap-2">
                <Button 
                  ref={addButtonRef} 
                  className="woopi-ai-button-primary w-full md:w-auto"
                  onClick={() => navigate('/documentos/carregar')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Documento
                </Button>
              </div>
            </div>

            {/* Documents Filters */}
            <Card className="woopi-ai-card">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 woopi-ai-text-secondary" />
                      <Input
                        ref={searchInputRef}
                        placeholder="Buscar por nome do documento, descrição ou workflows..."
                        value={documentSearch}
                        onChange={(e) => setDocumentSearch(e.target.value)}
                        className="pl-10 pr-10 border border-woopi-ai-border"
                      />
                      {documentSearch && (
                        <button
                          type="button"
                          onClick={clearDocumentSearch}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray hover:text-woopi-ai-dark-gray transition-colors"
                          title="Limpar busca"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-48 border border-woopi-ai-border">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos Status</SelectItem>
                        {statuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={workflowsFilter} onValueChange={setWorkflowsFilter}>
                      <SelectTrigger className="w-full sm:w-48 border border-woopi-ai-border">
                        <SelectValue placeholder="Workflows" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Workflows</SelectItem>
                        {availableWorkflows.map(workflow => (
                          <SelectItem key={workflow} value={workflow}>{workflow}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents Table */}
            <Card className="woopi-ai-card">
              <CardHeader>
                <CardTitle className="woopi-ai-text-primary">
                  Documentos ({sortedDocuments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Bulk Delete Button - Only show when items are selected */}
                {selectedDocuments.length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-700">
                        {selectedDocuments.length} item(s) selecionado(s)
                      </span>
                      <BulkDeleteConfirmationDialog>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Excluir
                        </Button>
                      </BulkDeleteConfirmationDialog>
                    </div>
                  </div>
                )}

                {/* Desktop Table View */}
                <div className="overflow-x-auto hidden md:block table-scroll-container" style={{ minWidth: '900px' }}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectAll}
                            onCheckedChange={handleSelectAll}
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
                      {paginatedDocuments.map((document) => (
                        <TableRow key={document.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedDocuments.includes(document.id)}
                              onCheckedChange={() => handleSelectDocument(document.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium woopi-ai-text-primary truncate">
                                {document.name.replace(/\.[^/.]+$/, "")}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <p className="woopi-ai-text-primary line-clamp-2">{document.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="woopi-ai-text-secondary">
                              {new Date(document.uploadDate).toLocaleDateString('pt-BR')}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(document.status)}>
                              {document.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {document.workflows.map((workflow, index) => (
                                <Badge 
                                  key={index}
                                  variant="outline"
                                  className="bg-white border-woopi-ai-border text-woopi-ai-dark-gray hover:bg-woopi-ai-light-gray text-xs px-2 py-1"
                                >
                                  {workflow}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleConsultDocument(document)}
                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20"
                                  >
                                    <Search className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Consultar</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="block md:hidden">
                  {/* Bulk Delete Button for Mobile */}
                  {selectedDocuments.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-red-700">
                          {selectedDocuments.length} item(s) selecionado(s)
                        </span>
                        <BulkDeleteConfirmationDialog>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Excluir
                          </Button>
                        </BulkDeleteConfirmationDialog>
                      </div>
                    </div>
                  )}

                  <div className="space-y-0">
                    {paginatedDocuments.map((document) => (
                      <div key={document.id} className="mobile-card-item">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3 flex-1">
                            <Checkbox
                              checked={selectedDocuments.includes(document.id)}
                              onCheckedChange={() => handleSelectDocument(document.id)}
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {getTypeIcon(document.type)}
                                <Badge className={getStatusColor(document.status)}>
                                  {document.status}
                                </Badge>
                              </div>
                              <h3 className="font-medium woopi-ai-text-primary text-sm leading-tight mb-1">
                                {document.name.replace(/\.[^/.]+$/, "")}
                              </h3>
                              <p className="text-xs woopi-ai-text-secondary line-clamp-2 mb-2">
                                {document.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {document.workflows.map((workflow, index) => (
                                  <Badge 
                                    key={index}
                                    variant="outline"
                                    className="bg-white border-woopi-ai-border text-woopi-ai-dark-gray text-xs px-1 py-0"
                                  >
                                    {workflow}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-4 text-xs woopi-ai-text-secondary">
                                <span>{document.size}</span>
                                <span>{new Date(document.uploadDate).toLocaleDateString('pt-BR')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mobile-card-actions">
                          <div className="flex gap-2">
                            {document.status === 'Aguardando análise' ? (
                              <Button
                                size="sm"
                                onClick={() => handleAnalyzeDocument(document)}
                                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                              >
                                ANALISAR
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleConsultDocument(document)}
                                className="bg-green-600 hover:bg-green-700 text-white flex-1"
                              >
                                CONSULTAR
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer with pagination info and pagination */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between px-0 py-4 border-t border-woopi-ai-border gap-4 mt-4">
                  <div className="text-sm woopi-ai-text-secondary">
                    Linhas por página: 
                    <select className="ml-2 border border-woopi-ai-border rounded px-2 py-1">
                      <option value={10}>10</option>
                    </select>
                    <span className="ml-4">
                      {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, sortedDocuments.length)} de {sortedDocuments.length}
                    </span>
                  </div>
                  
                  {renderPagination()}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}