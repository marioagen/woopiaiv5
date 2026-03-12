import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, Globe, CheckSquare, Square, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface GlobalPrompt {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  promptContent: string;
}

export function PromptsImportPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [viewingPrompt, setViewingPrompt] = useState<GlobalPrompt | null>(null);

  // Mock data - Prompts pré-definidos do sistema
  const globalPrompts: GlobalPrompt[] = [
    {
      id: 'global-1',
      name: '[Jurídico] Análise de Contratos',
      description: 'Prompt para análise detalhada de contratos, identificando cláusulas importantes, riscos e obrigações',
      category: 'Jurídico',
      createdAt: '15/01/2025',
      promptContent: 'Você é um assistente jurídico especializado em análise de contratos. Analise o documento fornecido e identifique: 1) Cláusulas principais e suas implicações legais, 2) Riscos potenciais e pontos de atenção críticos, 3) Obrigações das partes envolvidas com seus respectivos prazos, 4) Condições especiais, penalidades e multas contratuais, 5) Recomendações de ajustes ou cláusulas que devem ser negociadas. Forneça um resumo estruturado e objetivo com análise de conformidade legal.'
    },
    {
      id: 'global-2',
      name: '[Compliance] Verificação de Conformidade',
      description: 'Verificação de documentos para conformidade com normas regulatórias e políticas internas',
      category: 'Compliance',
      createdAt: '10/01/2025',
      promptContent: 'Analise o documento fornecido quanto à conformidade com normas regulatórias aplicáveis (LGPD, ISO 27001, SOX, etc). Verifique: 1) Adequação às políticas internas da organização, 2) Conformidade com legislação vigente no Brasil, 3) Identificação de não conformidades e gaps regulatórios, 4) Nível de risco associado (baixo, médio, alto), 5) Recomendações de ajustes necessários para compliance total. Forneça relatório detalhado com checklist de conformidade.'
    },
    {
      id: 'global-3',
      name: '[Financeiro] Extração de Dados Fiscais',
      description: 'Extração automática de informações fiscais de notas fiscais e documentos contábeis',
      category: 'Financeiro',
      createdAt: '08/01/2025',
      promptContent: 'Extraia as seguintes informações fiscais do documento de forma estruturada: 1) Número da nota fiscal e série, 2) Data e hora de emissão, 3) Valor total, subtotal, impostos (ICMS, IPI, PIS, COFINS), 4) Dados completos do emissor (CNPJ, razão social, endereço), 5) Dados do destinatário, 6) Itens discriminados com descrição, quantidade, valor unitário e total, 7) Chave de acesso NFe, 8) CFOP e NCM dos produtos. Estruture os dados em formato JSON válido para integração com sistemas ERP.'
    },
    {
      id: 'global-4',
      name: '[RH] Análise de Currículos',
      description: 'Análise e extração de informações relevantes de currículos para processos seletivos',
      category: 'Recursos Humanos',
      createdAt: '05/01/2025',
      promptContent: 'Analise o currículo fornecido e extraia: 1) Dados pessoais (nome, contato, localização), 2) Formação acadêmica completa com instituições e datas, 3) Experiências profissionais relevantes com período de atuação e principais responsabilidades, 4) Competências técnicas e certificações, 5) Idiomas e nível de proficiência, 6) Pontos fortes e diferenciais do candidato, 7) Match percentual com a vaga baseado nos requisitos. Forneça um resumo executivo e score de aderência.'
    },
    {
      id: 'global-5',
      name: '[Jurídico] Identificação de Riscos',
      description: 'Identificação de cláusulas de risco e pontos de atenção em documentos jurídicos',
      category: 'Jurídico',
      createdAt: '03/01/2025',
      promptContent: 'Realize análise de risco do documento jurídico identificando: 1) Cláusulas abusivas ou desbalanceadas, 2) Riscos financeiros (multas, indenizações, garantias), 3) Riscos operacionais e prazos críticos, 4) Conflitos com legislação atual, 5) Lacunas contratuais que podem gerar disputas futuras, 6) Cláusulas de foro, arbitragem e resolução de conflitos. Classifique cada risco por severidade (crítico, alto, médio, baixo) e impacto financeiro estimado.'
    },
    {
      id: 'global-6',
      name: '[Marketing] Análise de Sentimento',
      description: 'Análise de sentimento em documentos de feedback de clientes e pesquisas de satisfação',
      category: 'Marketing',
      createdAt: '01/01/2025',
      promptContent: 'Analise o sentimento expresso no documento e identifique: 1) Sentimento geral (positivo, neutro, negativo) com score de 0-100, 2) Principais temas e tópicos mencionados, 3) Pontos de satisfação e elogios específicos, 4) Reclamações, frustrações e pain points, 5) Sugestões de melhoria mencionadas, 6) Urgência e prioridade do feedback, 7) Tendências e padrões identificados. Forneça insights acionáveis para equipe de produto e atendimento.'
    },
    {
      id: 'global-7',
      name: '[Operações] Extração de Dados Logísticos',
      description: 'Extração de informações de documentos de transporte e logística',
      category: 'Operações',
      createdAt: '28/12/2024',
      promptContent: 'Extraia informações logísticas do documento: 1) Número do pedido, ordem de transporte ou CTe, 2) Dados do remetente e destinatário completos, 3) Endereços de coleta e entrega com CEP, 4) Data prevista de coleta e entrega, 5) Tipo de carga, peso, volume e dimensões, 6) Valor da mercadoria e frete, 7) Transportadora responsável e rastreamento, 8) Status atual da entrega, 9) Observações especiais e restrições. Estruture em formato padronizado para sistema de gestão de transportes.'
    },
    {
      id: 'global-8',
      name: '[Compliance] Detecção de Fraudes',
      description: 'Identificação de padrões suspeitos e possíveis fraudes em documentos financeiros',
      category: 'Compliance',
      createdAt: '25/12/2024',
      promptContent: 'Analise o documento financeiro em busca de indicadores de fraude: 1) Inconsistências numéricas e valores atípicos, 2) Padrões suspeitos em datas, horários e sequências, 3) Duplicidade de informações ou documentos, 4) Divergências entre documentos relacionados, 5) Assinaturas, carimbos ou autenticações questionáveis, 6) Alterações, rasuras ou modificações não autorizadas, 7) Transações incompatíveis com perfil histórico. Classifique o nível de suspeita (baixo, médio, alto, crítico) e recomende ações de investigação.'
    },
    {
      id: 'global-9',
      name: '[Financeiro] Análise de Balanços',
      description: 'Análise detalhada de balanços patrimoniais e demonstrativos financeiros',
      category: 'Financeiro',
      createdAt: '20/12/2024',
      promptContent: 'Realize análise financeira completa do balanço patrimonial: 1) Principais indicadores (liquidez, endividamento, rentabilidade), 2) Análise vertical e horizontal com variações percentuais, 3) Capital de giro e ciclo financeiro, 4) Estrutura de capital e composição do passivo, 5) Qualidade dos ativos e recebíveis, 6) Fluxo de caixa operacional e geração de valor, 7) Comparação com benchmarks do setor, 8) Pontos de atenção e red flags. Forneça diagnóstico executivo com recomendações estratégicas.'
    }
  ];

  const filteredPrompts = globalPrompts.filter(prompt => 
    prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'category':
        return a.category.localeCompare(b.category);
      case 'oldest':
        return new Date(a.createdAt.split('/').reverse().join('-')).getTime() - 
               new Date(b.createdAt.split('/').reverse().join('-')).getTime();
      case 'recent':
      default:
        return new Date(b.createdAt.split('/').reverse().join('-')).getTime() - 
               new Date(a.createdAt.split('/').reverse().join('-')).getTime();
    }
  });

  const handleSelectAll = () => {
    if (selectedPrompts.length === sortedPrompts.length) {
      setSelectedPrompts([]);
    } else {
      setSelectedPrompts(sortedPrompts.map(p => p.id));
    }
  };

  const handleTogglePrompt = (promptId: string) => {
    setSelectedPrompts(prev => 
      prev.includes(promptId) 
        ? prev.filter(id => id !== promptId)
        : [...prev, promptId]
    );
  };

  const handleImport = () => {
    if (selectedPrompts.length === 0) {
      toast.error('Selecione pelo menos um agente para importar');
      return;
    }

    // Aqui você salvaria os prompts importados com a flag isGlobal: true
    const selectedNames = sortedPrompts
      .filter(p => selectedPrompts.includes(p.id))
      .map(p => p.name)
      .join(', ');

    toast.success(`${selectedPrompts.length} agente(s) importado(s) com sucesso!`);
    navigate('/prompts');
  };

  const allSelected = sortedPrompts.length > 0 && selectedPrompts.length === sortedPrompts.length;
  const someSelected = selectedPrompts.length > 0 && selectedPrompts.length < sortedPrompts.length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/prompts')}
            className="hover:bg-woopi-ai-light-gray"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="woopi-ai-text-primary">Importar Agentes</h1>
            <p className="woopi-ai-text-secondary">Selecione agentes pré-definidos do sistema</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate('/prompts')}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleImport}
            className="woopi-ai-button-primary"
            disabled={selectedPrompts.length === 0}
          >
            Importar ({selectedPrompts.length})
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
            <SelectItem value="category">Categoria</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Select All */}
      <div className="flex items-center gap-2 px-2">
        <Checkbox
          id="select-all"
          checked={allSelected}
          onCheckedChange={handleSelectAll}
          className={someSelected && !allSelected ? "data-[state=checked]:bg-woopi-ai-blue" : ""}
        />
        <label
          htmlFor="select-all"
          className="text-sm font-medium text-woopi-ai-dark-gray cursor-pointer"
        >
          {allSelected ? 'Desselecionar todos' : 'Selecionar todos'} ({sortedPrompts.length} agentes)
        </label>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedPrompts.map((prompt) => {
          const isSelected = selectedPrompts.includes(prompt.id);
          
          return (
            <Card 
              key={prompt.id} 
              className={`woopi-ai-card transition-all cursor-pointer ${
                isSelected 
                  ? 'ring-2 ring-woopi-ai-blue bg-woopi-ai-light-blue' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleTogglePrompt(prompt.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`prompt-${prompt.id}`}
                    checked={isSelected}
                    onCheckedChange={() => handleTogglePrompt(prompt.id)}
                    className="mt-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 min-h-[2.5rem]">
                      <Globe className="w-4 h-4 text-woopi-ai-blue flex-shrink-0" />
                      <h3 className="woopi-ai-text-primary text-sm line-clamp-2">{prompt.name}</h3>
                    </div>
                    <p className="woopi-ai-text-secondary text-xs line-clamp-2 mb-3 min-h-[2.5rem]">
                      {prompt.description}
                    </p>
                    
                    {/* Conteúdo do Prompt */}
                    <div className="bg-woopi-ai-light-gray rounded-lg p-3 border border-woopi-ai-border">
                      <p className="text-xs text-woopi-ai-dark-gray line-clamp-3 mb-2 min-h-[3rem]">
                        {prompt.promptContent}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingPrompt(prompt);
                        }}
                        className="text-xs text-woopi-ai-blue hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Ver completo
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {sortedPrompts.length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-12 h-12 text-woopi-ai-gray mx-auto mb-4" />
          <h3 className="woopi-ai-text-primary mb-2">Nenhum agente encontrado</h3>
          <p className="woopi-ai-text-secondary">
            Tente ajustar os filtros de busca
          </p>
        </div>
      )}

      {/* Modal de visualização do prompt completo */}
      <Dialog open={!!viewingPrompt} onOpenChange={() => setViewingPrompt(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-woopi-ai-blue" />
              <DialogTitle className="woopi-ai-text-primary">
                {viewingPrompt?.name}
              </DialogTitle>
            </div>
            <DialogDescription className="woopi-ai-text-secondary">
              {viewingPrompt?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-woopi-ai-dark-gray mb-2">Conteúdo do Prompt:</h4>
              <div className="bg-woopi-ai-light-gray rounded-lg p-4 border border-woopi-ai-border">
                <p className="text-sm text-woopi-ai-dark-gray whitespace-pre-wrap leading-relaxed">
                  {viewingPrompt?.promptContent}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-woopi-ai-border">
              <div className="text-xs text-woopi-ai-gray">
                <span className="font-medium">Categoria:</span> {viewingPrompt?.category}
              </div>
              <div className="text-xs text-woopi-ai-gray">
                <span className="font-medium">Criado em:</span> {viewingPrompt?.createdAt}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}