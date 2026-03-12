import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { useKeyboardShortcuts } from './ui/use-keyboard-shortcuts';

interface Question {
  id: number;
  descricao: string;
  dataInclusao: string;
  proprietario: string;
}

interface Questionnaire {
  id: number;
  nome: string;
  tipoDocumento: string;
  perguntas: number;
  perguntasSelecionadas?: Question[];
  dataInclusao: string;
  proprietario: string;
}

type SortField = 'id' | 'nome' | 'tipoDocumento' | 'perguntas' | 'dataInclusao' | 'proprietario';
type SortDirection = 'asc' | 'desc' | null;

export function QuestionnairesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Refs for keyboard shortcuts
  const searchInputRef = useRef<HTMLInputElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  // Checkbox selection states
  const [selectedQuestionnaires, setSelectedQuestionnaires] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Sorting states
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Search states
  const [questionnaireSearch, setQuestionnaireSearch] = useState('');

  // Mock available questions data
  const [availableQuestions] = useState<Question[]>([
    {
      id: 4,
      descricao: 'summarize o teor do documento',
      dataInclusao: '2025-06-20',
      proprietario: 'milagres@bitami.etetermin.com'
    },
    {
      id: 1,
      descricao: 'Qual é o objetivo principal deste documento?',
      dataInclusao: '2025-01-15',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 2,
      descricao: 'Quais são os riscos identificados?',
      dataInclusao: '2025-01-10',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 3,
      descricao: 'Existe conformidade com as normas vigentes?',
      dataInclusao: '2025-01-05',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 5,
      descricao: 'Quais são as responsabilidades definidas?',
      dataInclusao: '2024-12-28',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 6,
      descricao: 'O documento possui data de validade?',
      dataInclusao: '2024-12-20',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 7,
      descricao: 'Existem anexos ou documentos relacionados?',
      dataInclusao: '2024-12-15',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 8,
      descricao: 'Qual é o nível de criticidade desta informação?',
      dataInclusao: '2024-12-10',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 9,
      descricao: 'Há necessidade de aprovação superior?',
      dataInclusao: '2024-12-05',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 10,
      descricao: 'O documento está atualizado com a versão mais recente?',
      dataInclusao: '2024-12-01',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 11,
      descricao: 'Existem conflitos com outras diretrizes?',
      dataInclusao: '2024-11-25',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 12,
      descricao: 'Qual é o impacto operacional desta mudança?',
      dataInclusao: '2024-11-20',
      proprietario: 'admin@empresa.com'
    }
  ]);

  // Questionnaires data
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([
    {
      id: 1,
      nome: 'basics',
      tipoDocumento: 'sired',
      perguntas: 4,
      perguntasSelecionadas: [
        availableQuestions.find(q => q.id === 4),
        availableQuestions.find(q => q.id === 1),
        availableQuestions.find(q => q.id === 2),
        availableQuestions.find(q => q.id === 3)
      ].filter(Boolean) as Question[],
      dataInclusao: '2025-06-20',
      proprietario: 'milagres@bitami.etetermin.com'
    },
    {
      id: 2,
      nome: 'Avaliação de Conformidade',
      tipoDocumento: 'Contrato',
      perguntas: 8,
      perguntasSelecionadas: [
        availableQuestions.find(q => q.id === 1),
        availableQuestions.find(q => q.id === 2),
        availableQuestions.find(q => q.id === 3),
        availableQuestions.find(q => q.id === 5),
        availableQuestions.find(q => q.id === 6),
        availableQuestions.find(q => q.id === 7),
        availableQuestions.find(q => q.id === 8),
        availableQuestions.find(q => q.id === 9)
      ].filter(Boolean) as Question[],
      dataInclusao: '2025-01-15',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 3,
      nome: 'Análise de Riscos',
      tipoDocumento: 'Relatório',
      perguntas: 12,
      perguntasSelecionadas: availableQuestions,
      dataInclusao: '2025-01-10',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 4,
      nome: 'Checklist de Segurança',
      tipoDocumento: 'Manual',
      perguntas: 15,
      perguntasSelecionadas: [],
      dataInclusao: '2025-01-05',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 5,
      nome: 'Auditoria Interna',
      tipoDocumento: 'Política',
      perguntas: 20,
      perguntasSelecionadas: [],
      dataInclusao: '2024-12-28',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 6,
      nome: 'Avaliação de Performance',
      tipoDocumento: 'Procedimento',
      perguntas: 6,
      perguntasSelecionadas: [],
      dataInclusao: '2024-12-20',
      proprietario: 'admin@empresa.com'
    }
  ]);

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
  const sortQuestionnaires = (questionnaires: Questionnaire[]) => {
    if (!sortField || !sortDirection) return questionnaires;

    return [...questionnaires].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'nome':
          aValue = a.nome.toLowerCase();
          bValue = b.nome.toLowerCase();
          break;
        case 'tipoDocumento':
          aValue = a.tipoDocumento.toLowerCase();
          bValue = b.tipoDocumento.toLowerCase();
          break;
        case 'perguntas':
          aValue = a.perguntas;
          bValue = b.perguntas;
          break;
        case 'dataInclusao':
          aValue = new Date(a.dataInclusao);
          bValue = new Date(b.dataInclusao);
          break;
        case 'proprietario':
          aValue = a.proprietario.toLowerCase();
          bValue = b.proprietario.toLowerCase();
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

  // Enhanced filtering for questionnaires
  const filteredQuestionnaires = questionnaires.filter(questionnaire => {
    const matchesSearch = questionnaire.nome.toLowerCase().includes(questionnaireSearch.toLowerCase()) ||
                         questionnaire.tipoDocumento.toLowerCase().includes(questionnaireSearch.toLowerCase()) ||
                         questionnaire.proprietario.toLowerCase().includes(questionnaireSearch.toLowerCase()) ||
                         questionnaire.id.toString().includes(questionnaireSearch);
    return matchesSearch;
  });

  // Apply sorting to filtered data
  const sortedQuestionnaires = sortQuestionnaires(filteredQuestionnaires);

  // Pagination calculations
  const totalPages = Math.ceil(sortedQuestionnaires.length / ITEMS_PER_PAGE);
  const paginatedQuestionnaires = sortedQuestionnaires.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Checkbox functions
  const handleSelectQuestionnaire = (questionnaireId: number) => {
    setSelectedQuestionnaires(prev => 
      prev.includes(questionnaireId) 
        ? prev.filter(id => id !== questionnaireId)
        : [...prev, questionnaireId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedQuestionnaires([]);
    } else {
      setSelectedQuestionnaires(paginatedQuestionnaires.map(questionnaire => questionnaire.id));
    }
    setSelectAll(!selectAll);
  };

  // Update selectAll state when individual selections change
  React.useEffect(() => {
    const allSelected = paginatedQuestionnaires.length > 0 && 
      paginatedQuestionnaires.every(questionnaire => selectedQuestionnaires.includes(questionnaire.id));
    setSelectAll(allSelected);
  }, [selectedQuestionnaires, paginatedQuestionnaires]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset pagination when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [questionnaireSearch]);

  // Clear search handler
  const clearQuestionnaireSearch = () => {
    setQuestionnaireSearch('');
  };

  // Navigation handlers
  const handleCreateNew = () => {
    navigate('/questionarios/new');
  };

  const handleEditQuestionnaire = (questionnaire: Questionnaire) => {
    navigate(`/questionarios/${questionnaire.id}`);
  };

  // CRUD operations
  const handleDeleteQuestionnaire = (questionnaireId: number) => {
    setQuestionnaires(questionnaires.filter(questionnaire => questionnaire.id !== questionnaireId));
    toast.success('Questionário excluído com sucesso!');
  };

  // Bulk delete function
  const handleBulkDelete = () => {
    setQuestionnaires(questionnaires.filter(questionnaire => !selectedQuestionnaires.includes(questionnaire.id)));
    toast.success(`${selectedQuestionnaires.length} questionário(s) excluído(s) com sucesso!`);
    setSelectedQuestionnaires([]);
    setSelectAll(false);
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

  // Delete Confirmation Component
  const DeleteConfirmationDialog = ({ questionnaire, children }: { questionnaire: Questionnaire; children: React.ReactNode }) => (
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
            Você está prestes a deletar<br />um questionário do sistema
          </AlertDialogTitle>
          <AlertDialogDescription className="text-woopi-ai-gray">
            Esta ação não poderá ser desfeita.<br />
            Tem certeza que deseja<br />
            removê-lo?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="text-woopi-ai-blue hover:text-woopi-ai-dark-blue">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => handleDeleteQuestionnaire(questionnaire.id)}
            className="woopi-ai-button-primary"
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

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
            Você está prestes a deletar<br />{selectedQuestionnaires.length} questionário(s) do sistema
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

  // Mobile Card Component
  const QuestionnaireCard = ({ questionnaire }: { questionnaire: Questionnaire }) => (
    <div className="mobile-card-item">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <Checkbox
            checked={selectedQuestionnaires.includes(questionnaire.id)}
            onCheckedChange={() => handleSelectQuestionnaire(questionnaire.id)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs woopi-ai-text-secondary">ID: {questionnaire.id}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                {questionnaire.perguntas} perguntas
              </span>
            </div>
            <h3 className="font-medium woopi-ai-text-primary text-sm leading-tight mb-1">
              {questionnaire.nome}
            </h3>
          </div>
        </div>
      </div>
      
      <div className="mobile-card-row">
        <div className="mobile-card-label">Tipo de Documento</div>
        <div className="mobile-card-value">
          <span className="text-sm woopi-ai-text-primary">{questionnaire.tipoDocumento}</span>
        </div>
      </div>
      
      <div className="mobile-card-row">
        <div className="mobile-card-label">Data de Inclusão</div>
        <div className="mobile-card-value">
          <span className="text-sm woopi-ai-text-primary">
            {new Date(questionnaire.dataInclusao).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
      
      <div className="mobile-card-row">
        <div className="mobile-card-label">Proprietário</div>
        <div className="mobile-card-value">
          <span className="text-sm woopi-ai-text-primary">{questionnaire.proprietario}</span>
        </div>
      </div>
      
      <div className="mobile-card-actions">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditQuestionnaire(questionnaire)}
            className="h-8 w-8 p-0 hover:bg-muted dark:hover:bg-[#2d3354]"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <DeleteConfirmationDialog questionnaire={questionnaire}>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </DeleteConfirmationDialog>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button 
          ref={addButtonRef} 
          onClick={handleCreateNew}
          className="woopi-ai-button-primary w-full md:w-auto ml-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          CRIAR QUESTIONÁRIO
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Questionários</CardTitle>
          <CardDescription>
            Encontre questionários por nome, tipo de documento ou proprietário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray w-4 h-4" />
              <Input
                ref={searchInputRef}
                placeholder="Buscar questionários por nome, tipo de documento, proprietário ou ID..."
                value={questionnaireSearch}
                onChange={(e) => setQuestionnaireSearch(e.target.value)}
                className="pl-10 pr-10 border-gray-300 focus:border-woopi-ai-blue"
              />
              {questionnaireSearch && (
                <button
                  type="button"
                  onClick={clearQuestionnaireSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray hover:text-woopi-ai-dark-gray transition-colors"
                  title="Limpar busca"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {selectedQuestionnaires.length > 0 && (
              <BulkDeleteConfirmationDialog>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Selecionados ({selectedQuestionnaires.length})
                </Button>
              </BulkDeleteConfirmationDialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questionnaires Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Questionários</CardTitle>
          <CardDescription>
            {sortedQuestionnaires.length} questionário(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="table-scroll-container overflow-x-auto">
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
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center gap-2">
                        ID
                        {getSortIcon('id')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 transition-colors min-w-[200px]"
                      onClick={() => handleSort('nome')}
                    >
                      <div className="flex items-center gap-2">
                        Nome
                        {getSortIcon('nome')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort('tipoDocumento')}
                    >
                      <div className="flex items-center gap-2">
                        Tipo de Documento
                        {getSortIcon('tipoDocumento')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort('perguntas')}
                    >
                      <div className="flex items-center gap-2">
                        Perguntas
                        {getSortIcon('perguntas')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort('dataInclusao')}
                    >
                      <div className="flex items-center gap-2">
                        Data de Inclusão
                        {getSortIcon('dataInclusao')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 transition-colors min-w-[200px]"
                      onClick={() => handleSort('proprietario')}
                    >
                      <div className="flex items-center gap-2">
                        Proprietário
                        {getSortIcon('proprietario')}
                      </div>
                    </TableHead>
                    <TableHead className="w-20">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedQuestionnaires.map((questionnaire) => (
                    <TableRow key={questionnaire.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedQuestionnaires.includes(questionnaire.id)}
                          onCheckedChange={() => handleSelectQuestionnaire(questionnaire.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{questionnaire.id}</TableCell>
                      <TableCell className="font-medium">{questionnaire.nome}</TableCell>
                      <TableCell>{questionnaire.tipoDocumento}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {questionnaire.perguntas}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(questionnaire.dataInclusao).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={questionnaire.proprietario}>
                        {questionnaire.proprietario}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditQuestionnaire(questionnaire)}
                            className="h-8 w-8 p-0 hover:bg-muted dark:hover:bg-[#2d3354]"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <DeleteConfirmationDialog questionnaire={questionnaire}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </DeleteConfirmationDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm woopi-ai-text-secondary">
                  Selecionar todos ({paginatedQuestionnaires.length})
                </span>
              </div>
              {selectedQuestionnaires.length > 0 && (
                <BulkDeleteConfirmationDialog>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </BulkDeleteConfirmationDialog>
              )}
            </div>
            
            {paginatedQuestionnaires.map((questionnaire) => (
              <QuestionnaireCard key={questionnaire.id} questionnaire={questionnaire} />
            ))}
          </div>

          {/* Empty State */}
          {sortedQuestionnaires.length === 0 && (
            <div className="text-center py-12">
              <div className="text-woopi-ai-gray mb-4">
                {questionnaireSearch ? 'Nenhum questionário encontrado com os critérios de busca.' : 'Nenhum questionário cadastrado.'}
              </div>
              <Button onClick={handleCreateNew} className="woopi-ai-button-primary">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Questionário
              </Button>
            </div>
          )}

          {/* Pagination */}
          {renderPagination()}
        </CardContent>
      </Card>
    </div>
  );
}