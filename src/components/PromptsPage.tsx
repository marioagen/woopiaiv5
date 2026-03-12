import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, MoreHorizontal, Copy, Calendar, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader } from './ui/card';

// Mock data para prompts
const mockPrompts = [
  {
    id: 1,
    name: '[Jurídico] Análise de Contratos',
    description: 'Item para revisar informações referentes a papéis jurídicos, extra judiciais, penalidades, etc',
    createdAt: '16/04/2025',
    status: 'ativo',
    isGlobal: true,
    promptContent: 'Você é um assistente jurídico especializado em análise de contratos. Analise o documento fornecido e identifique: 1) Cláusulas principais e suas implicações, 2) Riscos potenciais e pontos de atenção, 3) Obrigações das partes envolvidas, 4) Prazos e condições especiais. Forneça um resumo estruturado com recomendações.'
  },
  {
    id: 2,
    name: 'Prompt Name',
    description: 'Item para revisar informações referentes a papéis jurídicos, extra judiciais, penalidades, etc',
    createdAt: '16/04/2025',
    status: 'ativo',
    isGlobal: false
  },
  {
    id: 3,
    name: '[Compliance] Verificação de Conformidade',
    description: 'Item para revisar informações referentes a papéis jurídicos, extra judiciais, penalidades, etc',
    createdAt: '16/04/2025',
    status: 'ativo',
    isGlobal: true,
    promptContent: 'Analise o documento fornecido quanto à conformidade com normas regulatórias aplicáveis. Verifique: 1) Adequação às políticas internas, 2) Conformidade com legislação vigente, 3) Identificação de não conformidades, 4) Recomendações de ajustes necessários.'
  },
  {
    id: 4,
    name: 'Prompt Name',
    description: 'Item para revisar informações referentes a papéis jurídicos, extra judiciais, penalidades, etc',
    createdAt: '16/04/2025',
    status: 'inativo',
    isGlobal: false
  },
  {
    id: 5,
    name: '[Financeiro] Extração de Dados Fiscais',
    description: 'Item para revisar informações referentes a papéis jurídicos, extra judiciais, penalidades, etc',
    createdAt: '16/04/2025',
    status: 'ativo',
    isGlobal: true,
    promptContent: 'Extraia as seguintes informações fiscais do documento: 1) Número da nota fiscal, 2) Data de emissão, 3) Valor total e impostos, 4) Dados do emissor e destinatário, 5) Itens discriminados com valores. Estruture os dados em formato JSON.'
  },
  {
    id: 6,
    name: 'Prompt Name',
    description: 'Item para revisar informações referentes a papéis jurídicos, extra judiciais, penalidades, etc',
    createdAt: '16/04/2025',
    status: 'ativo',
    isGlobal: false
  },
  {
    id: 7,
    name: 'Prompt Name',
    description: 'Item para revisar informações referentes a papéis jurídicos, extra judiciais, penalidades, etc',
    createdAt: '16/04/2025',
    status: 'ativo',
    isGlobal: false
  },
  {
    id: 8,
    name: 'Prompt Name',
    description: 'Item para revisar informações referentes a papéis jurídicos, extra judiciais, penalidades, etc',
    createdAt: '16/04/2025',
    status: 'ativo',
    isGlobal: false
  },
  {
    id: 9,
    name: 'Prompt Name',
    description: 'Item para revisar informações referentes a papéis jurídicos, extra judiciais, penalidades, etc',
    createdAt: '16/04/2025',
    status: 'ativo',
    isGlobal: false
  }
];

export function PromptsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedAll, setSelectedAll] = useState(false);
  const [expandedPrompts, setExpandedPrompts] = useState<number[]>([]);

  const handleCreatePrompt = () => {
    navigate('/prompts/novo');
  };

  const handleEditPrompt = (id: number) => {
    navigate(`/prompts/editar/${id}`);
  };

  const handleDeletePrompt = (id: number) => {
    // Implementar lógica de exclusão
    console.log('Excluir prompt:', id);
  };

  const handleDuplicatePrompt = (id: number) => {
    // Implementar lógica de duplicação
    console.log('Duplicar prompt:', id);
  };

  const filteredPrompts = mockPrompts.filter(prompt =>
    prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-woopi-ai-gray">
        <span className="text-woopi-ai-blue cursor-pointer hover:underline">Agentes</span>
        <span>/</span>
        <span>Listagem</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-woopi-ai-gray" />
            <Input
              placeholder="Buscar Agente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="date">Data</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleCreatePrompt}
          className="woopi-ai-button-primary gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </Button>
      </div>

      {/* Select All Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="selectAll"
          checked={selectedAll}
          onChange={(e) => setSelectedAll(e.target.checked)}
          className="rounded border-woopi-ai-border"
        />
        <label htmlFor="selectAll" className="text-sm text-woopi-ai-gray">
          selecionar todos
        </label>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrompts.map((prompt) => {
          const isExpanded = expandedPrompts.includes(prompt.id);
          
          return (
            <Card key={prompt.id} className="woopi-ai-card hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {prompt.isGlobal && (
                          <Globe className="w-4 h-4 text-woopi-ai-blue flex-shrink-0" />
                        )}
                        <h3 className="font-medium text-woopi-ai-dark-gray">{prompt.name}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={prompt.status === 'ativo' ? 'default' : 'secondary'}
                      className={prompt.status === 'ativo' ? 'woopi-ai-badge-primary' : 'woopi-ai-badge-secondary'}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-[#2d3354]">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditPrompt(prompt.id)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicatePrompt(prompt.id)}>
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeletePrompt(prompt.id)}
                          className="text-woopi-ai-error"
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                <p className="text-sm text-woopi-ai-gray line-clamp-3">
                  {prompt.description}
                </p>

                {/* Seção do prompt completo (apenas para prompts globais) */}
                {prompt.isGlobal && (
                  <div className="border-t border-woopi-ai-border pt-4">
                    <button
                      onClick={() => {
                        if (isExpanded) {
                          setExpandedPrompts(expandedPrompts.filter(id => id !== prompt.id));
                        } else {
                          setExpandedPrompts([...expandedPrompts, prompt.id]);
                        }
                      }}
                      className="flex items-center justify-between w-full text-left group"
                    >
                      <span className="text-sm font-medium text-woopi-ai-blue">
                        {isExpanded ? 'Ocultar prompt' : 'Ver prompt completo'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-woopi-ai-blue transition-transform" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-woopi-ai-blue transition-transform" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="mt-3 p-3 bg-woopi-ai-light-gray rounded-lg border border-woopi-ai-border">
                        <p className="text-xs text-woopi-ai-dark-gray whitespace-pre-wrap">
                          {prompt.promptContent}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-woopi-ai-blue">
                    <Calendar className="w-3 h-3" />
                    <span>criação - {prompt.createdAt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-4">
        <Button variant="outline" className="px-8">
          Carregar mais
        </Button>
      </div>
    </div>
  );
}