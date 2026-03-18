import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { ArrowLeft, Save, Copy, Trash2, AlertCircle, Sparkles, X, PlugZap, Search, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { mockAgents, generateOutputKey } from '../data/mockAgents';

interface PromptFormData {
  name: string;
  description: string;
  content: string;
  isGlobal?: boolean;
}

interface ApiEndpoint {
  id: number;
  text: string;
  subtitle?: string;
}

const MOCK_API_ENDPOINTS: ApiEndpoint[] = [
  { id: 1, text: 'Get User Details', subtitle: 'GET · https://api.example.com/v1/users/{id}' },
  { id: 2, text: 'User OCR Processing', subtitle: 'POST · https://api.ocr.com/v2/process' },
  { id: 3, text: 'Validate Document', subtitle: 'POST · https://api.example.com/v1/docs/validate' },
  { id: 4, text: 'Fetch Contract Data', subtitle: 'GET · https://contracts.api.com/v1/fetch' },
  { id: 5, text: 'Send Notification', subtitle: 'POST · https://notify.api.com/v1/send' },
  { id: 6, text: 'Get Entity Info', subtitle: 'GET · https://api.example.com/v1/entities/{id}' },
  { id: 7, text: 'Update Record Status', subtitle: 'PATCH · https://api.example.com/v1/records/{id}' },
];

export function PromptEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const locationState = location.state as { isClone?: boolean; cloneData?: any; originalPromptId?: string } | null;
  const isCloning = locationState?.isClone || false;
  const isEditing = Boolean(id) && id !== 'new';
  
  const [formData, setFormData] = useState<PromptFormData>({
    name: '',
    description: '',
    content: '',
    isGlobal: false
  });

  const [wasGlobal, setWasGlobal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  // External consult state
  const [enableExternalConsult, setEnableExternalConsult] = useState(false);
  const [selectedEndpoints, setSelectedEndpoints] = useState<ApiEndpoint[]>([]);
  const [endpointSearchTerm, setEndpointSearchTerm] = useState('');

  useEffect(() => {
    if (isCloning && locationState?.cloneData) {
      const originalId = locationState.originalPromptId;
      const isGlobalPrompt = originalId === '2' || originalId === '4';
      
      const clonedContent = isGlobalPrompt 
        ? `Analise o seguinte documento jurídico e extraia as seguintes informações:\n\n1. Tipo de documento\n2. Partes envolvidas\n3. Principais cláusulas\n4. Prazos importantes\n5. Valores monetários mencionados\n\nForneça uma análise estruturada e detalhada.`
        : `Analise o seguinte documento e extraia as seguintes informações:\n\n1. Informações principais\n2. Dados relevantes\n3. Conclusões\n\nForneça uma análise detalhada.`;
      
      setFormData({
        name: locationState.cloneData.name || '',
        description: locationState.cloneData.description || '',
        content: clonedContent,
        isGlobal: false
      });
    } else if (isEditing && id) {
      const isGlobalPrompt = id === '2' || id === '4';
      const promptData = {
        name: isGlobalPrompt ? '[Jurídico] Análise de Contratos' : 'Prompt de Análise Jurídica',
        description: 'Prompt para análise detalhada de documentos jurídicos',
        content: `Analise o seguinte documento jurídico e extraia as seguintes informações:\n\n1. Tipo de documento\n2. Partes envolvidas\n3. Principais cláusulas\n4. Prazos importantes\n5. Valores monetários mencionados\n\nForneça uma análise estruturada e detalhada.`,
        isGlobal: isGlobalPrompt
      };
      setFormData(promptData);
      setWasGlobal(isGlobalPrompt);
    }
  }, [isEditing, isCloning, id, locationState]);

  const handleInputChange = (field: keyof PromptFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (wasGlobal && !hasEdited) {
      setHasEdited(true);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Nome do prompt é obrigatório');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Conteúdo do prompt é obrigatório');
      return;
    }

    setIsSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let action: string;
      if (isCloning) {
        action = 'criado';
      } else {
        action = isEditing ? 'atualizado' : 'criado';
      }
      
      const globalMessage = wasGlobal && hasEdited ? ' Este prompt agora é personalizado.' : '';
      toast.success(`Prompt "${formData.name}" foi ${action} com sucesso.${globalMessage}`);
      
      navigate('/prompts');
    } catch (error) {
      toast.error('Erro ao salvar prompt');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(formData.content);
    toast.success('Conteúdo copiado para área de transferência');
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este prompt?')) {
      toast.success('Prompt excluído com sucesso');
      navigate('/prompts');
    }
  };

  const handleRefinePrompt = async () => {
    if (!formData.content.trim()) {
      toast.error('Digite algum conteúdo antes de refinar o prompt');
      return;
    }

    setIsRefining(true);
    toast.info('Refinando prompt com melhores práticas...');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const refinedPrompt = `# Contexto e Papel\nVocê é um especialista em análise jurídica com conhecimento profundo em contratos e documentos legais.\n\n# Tarefa Principal\n${formData.content}\n\n# Instruções Específicas\n- Analise o documento de forma meticulosa e estruturada\n- Identifique todos os elementos relevantes solicitados\n- Destaque informações críticas e potenciais riscos\n- Mantenha objetividade e precisão na análise\n\n# Formato de Saída Esperado\nForneça a análise em formato estruturado com:\n1. Resumo executivo\n2. Detalhamento de cada item solicitado\n3. Observações e recomendações (se aplicável)\n\n# Restrições\n- Use linguagem clara e profissional\n- Baseie-se apenas nas informações presentes no documento\n- Indique quando informações não estiverem disponíveis`;

      setFormData(prev => ({ ...prev, content: refinedPrompt }));
      toast.success('Prompt refinado com sucesso! Revise o conteúdo gerado.');
      
      if (wasGlobal && !hasEdited) {
        setHasEdited(true);
      }
    } catch (error) {
      toast.error('Erro ao refinar prompt');
    } finally {
      setIsRefining(false);
    }
  };

  const handleSelectAllEndpoints = () => {
    setSelectedEndpoints(MOCK_API_ENDPOINTS);
  };

  const handleClearAllEndpoints = () => {
    setSelectedEndpoints([]);
  };

  const handleEndpointToggle = (endpoint: ApiEndpoint) => {
    setSelectedEndpoints(prev =>
      prev.some(e => e.id === endpoint.id)
        ? prev.filter(e => e.id !== endpoint.id)
        : [...prev, endpoint]
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/prompts')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h1 className="woopi-ai-text-primary">
              {isCloning ? 'Criar Prompt' : (isEditing ? 'Editar Prompt' : 'Novo Prompt')}
            </h1>
            <p className="woopi-ai-text-secondary">
              {isCloning ? 'Criar um novo prompt baseado em um existente' : (isEditing ? 'Modificar as configurações do prompt' : 'Criar um novo prompt de IA')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing && !isCloning && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          )}
          {isCloning && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/prompts')}
              className="text-gray-600 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          )}
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="woopi-ai-button-primary"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Alert for Global Prompts */}
        {wasGlobal && (
          <Alert className="border-woopi-ai-blue bg-woopi-ai-light-blue">
            <AlertCircle className="h-4 w-4 text-woopi-ai-blue" />
            <AlertDescription className="text-woopi-ai-dark-gray">
              <strong>Atenção:</strong> Este é um prompt pré-definido do sistema. As modificações realizadas não irão impactar o prompt original. 
              Ao salvar suas alterações, este prompt perderá a identificação de prompt global e se tornará um prompt personalizado.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card className="woopi-ai-card">
            <CardHeader>
              <CardTitle className="woopi-ai-text-primary">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="woopi-ai-text-primary">Nome do Prompt *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Digite o nome do prompt"
                  className="mt-1 border border-gray-300"
                />
                {formData.name.trim() && (() => {
                  const existingAgent = isEditing ? mockAgents.find(a => a.id === id) : null;
                  const outputKey = existingAgent?.outputKey ?? generateOutputKey(formData.name);
                  const variable = `{{${outputKey}}}`;
                  return (
                    <div className="mt-2 flex items-center gap-2.5 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/40">
                      <Bot className="w-3.5 h-3.5 text-woopi-ai-blue flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-woopi-ai-gray leading-tight mb-0.5">
                          Output disponível em API Templates como:
                        </p>
                        <code className="text-xs font-mono text-woopi-ai-blue font-semibold break-all">
                          {variable}
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(variable);
                          toast.success('Variável copiada!');
                        }}
                        className="flex-shrink-0 p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 text-woopi-ai-blue transition-colors"
                        title="Copiar variável"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })()}
              </div>

              <div>
                <Label htmlFor="description" className="woopi-ai-text-primary">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      handleInputChange('description', e.target.value);
                    }
                  }}
                  placeholder="Descreva o propósito e uso do prompt"
                  className="mt-1 border border-gray-300"
                  rows={3}
                  maxLength={500}
                />
                <p className={`mt-1 text-xs text-right ${formData.description.length >= 450 ? 'text-woopi-ai-error font-medium' : 'text-woopi-ai-gray'}`}>
                  {formData.description.length}/500
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Prompt Content */}
          <Card className="woopi-ai-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="woopi-ai-text-primary">Conteúdo do Prompt</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyContent}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="content" className="woopi-ai-text-primary">Conteúdo do Prompt *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Digite o conteúdo do prompt."
                    className="mt-1 font-mono border border-gray-300"
                    rows={15}
                  />
                  
                  {/* Botão Refinar Prompt */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefinePrompt}
                    disabled={isRefining}
                    className="mt-3 border-woopi-ai-blue text-woopi-ai-blue hover:bg-woopi-ai-light-blue"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isRefining ? 'Refinando...' : 'Refinar Prompt'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* External Consult */}
          <Card className="woopi-ai-card">
            <CardHeader>
              <CardTitle className="woopi-ai-text-primary flex items-center gap-2">
                <PlugZap className="w-5 h-5 text-[#0073ea]" />
                Consulta Externa da IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  id="enable-external-consult"
                  type="checkbox"
                  checked={enableExternalConsult}
                  onChange={(e) => {
                    setEnableExternalConsult(e.target.checked);
                    if (!e.target.checked) {
                      setSelectedEndpoints([]);
                      setEndpointSearchTerm('');
                    }
                  }}
                  className="w-4 h-4 rounded border-woopi-ai-border accent-[#0073ea] cursor-pointer"
                />
                <Label
                  htmlFor="enable-external-consult"
                  className="woopi-ai-text-primary cursor-pointer select-none"
                >
                  Habilitar consulta externa da IA neste agente
                </Label>
              </div>

              {/* Endpoint Multiselect (estilo tela de times) */}
              {enableExternalConsult && (
                <div className="pt-2 border-t border-woopi-ai-border">
                  <div className="border rounded-md p-4 bg-muted">
                    {/* Header com contagem e ações */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium woopi-ai-text-primary">
                        Endpoints Selecionados ({selectedEndpoints.length})
                      </span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleSelectAllEndpoints}
                          className="text-xs"
                        >
                          Selecionar Todos
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleClearAllEndpoints}
                          className="text-xs"
                        >
                          Limpar Seleção
                        </Button>
                      </div>
                    </div>

                    {/* Badges dos selecionados */}
                    {selectedEndpoints.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3 max-h-[100px] overflow-y-auto">
                        {selectedEndpoints.map((ep) => (
                          <Badge key={ep.id} variant="secondary" className="woopi-ai-badge-primary">
                            {ep.text}
                            <button
                              type="button"
                              className="ml-1"
                              onClick={() => handleEndpointToggle(ep)}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Campo de busca */}
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-woopi-ai-gray w-4 h-4" />
                      <Input
                        placeholder="Buscar endpoints..."
                        value={endpointSearchTerm}
                        onChange={(e) => setEndpointSearchTerm(e.target.value)}
                        className="pl-10 h-8 bg-card"
                      />
                    </div>

                    {/* Lista de endpoints disponíveis */}
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {MOCK_API_ENDPOINTS
                        .filter(ep =>
                          ep.text.toLowerCase().includes(endpointSearchTerm.toLowerCase()) &&
                          !selectedEndpoints.some(s => s.id === ep.id)
                        )
                        .map((ep) => (
                          <div
                            key={ep.id}
                            className="flex items-center space-x-3 p-2 hover:bg-accent rounded cursor-pointer"
                            onClick={() => handleEndpointToggle(ep)}
                          >
                            <Checkbox checked={false} onChange={() => handleEndpointToggle(ep)} />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm woopi-ai-text-primary">{ep.text}</div>
                              {ep.subtitle && (
                                <div className="text-xs text-woopi-ai-gray truncate">{ep.subtitle}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      {MOCK_API_ENDPOINTS.filter(ep =>
                        ep.text.toLowerCase().includes(endpointSearchTerm.toLowerCase()) &&
                        !selectedEndpoints.some(s => s.id === ep.id)
                      ).length === 0 && (
                        <div className="p-3 text-center text-sm text-woopi-ai-gray">
                          Nenhum endpoint disponível
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
