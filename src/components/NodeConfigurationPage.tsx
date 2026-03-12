import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { 
  ArrowLeft, 
  Save,
  Play,
  Plus,
  Code2,
  Trash2,
  ScanLine,
  FileText,
  Mail,
  ArrowRight,
  Check,
  Settings,
  Database,
  MessageSquare,
  X,
  GitBranch,
  ClipboardList,
  ShieldOff,
  Info,
  Lightbulb,
  PlugZap,
  Search
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner@2.0.3';

// Interface para endpoints de API externa
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

// Agentes/prompts cadastrados no sistema
interface SavedPrompt {
  id: string;
  name: string;
  hasExternalConsult: boolean;
}

const MOCK_SAVED_PROMPTS: SavedPrompt[] = [
  { id: 'saved-1', name: '[Jurídico] Análise de Contratos',         hasExternalConsult: true  },
  { id: 'saved-2', name: 'Resumo Executivo',                         hasExternalConsult: false },
  { id: 'saved-3', name: '[Compliance] Verificação de Conformidade', hasExternalConsult: true  },
  { id: 'saved-4', name: '[Financeiro] Extração de Dados Fiscais',   hasExternalConsult: true  },
  { id: 'saved-5', name: 'Prompt de Análise Jurídica',               hasExternalConsult: false },
  { id: 'saved-6', name: 'Análise de Documentos',                    hasExternalConsult: false },
];

// Tipos de ferramentas disponíveis
interface ToolType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  textColor: string;
}

// Ferramentas disponíveis
const availableTools: ToolType[] = [
  {
    id: 'start',
    name: 'Início',
    icon: <Play className="w-4 h-4" />,
    color: '#0073ea',
    bgColor: '#e1e9f8',
    textColor: '#0073ea'
  },
  {
    id: 'api-template',
    name: 'API Template',
    icon: <Code2 className="w-4 h-4" />,
    color: '#10b981',
    bgColor: '#d1fae5',
    textColor: '#10b981'
  },
  {
    id: 'condition',
    name: 'Condição',
    icon: <GitBranch className="w-4 h-4" />,
    color: '#f59e0b',
    bgColor: '#fef3c7',
    textColor: '#f59e0b'
  },
  {
    id: 'ocr',
    name: 'OCR Padrão',
    icon: <ScanLine className="w-4 h-4" />,
    color: '#0073ea',
    bgColor: '#e1e9f8',
    textColor: '#0073ea'
  },
  {
    id: 'embeddings',
    name: 'Embeddings de Contratos',
    icon: <Database className="w-4 h-4" />,
    color: '#0073ea',
    bgColor: '#e1e9f8',
    textColor: '#0073ea'
  },
  {
    id: 'email-summary',
    name: 'Resumidor de E-mails',
    icon: <MessageSquare className="w-4 h-4" />,
    color: '#0073ea',
    bgColor: '#e1e9f8',
    textColor: '#0073ea'
  },
  {
    id: 'extract-nfe',
    name: 'Extrair Dados de NF-e',
    icon: <FileText className="w-4 h-4" />,
    color: '#0073ea',
    bgColor: '#e1e9f8',
    textColor: '#0073ea'
  },
  {
    id: 'send-erp',
    name: 'Enviar para ERP',
    icon: <ArrowRight className="w-4 h-4" />,
    color: '#0073ea',
    bgColor: '#e1e9f8',
    textColor: '#0073ea'
  },
  {
    id: 'questionnaire',
    name: 'Questionário',
    icon: <ClipboardList className="w-4 h-4" />,
    color: '#8b5cf6',
    bgColor: '#f3e8ff',
    textColor: '#8b5cf6'
  },
  {
    id: 'anonymize',
    name: 'Anonimizar Documento',
    icon: <ShieldOff className="w-4 h-4" />,
    color: '#0d9488',
    bgColor: '#ccfbf1',
    textColor: '#0d9488'
  },
  {
    id: 'finalize',
    name: 'Finalizar fluxo',
    icon: <Check className="w-4 h-4" />,
    color: '#0073ea',
    bgColor: '#e1e9f8',
    textColor: '#0073ea'
  }
];

// Outputs disponíveis para cada tipo de ferramenta
const toolOutputs: Record<string, { id: string; name: string; description: string }[]> = {
  start: [
    { id: 'documento', name: 'Documento Original', description: 'Arquivo de documento enviado' }
  ],
  'api-template': [
    { id: 'response_body', name: 'Response Body', description: 'Corpo da resposta da API' },
    { id: 'status_code', name: 'Status Code', description: 'Código de status HTTP' },
    { id: 'headers', name: 'Response Headers', description: 'Cabeçalhos da resposta' }
  ],
  condition: [
    { id: 'resultado', name: 'Resultado da Condição', description: 'Valor booleano (sim/não)' },
    { id: 'valor_comparado', name: 'Valor Comparado', description: 'Valor que foi comparado' }
  ],
  ocr: [
    { id: 'texto_extraido', name: 'Texto Extraído', description: 'Texto completo extraído via OCR' },
    { id: 'confianca', name: 'Nível de Confiança', description: 'Percentual de confiança da extração' }
  ],
  embeddings: [
    { id: 'embeddings', name: 'Embeddings Gerados', description: 'Vetores de embeddings do texto' },
    { id: 'contexto', name: 'Contexto Extraído', description: 'Contexto relevante identificado' }
  ],
  'email-summary': [
    { id: 'resumo', name: 'Resumo do E-mail', description: 'Resumo condensado do conteúdo' },
    { id: 'assunto', name: 'Assunto Principal', description: 'Tema principal identificado' }
  ],
  'extract-nfe': [
    { id: 'dados_estruturados', name: 'Dados Estruturados', description: 'Campos extraídos da NF-e' },
    { id: 'numero_nf', name: 'Número da NF-e', description: 'Número da nota fiscal' },
    { id: 'valor_total', name: 'Valor Total', description: 'Valor total da nota' }
  ],
  'send-erp': [
    { id: 'resposta_api', name: 'Resposta da API', description: 'Resposta do ERP' },
    { id: 'status_envio', name: 'Status do Envio', description: 'Status da integração' }
  ],
  questionnaire: [
    { id: 'respostas', name: 'Respostas do Questionário', description: 'Todas as respostas coletadas' },
    { id: 'pontuacao', name: 'Pontuação Total', description: 'Pontuação calculada das respostas' },
    { id: 'resultado', name: 'Resultado Final', description: 'Resultado consolidado do questionário' }
  ],
  anonymize: [
    { id: 'documento_anonimizado', name: 'Documento Anonimizado', description: 'Documento com dados sensíveis tratados' },
    { id: 'campos_anonimizados', name: 'Campos Anonimizados', description: 'Lista dos campos que foram anonimizados' },
    { id: 'relatorio', name: 'Relatório de Anonimização', description: 'Relatório detalhado das transformações aplicadas' }
  ]
};

