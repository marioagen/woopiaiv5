import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, 
  Plus, 
  MoreHorizontal,
  Edit2,
  Trash2,
  X,
  Zap,
  ChevronDown
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { toast } from 'sonner@2.0.3';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type OrderBy = 'recent' | 'oldest' | 'alphabetical';

interface APITemplate {
  id: number;
  method: HTTPMethod;
  name: string;
  url: string;
  criadoEm: string;
}

export function APITemplatesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState<OrderBy>('recent');
  const [selectedMethods, setSelectedMethods] = useState<HTTPMethod[]>([]);

  // Mock data
  const [templates, setTemplates] = useState<APITemplate[]>([
    {
      id: 1,
      method: 'GET',
      name: 'Get User Details',
      url: 'https://jsonplaceholder.typicode.com/users/1',
      criadoEm: '2024-01-20'
    },
    {
      id: 2,
      method: 'GET',
      name: 'List All Posts',
      url: 'https://jsonplaceholder.typicode.com/posts',
      criadoEm: '2024-01-19'
    },
    {
      id: 3,
      method: 'POST',
      name: 'Create a New Post',
      url: 'https://jsonplaceholder.typicode.com/posts',
      criadoEm: '2024-01-18'
    },
    {
      id: 4,
      method: 'PUT',
      name: 'Update a Photo',
      url: 'https://jsonplaceholder.typicode.com/photos/100',
      criadoEm: '2024-01-17'
    },
    {
      id: 5,
      method: 'DELETE',
      name: 'Delete a Comment',
      url: 'https://jsonplaceholder.typicode.com/comments/5',
      criadoEm: '2024-01-16'
    },
    {
      id: 6,
      method: 'PATCH',
      name: 'Patch a Todo Item',
      url: 'https://jsonplaceholder.typicode.com/todos/20',
      criadoEm: '2024-01-15'
    },
    {
      id: 7,
      method: 'GET',
      name: 'Get Weather Forecast',
      url: 'https://api.weather.gov/points/39.7456,-97.0892',
      criadoEm: '2024-01-14'
    },
    {
      id: 8,
      method: 'GET',
      name: 'Search for Cat Facts',
      url: 'https://catfact.ninja/facts',
      criadoEm: '2024-01-13'
    }
  ]);

  // All available methods
  const allMethods: HTTPMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  // Get method badge color
  const getMethodColor = (method: HTTPMethod) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700/50';
      case 'POST':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700/50';
      case 'PUT':
        return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700/50';
      case 'DELETE':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700/50';
      case 'PATCH':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700/50';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700/40 dark:text-gray-300 dark:border-gray-600/50';
    }
  };

  // Toggle method filter
  const toggleMethod = (method: HTTPMethod) => {
    setSelectedMethods(prev =>
      prev.includes(method)
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedMethods([]);
    setOrderBy('recent');
    setSearchTerm('');
  };

  // Check if has active filters
  const hasActiveFilters = selectedMethods.length > 0;

  // Filter templates based on search and method filters
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchTerm.trim() || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.method.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMethod = selectedMethods.length === 0 || 
      selectedMethods.includes(template.method);

    return matchesSearch && matchesMethod;
  });

  // Sort templates
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (orderBy) {
      case 'recent':
        return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
      case 'oldest':
        return new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime();
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleCreateTemplate = () => {
    navigate('/templates/api/novo');
  };

  const handleEditTemplate = (template: APITemplate) => {
    navigate(`/templates/api/editar/${template.id}`);
  };

  const handleDeleteTemplate = (template: APITemplate) => {
    // TODO: Implement delete with confirmation
    toast.success(`Template "${template.name}" removido com sucesso`);
    setTemplates(prev => prev.filter(t => t.id !== template.id));
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="woopi-ai-text-primary">API Templates</h1>
          <p className="woopi-ai-text-secondary">
            Gerencie, teste e edite seus templates de requisição de API.
          </p>
        </div>
        <Button 
          onClick={handleCreateTemplate}
          className="woopi-ai-button-primary whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar Novo Template
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="woopi-ai-card">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-woopi-ai-gray" />
                <Input
                  type="text"
                  placeholder="Buscar templates por nome ou URL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-woopi-ai-border"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray hover:text-woopi-ai-dark-gray"
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

                {/* Methods Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="border-woopi-ai-border hover:bg-woopi-ai-light-gray dark:border-[#393e5c] dark:text-[#d5d8e0] dark:hover:bg-[#2d3354]"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Métodos HTTP
                      {selectedMethods.length > 0 && (
                        <Badge 
                          variant="secondary" 
                          className="ml-2 bg-[#0073ea] text-white hover:bg-[#0073ea]/90 rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs"
                        >
                          {selectedMethods.length}
                        </Badge>
                      )}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 dark:bg-[#292f4c] dark:border-[#393e5c]">
                    <DropdownMenuLabel className="dark:text-[#d5d8e0]">Filtrar por Método</DropdownMenuLabel>
                    <DropdownMenuSeparator className="dark:bg-[#393e5c]" />
                    {allMethods.map((method) => (
                      <DropdownMenuCheckboxItem
                        key={method}
                        checked={selectedMethods.includes(method)}
                        onCheckedChange={() => toggleMethod(method)}
                        className="dark:text-[#d5d8e0] dark:focus:bg-[#2d3354]"
                      >
                        <Badge 
                          variant="outline"
                          className={`${getMethodColor(method)} text-xs font-medium px-2 py-0.5 mr-2`}
                        >
                          {method}
                        </Badge>
                        {method}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearFilters}
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
                {selectedMethods.map((method) => (
                  <Badge 
                    key={method}
                    variant="secondary"
                    className="bg-[#0073ea] text-white hover:bg-[#0073ea]/90 gap-1"
                  >
                    <Zap className="w-3 h-3" />
                    {method}
                    <button
                      type="button"
                      onClick={() => toggleMethod(method)}
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

      {/* Templates Table */}
      <Card className="woopi-ai-card">
        <CardHeader>
          <CardTitle className="woopi-ai-text-primary">
            Templates ({sortedTemplates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Método</TableHead>
                  <TableHead>Nome do Template</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="w-20">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTemplates.length > 0 ? (
                  sortedTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={`${getMethodColor(template.method)} text-xs font-medium px-2.5 py-1 whitespace-nowrap`}
                        >
                          {template.method}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium woopi-ai-text-primary">{template.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-woopi-ai-gray truncate max-w-md font-mono">
                          {template.url}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-muted dark:hover:bg-[#2d3354] dark:text-[#9196b0]"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="dark:bg-[#292f4c] dark:border-[#393e5c]">
                            <DropdownMenuItem onClick={() => handleEditTemplate(template)} className="dark:text-[#d5d8e0] dark:focus:bg-[#2d3354]">
                              <Edit2 className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteTemplate(template)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:focus:bg-[#2d3354]"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Zap className="w-8 h-8 text-woopi-ai-gray opacity-50" />
                        <span className="text-woopi-ai-gray">
                          {searchTerm || hasActiveFilters
                            ? 'Nenhum template encontrado com os filtros aplicados' 
                            : 'Nenhum template cadastrado'}
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
            {sortedTemplates.length > 0 ? (
              sortedTemplates.map((template) => (
                <div key={template.id} className="border border-woopi-ai-border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className={`${getMethodColor(template.method)} text-xs font-medium px-2 py-1`}
                        >
                          {template.method}
                        </Badge>
                        <p className="font-medium woopi-ai-text-primary">{template.name}</p>
                      </div>
                      <p className="text-xs text-woopi-ai-gray font-mono break-all">
                        {template.url}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-muted dark:hover:bg-[#2d3354] dark:text-[#9196b0]"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="dark:bg-[#292f4c] dark:border-[#393e5c]">
                        <DropdownMenuItem onClick={() => handleEditTemplate(template)} className="dark:text-[#d5d8e0] dark:focus:bg-[#2d3354]">
                          <Edit2 className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTemplate(template)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:focus:bg-[#2d3354]"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Zap className="w-8 h-8 text-woopi-ai-gray opacity-50 mx-auto mb-2" />
                <p className="text-woopi-ai-gray">
                  {searchTerm || hasActiveFilters
                    ? 'Nenhum template encontrado com os filtros aplicados' 
                    : 'Nenhum template cadastrado'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}