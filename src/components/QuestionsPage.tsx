import React, { useState, useRef } from 'react';
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
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
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

type SortField = 'id' | 'descricao' | 'dataInclusao' | 'proprietario';
type SortDirection = 'asc' | 'desc' | null;

export function QuestionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Refs for keyboard shortcuts
  const searchInputRef = useRef<HTMLInputElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  // Checkbox selection states
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Sorting states
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Search states
  const [questionSearch, setQuestionSearch] = useState('');

  // Questions data - Based on the attached image
  const [questions, setQuestions] = useState<Question[]>([
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

  // Modal states
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form states
  const [questionForm, setQuestionForm] = useState({
    descricao: '',
  });

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
  const sortQuestions = (questions: Question[]) => {
    if (!sortField || !sortDirection) return questions;

    return [...questions].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'descricao':
          aValue = a.descricao.toLowerCase();
          bValue = b.descricao.toLowerCase();
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

  // Enhanced filtering for questions
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.descricao.toLowerCase().includes(questionSearch.toLowerCase()) ||
                         question.proprietario.toLowerCase().includes(questionSearch.toLowerCase()) ||
                         question.id.toString().includes(questionSearch);
    return matchesSearch;
  });

  // Apply sorting to filtered data
  const sortedQuestions = sortQuestions(filteredQuestions);

  // Pagination calculations
  const totalPages = Math.ceil(sortedQuestions.length / ITEMS_PER_PAGE);
  const paginatedQuestions = sortedQuestions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Checkbox functions
  const handleSelectQuestion = (questionId: number) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(paginatedQuestions.map(question => question.id));
    }
    setSelectAll(!selectAll);
  };

  // Update selectAll state when individual selections change
  React.useEffect(() => {
    const allSelected = paginatedQuestions.length > 0 && 
      paginatedQuestions.every(question => selectedQuestions.includes(question.id));
    setSelectAll(allSelected);
  }, [selectedQuestions, paginatedQuestions]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset pagination when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [questionSearch]);

  // Clear search handler
  const clearQuestionSearch = () => {
    setQuestionSearch('');
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
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuestion) {
      setQuestions(questions.map(question => 
        question.id === editingQuestion.id 
          ? { 
              ...question, 
              descricao: questionForm.descricao
            }
          : question
      ));
      toast.success('Pergunta atualizada com sucesso!');
    } else {
      const newQuestion: Question = {
        id: Date.now(),
        descricao: questionForm.descricao,
        dataInclusao: new Date().toISOString().split('T')[0],
        proprietario: 'usuarioatual@empresa.com'
      };
      setQuestions([newQuestion, ...questions]);
      toast.success('Pergunta criada com sucesso!');
    }
    resetQuestionForm();
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      descricao: '',
    });
    setEditingQuestion(null);
    setIsQuestionModalOpen(false);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionForm({
      descricao: question.descricao,
    });
    setIsQuestionModalOpen(true);
  };

  const handleDeleteQuestion = (questionId: number) => {
    setQuestions(questions.filter(question => question.id !== questionId));
    toast.success('Pergunta excluída com sucesso!');
  };

  // Bulk delete function
  const handleBulkDelete = () => {
    setQuestions(questions.filter(question => !selectedQuestions.includes(question.id)));
    toast.success(`${selectedQuestions.length} pergunta(s) excluída(s) com sucesso!`);
    setSelectedQuestions([]);
    setSelectAll(false);
  };

  // Delete Confirmation Component
  const DeleteConfirmationDialog = ({ question, children }: { question: Question; children: React.ReactNode }) => (
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
            Você está prestes a deletar<br />uma pergunta do sistema
          </AlertDialogTitle>
          <AlertDialogDescription className="text-woopi-ai-gray">
            Esta ação não poderá ser desfeita.<br />
            Tem certeza que deseja<br />
            removê-la?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="text-woopi-ai-blue hover:text-woopi-ai-dark-blue">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => handleDeleteQuestion(question.id)}
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
            Você está prestes a deletar<br />{selectedQuestions.length} pergunta(s) do sistema
          </AlertDialogTitle>
          <AlertDialogDescription className="text-woopi-ai-gray">
            Esta ação não poderá ser desfeita.<br />
            Tem certeza que deseja<br />
            removê-las?
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
  const QuestionCard = ({ question }: { question: Question }) => (
    <div className="mobile-card-item">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <Checkbox
            checked={selectedQuestions.includes(question.id)}
            onCheckedChange={() => handleSelectQuestion(question.id)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs woopi-ai-text-secondary">ID: {question.id}</span>
            </div>
            <h3 className="font-medium woopi-ai-text-primary text-sm leading-tight mb-2">
              {question.descricao}
            </h3>
          </div>
        </div>
      </div>
      
      <div className="mobile-card-row">
        <div className="mobile-card-label">Data de Inclusão</div>
        <div className="mobile-card-value">
          <span className="text-sm woopi-ai-text-primary">
            {new Date(question.dataInclusao).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
      
      <div className="mobile-card-row">
        <div className="mobile-card-label">Proprietário</div>
        <div className="mobile-card-value">
          <span className="text-sm woopi-ai-text-primary">{question.proprietario}</span>
        </div>
      </div>
      
      <div className="mobile-card-actions">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditQuestion(question)}
            className="h-8 w-8 p-0 hover:bg-muted dark:hover:bg-[#2d3354]"
          >
            <Edit className="w-4 h-4 text-green-600" />
          </Button>
          <DeleteConfirmationDialog question={question}>
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
        <Dialog open={isQuestionModalOpen} onOpenChange={setIsQuestionModalOpen}>
          <DialogTrigger asChild>
            <Button ref={addButtonRef} className="woopi-ai-button-primary w-full md:w-auto ml-auto">
              <Plus className="w-4 h-4 mr-2" />
              CRIAR PERGUNTA
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? 'Editar Pergunta' : 'Criar Pergunta'}
              </DialogTitle>
              <DialogDescription>
                {editingQuestion ? 'Atualize a informação da pergunta' : 'Crie uma nova pergunta para o sistema'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição da Pergunta</Label>
                <Textarea
                  id="descricao"
                  placeholder="Digite a descrição da pergunta"
                  value={questionForm.descricao}
                  onChange={(e) => setQuestionForm({...questionForm, descricao: e.target.value})}
                  className="border-gray-300 focus:border-woopi-ai-blue"
                  required
                  rows={3}
                />
              </div>

              <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetQuestionForm} className="w-full md:w-auto">
                  Cancelar
                </Button>
                <Button type="submit" className="woopi-ai-button-primary w-full md:w-auto">
                  {editingQuestion ? 'Salvar Alterações' : 'Criar Pergunta'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Quick Create */}
      <Card className="woopi-ai-card">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 woopi-ai-text-secondary" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Buscar pergunta"
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                    className="pl-10 pr-10 border border-woopi-ai-border"
                  />
                  {questionSearch && (
                    <button
                      type="button"
                      onClick={clearQuestionSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray hover:text-woopi-ai-dark-gray transition-colors"
                      title="Limpar busca"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Table/Cards */}
      <Card className="woopi-ai-card">
        <CardContent className="p-0">
          {/* Bulk Delete Button - Only show when items are selected */}
          {selectedQuestions.length > 0 && (
            <div className="m-6 mb-0 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-700">
                  {selectedQuestions.length} item(s) selecionado(s)
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
          <div className="overflow-x-auto hidden md:block table-scroll-container" style={{ minWidth: '800px' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 pl-6">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-woopi-ai-light-gray transition-colors"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>ID</span>
                      {getSortIcon('id')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-woopi-ai-light-gray transition-colors"
                    onClick={() => handleSort('descricao')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Descrição</span>
                      {getSortIcon('descricao')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-woopi-ai-light-gray transition-colors"
                    onClick={() => handleSort('dataInclusao')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Data de Inclusão</span>
                      {getSortIcon('dataInclusao')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none hover:bg-woopi-ai-light-gray transition-colors"
                    onClick={() => handleSort('proprietario')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Proprietário</span>
                      {getSortIcon('proprietario')}
                    </div>
                  </TableHead>
                  <TableHead className="w-20 pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedQuestions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="pl-6">
                      <Checkbox
                        checked={selectedQuestions.includes(question.id)}
                        onCheckedChange={() => handleSelectQuestion(question.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="woopi-ai-text-primary">{question.id}</span>
                    </TableCell>
                    <TableCell>
                      <span className="woopi-ai-text-primary">{question.descricao}</span>
                    </TableCell>
                    <TableCell>
                      <span className="woopi-ai-text-secondary">
                        {new Date(question.dataInclusao).toLocaleDateString('pt-BR')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="woopi-ai-text-secondary">{question.proprietario}</span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditQuestion(question)}
                          className="h-8 w-8 p-0 hover:bg-muted dark:hover:bg-[#2d3354]"
                        >
                          <Edit className="w-4 h-4 text-green-600" />
                        </Button>
                        <DeleteConfirmationDialog question={question}>
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
            
            {/* Footer with pagination info and pagination */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 py-4 border-t border-woopi-ai-border gap-4">
              <div className="text-sm woopi-ai-text-secondary">
                Linhas por página: 
                <select className="ml-2 border border-woopi-ai-border rounded px-2 py-1">
                  <option value={10}>10</option>
                </select>
                <span className="ml-4">
                  {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, sortedQuestions.length)} de {sortedQuestions.length}
                </span>
              </div>
              
              {renderPagination()}
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden p-4">
            {/* Bulk Delete Button for Mobile */}
            {selectedQuestions.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-700">
                    {selectedQuestions.length} item(s) selecionado(s)
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
              {paginatedQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
            
            {/* Mobile Footer */}
            <div className="flex flex-col items-center gap-4 pt-4 mt-4 border-t border-woopi-ai-border">
              <div className="text-sm woopi-ai-text-secondary text-center">
                {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, sortedQuestions.length)} de {sortedQuestions.length}
              </div>
              {renderPagination()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}