// Componente de Input Dinâmico com seletor de outputs
interface DynamicInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  predecessorNodes: { id: string; name: string; toolId: string }[];
  inputType?: 'text' | 'textarea';
}

const DynamicInputField = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  predecessorNodes,
  inputType = 'text'
}: DynamicInputFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  const insertDynamicValue = (nodeId: string, nodeName: string, outputId: string, outputName: string) => {
    const expression = `{{${nodeName}.${outputId}}}`;
    onChange(value ? `${value} ${expression}` : expression);
    setIsOpen(false);
    setExpandedNode(null);
    toast.success(`Mapeamento adicionado: ${nodeName}.${outputName}`);
  };

  return (
    <div className="space-y-2">
      <Label className="text-lg">{label}</Label>
      <div className="relative flex gap-2">
        {inputType === 'text' ? (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 h-12 text-base"
          />
        ) : (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={6}
            className="flex-1 text-base"
          />
        )}
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-12 px-4 border-woopi-ai-border hover:bg-woopi-ai-light-blue hover:border-woopi-ai-blue flex-shrink-0"
              title="Inserir dado dinâmico"
            >
              <Code2 className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-3 border-b">
              <h4 className="font-medium text-sm text-woopi-ai-dark-gray">
                Mapear Dados Dinâmicos
              </h4>
              <p className="text-xs text-woopi-ai-gray mt-1">
                Selecione a saída de um nó anterior para usar como entrada
              </p>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {predecessorNodes.length === 0 ? (
                <div className="p-4 text-center text-sm text-woopi-ai-gray">
                  Nenhum nó predecessor disponível. Conecte ferramentas anteriores para mapear dados.
                </div>
              ) : (
                <div className="py-2">
                  {predecessorNodes.map((node) => {
                    const outputs = toolOutputs[node.toolId] || [];
                    const isExpanded = expandedNode === node.id;
                    
                    return (
                      <div key={node.id} className="border-b last:border-b-0">
                        <button
                          className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between"
                          onClick={() => setExpandedNode(isExpanded ? null : node.id)}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-woopi-ai-light-blue flex items-center justify-center">
                              {availableTools.find(t => t.id === node.toolId)?.icon}
                            </div>
                            <div>
                              <div className="font-medium text-sm text-woopi-ai-dark-gray">
                                {node.name}
                              </div>
                              <div className="text-xs text-woopi-ai-gray">
                                {outputs.length} saída(s) disponível(is)
                              </div>
                            </div>
                          </div>
                          <Plus className={`w-4 h-4 text-woopi-ai-gray transition-transform ${isExpanded ? 'rotate-45' : ''}`} />
                        </button>
                        
                        {isExpanded && outputs.length > 0 && (
                          <div className="bg-gray-50 border-t">
                            {outputs.map((output) => (
                              <button
                                key={output.id}
                                className="w-full px-4 py-2.5 pl-12 text-left hover:bg-white flex flex-col"
                                onClick={() => insertDynamicValue(node.id, node.name, output.id, output.name)}
                              >
                                <div className="font-medium text-sm text-woopi-ai-blue">
                                  {output.name}
                                </div>
                                <div className="text-xs text-woopi-ai-gray mt-0.5">
                                  {output.description}
                                </div>
                                <div className="text-xs font-mono text-gray-500 mt-1 bg-gray-100 px-2 py-1 rounded inline-block">
                                  {'{{' + node.name + '.' + output.id + '}}'}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export function NodeConfigurationPage() {
  const { stageId, nodeId } = useParams<{ stageId: string; nodeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Chave para sessionStorage
  const storageKey = `node-config-${stageId}-${nodeId}`;
  
  // Receber dados do state de navegação
  const locationState = location.state as { toolId?: string; config?: any; predecessors?: any[]; flowTitle?: string } | null;
  
  // Se temos dados no location.state, salvar no sessionStorage
  if (locationState && locationState.toolId) {
    sessionStorage.setItem(storageKey, JSON.stringify(locationState));
  }
  
  // Tentar recuperar do sessionStorage se location.state estiver vazio
  const savedData = sessionStorage.getItem(storageKey);
  const effectiveState = locationState?.toolId ? locationState : (savedData ? JSON.parse(savedData) : null);
  
  const { toolId, config: initialConfig, predecessors, flowTitle } = effectiveState || {};
  
  // Reconstruir o objeto tool a partir do toolId
  const tool = toolId ? availableTools.find(t => t.id === toolId) : null;
  
  // Estados de configuração
  const [config, setConfig] = useState<any>(initialConfig || {});
  
  // Estados para API Template
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>(
    initialConfig?.apiMethod || 'GET'
  );
  const [apiUrl, setApiUrl] = useState(initialConfig?.apiUrl || '');
  const [activeTab, setActiveTab] = useState<'params' | 'headers'>('params');
  const [params, setParams] = useState<{ key: string; value: string }[]>(
    initialConfig?.params || [{ key: '', value: '' }]
  );
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>(
    initialConfig?.headers || [{ key: '', value: '' }]
  );
  const [requestBody, setRequestBody] = useState(initialConfig?.requestBody || '');
  const [response, setResponse] = useState(initialConfig?.response || '');
  const [selectedApiTemplate, setSelectedApiTemplate] = useState<string>(initialConfig?.selectedApiTemplate || '');
  const [apiDependency, setApiDependency] = useState<string>(initialConfig?.apiDependency || '');

  // Estados para criação inline de prompt
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [newPromptData, setNewPromptData] = useState({
    name: '',
    description: '',
    content: ''
  });

  // Estados para Consulta Externa da IA
  const [enableExternalConsult, setEnableExternalConsult] = useState<boolean>(initialConfig?.enableExternalConsult || false);
  const [selectedEndpoints, setSelectedEndpoints] = useState<ApiEndpoint[]>(initialConfig?.selectedEndpoints || []);
  const [endpointSearchTerm, setEndpointSearchTerm] = useState('');

  const handleBack = () => {
    // Limpar dados do sessionStorage ao voltar
    sessionStorage.removeItem(storageKey);
    navigate(`/documentos/workflow/automacao/${stageId}`);
  };

  const handleSave = () => {
    const updatedConfig = {
      ...config,
      apiMethod,
      apiUrl,
      params,
      headers,
      requestBody,
      response
    };
    
    // Limpar dados do sessionStorage ao salvar
    sessionStorage.removeItem(storageKey);
    
    // Aqui você salvaria no backend ou state management
    toast.success(`Configuração de ${tool?.name} salva com sucesso`);
    
    // Voltar para a página do fluxo
    navigate(`/documentos/workflow/automacao/${stageId}`, {
      state: { nodeId, updatedConfig }
    });
  };

  const updateConfig = (field: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  // Funções para gerenciar params
  const addParam = () => {
    setParams([...params, { key: '', value: '' }]);
  };

  const removeParam = (index: number) => {
    setParams(params.filter((_, i) => i !== index));
  };

  const updateParam = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  // Funções para gerenciar headers
  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const handleExecuteAPI = async () => {
    try {
      toast.info('Executando requisição API...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          message: 'Operação realizada com sucesso',
          timestamp: new Date().toISOString()
        }
      };
      
      setResponse(JSON.stringify(mockResponse, null, 2));
      toast.success('API executada com sucesso!');
    } catch (error) {
      toast.error('Erro ao executar API');
    }
  };

  const getMethodColor = (method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH') => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'POST':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'PUT':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'DELETE':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'PATCH':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Funções para gerenciar criação de prompt
  const handleCreatePromptClick = () => {
    setShowPromptForm(true);
  };

  const handleCancelPromptForm = () => {
    setShowPromptForm(false);
    setNewPromptData({
      name: '',
      description: '',
      content: ''
    });
  };

  const handleSaveNewPrompt = () => {
    // Validações
    if (!newPromptData.name.trim()) {
      toast.error('Nome do prompt é obrigatório');
      return;
    }

    if (!newPromptData.content.trim()) {
      toast.error('Conteúdo do prompt é obrigatório');
      return;
    }

    // Aqui você salvaria o prompt no backend
    toast.success('Prompt criado com sucesso!');
    
    // Fechar o formulário e resetar
    setShowPromptForm(false);
    setNewPromptData({
      name: '',
      description: '',
      content: ''
    });

    // Atualizar o config para usar o novo prompt
    updateConfig('promptType', 'custom');
    updateConfig('customPrompt', newPromptData.content);
  };

  const handlePromptDataChange = (field: string, value: string) => {
    setNewPromptData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handlers para Consulta Externa da IA
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

  // Renderizar campos específicos por tipo de ferramenta
  const renderToolFields = () => {
    if (!tool) return null;

    switch (tool.id) {
      case 'api-template':
        return (
          <div className="flex flex-col min-h-[600px]">
            {/* ── Template selector row (full width) ── */}
            <div className="border-b border-gray-200 dark:border-[#393e5c] p-4 md:p-6">
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Selecione um Template
                </Label>
                <Select value={selectedApiTemplate || undefined} onValueChange={setSelectedApiTemplate}>
                  <SelectTrigger className="h-10 text-sm w-72">
                    <SelectValue placeholder="Selecione um template..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webhulk1">Webhulk1</SelectItem>
                    <SelectItem value="webhulk2">Webhulk2</SelectItem>
                    <SelectItem value="rest-generic">REST API Genérica</SelectItem>
                    <SelectItem value="soap-basic">SOAP Básico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ── Two-column area ── */}
            <div className="flex flex-col lg:flex-row flex-1">
            {/* ── Left column ── */}
            <div className="w-full lg:w-[380px] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-[#393e5c] p-4 md:p-6 space-y-5 overflow-y-auto">

              {/* Dependências */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dependências <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Selecione as ferramentas anteriores cujas saídas você deseja usar como entrada
                </p>
                <div className="flex gap-2">
                  <Select value={apiDependency || undefined} onValueChange={setApiDependency}>
                    <SelectTrigger className="h-10 text-sm flex-1">
                      <SelectValue placeholder="Adicionar Dependência" />
                    </SelectTrigger>
                    <SelectContent>
                      {predecessors && predecessors.length > 0 ? (
                        predecessors.map((pred) => (
                          <SelectItem key={pred.id} value={pred.id}>
                            <div className="flex items-center gap-2">
                              <span>{pred.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {availableTools.find(t => t.id === pred.toolId)?.name || pred.toolId}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>Nenhuma ferramenta disponível</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0 flex-shrink-0">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Detalhes da Requisição */}
              <div className="border border-gray-200 dark:border-[#393e5c] rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-[#393e5c] bg-gray-50 dark:bg-[#1f2132]">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-[#d5d8e0]">
                    Detalhes da Requisição
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {/* Método + URL */}
                  <div className="flex gap-3 items-end">
                    <div className="flex-shrink-0 space-y-1">
                      <Label className="text-xs text-gray-500 dark:text-gray-400">Método</Label>
                      <Select value={apiMethod} onValueChange={(value: any) => setApiMethod(value)}>
                        <SelectTrigger className="w-24 h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">
                            <Badge variant="outline" className={`${getMethodColor('GET')} text-xs px-2 py-0`}>GET</Badge>
                          </SelectItem>
                          <SelectItem value="POST">
                            <Badge variant="outline" className={`${getMethodColor('POST')} text-xs px-2 py-0`}>POST</Badge>
                          </SelectItem>
                          <SelectItem value="PUT">
                            <Badge variant="outline" className={`${getMethodColor('PUT')} text-xs px-2 py-0`}>PUT</Badge>
                          </SelectItem>
                          <SelectItem value="DELETE">
                            <Badge variant="outline" className={`${getMethodColor('DELETE')} text-xs px-2 py-0`}>DELETE</Badge>
                          </SelectItem>
                          <SelectItem value="PATCH">
                            <Badge variant="outline" className={`${getMethodColor('PATCH')} text-xs px-2 py-0`}>PATCH</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <Label className="text-xs text-gray-500 dark:text-gray-400">URL do Endpoint</Label>
                      <Input
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        placeholder="http://localhost:5000/dados"
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>

                  {/* Tabs Params / Headers */}
                  <div>
                    <div className="flex border-b border-gray-200 dark:border-[#393e5c]">
                      <button
                        onClick={() => setActiveTab('params')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === 'params'
                            ? 'border-[#0073ea] text-[#0073ea]'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        Parâmetros de Query
                      </button>
                      <button
                        onClick={() => setActiveTab('headers')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === 'headers'
                            ? 'border-[#0073ea] text-[#0073ea]'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        Cabeçalhos
                      </button>
                    </div>

                    {activeTab === 'params' && (
                      <div className="pt-3 space-y-3">
                        <div className="grid grid-cols-[1fr_1fr_32px] gap-2 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide px-1">
                          <span>KEY</span><span>VALUE</span><span />
                        </div>
                        <div className="space-y-2">
                          {params.map((param, index) => (
                            <div key={index} className="grid grid-cols-[1fr_1fr_32px] gap-2">
                              <Input
                                value={param.key}
                                onChange={(e) => updateParam(index, 'key', e.target.value)}
                                placeholder="param_name"
                                className="h-8 text-xs"
                              />
                              <Input
                                value={param.value}
                                onChange={(e) => updateParam(index, 'value', e.target.value)}
                                placeholder="param_value"
                                className="h-8 text-xs"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeParam(index)}
                                className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" onClick={addParam} className="w-full border-dashed h-8 text-xs">
                          <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar Parâmetro
                        </Button>
                      </div>
                    )}

                    {activeTab === 'headers' && (
                      <div className="pt-3 space-y-3">
                        <div className="grid grid-cols-[1fr_1fr_32px] gap-2 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide px-1">
                          <span>KEY</span><span>VALUE</span><span />
                        </div>
                        <div className="space-y-2">
                          {headers.map((header, index) => (
                            <div key={index} className="grid grid-cols-[1fr_1fr_32px] gap-2">
                              <Input
                                value={header.key}
                                onChange={(e) => updateHeader(index, 'key', e.target.value)}
                                placeholder="Content-Type"
                                className="h-8 text-xs"
                              />
                              <Input
                                value={header.value}
                                onChange={(e) => updateHeader(index, 'value', e.target.value)}
                                placeholder="application/json"
                                className="h-8 text-xs"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeHeader(index)}
                                className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" onClick={addHeader} className="w-full border-dashed h-8 text-xs">
                          <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar Cabeçalho
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right column ── */}
            <div className="flex-1 p-4 md:p-6 flex flex-col gap-4">
              <div className="space-y-1">
                <Label className="text-base font-medium text-gray-800 dark:text-[#d5d8e0]">
                  Corpo da Requisição
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Digite '|' para ver as variáveis disponíveis.
                </p>
              </div>

              <Textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                placeholder={'{\n  "prompt": "{{prompt}}"\n}'}
                className="font-mono text-sm resize-none flex-1 min-h-[420px] leading-relaxed"
              />

              {/* Tip */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-lg p-3 flex items-center gap-2 flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Dica: Use variáveis como [ocr] ou [prompt] que serão substituídas no momento da execução.
                </p>
              </div>
            </div>
            </div>{/* end two-column area */}
          </div>
        );

      case 'condition':
        return (
          <div className="max-w-3xl space-y-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <GitBranch className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-900 dark:text-amber-300 mb-1">Nó de Condição</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400/80">
                    Configure uma condição que determinará o fluxo de execução. Se a condição for verdadeira, o fluxo segue pela saída <strong className="text-green-600 dark:text-green-400">Sim</strong>. Caso contrário, segue pela saída <strong className="text-red-600 dark:text-red-400">Não</strong>.
                  </p>
                </div>
              </div>
            </div>

            <DynamicInputField
              label="Input - Valor de Entrada"
              value={config.conditionInput || ''}
              onChange={(value) => updateConfig('conditionInput', value)}
              placeholder="Selecione ou digite o valor a ser comparado"
              predecessorNodes={predecessors || []}
              inputType="text"
            />

            <div className="space-y-3">
              <Label htmlFor="operator" className="text-lg">Operador</Label>
              <Select 
                value={config.operator || 'equals'} 
                onValueChange={(value) => updateConfig('operator', value)}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Selecione o operador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Igual a (==)</SelectItem>
                  <SelectItem value="notEquals">Diferente de (!=)</SelectItem>
                  <SelectItem value="greaterThan">Maior que (&gt;)</SelectItem>
                  <SelectItem value="greaterThanOrEquals">Maior ou igual a (&gt;=)</SelectItem>
                  <SelectItem value="lessThan">Menor que (&lt;)</SelectItem>
                  <SelectItem value="lessThanOrEquals">Menor ou igual a (&lt;=)</SelectItem>
                  <SelectItem value="contains">Contém</SelectItem>
                  <SelectItem value="notContains">Não contém</SelectItem>
                  <SelectItem value="startsWith">Começa com</SelectItem>
                  <SelectItem value="endsWith">Termina com</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="comparison-value" className="text-lg">Valor de Comparação</Label>
              <Input
                id="comparison-value"
                value={config.comparisonValue || ''}
                onChange={(e) => updateConfig('comparisonValue', e.target.value)}
                placeholder="Digite o valor para comparação"
                className="h-12 text-base"
              />
            </div>

            {/* Preview da condição */}
            {config.conditionInput && config.operator && config.comparisonValue && (
              <div className="bg-gray-50 dark:bg-[#1f2132] border border-gray-200 dark:border-[#393e5c] rounded-lg p-4">
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">Preview da Condição</Label>
                <div className="font-mono text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-[#292f4c] rounded p-3 border border-gray-200 dark:border-[#393e5c]">
                  <span className="text-blue-600 dark:text-blue-400">{config.conditionInput}</span>
                  {' '}
                  <span className="text-purple-600 font-bold">
                    {config.operator === 'equals' && '=='}
                    {config.operator === 'notEquals' && '!='}
                    {config.operator === 'greaterThan' && '>'}
                    {config.operator === 'greaterThanOrEquals' && '>='}
                    {config.operator === 'lessThan' && '<'}
                    {config.operator === 'lessThanOrEquals' && '<='}
                    {config.operator === 'contains' && 'contém'}
                    {config.operator === 'notContains' && 'não contém'}
                    {config.operator === 'startsWith' && 'começa com'}
                    {config.operator === 'endsWith' && 'termina com'}
                  </span>
                  {' '}
                  <span className="text-green-600 dark:text-green-400">"{config.comparisonValue}"</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'ocr':
        return (
          <div className="max-w-3xl space-y-6">
            <DynamicInputField
              label="Documento de Entrada"
              value={config.ocrInput || ''}
              onChange={(value) => updateConfig('ocrInput', value)}
              placeholder="Especifique o documento para processar"
              predecessorNodes={predecessors || []}
              inputType="text"
            />
            <div className="space-y-3">
              <Label htmlFor="ocr-language" className="text-lg">Idioma do OCR</Label>
              <Select 
                value={config.language || 'pt'} 
                onValueChange={(value) => updateConfig('language', value)}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="en">Inglês</SelectItem>
                  <SelectItem value="es">Espanhol</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label htmlFor="confidence" className="text-lg">Nível de Confiança Mínimo (%)</Label>
              <Input
                id="confidence"
                type="number"
                min="0"
                max="100"
                value={config.confidence || 85}
                onChange={(e) => updateConfig('confidence', parseInt(e.target.value))}
                className="h-12 text-base"
              />
            </div>
          </div>
        );

      case 'embeddings':
      case 'email-summary':
        return (
          <div className="max-w-3xl space-y-6">
            {/* Dependências - Mostrar primeiro */}
            {predecessors && predecessors.length > 0 && (
              <div className="space-y-3">
                <Label className="text-lg">Dependências</Label>
                <div className="bg-gray-50 border border-gray-200 dark:border-[#393e5c] rounded-lg p-4 space-y-2">
                  {predecessors.map((pred) => (
                    <div key={pred.id} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-woopi-ai-blue" />
                      <span className="font-medium text-woopi-ai-dark-gray">{pred.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {availableTools.find(t => t.id === pred.toolId)?.name || pred.toolId}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seletor de Prompt Existente */}
            <div className="space-y-3">
              <Label htmlFor="prompt-type" className="text-lg">Prompts</Label>
              <Select 
                value={config.promptType || 'default'} 
                onValueChange={(value) => updateConfig('promptType', value)}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Selecione o tipo de prompt" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide px-2 py-1">
                      Geral
                    </SelectLabel>
                    <SelectItem value="default">Prompt Padrão</SelectItem>
                    <SelectItem value="custom">Prompt Personalizado</SelectItem>
                    <SelectItem value="template">Template Predefinido</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide px-2 py-1">
                      Agentes Cadastrados
                    </SelectLabel>
                    {MOCK_SAVED_PROMPTS.map((prompt) => (
                      <SelectItem key={prompt.id} value={prompt.id}>
                        <span className="flex items-center gap-2">
                          {prompt.hasExternalConsult ? (
                            <>
                              <span>{prompt.name}</span>
                              <span className="flex items-center gap-1 text-[#0073ea] font-semibold text-xs bg-[#0073ea]/10 px-1.5 py-0.5 rounded">
                                <PlugZap className="w-3.5 h-3.5" />
                                Consulta Externa
                              </span>
                            </>
                          ) : (
                            <span>{prompt.name}</span>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Botão para criar novo prompt */}
            <div>
              <Button
                variant="outline"
                className="w-full border-dashed h-11 text-base"
                onClick={handleCreatePromptClick}
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar novo prompt
              </Button>
            </div>

            {/* Formulário de criação de prompt */}
            {showPromptForm && (
              <div className="space-y-4">
                <Label className="text-lg">Novo Prompt</Label>
                <Input
                  value={newPromptData.name}
                  onChange={(e) => handlePromptDataChange('name', e.target.value)}
                  placeholder="Nome do prompt"
                  className="h-12 text-base"
                />
                <Textarea
                  value={newPromptData.description}
                  onChange={(e) => handlePromptDataChange('description', e.target.value)}
                  placeholder="Descrição do prompt"
                  className="text-base resize-none h-24 leading-relaxed"
                />
                <Textarea
                  value={newPromptData.content}
                  onChange={(e) => handlePromptDataChange('content', e.target.value)}
                  placeholder="Conteúdo do prompt"
                  className="font-mono text-base resize-none h-48 leading-relaxed"
                />
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelPromptForm}
                    className="h-11 text-base"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveNewPrompt}
                    className="woopi-ai-button-primary h-11 text-base"
                  >
                    Salvar Prompt
                  </Button>
                </div>
              </div>
            )}

            {/* Campo de prompt personalizado (se custom for selecionado) */}
            {config.promptType === 'custom' && (
              <DynamicInputField
                label="Prompt Personalizado"
                value={config.customPrompt || ''}
                onChange={(value) => updateConfig('customPrompt', value)}
                placeholder="Digite seu prompt personalizado..."
                predecessorNodes={predecessors || []}
                inputType="textarea"
              />
            )}

            {/* Consulta Externa da IA */}
            <div className="border border-gray-200 dark:border-[#393e5c] rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-[#393e5c] bg-gray-50 dark:bg-[#1f2132] flex items-center gap-2.5">
                <PlugZap className="w-5 h-5 text-[#0073ea] drop-shadow-[0_0_4px_rgba(0,115,234,0.5)]" />
                <h3 className="text-sm font-semibold text-gray-800 dark:text-[#d5d8e0]">
                  Consulta Externa da IA
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {/* Checkbox habilitar */}
                <div className="flex items-center gap-3">
                  <input
                    id="node-enable-external-consult"
                    type="checkbox"
                    checked={enableExternalConsult}
                    onChange={(e) => {
                      setEnableExternalConsult(e.target.checked);
                      updateConfig('enableExternalConsult', e.target.checked);
                      if (!e.target.checked) {
                        setSelectedEndpoints([]);
                        setEndpointSearchTerm('');
                        updateConfig('selectedEndpoints', []);
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 dark:border-[#393e5c] accent-[#0073ea] cursor-pointer"
                  />
                  <Label
                    htmlFor="node-enable-external-consult"
                    className="text-sm text-gray-700 dark:text-[#d5d8e0] cursor-pointer select-none"
                  >
                    Habilitar consulta externa da IA neste agente
                  </Label>
                </div>

                {/* Multiselect de endpoints */}
                {enableExternalConsult && (
                  <div className="pt-2 border-t border-gray-200 dark:border-[#393e5c]">
                    <div className="border border-gray-200 dark:border-[#393e5c] rounded-md p-4 bg-gray-50 dark:bg-[#1f2132]">
                      {/* Header com contagem e ações */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-[#d5d8e0]">
                          Endpoints Selecionados ({selectedEndpoints.length})
                        </span>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleSelectAllEndpoints}
                            className="text-xs h-7"
                          >
                            Selecionar Todos
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleClearAllEndpoints}
                            className="text-xs h-7"
                          >
                            Limpar Seleção
                          </Button>
                        </div>
                      </div>

                      {/* Badges dos selecionados */}
                      {selectedEndpoints.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3 max-h-[80px] overflow-y-auto">
                          {selectedEndpoints.map((ep) => (
                            <Badge
                              key={ep.id}
                              variant="secondary"
                              className="bg-[#0073ea]/10 text-[#0073ea] dark:bg-[#0073ea]/20 dark:text-[#4a9ff5] border-[#0073ea]/30 flex items-center gap-1"
                            >
                              {ep.text}
                              <button
                                type="button"
                                className="ml-1 hover:opacity-70"
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
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                        <Input
                          placeholder="Buscar endpoints..."
                          value={endpointSearchTerm}
                          onChange={(e) => setEndpointSearchTerm(e.target.value)}
                          className="pl-10 h-8 text-sm bg-white dark:bg-[#292f4c]"
                        />
                      </div>

                      {/* Lista de endpoints disponíveis */}
                      <div className="max-h-44 overflow-y-auto space-y-1">
                        {MOCK_API_ENDPOINTS
                          .filter(ep =>
                            ep.text.toLowerCase().includes(endpointSearchTerm.toLowerCase()) &&
                            !selectedEndpoints.some(s => s.id === ep.id)
                          )
                          .map((ep) => (
                            <div
                              key={ep.id}
                              className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-[#393e5c] rounded cursor-pointer"
                              onClick={() => handleEndpointToggle(ep)}
                            >
                              <input
                                type="checkbox"
                                checked={false}
                                readOnly
                                className="w-4 h-4 rounded border-gray-300 dark:border-[#393e5c] accent-[#0073ea] pointer-events-none"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-800 dark:text-[#d5d8e0]">{ep.text}</div>
                                {ep.subtitle && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{ep.subtitle}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        {MOCK_API_ENDPOINTS.filter(ep =>
                          ep.text.toLowerCase().includes(endpointSearchTerm.toLowerCase()) &&
                          !selectedEndpoints.some(s => s.id === ep.id)
                        ).length === 0 && (
                          <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                            Nenhum endpoint disponível
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'extract-nfe':
        return (
          <div className="max-w-3xl space-y-6">
            <DynamicInputField
              label="Dados para Extração"
              value={config.extractionInput || ''}
              onChange={(value) => updateConfig('extractionInput', value)}
              placeholder="Especifique os dados de entrada para extração"
              predecessorNodes={predecessors || []}
              inputType="text"
            />
            <div className="space-y-3">
              <Label htmlFor="extraction-fields" className="text-lg">Campos para Extração</Label>
              <div className="grid grid-cols-2 gap-3">
                {['numero', 'data', 'cnpj', 'valor', 'impostos', 'produtos'].map(field => (
                  <label key={field} className="flex items-center space-x-2 p-3 border dark:border-[#393e5c] rounded-lg hover:bg-gray-50 dark:hover:bg-[#1f2132] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.extractionFields?.[field] || false}
                      onChange={(e) => updateConfig('extractionFields', {
                        ...config.extractionFields,
                        [field]: e.target.checked
                      })}
                      className="rounded w-4 h-4"
                    />
                    <span className="text-base capitalize">{field}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'send-erp':
        return (
          <div className="max-w-3xl space-y-6">
            <DynamicInputField
              label="Endpoint do ERP"
              value={config.erpEndpoint || ''}
              onChange={(value) => updateConfig('erpEndpoint', value)}
              placeholder="https://api.erp.com/documents"
              predecessorNodes={predecessors || []}
              inputType="text"
            />
            <div className="space-y-3">
              <Label htmlFor="auth-token" className="text-lg">Token de Autenticação</Label>
              <Input
                id="auth-token"
                type="password"
                placeholder="Token ou chave de API"
                value={config.authToken || ''}
                onChange={(e) => updateConfig('authToken', e.target.value)}
                className="h-12 text-base"
              />
            </div>
          </div>
        );

      case 'questionnaire':
        return (
          <div className="max-w-3xl space-y-6">
            {/* Título da página conforme a imagem */}
            <div>
              <h2 className="text-xl font-medium text-gray-900 dark:text-[#d5d8e0] mb-4">Configurar Questionário</h2>
            </div>

            {/* Seletor de Dependências - Conforme imagem de referência */}
            <div className="space-y-3">
              <Label className="text-lg">
                Dependências <span className="text-red-500">*</span>
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Selecione as ferramentas anteriores cujas saídas você deseja usar como entrada
              </p>
              <Select 
                value={config.selectedDependency || undefined} 
                onValueChange={(value) => updateConfig('selectedDependency', value)}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Nenhuma ferramenta disponível" />
                </SelectTrigger>
                <SelectContent>
                  {predecessors && predecessors.length > 0 ? (
                    predecessors.map((pred) => (
                      <SelectItem key={pred.id} value={pred.id}>
                        <div className="flex items-center gap-2">
                          <span>{pred.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {availableTools.find(t => t.id === pred.toolId)?.name || pred.toolId}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>Nenhuma ferramenta disponível</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Questionários */}
            <div className="space-y-4">
              <Label className="text-lg">Questionários</Label>
              <Select 
                value={config.questionnaireId || undefined} 
                onValueChange={(value) => updateConfig('questionnaireId', value)}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Nenhuma ferramenta disponível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="q1">Questionário de Compliance</SelectItem>
                  <SelectItem value="q2">Questionário de Risco</SelectItem>
                  <SelectItem value="q3">Questionário Jurídico</SelectItem>
                  <SelectItem value="q4">Questionário Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'anonymize':
        return (
          <div className="max-w-3xl space-y-6">
            {/* Banner informativo */}


            {/* Tipo de Anonimização — obrigatório */}
            <div className="space-y-3">
              <Label htmlFor="anonymize-type" className="text-lg">
                Tipo de Anonimização <span className="text-red-500">*</span>
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Define como os dados sensíveis serão tratados no documento.
              </p>
              <Select
                value={config.anonymizeType || undefined}
                onValueChange={(value) => updateConfig('anonymizeType', value)}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Selecione o tipo de anonimização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="partial-masking">
                    <div className="flex flex-col py-0.5">
                      <span className="font-medium">Mascaramento Parcial</span>
                      <span className="text-xs text-gray-500">Ex: João S., CPF ***.***.***-12</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="full-masking">
                    <div className="flex flex-col py-0.5">
                      <span className="font-medium">Mascaramento Total</span>
                      <span className="text-xs text-gray-500">Ex: [NOME OCULTO], [CPF OCULTO]</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="initials">
                    <div className="flex flex-col py-0.5">
                      <span className="font-medium">Substituição por Iniciais</span>
                      <span className="text-xs text-gray-500">Ex: J.S., M.A.O.</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="synthetic-data">
                    <div className="flex flex-col py-0.5">
                      <span className="font-medium">Dados Fictícios</span>
                      <span className="text-xs text-gray-500">Substitui por dados realistas gerados sinteticamente</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Preview do tipo selecionado */}
              {config.anonymizeType && (
                <div className="bg-gray-50 dark:bg-[#1f2132] border border-gray-200 dark:border-[#393e5c] rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Exemplo de resultado</p>
                  {config.anonymizeType === 'partial-masking' && (
                    <div className="space-y-1 text-sm font-mono">
                      <p><span className="text-gray-400">Nome:</span> <span className="text-teal-600 dark:text-teal-400">João S.</span></p>
                      <p><span className="text-gray-400">CPF:</span> <span className="text-teal-600 dark:text-teal-400">***.456.***-12</span></p>
                    </div>
                  )}
                  {config.anonymizeType === 'full-masking' && (
                    <div className="space-y-1 text-sm font-mono">
                      <p><span className="text-gray-400">Nome:</span> <span className="text-teal-600 dark:text-teal-400">[NOME OCULTO]</span></p>
                      <p><span className="text-gray-400">CPF:</span> <span className="text-teal-600 dark:text-teal-400">[CPF OCULTO]</span></p>
                    </div>
                  )}
                  {config.anonymizeType === 'initials' && (
                    <div className="space-y-1 text-sm font-mono">
                      <p><span className="text-gray-400">Nome:</span> <span className="text-teal-600 dark:text-teal-400">J.S.</span></p>
                      <p><span className="text-gray-400">Empresa:</span> <span className="text-teal-600 dark:text-teal-400">A.B.C. Ltda.</span></p>
                    </div>
                  )}
                  {config.anonymizeType === 'synthetic-data' && (
                    <div className="space-y-1 text-sm font-mono">
                      <p><span className="text-gray-400">Nome:</span> <span className="text-teal-600 dark:text-teal-400">Carlos Mendes</span></p>
                      <p><span className="text-gray-400">CPF:</span> <span className="text-teal-600 dark:text-teal-400">123.456.789-00</span></p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Prompt de Instrução — opcional */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="anonymize-prompt" className="text-lg">Prompt de Instrução</Label>
                <Badge variant="outline" className="text-xs">Opcional</Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Selecione um Agente cadastrado na plataforma para guiar o processo de anonimização com instruções personalizadas.
              </p>
              <Select
                value={config.promptAgentId || 'none'}
                onValueChange={(value) => updateConfig('promptAgentId', value === 'none' ? '' : value)}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Nenhum agente selecionado (usar padrão)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-gray-400 italic">Nenhum — usar comportamento padrão</span>
                  </SelectItem>
                  <SelectItem value="agent-juridico">
                    <div className="flex flex-col py-0.5">
                      <span className="font-medium">Agente de Análise Jurídica</span>
                      <span className="text-xs text-gray-500">Foca em dados pessoais e cláusulas sensíveis</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="agent-financeiro">
                    <div className="flex flex-col py-0.5">
                      <span className="font-medium">Agente Financeiro</span>
                      <span className="text-xs text-gray-500">Oculta valores, contas e informações bancárias</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="agent-compliance">
                    <div className="flex flex-col py-0.5">
                      <span className="font-medium">Agente de Compliance (LGPD)</span>
                      <span className="text-xs text-gray-500">Aplica regras da LGPD para proteção de dados</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="agent-contratos">
                    <div className="flex flex-col py-0.5">
                      <span className="font-medium">Agente de Contratos</span>
                      <span className="text-xs text-gray-500">Especializado em contratos e acordos comerciais</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="agent-rh">
                    <div className="flex flex-col py-0.5">
                      <span className="font-medium">Agente de RH</span>
                      <span className="text-xs text-gray-500">Trata dados de colaboradores e folha de pagamento</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
        );

      default:
        return (
          <div className="max-w-3xl space-y-6">
            <DynamicInputField
              label="Dados de Entrada"
              value={config.inputData || ''}
              onChange={(value) => updateConfig('inputData', value)}
              placeholder="Digite ou selecione a fonte de dados"
              predecessorNodes={predecessors || []}
              inputType="text"
            />
          </div>
        );
    }
  };

  if (!tool) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500">Ferramenta não encontrada</p>
          <Button onClick={handleBack} className="mt-4">
            Voltar ao Fluxo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1f2132]">
      {/* Header com Breadcrumb */}
      <div className="bg-white dark:bg-[#1a1b2e] border-b border-gray-200 dark:border-[#393e5c] sticky top-0 z-10">
        <div className="p-4 md:p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <button 
              onClick={() => navigate('/workflow/gestao')}
              className="hover:text-woopi-ai-blue"
            >
              Fluxos
            </button>
            <span>/</span>
            <button 
              onClick={handleBack}
              className="hover:text-woopi-ai-blue"
            >
              {flowTitle || 'Fluxo de Automação'}
            </button>
            <span>/</span>
            <span className="text-woopi-ai-dark-gray font-medium">{tool.name}</span>
          </div>

          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Fluxo
              </Button>
              <div className="flex items-center gap-3">
                <div 
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                  style={{ backgroundColor: tool.bgColor, color: tool.textColor }}
                >
                  {tool.icon}
                </div>
                <div>
                  <h1 className="text-2xl font-medium text-gray-900 dark:text-[#d5d8e0]">
                    {tool.name}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Configure os parâmetros desta ferramenta</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleSave}
              className="woopi-ai-button-primary flex items-center gap-2 h-12 px-6 text-base"
            >
              <Save className="w-5 h-5" />
              Salvar Configuração
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Dica de mapeamento dinâmico */}
        {predecessors && predecessors.length > 0 && tool.id !== 'api-template' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Code2 className="w-5 h-5 text-woopi-ai-blue mt-0.5 flex-shrink-0" />
              <div className="text-sm text-woopi-ai-dark-gray">
                <p className="font-medium mb-1">Mapeamento Dinâmico Disponível</p>
                <p className="text-woopi-ai-gray">
                  Clique no ícone <Code2 className="w-4 h-4 inline mx-1" /> ao lado dos campos para inserir dados das ferramentas anteriores
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Campos da Ferramenta */}
        <div className={`bg-white dark:bg-[#292f4c] rounded-lg border border-gray-200 dark:border-[#393e5c] node-config-form overflow-hidden ${tool.id === 'api-template' ? '' : 'p-4 md:p-6'}`}>
          {renderToolFields()}
        </div>
      </div>
    </div>
  );
}