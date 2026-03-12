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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { useKeyboardShortcuts } from './ui/use-keyboard-shortcuts';


interface DocumentType {
  id: number;
  nome: string;
  dataInclusao: string;
  proprietario: string;
}

type SortField = 'id' | 'nome' | 'dataInclusao' | 'proprietario';
type SortDirection = 'asc' | 'desc' | null;

export function DocumentTypesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Refs for keyboard shortcuts
  const searchInputRef = useRef<HTMLInputElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  // Checkbox selection states
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Sorting states
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Search states
  const [typeSearch, setTypeSearch] = useState('');

  // Document types data - Updated to match the attached image
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([
    {
      id: 1,
      nome: 'sired',
      dataInclusao: '2025-06-20',
      proprietario: 'milagres@bitami.etetermin.com'
    },
    {
      id: 2,
      nome: 'Contrato',
      dataInclusao: '2025-01-15',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 3,
      nome: 'Relatório',
      dataInclusao: '2025-01-10',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 4,
      nome: 'Manual',
      dataInclusao: '2025-01-05',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 5,
      nome: 'Política',
      dataInclusao: '2025-01-01',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 6,
      nome: 'Procedimento',
      dataInclusao: '2024-12-28',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 7,
      nome: 'Formulário',
      dataInclusao: '2024-12-20',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 8,
      nome: 'Certificado',
      dataInclusao: '2024-12-15',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 9,
      nome: 'Licença',
      dataInclusao: '2024-12-10',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 10,
      nome: 'Norma',
      dataInclusao: '2024-12-05',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 11,
      nome: 'Instrução',
      dataInclusao: '2024-12-01',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 12,
      nome: 'Regulamento',
      dataInclusao: '2024-11-25',
      proprietario: 'admin@empresa.com'
    }
  ]);

  // Modal states
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<DocumentType | null>(null);

  // Form states
  const [typeForm, setTypeForm] = useState({
    nome: '',
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
  const sortTypes = (types: DocumentType[]) => {
    if (!sortField || !sortDirection) return types;

    return [...types].sort((a, b) => {
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

  // Enhanced filtering for document types
  const filteredTypes = documentTypes.filter(type => {
    const matchesSearch = type.nome.toLowerCase().includes(typeSearch.toLowerCase()) ||
                         type.proprietario.toLowerCase().includes(typeSearch.toLowerCase()) ||
                         type.id.toString().includes(typeSearch);
    return matchesSearch;
  });

  // Apply sorting to filtered data
  const sortedTypes = sortTypes(filteredTypes);

  // Pagination calculations
  const totalPages = Math.ceil(sortedTypes.length / ITEMS_PER_PAGE);
  const paginatedTypes = sortedTypes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Checkbox functions
  const handleSelectType = (typeId: number) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes(paginatedTypes.map(type => type.id));
    }
    setSelectAll(!selectAll);
  };

  // Update selectAll state when individual selections change
  React.useEffect(() => {
    const allSelected = paginatedTypes.length > 0 && 
      paginatedTypes.every(type => selectedTypes.includes(type.id));
    setSelectAll(allSelected);
  }, [selectedTypes, paginatedTypes]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset pagination when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [typeSearch]);

  // Clear search handler
  const clearTypeSearch = () => {
    setTypeSearch('');
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
  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingType) {
      setDocumentTypes(documentTypes.map(type => 
        type.id === editingType.id 
          ? { 
              ...type, 
              nome: typeForm.nome
            }
          : type
      ));
      toast.success('Tipo de documento atualizado com sucesso!');
    } else {
      const newType: DocumentType = {
        id: Date.now(),
        nome: typeForm.nome,
        dataInclusao: new Date().toISOString().split('T')[0],
        proprietario: 'usuarioatual@empresa.com'
      };
      setDocumentTypes([newType, ...documentTypes]);
      toast.success('Tipo de documento criado com sucesso!');
    }
    resetTypeForm();
  };

  const resetTypeForm = () => {
    setTypeForm({
      nome: '',
    });
    setEditingType(null);
    setIsTypeModalOpen(false);
  };

  const handleEditType = (type: DocumentType) => {
    setEditingType(type);
    setTypeForm({
      nome: type.nome,
    });
    setIsTypeModalOpen(true);
  };

  const handleDeleteType = (typeId: number) => {
    setDocumentTypes(documentTypes.filter(type => type.id !== typeId));
    toast.success('Tipo de documento excluído com sucesso!');
  };

  // Bulk delete function
  const handleBulkDelete = () => {
    setDocumentTypes(documentTypes.filter(type => !selectedTypes.includes(type.id)));
    toast.success(`${selectedTypes.length} tipo(s) de documento excluído(s) com sucesso!`);
    setSelectedTypes([]);
    setSelectAll(false);
  };

  // Delete Confirmation Component
  const DeleteConfirmationDialog = ({ type, children }: { type: DocumentType; children: React.ReactNode }) => (
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
            Você está prestes a deletar<br />um tipo de documento do sistema
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
            onClick={() => handleDeleteType(type.id)}
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
            Você está prestes a deletar<br />{selectedTypes.length} tipo(s) de documento do sistema
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
  const TypeCard = ({ type }: { type: DocumentType }) => (
    <div className="mobile-card-item">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <Checkbox
            checked={selectedTypes.includes(type.id)}
            onCheckedChange={() => handleSelectType(type.id)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium woopi-ai-text-primary text-sm leading-tight mb-1">
              {type.nome}
            </h3>
            <p className="text-xs woopi-ai-text-secondary">ID: {type.id}</p>
          </div>
        </div>
      </div>
      
      <div className="mobile-card-row">
        <div className="mobile-card-label">Data de Inclusão</div>
        <div className="mobile-card-value">
          <span className="text-sm woopi-ai-text-primary">
            {new Date(type.dataInclusao).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
      
      <div className="mobile-card-row">
        <div className="mobile-card-label">Proprietário</div>
        <div className="mobile-card-value">
          <span className="text-sm woopi-ai-text-primary">{type.proprietario}</span>
        </div>
      </div>
      
      <div className="mobile-card-actions">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditType(type)}
            className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
          >
            <Edit className="w-4 h-4 text-green-600 dark:text-green-400" />
          </Button>
          <DeleteConfirmationDialog type={type}>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
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
        <Dialog open={isTypeModalOpen} onOpenChange={setIsTypeModalOpen}>
          <DialogTrigger asChild>
            <Button ref={addButtonRef} className="woopi-ai-button-primary w-full md:w-auto ml-auto">
              <Plus className="w-4 h-4 mr-2" />
              CRIAR TIPO
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle>
                {editingType ? 'Editar Tipo' : 'Criar Tipo'}
              </DialogTitle>
              <DialogDescription>
                {editingType ? 'Atualize as informações do tipo' : 'Crie um novo tipo de documento'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleTypeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Tipo</Label>
                <Input
                  id="nome"
                  placeholder="Digite o nome do tipo"
                  value={typeForm.nome}
                  onChange={(e) => setTypeForm({...typeForm, nome: e.target.value})}
                  className="border-gray-300 focus:border-woopi-ai-blue"
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetTypeForm} className="w-full md:w-auto">
                  Cancelar
                </Button>
                <Button type="submit" className="woopi-ai-button-primary w-full md:w-auto">
                  {editingType ? 'Salvar Alterações' : 'Criar Tipo'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="woopi-ai-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 woopi-ai-text-secondary" />
                <Input
                  ref={searchInputRef}
                  placeholder="Nome, ID ou busca um novo tipo para colaborar"
                  value={typeSearch}
                  onChange={(e) => setTypeSearch(e.target.value)}
                  className="pl-10 pr-10 border border-woopi-ai-border"
                />
                {typeSearch && (
                  <button
                    type="button"
                    onClick={clearTypeSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray hover:text-woopi-ai-dark-gray transition-colors"
                    title="Limpar busca"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Types Table/Cards */}
      <Card className="woopi-ai-card">
        <CardContent className="p-0">
          {/* Bulk Delete Button - Only show when items are selected */}
          {selectedTypes.length > 0 && (
            <div className="m-6 mb-0 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-700">
                  {selectedTypes.length} item(s) selecionado(s)
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
                    onClick={() => handleSort('nome')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nome</span>
                      {getSortIcon('nome')}
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
                {paginatedTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="pl-6">
                      <Checkbox
                        checked={selectedTypes.includes(type.id)}
                        onCheckedChange={() => handleSelectType(type.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="woopi-ai-text-primary">{type.id}</span>
                    </TableCell>
                    <TableCell>
                      <span className="woopi-ai-text-primary">{type.nome}</span>
                    </TableCell>
                    <TableCell>
                      <span className="woopi-ai-text-secondary">
                        {new Date(type.dataInclusao).toLocaleDateString('pt-BR')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="woopi-ai-text-secondary">{type.proprietario}</span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditType(type)}
                          className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/20"
                        >
                          <Edit className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </Button>
                        <DeleteConfirmationDialog type={type}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
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
                  {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, sortedTypes.length)} de {sortedTypes.length}
                </span>
              </div>
              
              {renderPagination()}
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden p-4">
            {/* Bulk Delete Button for Mobile */}
            {selectedTypes.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-700">
                    {selectedTypes.length} item(s) selecionado(s)
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
              {paginatedTypes.map((type) => (
                <TypeCard key={type.id} type={type} />
              ))}
            </div>
            
            {/* Mobile Footer */}
            <div className="flex flex-col items-center gap-4 pt-4 mt-4 border-t border-woopi-ai-border">
              <div className="text-sm woopi-ai-text-secondary text-center">
                {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, sortedTypes.length)} de {sortedTypes.length}
              </div>
              {renderPagination()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}