import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDarkMode } from '../hooks/useDarkMode';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Upload, 
  Play, 
  ScanLine, 
  FileText, 
  Mail, 
  ArrowRight, 
  Check,
  Settings,
  X,
  Plus,
  Edit3,
  MessageSquare,
  Database,
  Code2,
  Trash2,
  GitBranch,
  ClipboardList,
  ShieldOff,
  CircleHelp,
  GripHorizontal,
  MousePointerClick,
  Link2,
  PlayCircle,
  Search,
  ChevronDown
} from 'lucide-react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  addEdge, 
  Connection, 
  Edge, 
  Node, 
  useNodesState, 
  useEdgesState,
  Handle,
  Position,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner@2.0.3';

// Tipos de ferramentas disponíveis
interface ToolType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  textColor: string;
}

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
      <Label>{label}</Label>
      <div className="relative flex gap-2">
        {inputType === 'text' ? (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
        ) : (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className="flex-1"
          />
        )}
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-3 border-woopi-ai-border hover:bg-woopi-ai-light-blue hover:border-woopi-ai-blue flex-shrink-0"
              title="Inserir dado dinâmico"
            >
              <Code2 className="w-4 h-4" />
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
                          className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-[#292f4c] flex items-center justify-between"
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
                          <div className="bg-gray-50 dark:bg-[#1f2132] border-t dark:border-[#393e5c]">
                            {outputs.map((output) => (
                              <button
                                key={output.id}
                                className="w-full px-4 py-2.5 pl-12 text-left hover:bg-white dark:hover:bg-[#292f4c] flex flex-col"
                                onClick={() => insertDynamicValue(node.id, node.name, output.id, output.name)}
                              >
                                <div className="font-medium text-sm text-woopi-ai-blue">
                                  {output.name}
                                </div>
                                <div className="text-xs text-woopi-ai-gray mt-0.5">
                                  {output.description}
                                </div>
                                <div className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1 bg-gray-100 dark:bg-[#1f2132] px-2 py-1 rounded inline-block">
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

// Componente do nó customizado
const CustomNode = ({ data, id }: { data: any; id: string }) => {
  const tool = availableTools.find(t => t.id === data.toolId);
  
  if (!tool) return null;

  const handleRemoveNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onRemove) {
      data.onRemove(id);
    }
  };

  const handleConfigureNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onConfigure) {
      // Passar apenas o toolId (string), não o objeto tool completo que contém React elements
      data.onConfigure(id, data.toolId);
    }
  };

  // Renderizar nó de condição com duas saídas
  if (data.toolId === 'condition') {
    return (
      <div className="px-4 py-3 shadow-lg rounded-lg bg-amber-50 dark:bg-[#3a3520] border-2 border-amber-300 dark:border-amber-500/50 min-w-64 hover:shadow-xl transition-shadow relative">
        <Handle 
          type="target" 
          position={Position.Left} 
          className="w-3 h-3 !bg-amber-500 border-2 border-white dark:border-gray-800" 
        />
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{ backgroundColor: tool.bgColor, color: tool.textColor }}
          >
            {tool.icon}
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm text-gray-900 dark:text-[#d5d8e0]">{tool.name}</div>
          </div>
          <div className="flex gap-1 nodrag">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-6 h-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-[#393e5c] nodrag"
              onClick={handleConfigureNode}
            >
              <Settings className="w-3 h-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-6 h-6 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 nodrag"
              onClick={handleRemoveNode}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
        {/* Duas handles de saída para condição */}
        <Handle 
          type="source" 
          position={Position.Right} 
          id="yes"
          style={{ top: '40%' }}
          className="w-3 h-3 !bg-green-500 border-2 border-white dark:border-gray-800" 
        />
        <Handle 
          type="source" 
          position={Position.Right} 
          id="no"
          style={{ top: '75%' }}
          className="w-3 h-3 !bg-red-500 border-2 border-white dark:border-gray-800" 
        />
        {/* Labels para as saídas - posicionados fora do nó à direita */}
        <div className="absolute -right-10 top-[35%] text-xs font-semibold text-green-600 dark:text-green-400 pointer-events-none bg-white dark:bg-[#292f4c] px-1.5 py-0.5 rounded border border-green-200 dark:border-green-500/40">
          Sim
        </div>
        <div className="absolute -right-10 top-[70%] text-xs font-semibold text-red-600 dark:text-red-400 pointer-events-none bg-white dark:bg-[#292f4c] px-1.5 py-0.5 rounded border border-red-200 dark:border-red-500/40">
          Não
        </div>
      </div>
    );
  }

  // Renderizar nó padrão
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-white dark:bg-[#292f4c] border-2 border-gray-200 dark:border-[#393e5c] min-w-48 hover:shadow-xl transition-shadow">
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 !bg-blue-500 border-2 border-white dark:border-gray-800" 
      />
      <div className="flex items-center gap-3">
        <div 
          className="flex items-center justify-center w-8 h-8 rounded-full"
          style={{ backgroundColor: tool.bgColor, color: tool.textColor }}
        >
          {tool.icon}
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm text-gray-900 dark:text-[#d5d8e0]">{tool.name}</div>
        </div>
        <div className="flex gap-1 nodrag">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-6 h-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-[#393e5c] nodrag"
            onClick={handleConfigureNode}
          >
            <Settings className="w-3 h-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-6 h-6 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 nodrag"
            onClick={handleRemoveNode}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 !bg-blue-500 border-2 border-white dark:border-gray-800" 
      />
    </div>
  );
};

// Componente de edge customizado com botão de remoção no hover
const CustomEdge = ({ 
  id, 
  sourceX, 
  sourceY, 
  targetX, 
  targetY, 
  sourcePosition, 
  targetPosition,
  data,
  selected
}: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleRemoveEdge = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (data?.onRemove) {
      data.onRemove(id);
    }
  };

  // Mostrar botão se estiver selecionado OU em hover
  const showButton = selected || isHovered;

  return (
    <>
      <BaseEdge 
        id={id}
        path={edgePath} 
        style={{ 
          stroke: selected ? '#0073ea' : '#3b82f6', 
          strokeWidth: selected ? 3 : 2,
        }}
        markerEnd={undefined}
      />
      {/* Área invisível maior para facilitar hover */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            opacity: showButton ? 1 : 0,
            visibility: showButton ? 'visible' : 'hidden',
            transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
            zIndex: 1000,
          }}
          className="nodrag nopan"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            onClick={handleRemoveEdge}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg border-2 border-white dark:border-gray-800 transition-all hover:scale-110"
            title="Remover conexão"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

const nodeTypes: NodeTypes = {
  customNode: CustomNode,
};

const edgeTypes: EdgeTypes = {
  customEdge: CustomEdge,
};

// Nós iniciais baseados na imagem de referência
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'customNode',
    position: { x: 50, y: 250 },
    data: { toolId: 'start' },
    draggable: true,
    selectable: true,
    connectable: true
  },
  {
    id: '2',
    type: 'customNode',
    position: { x: 280, y: 200 },
    data: { toolId: 'ocr' },
    draggable: true,
    selectable: true,
    connectable: true
  },
  {
    id: '3',
    type: 'customNode',
    position: { x: 540, y: 150 },
    data: { toolId: 'embeddings' },
    draggable: true,
    selectable: true,
    connectable: true
  },
  {
    id: '4',
    type: 'customNode',
    position: { x: 540, y: 300 },
    data: { toolId: 'extract-nfe' },
    draggable: true,
    selectable: true,
    connectable: true
  },
  {
    id: '5',
    type: 'customNode',
    position: { x: 800, y: 225 },
    data: { toolId: 'api-template' },
    draggable: true,
    selectable: true,
    connectable: true
  }
];

// Conexões iniciais
const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'customEdge',
    animated: false,
    style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: 'none' }
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'customEdge',
    animated: false,
    style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: 'none' }
  },
  {
    id: 'e1-4',
    source: '1',
    target: '4',
    type: 'customEdge',
    animated: false,
    style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: 'none' }
  }
];

