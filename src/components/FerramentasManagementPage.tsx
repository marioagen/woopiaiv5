import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Search, 
  BookType, 
  Plus, 
  Edit, 
  Trash2, 
  ScanLine, 
  Layers, 
  Sparkles, 
  Database, 
  MessageCircle, 
  ShieldUser, 
  Languages,
  ChevronUp,
  ChevronDown,
  Filter,
  X,
  ChevronsUpDown,
  Globe,
  Network
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { toast } from 'sonner@2.0.3';

interface Ferramenta {
  id: number;
  name: string;
  type: 'ocr' | 'embeddings' | 'prompt' | 'extracao' | 'perguntas' | 'anonimizacao' | 'traducao' | 'json-api' | 'n8n-connector';
  input: string;
  output: string;
  createdAt: string;
  status: 'Ativa' | 'Inativa';
  usageCount: number;
}

type SortField = 'name' | 'type';
type SortDirection = 'asc' | 'desc';

const typeLabels = {
  ocr: 'OCR',
  embeddings: 'Embeddings',
  prompt: 'Prompt',
  extracao: 'Extração',
  perguntas: 'Perguntas ao Documento',
  anonimizacao: 'Anonimização',
  traducao: 'Tradução',
  'json-api': 'JSON API',
  'n8n-connector': 'Conector N8N'
};

const inputOptions = [
  'text',
  'PDF'
];

const outputOptions = [
  'text',
  'PDF'
];

const typeIcons = {
  ocr: ScanLine,
  embeddings: Layers,
  prompt: Sparkles,
  extracao: Database,
  perguntas: MessageCircle,
  anonimizacao: ShieldUser,
  traducao: Languages,
  'json-api': Globe,
  'n8n-connector': Network
};

const typeColors = {
  ocr: 'woopi-ai-badge-primary',
  embeddings: 'woopi-ai-badge-secondary',
  prompt: 'woopi-ai-badge-warning',
  extracao: 'woopi-ai-badge-purple',
  perguntas: 'woopi-ai-badge-success',
  anonimizacao: 'woopi-ai-badge-orange',
  traducao: 'woopi-ai-badge-purple',
  'json-api': 'woopi-ai-badge-primary',
  'n8n-connector': 'woopi-ai-badge-success'
};

