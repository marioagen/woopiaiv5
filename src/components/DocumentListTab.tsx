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
  ChevronRight,
  Filter
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
  const ITEMS_PER_PAGE = 10;

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

  // Workflow selector dialog states
  const [workflowSelectorOpen, setWorkflowSelectorOpen] = useState(false);
  const [selectedDocumentForConsult, setSelectedDocumentForConsult] = useState<Document | null>(null);
  const [workflowSearchTerm, setWorkflowSearchTerm] = useState('');

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
  const totalPages = Math.ceil(filteredAndSortedDocuments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDocuments = filteredAndSortedDocuments.slice(startIndex, endIndex);

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
          {/* Bulk Delete Button - Only show when items are selected */}
          {selectedDocuments.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-700">
                  {selectedDocuments.length} item(s) selecionado(s)
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
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
          )}

          <div className="mb-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 woopi-ai-text-secondary" />
                  <Input
                    placeholder="Buscar por nome do documento, descrição ou workflows..."
                    value={documentSearch}
                    onChange={(e) => setDocumentSearch(e.target.value)}
                    className="pl-10 pr-10 border border-woopi-ai-border"
                  />
                  {documentSearch && (
                    <button
                      type="button"
                      onClick={() => setDocumentSearch('')}
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
                    <SelectItem value="Aguardando análise">Aguardando análise</SelectItem>
                    <SelectItem value="Analisado">Analisado</SelectItem>
                    <SelectItem value="Finalizado">Finalizado</SelectItem>
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

                <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
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

          {/* Footer with pagination info and pagination */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between px-0 py-4 border-t border-woopi-ai-border gap-4 mt-4">
            <div className="text-sm woopi-ai-text-secondary">
              Linhas por página: 
              <select className="ml-2 border border-woopi-ai-border rounded px-2 py-1">
                <option value={10}>10</option>
              </select>
              <span className="ml-4">
                {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedDocuments.length)} de {filteredAndSortedDocuments.length}
              </span>
            </div>
            
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
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
    </div>
  );
}