function DocumentAutomationFlow({ stageId, navigate }: { stageId: string; navigate: any }) {
  const { fitView } = useReactFlow();
  const { isDark: isDarkHook } = useDarkMode();
  // Sync with DOM class in case the hook state is stale in this child instance
  const [isDarkDOM, setIsDarkDOM] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkDOM(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  const isDark = isDarkHook || isDarkDOM;
  
  // Estado para controlar a visibilidade das ferramentas
  const [showTools, setShowTools] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [toolSearch, setToolSearch] = useState('');
  const [showAllTools, setShowAllTools] = useState(false);
  const TOOLS_ROW_LIMIT = 8;
  
  // Estado para o título editável
  const [flowTitle, setFlowTitle] = useState('Fluxo de Automação: Recebimento');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(flowTitle);
  
  // Estado para o painel de configuração
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [selectedNodeForConfig, setSelectedNodeForConfig] = useState<{ id: string; tool: ToolType } | null>(null);
  const [nodeConfigs, setNodeConfigs] = useState<Record<string, any>>({});
  
  // Estados para API Template
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('GET');
  const [apiUrl, setApiUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'params' | 'headers'>('params');
  const [params, setParams] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState('');
  
  // Callback para remover nó
  const removeNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    toast.success('Ferramenta removida do fluxo');
  }, []);

  // Callback para remover edge
  const removeEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    toast.success('Conexão removida');
  }, []);

  // Callback para configurar nó - agora recebe toolId diretamente como string
  const configureNodeCallback = useCallback((nodeId: string, toolId: string) => {
    // Navegar para página dedicada de configuração
    // Passar apenas dados serializáveis (sem React elements)
    navigate(`/documentos/workflow/automacao/${stageId}/node/${nodeId}`, {
      state: {
        toolId, // toolId já é uma string, não precisa de transformação
        config: nodeConfigs[nodeId] || {},
        predecessors: [], // Será calculado na página de destino
        flowTitle
      }
    });
  }, [navigate, stageId, nodeConfigs, flowTitle]);

  // Preparar nós iniciais com callback de remoção
  const initialNodesWithCallbacks = useMemo(() => 
    initialNodes.map(node => ({
      ...node,
      data: { 
        ...node.data, 
        onRemove: removeNode,
        onConfigure: configureNodeCallback
      }
    })), [removeNode, configureNodeCallback]
  );

  // Preparar edges iniciais com callback de remoção
  const initialEdgesWithCallbacks = useMemo(() => 
    initialEdges.map(edge => ({
      ...edge,
      data: { ...edge.data, onRemove: removeEdge }
    })), [removeEdge]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodesWithCallbacks);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdgesWithCallbacks);

  // Função para obter nós predecessores de um nó específico
  const getPredecessorNodes = useCallback((nodeId: string) => {
    const predecessorIds = edges
      .filter(edge => edge.target === nodeId)
      .map(edge => edge.source);
    
    return nodes
      .filter(node => predecessorIds.includes(node.id))
      .map(node => {
        const tool = availableTools.find(t => t.id === node.data.toolId);
        return {
          id: node.id,
          name: tool?.name || 'Nó',
          toolId: node.data.toolId
        };
      });
  }, [nodes, edges]);

  // useEffect para ajustar a visualização quando os nós mudarem (fitView)
  useEffect(() => {
    // Timeout para garantir que o DOM foi atualizado
    const timer = setTimeout(() => {
      fitView({ padding: 0.2, duration: 400 });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [nodes, fitView]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditTitle = () => {
    setTempTitle(flowTitle);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    setFlowTitle(tempTitle);
    setIsEditingTitle(false);
    toast.success('Título do fluxo atualizado');
  };

  const handleCancelEdit = () => {
    setTempTitle(flowTitle);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: 'customEdge',
        animated: false,
        style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: 'none' },
        data: { onRemove: removeEdge }
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, removeEdge]
  );

  const handleSave = () => {
    toast.success('Fluxo de automação salvo com sucesso');
  };

  const handleDownloadJSON = () => {
    const flowData = {
      nodes,
      edges,
      stageId
    };
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `fluxo-automacao-${stageId}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('JSON do fluxo baixado com sucesso');
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const flowData = JSON.parse(e.target?.result as string);
            if (flowData.nodes && flowData.edges) {
              // Adicionar callbacks aos nós carregados
              const nodesWithCallbacks = flowData.nodes.map((node: Node) => ({
                ...node,
                data: { 
                  ...node.data, 
                  onRemove: removeNode,
                  onConfigure: configureNodeCallback
                },
                draggable: true,
                selectable: true,
                connectable: true
              }));
              
              // Adicionar callbacks de remoção aos edges carregados
              const edgesWithCallbacks = flowData.edges.map((edge: Edge) => ({
                ...edge,
                data: { ...edge.data, onRemove: removeEdge }
              }));
              
              setNodes(nodesWithCallbacks);
              setEdges(edgesWithCallbacks);
              toast.success('Fluxo carregado com sucesso');
            }
          } catch (error) {
            toast.error('Erro ao carregar o arquivo JSON');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const addToolToFlow = useCallback((tool: ToolType) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type: 'customNode',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { 
        toolId: tool.id, 
        onRemove: removeNode,
        onConfigure: configureNodeCallback
      },
      draggable: true,
      selectable: true,
      connectable: true
    };
    setNodes((nds) => [...nds, newNode]);
    toast.success(`Ferramenta "${tool.name}" adicionada ao fluxo`);
  }, [removeNode, configureNodeCallback]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDropHandler = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const toolId = event.dataTransfer.getData('application/reactflow');
      const tool = availableTools.find(t => t.id === toolId);

      if (tool) {
        const position = { x: event.clientX - 200, y: event.clientY - 100 };
        const newNode: Node = {
          id: `${Date.now()}`,
          type: 'customNode',
          position,
          data: { 
            toolId: tool.id, 
            onRemove: removeNode,
            onConfigure: configureNodeCallback
          },
          draggable: true,
          selectable: true,
          connectable: true
        };
        setNodes((nds) => [...nds, newNode]);
        toast.success(`Ferramenta "${tool.name}" adicionada ao fluxo`);
      }
    },
    [removeNode, configureNodeCallback]
  );

  const onDragStart = (event: React.DragEvent, toolId: string) => {
    event.dataTransfer.setData('application/reactflow', toolId);
    event.dataTransfer.effectAllowed = 'move';
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

  // Get method badge color
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

  // Funções para configuração do nó
  const handleConfigSave = () => {
    if (selectedNodeForConfig) {
      toast.success(`Configuração salva para ${selectedNodeForConfig.tool.name}`);
      setIsConfigPanelOpen(false);
    }
  };

  const handleExecuteAPI = async () => {
    try {
      toast.info('Executando requisição API...');
      // Simular chamada de API
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

  const getCurrentConfig = () => {
    if (!selectedNodeForConfig) return {};
    return nodeConfigs[selectedNodeForConfig.id] || {};
  };

  const updateNodeConfig = (field: string, value: any) => {
    if (selectedNodeForConfig) {
      setNodeConfigs(prev => ({
        ...prev,
        [selectedNodeForConfig.id]: {
          ...prev[selectedNodeForConfig.id],
          [field]: value
        }
      }));
    }
  };

  // Componente do painel de configuração
  const renderConfigPanel = () => {
    if (!selectedNodeForConfig) return null;

    const { tool, id: nodeId } = selectedNodeForConfig;
    const config = getCurrentConfig();
    const predecessors = getPredecessorNodes(nodeId);

    const commonFields = (
      <>
        <DynamicInputField
          label="Dados de Entrada"
          value={config.inputData || ''}
          onChange={(value) => updateNodeConfig('inputData', value)}
          placeholder="Digite ou selecione a fonte de dados"
          predecessorNodes={predecessors}
          inputType="text"
        />
      </>
    );

    const renderToolSpecificFields = () => {
      switch (tool.id) {
        case 'ocr':
          return (
            <>
              <DynamicInputField
                label="Documento de Entrada"
                value={config.ocrInput || ''}
                onChange={(value) => updateNodeConfig('ocrInput', value)}
                placeholder="Especifique o documento para processar"
                predecessorNodes={predecessors}
                inputType="text"
              />
              <div className="space-y-2">
                <Label htmlFor="ocr-language">Idioma do OCR</Label>
                <Select 
                  value={config.language || 'pt'} 
                  onValueChange={(value) => updateNodeConfig('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="en">Inglês</SelectItem>
                    <SelectItem value="es">Espanhol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confidence">Nível de Confiança Mínimo (%)</Label>
                <Input
                  id="confidence"
                  type="number"
                  min="0"
                  max="100"
                  value={config.confidence || 85}
                  onChange={(e) => updateNodeConfig('confidence', parseInt(e.target.value))}
                />
              </div>
            </>
          );
        
        case 'embeddings':
        case 'email-summary':
          return (
            <>
              <div className="space-y-2">
                <Label htmlFor="prompt-type">Tipo de Prompt</Label>
                <Select 
                  value={config.promptType || 'default'} 
                  onValueChange={(value) => updateNodeConfig('promptType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de prompt" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Prompt Padrão</SelectItem>
                    <SelectItem value="custom">Prompt Personalizado</SelectItem>
                    <SelectItem value="template">Template Predefinido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {config.promptType === 'custom' && (
                <DynamicInputField
                  label="Prompt Personalizado"
                  value={config.customPrompt || ''}
                  onChange={(value) => updateNodeConfig('customPrompt', value)}
                  placeholder="Digite seu prompt personalizado..."
                  predecessorNodes={predecessors}
                  inputType="textarea"
                />
              )}
            </>
          );

        case 'extract-nfe':
          return (
            <>
              <DynamicInputField
                label="Dados para Extração"
                value={config.extractionInput || ''}
                onChange={(value) => updateNodeConfig('extractionInput', value)}
                placeholder="Especifique os dados de entrada para extração"
                predecessorNodes={predecessors}
                inputType="text"
              />
              <div className="space-y-2">
                <Label htmlFor="extraction-fields">Campos para Extração</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['numero', 'data', 'cnpj', 'valor', 'impostos', 'produtos'].map(field => (
                    <label key={field} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={config.extractionFields?.[field] || false}
                        onChange={(e) => updateNodeConfig('extractionFields', {
                          ...config.extractionFields,
                          [field]: e.target.checked
                        })}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{field}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          );

        case 'send-erp':
          return (
            <>
              <DynamicInputField
                label="Endpoint do ERP"
                value={config.erpEndpoint || ''}
                onChange={(value) => updateNodeConfig('erpEndpoint', value)}
                placeholder="https://api.erp.com/documents"
                predecessorNodes={predecessors}
                inputType="text"
              />
              <div className="space-y-2">
                <Label htmlFor="auth-token">Token de Autenticação</Label>
                <Input
                  id="auth-token"
                  type="password"
                  placeholder="Token ou chave de API"
                  value={config.authToken || ''}
                  onChange={(e) => updateNodeConfig('authToken', e.target.value)}
                />
              </div>
            </>
          );

        case 'questionnaire':
          return (
            <>
              <div className="space-y-4">
                <Label>Questionários em Sequência</Label>
                {(config.questionnaires || [{ id: '' }]).map((q: any, index: number) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <Select 
                        value={q.id || ''} 
                        onValueChange={(value) => {
                          const newQuestionnaires = [...(config.questionnaires || [{ id: '' }])];
                          newQuestionnaires[index] = { id: value };
                          updateNodeConfig('questionnaires', newQuestionnaires);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um questionário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="q1">Questionário de Compliance</SelectItem>
                          <SelectItem value="q2">Questionário de Risco</SelectItem>
                          <SelectItem value="q3">Questionário Jurídico</SelectItem>
                          <SelectItem value="q4">Questionário Financeiro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {(config.questionnaires || []).length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newQuestionnaires = (config.questionnaires || []).filter((_: any, i: number) => i !== index);
                          updateNodeConfig('questionnaires', newQuestionnaires);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newQuestionnaires = [...(config.questionnaires || [{ id: '' }]), { id: '' }];
                    updateNodeConfig('questionnaires', newQuestionnaires);
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Questionário
                </Button>
              </div>
            </>
          );

        default:
          return null;
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ backgroundColor: tool.bgColor, color: tool.textColor }}
          >
            {tool.icon}
          </div>
          <div>
            <h3 className="font-medium text-woopi-ai-dark-gray">{tool.name}</h3>
            <p className="text-sm text-woopi-ai-gray">Configure os parâmetros desta ferramenta</p>
          </div>
        </div>

        {/* Dica de mapeamento dinâmico */}
        {predecessors.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Code2 className="w-4 h-4 text-woopi-ai-blue mt-0.5 flex-shrink-0" />
              <div className="text-xs text-woopi-ai-dark-gray">
                <p className="font-medium mb-1">Mapeamento Dinâmico Disponível</p>
                <p className="text-woopi-ai-gray">
                  Clique no ícone <Code2 className="w-3 h-3 inline mx-1" /> ao lado dos campos para inserir dados das ferramentas anteriores
                </p>
              </div>
            </div>
          </div>
        )}

        {commonFields}
        {renderToolSpecificFields()}

        <DynamicInputField
          label="Observações"
          value={config.notes || ''}
          onChange={(value) => updateNodeConfig('notes', value)}
          placeholder="Adicione observações sobre esta configuração..."
          predecessorNodes={predecessors}
          inputType="textarea"
        />
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-[#1f2132]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1a1b2e] border-b border-gray-200 dark:border-[#393e5c]">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={handleTitleKeyDown}
                className="text-xl font-medium text-gray-900 dark:text-[#d5d8e0] border-none p-0 h-auto bg-transparent focus:bg-white dark:focus:bg-[#292f4c] focus:border focus:border-woopi-ai-border focus:px-2 focus:py-1"
                autoFocus
              />
            ) : (
              <div className="flex flex-col">
                <h1 className="text-xl font-medium text-gray-900 dark:text-[#d5d8e0]">
                  {flowTitle}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aprovação de Notas Fiscais - Etapa: Recebimento
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditTitle}
              className="w-6 h-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-[#393e5c]"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleSave}
            className="woopi-ai-button-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Incluir
          </Button>
          <Button 
            variant="outline"
            onClick={handleDownloadJSON}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Baixar JSON
          </Button>
          <Button 
            variant="outline"
            onClick={handleUpload}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Ferramentas Disponíveis */}
      <div className="p-4 bg-white dark:bg-[#1a1b2e] border-b border-gray-200 dark:border-[#393e5c]">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => { setShowTools(!showTools); setToolSearch(''); setShowAllTools(false); }}
            size="sm"
            className="woopi-ai-button-primary flex items-center gap-2"
          >
            <Plus className={`w-4 h-4 transition-transform ${showTools ? 'rotate-45' : ''}`} />
            {showTools ? 'Ocultar Ferramentas' : 'Adicionar Ferramentas'}
          </Button>

          {showTools && (
            <div className="relative w-56 animate-in fade-in duration-150">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={toolSearch}
                onChange={(e) => { setToolSearch(e.target.value); setShowAllTools(false); }}
                placeholder="Buscar ferramenta..."
                className="w-full h-8 pl-8 pr-3 text-xs rounded-md border border-gray-200 dark:border-[#393e5c] bg-gray-50 dark:bg-[#13141f] text-gray-800 dark:text-[#d5d8e0] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-woopi-ai-blue dark:focus:ring-[#4a7dff] focus:border-woopi-ai-blue dark:focus:border-[#4a7dff] transition-colors"
              />
              {toolSearch && (
                <button
                  onClick={() => setToolSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
        
        {showTools && (() => {
          const filtered = availableTools.filter((tool) =>
            tool.name.toLowerCase().includes(toolSearch.toLowerCase())
          );
          const visibleTools = showAllTools ? filtered : filtered.slice(0, TOOLS_ROW_LIMIT);
          const hasMore = filtered.length > TOOLS_ROW_LIMIT && !showAllTools;

          return (
            <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
              <div className="flex flex-nowrap gap-2 overflow-hidden items-center">
                {visibleTools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant="outline"
                    size="sm"
                    onClick={() => addToolToFlow(tool)}
                    draggable={tool.id !== 'start'}
                    onDragStart={tool.id !== 'start' ? (e) => onDragStart(e, tool.id) : undefined}
                    className={`flex-shrink-0 flex items-center gap-2 hover:shadow-sm ${
                      tool.id !== 'start' ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                    }`}
                    style={{
                      backgroundColor: isDark ? `${tool.color}15` : tool.bgColor,
                      borderColor: isDark ? `${tool.color}60` : tool.color,
                      color: isDark ? tool.color : tool.textColor
                    }}
                  >
                    {tool.icon}
                    {tool.name}
                  </Button>
                ))}

                {hasMore && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllTools(true)}
                    className="flex-shrink-0 flex items-center gap-1.5 border-dashed border-gray-300 dark:border-[#393e5c] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-400 dark:hover:border-[#4a7dff]"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                    Mais {filtered.length - TOOLS_ROW_LIMIT}
                  </Button>
                )}

                {showAllTools && filtered.length > TOOLS_ROW_LIMIT && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllTools(false)}
                    className="flex-shrink-0 flex items-center gap-1.5 border-dashed border-gray-300 dark:border-[#393e5c] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-400 dark:hover:border-[#4a7dff]"
                  >
                    <X className="w-3.5 h-3.5" />
                    Recolher
                  </Button>
                )}
              </div>

              {filtered.length === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 py-2">
                  Nenhuma ferramenta encontrada para "{toolSearch}"
                </p>
              )}
            </div>
          );
        })()}
      </div>

      {/* React Flow Canvas */}
      <div 
        className="flex-1" 
        style={{ 
          height: 'calc(100vh - 180px)', 
          width: '100%',
          position: 'relative'
        }} 
        onDrop={onDropHandler} 
        onDragOver={onDragOver}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          noDragClassName="nodrag"
          className="bg-gray-100 dark:bg-[#13141f] [&_.react-flow__pane]:bg-gray-100 [&_.react-flow__pane]:dark:!bg-[#13141f] [&_.react-flow__renderer]:bg-gray-100 [&_.react-flow__renderer]:dark:!bg-[#13141f]"
          style={{ 
            width: '100%', 
            height: '100%',
            background: isDark ? '#13141f' : '#f9fafb'
          }}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.5}
          maxZoom={2}
          snapToGrid={true}
          snapGrid={[15, 15]}
          deleteKeyCode="Delete"
          multiSelectionKeyCode="Shift"
        >
          <Background 
            color={isDark ? '#2a2d3e' : '#e5e7eb'}
            gap={20} 
            variant="dots"
            style={{ background: isDark ? '#13141f' : '#f9fafb' }}
          />
          <Controls 
            showZoom={true}
            showFitView={true}
            showInteractive={true}
            className="dark:!bg-[#292f4c] dark:!border-[#393e5c] dark:!shadow-lg [&>button]:dark:!bg-[#292f4c] [&>button]:dark:!border-[#393e5c] [&>button]:dark:!fill-[#d5d8e0] [&>button:hover]:dark:!bg-[#393e5c]"
          />
          <MiniMap 
            nodeColor={isDark ? '#4a7dff' : '#3b82f6'}
            nodeStrokeColor={isDark ? '#6b9fff' : '#1e40af'}
            nodeStrokeWidth={2}
            maskColor={isDark ? 'rgba(19,20,31,0.7)' : 'rgba(0,0,0,0.1)'}
            className="dark:!bg-[#13141f] dark:!border-[#2a2d3e]"
          />
        </ReactFlow>

        {/* Floating Help Button */}
        <div className="absolute top-3 right-3 z-50">
          <Popover open={isHelpOpen} onOpenChange={setIsHelpOpen}>
            <PopoverTrigger asChild>
              <button
                aria-label="Ajuda — como usar o fluxo de automação"
                className="group relative flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-white/90 dark:bg-[#292f4c]/90 backdrop-blur-sm border border-woopi-ai-blue/40 dark:border-[#4a7dff]/40 text-woopi-ai-blue dark:text-[#7aabff] hover:bg-woopi-ai-blue/10 dark:hover:bg-[#4a7dff]/15 hover:border-woopi-ai-blue dark:hover:border-[#4a7dff] hover:shadow-lg transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-woopi-ai-blue focus-visible:ring-offset-2"
              >
                {/* Pulse ring — only shown when popover is closed */}
                {!isHelpOpen && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-woopi-ai-blue/15 dark:bg-[#4a7dff]/15 pointer-events-none" />
                )}
                <CircleHelp className="w-4.5 h-4.5 relative z-10 transition-transform duration-200 group-hover:scale-110" />
              </button>
            </PopoverTrigger>

            <PopoverContent
              side="bottom"
              align="end"
              sideOffset={10}
              className="w-80 p-0 shadow-xl border border-gray-200 dark:border-[#393e5c] bg-white dark:bg-[#1f2132] rounded-xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 py-3 bg-woopi-ai-blue/5 dark:bg-[#4a7dff]/10 border-b border-gray-100 dark:border-[#393e5c] flex items-center gap-2">
                <CircleHelp className="w-4 h-4 text-woopi-ai-blue dark:text-[#7aabff] flex-shrink-0" />
                <p className="text-sm font-semibold text-gray-900 dark:text-[#d5d8e0]">Como usar o Fluxo de Automação</p>
              </div>

              {/* Steps */}
              <div className="px-4 py-3 space-y-3">
                {[
                  {
                    icon: <GripHorizontal className="w-4 h-4" />,
                    title: 'Arraste as ferramentas',
                    desc: 'Clique em "Adicionar Ferramentas" e arraste as ferramentas do Woopi AI para o canvas.',
                  },
                  {
                    icon: <Link2 className="w-4 h-4" />,
                    title: 'Conecte os nós',
                    desc: 'Arraste a alça de saída de um nó até a entrada do próximo para criar uma conexão.',
                  },
                  {
                    icon: <Settings className="w-4 h-4" />,
                    title: 'Configure cada nó',
                    desc: 'Clique na engrenagem de cada nó para abrir o painel de configuração.',
                  },
                  {
                    icon: <Save className="w-4 h-4" />,
                    title: 'Salve e veja em ação',
                    desc: 'Salve o fluxo e acompanhe os outputs ao analisar cada etapa após subir documentos.',
                  },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-woopi-ai-blue/10 dark:bg-[#4a7dff]/15 text-woopi-ai-blue dark:text-[#7aabff]">
                      {step.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-[#d5d8e0] leading-snug">{step.title}</p>
                      <p className="text-xs text-gray-500 dark:text-[#9196b0] leading-relaxed mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Video section */}
              <div className="px-4 pb-4">
                <div className="rounded-lg border border-gray-200 dark:border-[#393e5c] overflow-hidden">
                  {/* Label */}
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-[#292f4c] border-b border-gray-200 dark:border-[#393e5c]">
                    <PlayCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-700 dark:text-[#d5d8e0]">Assista o vídeo</span>
                  </div>
                  {/* Placeholder iframe — replace src with real YouTube embed URL */}
                  <div className="relative w-full bg-gray-100 dark:bg-[#13141f]" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src="https://www.youtube.com/embed/VIDEO_ID_AQUI"
                      title="Como usar o Fluxo de Automação"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Painel de Configuração Off-Canvas */}
      <Sheet open={isConfigPanelOpen} onOpenChange={setIsConfigPanelOpen}>
        <SheetContent side="right" className="w-[95vw] max-w-[1800px] overflow-y-auto overflow-x-hidden">
          <SheetHeader className="pb-6 border-b">
            <SheetTitle className="text-2xl">
              {selectedNodeForConfig ? `Configuração de ${selectedNodeForConfig.tool.name}` : 'Configuração'}
            </SheetTitle>
            <SheetDescription className="text-base">
              {selectedNodeForConfig?.tool.id === 'api-template' 
                ? 'Configure os parâmetros da requisição HTTP para integração com API externa.'
                : selectedNodeForConfig?.tool.id === 'questionnaire'
                ? 'Selecione os questionários que serão aplicados em sequência ao documento.'
                : 'Configure os parâmetros desta ferramenta.'
              }
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-8 pb-24">
            {/* Renderizar campos específicos de API Template */}
            {selectedNodeForConfig?.tool.id === 'api-template' ? (
              <>
                {/* HTTP Method + URL - Full Width */}
                <div className="mb-8">
              <Label className="text-base mb-3 block">Método HTTP & URL</Label>
              <div className="flex gap-3">
                <Select value={apiMethod} onValueChange={(value: any) => setApiMethod(value)}>
                  <SelectTrigger className="w-40 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">
                      <Badge variant="outline" className={`${getMethodColor('GET')} text-sm px-3 py-1`}>
                        GET
                      </Badge>
                    </SelectItem>
                    <SelectItem value="POST">
                      <Badge variant="outline" className={`${getMethodColor('POST')} text-sm px-3 py-1`}>
                        POST
                      </Badge>
                    </SelectItem>
                    <SelectItem value="PUT">
                      <Badge variant="outline" className={`${getMethodColor('PUT')} text-sm px-3 py-1`}>
                        PUT
                      </Badge>
                    </SelectItem>
                    <SelectItem value="DELETE">
                      <Badge variant="outline" className={`${getMethodColor('DELETE')} text-sm px-3 py-1`}>
                        DELETE
                      </Badge>
                    </SelectItem>
                    <SelectItem value="PATCH">
                      <Badge variant="outline" className={`${getMethodColor('PATCH')} text-sm px-3 py-1`}>
                        PATCH
                      </Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="https://api.example.com/endpoint"
                  className="flex-1 h-12 text-base"
                />
              </div>
            </div>

            {/* Layout em Grid de 3 colunas: PARAMS/HEADERS | Request Body | Response */}
            <div className="grid grid-cols-3 gap-6">
              {/* Coluna 1: PARAMS & HEADERS */}
              <div className="space-y-4 min-w-0">
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('params')}
                    className={`px-6 py-3 text-base font-medium border-b-2 transition-colors ${
                      activeTab === 'params'
                        ? 'border-[#0073ea] text-[#0073ea]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    PARAMS
                  </button>
                  <button
                    onClick={() => setActiveTab('headers')}
                    className={`px-6 py-3 text-base font-medium border-b-2 transition-colors ${
                      activeTab === 'headers'
                        ? 'border-[#0073ea] text-[#0073ea]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    HEADERS
                  </button>
                </div>

                {/* PARAMS Tab */}
                {activeTab === 'params' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-[1fr_1fr_48px] gap-3 text-sm font-medium text-gray-500 px-2">
                      <div>KEY</div>
                      <div>VALUE</div>
                      <div></div>
                    </div>
                    <div className="max-h-[calc(100vh-400px)] overflow-y-auto pr-2 space-y-2">
                      {params.map((param, index) => (
                        <div key={index} className="grid grid-cols-[1fr_1fr_48px] gap-3">
                          <Input
                            value={param.key}
                            onChange={(e) => updateParam(index, 'key', e.target.value)}
                            placeholder="param_name"
                            className="text-base h-11"
                          />
                          <Input
                            value={param.value}
                            onChange={(e) => updateParam(index, 'value', e.target.value)}
                            placeholder="param_value"
                            className="text-base h-11"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeParam(index)}
                            className="h-11 w-11 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addParam}
                      className="w-full border-dashed h-11 text-base"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Adicionar Parâmetro
                    </Button>
                  </div>
                )}

                {/* HEADERS Tab */}
                {activeTab === 'headers' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-[1fr_1fr_48px] gap-3 text-sm font-medium text-gray-500 px-2">
                      <div>KEY</div>
                      <div>VALUE</div>
                      <div></div>
                    </div>
                    <div className="max-h-[calc(100vh-400px)] overflow-y-auto pr-2 space-y-2">
                      {headers.map((header, index) => (
                        <div key={index} className="grid grid-cols-[1fr_1fr_48px] gap-3">
                          <Input
                            value={header.key}
                            onChange={(e) => updateHeader(index, 'key', e.target.value)}
                            placeholder="Content-Type"
                            className="text-base h-11"
                          />
                          <Input
                            value={header.value}
                            onChange={(e) => updateHeader(index, 'value', e.target.value)}
                            placeholder="application/json"
                            className="text-base h-11"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeHeader(index)}
                            className="h-11 w-11 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addHeader}
                      className="w-full border-dashed h-11 text-base"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Adicionar Header
                    </Button>
                  </div>
                )}
              </div>

              {/* Coluna 2: Request Body */}
              <div className="space-y-4 min-w-0">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Request Body (JSON)</Label>
                  <Badge variant="outline" className="text-xs">Opcional</Badge>
                </div>
                <Textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder='{\n  "key": "value",\n  "data": "example",\n  "items": [\n    { "id": 1, "name": "Item 1" },\n    { "id": 2, "name": "Item 2" }\n  ]\n}'
                  className="font-mono text-base resize-none h-[calc(100vh-400px)] leading-relaxed"
                />
              </div>

              {/* Coluna 3: Response Output + Execute */}
              <div className="space-y-4 min-w-0">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Response Output</Label>
                  {response && (
                    <Badge className="bg-green-100 text-green-700">
                      Sucesso
                    </Badge>
                  )}
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 h-[calc(100vh-500px)] overflow-y-auto">
                  {response ? (
                    <pre className="text-base font-mono text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {response}
                    </pre>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-base text-gray-500">
                          A resposta da API aparecerá aqui após a execução
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          Clique em "Executar API" para testar a requisição
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botão Execute API */}
                <Button
                  onClick={handleExecuteAPI}
                  className="w-full woopi-ai-button-primary h-12 text-base"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Executar API
                </Button>
              </div>
            </div>
              </>
            ) : (
              // Renderizar campos para outras ferramentas
              <div className="max-w-3xl mx-auto">
                {renderConfigPanel()}
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-[#1a1b2e] border-t dark:border-[#393e5c] flex gap-4">
            <Button
              variant="outline"
              onClick={() => setIsConfigPanelOpen(false)}
              className="flex-1 h-12 text-base"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfigSave}
              className="flex-1 woopi-ai-button-primary h-12 text-base"
            >
              <Save className="w-5 h-5 mr-2" />
              Salvar Configuração
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function DocumentAutomationPage() {
  const { stageId } = useParams<{ stageId: string }>();
  const navigate = useNavigate();
  
  if (!stageId) {
    return <div>Erro: ID da etapa não encontrado</div>;
  }
  
  return (
    <ReactFlowProvider>
      <DocumentAutomationFlow stageId={stageId} navigate={navigate} />
    </ReactFlowProvider>
  );
}