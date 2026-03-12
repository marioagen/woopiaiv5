import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, BookType, Plus, MoreHorizontal, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';

interface Template {
  id: number;
  name: string;
  type: string;
  fields: number;
}

interface SortConfig {
  key: keyof Template | null;
  direction: 'asc' | 'desc';
}

export function TemplateManagementPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  // Mock data based on Figma design
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 1,
      name: 'Extração inicial',
      type: 'Fiscal',
      fields: 5,
    },
    {
      id: 2,
      name: 'Financeiro',
      type: 'Financeiro jur',
      fields: 8,
    },
  ]);

  // Handle search
  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle sorting
  const handleSort = (key: keyof Template) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTemplates = React.useMemo(() => {
    if (!sortConfig.key) return filteredTemplates;

    return [...filteredTemplates].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredTemplates, sortConfig]);

  // Handle actions
  const handleNewTemplate = () => {
    navigate('/templates/novo');
  };

  const handleEditTemplate = (template: Template) => {
    toast.info(`Editando template: ${template.name}`);
  };

  const handleDeleteTemplate = (template: Template) => {
    toast.success(`Template "${template.name}" removido com sucesso`);
    setTemplates(templates.filter(t => t.id !== template.id));
  };

  const handleDuplicateTemplate = (template: Template) => {
    const newTemplate = {
      ...template,
      id: Math.max(...templates.map(t => t.id)) + 1,
      name: `${template.name} (Cópia)`,
    };
    setTemplates([...templates, newTemplate]);
    toast.success(`Template "${template.name}" duplicado com sucesso`);
  };

  const getSortIcon = (key: keyof Template) => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown className="w-4 h-4 text-woopi-ai-gray" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="w-4 h-4 text-woopi-ai-blue" />;
    }
    if (sortConfig.direction === 'desc') {
      return <ChevronDown className="w-4 h-4 text-woopi-ai-blue" />;
    }
    return <ChevronsUpDown className="w-4 h-4 text-woopi-ai-gray" />;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl woopi-ai-text-primary">
          Gerenciamento de templates
        </h1>
        <p className="woopi-ai-text-secondary">
          Gerencie templates a ser aplicados a documentos
        </p>
      </div>

      {/* Main Content Card */}
      <Card className="woopi-ai-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-woopi-ai-dark-gray">
              <BookType className="w-5 h-5" />
              Templates
            </CardTitle>
            <Button 
              onClick={handleNewTemplate}
              className="woopi-ai-button-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Template
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-woopi-ai-gray" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border border-woopi-ai-border focus:border-woopi-ai-blue"
            />
          </div>

          {/* Templates Count */}
          <div className="flex items-center gap-2">
            <span className="text-sm woopi-ai-text-primary">
              Times ({filteredTemplates.length})
            </span>
          </div>

          {/* Table */}
          <div className="border border-woopi-ai-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="border-b border-woopi-ai-border hover:bg-gray-50">
                  <TableHead 
                    className="cursor-pointer select-none p-2 hover:bg-woopi-ai-light-gray transition-colors"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="text-woopi-ai-gray text-xs">ID</span>
                      {getSortIcon('id')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none p-2 hover:bg-woopi-ai-light-gray transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="text-woopi-ai-gray text-xs">Nome</span>
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none p-2 hover:bg-woopi-ai-light-gray transition-colors"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="text-woopi-ai-gray text-xs">Tipo</span>
                      {getSortIcon('type')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none p-2 hover:bg-woopi-ai-light-gray transition-colors"
                    onClick={() => handleSort('fields')}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="text-woopi-ai-gray text-xs">Campos</span>
                      {getSortIcon('fields')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right p-2">
                    <span className="text-woopi-ai-gray text-xs">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTemplates.length > 0 ? (
                  sortedTemplates.map((template) => (
                    <TableRow 
                      key={template.id}
                      className="border-b border-woopi-ai-border hover:bg-gray-50/50"
                    >
                      <TableCell className="p-2">
                        <span className="text-sm text-woopi-ai-dark-gray">
                          {template.id}
                        </span>
                      </TableCell>
                      <TableCell className="p-2">
                        <span className="text-sm text-woopi-ai-dark-gray">
                          {template.name}
                        </span>
                      </TableCell>
                      <TableCell className="p-2">
                        <span className="text-sm text-woopi-ai-gray">
                          {template.type}
                        </span>
                      </TableCell>
                      <TableCell className="p-2">
                        <span className="text-sm text-woopi-ai-gray">
                          {template.fields}
                        </span>
                      </TableCell>
                      <TableCell className="text-right p-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteTemplate(template)}
                              className="text-woopi-ai-error hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="space-y-2">
                        <BookType className="w-12 h-12 text-woopi-ai-gray mx-auto opacity-50" />
                        <p className="text-woopi-ai-gray">
                          {searchTerm ? 'Nenhum template encontrado' : 'Nenhum template cadastrado'}
                        </p>
                        {!searchTerm && (
                          <Button 
                            onClick={handleNewTemplate}
                            variant="outline" 
                            size="sm"
                            className="mt-2"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Criar primeiro template
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}