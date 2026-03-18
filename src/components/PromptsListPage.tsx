import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, MoreHorizontal, Edit, Trash2, CloudDownload, Globe, Copy, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { toast } from 'sonner@2.0.3';

interface Prompt {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isGlobal?: boolean;
  createdBy?: 'me' | 'imported' | 'other';
  owner: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export function PromptsListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterType, setFilterType] = useState<'all' | 'me' | 'imported'>('all');

  // Mock data para demonstração
  const [prompts] = useState<Prompt[]>([
    {
      id: '1',
      name: 'Análise de Documentos Jurídicos',
      description: 'Prompt completo para revisar informações referentes a papéis jurídicos, processos extra judiciais, penalidades contratuais, multas e cláusulas de rescisão em contratos corporativos e acordos bilaterais',
      createdAt: '16/04/2025',
      updatedAt: '16/04/2025',
      createdBy: 'me',
      owner: { name: 'Carlos Eduardo Silva', email: 'carlos.silva@empresa.com' }
    },
    {
      id: '2',
      name: '[Jurídico] Análise de Contratos',
      description: 'Prompt para análise detalhada de contratos empresariais, identificando cláusulas importantes, riscos jurídicos, obrigações das partes, prazos de vigência e condições de renovação automática',
      createdAt: '15/01/2025',
      updatedAt: '15/01/2025',
      isGlobal: true,
      createdBy: 'imported',
      owner: { name: 'Woopi AI', email: 'suporte@woopi.ai' }
    },
    {
      id: '3',
      name: 'Resumo Executivo',
      description: 'Gera resumos executivos concisos de documentos extensos, destacando pontos-chave, decisões necessárias, prazos críticos e recomendações de ação para a equipe de gestão',
      createdAt: '16/04/2025',
      updatedAt: '16/04/2025',
      createdBy: 'other',
      owner: { name: 'Ana Beatriz Oliveira', email: 'ana.oliveira@empresa.com' }
    },
    {
      id: '4',
      name: '[Compliance] Verificação de Conformidade',
      description: 'Verificação de documentos para conformidade com normas regulatórias e políticas internas',
      createdAt: '10/01/2025',
      updatedAt: '10/01/2025',
      isGlobal: true,
      createdBy: 'imported',
      owner: { name: 'Woopi AI', email: 'suporte@woopi.ai' }
    },
    {
      id: '5',
      name: 'Prompt Name',
      description: 'Item para revisar informações referentes a papéis jurídicos, extra judiciais, penalidades, etc',
      createdAt: '16/04/2025',
      updatedAt: '16/04/2025',
      createdBy: 'me',
      owner: { name: 'Carlos Eduardo Silva', email: 'carlos.silva@empresa.com' }
    },
    {
      id: '6',
      name: '[Financeiro] Extração de Dados Fiscais',
      description: 'Extração automática de informações fiscais de notas fiscais e documentos contábeis',
      createdAt: '08/01/2025',
      updatedAt: '08/01/2025',
      isGlobal: true,
      createdBy: 'imported',
      owner: { name: 'Woopi AI', email: 'suporte@woopi.ai' }
    },
    {
      id: '7',
      name: 'Prompt Name',
      description: 'Item para revisar informações referentes a papéis jurídicos, extra judiciais, penalidades, etc',
      createdAt: '16/04/2025',
      updatedAt: '16/04/2025',
      createdBy: 'me',
      owner: { name: 'Mariana Ferreira Costa', email: 'mariana.costa@empresa.com' }
    },
    {
      id: '8',
      name: 'Prompt Name',
      description: 'Item para revisar informações referentes a papéis jurídicos, extra judiciais, penalidades, etc',
      createdAt: '16/04/2025',
      updatedAt: '16/04/2025',
      createdBy: 'other',
      owner: { name: 'Ricardo Mendes', email: 'ricardo.mendes@empresa.com' }
    },
    {
      id: '9',
      name: 'Prompt Name',
      description: 'Item para revisar informações referentes a papéis jurídicos, extra judiciais, penalidades, etc',
      createdAt: '16/04/2025',
      updatedAt: '16/04/2025',
      createdBy: 'me',
      owner: { name: 'Juliana Alves Santos', email: 'juliana.santos@empresa.com' }
    }
  ]);

  const filteredPrompts = prompts.filter(prompt => {
    // Filtro de busca
    const matchesSearch = prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de tipo
    const matchesType = filterType === 'all' || prompt.createdBy === filterType;
    
    return matchesSearch && matchesType;
  });

  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'oldest':
        return new Date(a.createdAt.split('/').reverse().join('-')).getTime() - 
               new Date(b.createdAt.split('/').reverse().join('-')).getTime();
      case 'recent':
      default:
        return new Date(b.updatedAt.split('/').reverse().join('-')).getTime() - 
               new Date(a.updatedAt.split('/').reverse().join('-')).getTime();
    }
  });

  const handleEdit = (promptId: string) => {
    navigate(`/prompts/edit/${promptId}`);
  };

  const handleClone = (prompt: Prompt) => {
    // Navegar para a página de edição em modo criação com dados pré-preenchidos
    navigate('/prompts/edit/new', {
      state: {
        isClone: true,
        cloneData: {
          name: `${prompt.name} - Cópia`,
          description: prompt.description,
          content: '' // O conteúdo será carregado na página de edição
        },
        originalPromptId: prompt.id
      }
    });
  };

  const handleDelete = (promptId: string, promptName: string) => {
    // Mock delete action
    toast.success(`Agente "${promptName}" foi excluído com sucesso`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="woopi-ai-text-primary">Agentes</h1>
          <p className="woopi-ai-text-secondary">Gerenciar agentes de IA do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate('/prompts/importar')}
            className="woopi-ai-button-primary"
          >
            <CloudDownload className="w-4 h-4 mr-2" />
            Importar pré-definidos
          </Button>
          <Button 
            onClick={() => navigate('/prompts/novo')}
            className="woopi-ai-button-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-woopi-ai-gray" />
          <Input
            placeholder="Buscar Agente"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mais recente</SelectItem>
            <SelectItem value="oldest">Mais antigo</SelectItem>
            <SelectItem value="name">Nome</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('all')}
          className={filterType === 'all' ? 'woopi-ai-button-primary' : ''}
        >
          Todos
        </Button>
        <Button
          variant={filterType === 'me' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('me')}
          className={filterType === 'me' ? 'woopi-ai-button-primary' : ''}
        >
          Meus agentes
        </Button>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedPrompts.map((prompt) => (
          <Card key={prompt.id} className="woopi-ai-card hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {prompt.isGlobal ? (
                    <Globe className="w-4 h-4 text-woopi-ai-blue flex-shrink-0" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                  )}
                  <h3 className="woopi-ai-text-primary truncate">{prompt.name}</h3>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-[#2d3354]">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {prompt.createdBy !== 'other' && (
                      <DropdownMenuItem onClick={() => handleEdit(prompt.id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleClone(prompt)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Clonar
                    </DropdownMenuItem>
                    {prompt.createdBy !== 'other' && (
                      <DropdownMenuItem 
                        onClick={() => handleDelete(prompt.id, prompt.name)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="h-10 mb-4">
                <div className="flex items-start gap-1">
                  <p className="woopi-ai-text-secondary text-sm line-clamp-2 flex-1">
                    {prompt.description.length > 100
                      ? `${prompt.description.slice(0, 100)}...`
                      : prompt.description}
                  </p>
                  {prompt.description.length > 100 && (
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="flex-shrink-0 mt-0.5 text-woopi-ai-gray hover:text-woopi-ai-blue transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs text-sm">
                          <p>{prompt.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-600">criação - {prompt.createdAt}</span>
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 cursor-default">
                        <span className="woopi-ai-text-secondary">Proprietário:</span>
                        {prompt.owner.avatarUrl ? (
                          <img
                            src={prompt.owner.avatarUrl}
                            alt={prompt.owner.name}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-woopi-ai-border"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#0073ea] text-white flex items-center justify-center text-[10px] font-semibold ring-1 ring-woopi-ai-border select-none">
                            {prompt.owner.name
                              .split(' ')
                              .filter((_, i, arr) => i === 0 || i === arr.length - 1)
                              .map(n => n[0])
                              .join('')
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-sm">
                      <p className="font-medium">{prompt.owner.name}</p>
                      <p className="opacity-75">{prompt.owner.email}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sortedPrompts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-woopi-ai-light-gray rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-woopi-ai-gray" />
          </div>
          <h3 className="woopi-ai-text-primary mb-2">Nenhum agente encontrado</h3>
          <p className="woopi-ai-text-secondary mb-4">
            Tente ajustar os termos de busca ou criar um novo agente.
          </p>
          <Button 
            onClick={() => navigate('/prompts/novo')}
            className="woopi-ai-button-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Agente
          </Button>
        </div>
      )}

      {/* Load More Button (if applicable) */}
      {sortedPrompts.length >= 9 && (
        <div className="text-center pt-6">
          <Button variant="outline" className="woopi-ai-button-secondary">
            Carregar mais
          </Button>
        </div>
      )}
    </div>
  );
}