export function FerramentasManagementPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFerramenta, setEditingFerramenta] = useState<Ferramenta | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    type: '' as Ferramenta['type'] | '',
    input: '',
    output: '',
    // JSON API specific fields
    url: '',
    method: 'GET',
    headers: '',
    // N8N Connector specific fields
    n8nUrl: '',
    apiKey: ''
  });

  // Mock data
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([
    {
      id: 1,
      name: 'OCR Básico',
      type: 'ocr',
      input: 'PDF',
      output: 'text',
      createdAt: '2024-01-15',
      status: 'Ativa',
      usageCount: 145
    },
    {
      id: 2,
      name: 'Embeddings de Contratos',
      type: 'embeddings',
      input: 'text',
      output: 'text',
      createdAt: '2024-01-10',
      status: 'Ativa',
      usageCount: 89
    },
    {
      id: 3,
      name: 'Gerador de Resumos',
      type: 'prompt',
      input: 'PDF',
      output: 'text',
      createdAt: '2024-02-01',
      status: 'Ativa',
      usageCount: 67
    },
    {
      id: 4,
      name: 'Extrator de CPF/CNPJ',
      type: 'extracao',
      input: 'text',
      output: 'text',
      createdAt: '2024-01-20',
      status: 'Inativa',
      usageCount: 23
    },
    {
      id: 5,
      name: 'Assistente de Documentos',
      type: 'perguntas',
      input: 'PDF',
      output: 'text',
      createdAt: '2024-01-25',
      status: 'Ativa',
      usageCount: 156
    },
    {
      id: 6,
      name: 'API de Validação Externa',
      type: 'json-api',
      input: 'text',
      output: 'text',
      createdAt: '2024-02-10',
      status: 'Ativa',
      usageCount: 42
    },
    {
      id: 7,
      name: 'Workflow N8N Aprovação',
      type: 'n8n-connector',
      input: 'text',
      output: 'text',
      createdAt: '2024-02-05',
      status: 'Ativa',
      usageCount: 28
    }
  ]);

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

  const sortedAndFilteredFerramentas = ferramentas
    .filter((ferramenta) => {
      if (typeFilter !== 'all' && ferramenta.type !== typeFilter) return false;
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        ferramenta.name.toLowerCase().includes(searchLower) ||
        ferramenta.input.toLowerCase().includes(searchLower) ||
        ferramenta.output.toLowerCase().includes(searchLower) ||
        typeLabels[ferramenta.type].toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      switch (sortField) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'type':
          valueA = typeLabels[a.type].toLowerCase();
          valueB = typeLabels[b.type].toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Modal functions
  const openCreateModal = () => {
    setEditingFerramenta(null);
    setFormData({
      name: '',
      type: '',
      input: '',
      output: '',
      url: '',
      method: 'GET',
      headers: '',
      n8nUrl: '',
      apiKey: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ferramenta: Ferramenta) => {
    setEditingFerramenta(ferramenta);
    setFormData({
      name: ferramenta.name,
      type: ferramenta.type,
      input: ferramenta.input,
      output: ferramenta.output,
      url: '',
      method: 'GET',
      headers: '',
      n8nUrl: '',
      apiKey: ''
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // Validação básica
    if (!formData.name || !formData.type || !formData.input || !formData.output) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Validação específica para JSON API
    if (formData.type === 'json-api') {
      if (!formData.url || !formData.method) {
        toast.error('Preencha todos os campos da configuração JSON API');
        return;
      }
    }

    // Validação específica para N8N Connector
    if (formData.type === 'n8n-connector') {
      if (!formData.n8nUrl || !formData.apiKey) {
        toast.error('Preencha todos os campos da configuração N8N');
        return;
      }
    }

    if (editingFerramenta) {
      // Update existing
      setFerramentas(prev => prev.map(f => 
        f.id === editingFerramenta.id 
          ? {
              ...f,
              name: formData.name,
              type: formData.type as Ferramenta['type'],
              input: formData.input,
              output: formData.output
            }
          : f
      ));
      toast.success('Ferramenta atualizada com sucesso');
    } else {
      // Create new
      const newFerramenta: Ferramenta = {
        id: Math.max(...ferramentas.map(f => f.id)) + 1,
        name: formData.name,
        type: formData.type as Ferramenta['type'],
        input: formData.input,
        output: formData.output,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'Ativa',
        usageCount: 0
      };
      setFerramentas(prev => [...prev, newFerramenta]);
      toast.success('Ferramenta criada com sucesso');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setFerramentas(prev => prev.filter(f => f.id !== id));
    toast.success('Ferramenta removida com sucesso');
  };

  const uniqueTypes = [...new Set(ferramentas.map(f => f.type))];

  const getTypeIcon = (type: Ferramenta['type']) => {
    const IconComponent = typeIcons[type];
    return <IconComponent className="w-4 h-4" />;
  };

  // Delete Confirmation Component
  const DeleteConfirmationDialog = ({ ferramenta, children }: { ferramenta: Ferramenta; children: React.ReactNode }) => (
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
            Você está prestes a deletar<br />uma ferramenta do sistema
          </AlertDialogTitle>
          <AlertDialogDescription className="text-woopi-ai-gray">
            Esta ação não poderá ser desfeita.<br />
            Tem certeza que deseja<br />
            remover <strong>{ferramenta.name}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="text-woopi-ai-blue hover:text-woopi-ai-dark-blue">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => handleDelete(ferramenta.id)}
            className="woopi-ai-button-primary"
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="woopi-ai-text-primary">Ferramentas</h1>
          <p className="woopi-ai-text-secondary">
            Gerencie e configure suas ferramentas de processamento de documentos
          </p>
        </div>
        <Button 
          onClick={openCreateModal}
          className="woopi-ai-button-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Ferramenta
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="woopi-ai-card">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 woopi-ai-text-secondary" />
                <Input
                  placeholder="Buscar por nome da ferramenta, entrada ou saída..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48 border border-woopi-ai-border">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Filtrar por tipo" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(type)}
                        {typeLabels[type]}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ferramentas Table */}
      <Card className="woopi-ai-card">
        <CardHeader>
          <CardTitle className="woopi-ai-text-primary">
            Ferramentas ({sortedAndFilteredFerramentas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead 
                    className="text-woopi-ai-gray font-medium cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Nome
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-woopi-ai-gray font-medium cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center gap-1">
                      Tipo
                      {getSortIcon('type')}
                    </div>
                  </TableHead>
                  <TableHead className="text-woopi-ai-gray font-medium">Entrada</TableHead>
                  <TableHead className="text-woopi-ai-gray font-medium">Saída</TableHead>
                  <TableHead className="text-woopi-ai-gray font-medium text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredFerramentas.length > 0 ? (
                  sortedAndFilteredFerramentas.map((ferramenta) => (
                    <TableRow key={ferramenta.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium woopi-ai-text-primary">{ferramenta.name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${typeColors[ferramenta.type]} flex items-center gap-1 w-fit`}>
                          {getTypeIcon(ferramenta.type)}
                          {typeLabels[ferramenta.type]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm woopi-ai-text-secondary">{ferramenta.input}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm woopi-ai-text-secondary">{ferramenta.output}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openEditModal(ferramenta)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-[#2d3354]"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar</p>
                            </TooltipContent>
                          </Tooltip>
                          <DeleteConfirmationDialog ferramenta={ferramenta}>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </DeleteConfirmationDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <BookType className="w-8 h-8 text-woopi-ai-gray opacity-50" />
                        <span className="text-woopi-ai-gray">
                          {searchTerm || typeFilter !== 'all' 
                            ? 'Nenhuma ferramenta encontrada com os filtros aplicados' 
                            : 'Nenhuma ferramenta cadastrada'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingFerramenta ? 'Editar Ferramenta' : 'Nova Ferramenta'}
            </DialogTitle>
            <DialogDescription>
              {editingFerramenta 
                ? 'Atualize as informações da ferramenta selecionada'
                : 'Crie uma nova ferramenta para processar documentos'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Ferramenta</Label>
              <Input
                id="name"
                placeholder="Ex: OCR Avançado"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Ferramenta</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Ferramenta['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ocr">OCR</SelectItem>
                  <SelectItem value="embeddings">Embeddings</SelectItem>
                  <SelectItem value="prompt">Prompt</SelectItem>
                  <SelectItem value="extracao">Extração</SelectItem>
                  <SelectItem value="perguntas">Perguntas ao Documento</SelectItem>
                  <SelectItem value="anonimizacao">Anonimização</SelectItem>
                  <SelectItem value="traducao">Tradução</SelectItem>
                  <SelectItem value="json-api">JSON API</SelectItem>
                  <SelectItem value="n8n-connector">Conector N8N</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="input">Entrada (Input)</Label>
                <Select 
                  value={formData.input} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, input: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de entrada" />
                  </SelectTrigger>
                  <SelectContent>
                    {inputOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="output">Saída (Output)</Label>
                <Select 
                  value={formData.output} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, output: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de saída" />
                  </SelectTrigger>
                  <SelectContent>
                    {outputOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* JSON API specific fields */}
            {formData.type === 'json-api' && (
              <div className="space-y-4 pt-4 border-t border-woopi-ai-border">
                <div className="space-y-2">
                  <Label htmlFor="url">URL da API</Label>
                  <Input
                    id="url"
                    placeholder="https://api.exemplo.com/endpoint"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method">Método HTTP</Label>
                  <Select 
                    value={formData.method} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, method: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headers">Headers JSON</Label>
                  <Input
                    id="headers"
                    placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                    value={formData.headers}
                    onChange={(e) => setFormData(prev => ({ ...prev, headers: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* N8N Connector specific fields */}
            {formData.type === 'n8n-connector' && (
              <div className="space-y-4 pt-4 border-t border-woopi-ai-border">
                <div className="space-y-2">
                  <Label htmlFor="n8nUrl">URL do N8N</Label>
                  <Input
                    id="n8nUrl"
                    placeholder="https://n8n.exemplo.com/webhook/workflow-id"
                    value={formData.n8nUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, n8nUrl: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">Chave da API</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Sua chave da API do N8N"
                    value={formData.apiKey}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              className="woopi-ai-button-primary"
            >
              {editingFerramenta ? 'Salvar Alterações' : 'Criar Ferramenta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}