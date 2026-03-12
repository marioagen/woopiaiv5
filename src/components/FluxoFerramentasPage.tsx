import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Square, 
  Circle, 
  Diamond,
  Zap,
  FileText,
  Settings,
  Database,
  MessageSquare
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  BackgroundVariant
} from 'reactflow';

import 'reactflow/dist/style.css';

// Custom Node Components
const ToolNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const getToolIcon = (toolType: string) => {
    switch (toolType) {
      case 'analyzer':
        return <FileText className="w-4 h-4" />;
      case 'automation':
        return <Zap className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className={`
      px-4 py-3 shadow-lg rounded-lg bg-white border-2 min-w-[200px]
      ${selected ? 'border-woopi-ai-blue' : 'border-woopi-ai-border'}
    `}>
      <div className="flex items-center gap-2 mb-2">
        <div className="text-woopi-ai-blue">
          {getToolIcon(data.toolType)}
        </div>
        <div className="font-medium text-sm text-woopi-ai-dark-gray">
          {data.label}
        </div>
      </div>
      <div className="text-xs text-woopi-ai-gray">
        {data.description}
      </div>
    </div>
  );
};

const StartNode = ({ data, selected }: { data: any; selected: boolean }) => {
  return (
    <div className={`
      px-4 py-3 shadow-lg rounded-full bg-green-500 border-2 min-w-[120px] text-center
      ${selected ? 'border-green-700' : 'border-green-400'}
    `}>
      <div className="flex items-center justify-center gap-2">
        <Play className="w-4 h-4 text-white" />
        <div className="font-medium text-sm text-white">
          {data.label || 'Início'}
        </div>
      </div>
    </div>
  );
};

const EndNode = ({ data, selected }: { data: any; selected: boolean }) => {
  return (
    <div className={`
      px-4 py-3 shadow-lg rounded-full bg-red-500 border-2 min-w-[120px] text-center
      ${selected ? 'border-red-700' : 'border-red-400'}
    `}>
      <div className="flex items-center justify-center gap-2">
        <Square className="w-4 h-4 text-white" />
        <div className="font-medium text-sm text-white">
          {data.label || 'Fim'}
        </div>
      </div>
    </div>
  );
};

const DecisionNode = ({ data, selected }: { data: any; selected: boolean }) => {
  return (
    <div className={`
      w-32 h-32 shadow-lg bg-yellow-400 border-2 transform rotate-45 flex items-center justify-center
      ${selected ? 'border-yellow-600' : 'border-yellow-300'}
    `}>
      <div className="transform -rotate-45 text-center">
        <Diamond className="w-4 h-4 text-white mx-auto mb-1" />
        <div className="font-medium text-xs text-white">
          {data.label || 'Decisão'}
        </div>
      </div>
    </div>
  );
};

// Node types definition
const nodeTypes: NodeTypes = {
  tool: ToolNode,
  start: StartNode,
  end: EndNode,
  decision: DecisionNode,
};

// Initial nodes
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'start',
    position: { x: 100, y: 100 },
    data: { label: 'Início do Fluxo' },
  },
  {
    id: '2',
    type: 'tool',
    position: { x: 300, y: 100 },
    data: { 
      label: 'Analisador de Documento',
      description: 'Extrai dados do documento',
      toolType: 'analyzer'
    },
  },
  {
    id: '3',
    type: 'decision',
    position: { x: 500, y: 100 },
    data: { label: 'Aprovado?' },
  },
  {
    id: '4',
    type: 'tool',
    position: { x: 700, y: 50 },
    data: { 
      label: 'Automação de Email',
      description: 'Envia notificação de aprovação',
      toolType: 'automation'
    },
  },
  {
    id: '5',
    type: 'tool',
    position: { x: 700, y: 200 },
    data: { 
      label: 'Banco de Dados',
      description: 'Salva dados para revisão',
      toolType: 'database'
    },
  },
  {
    id: '6',
    type: 'end',
    position: { x: 900, y: 100 },
    data: { label: 'Fim' },
  },
];

// Initial edges
const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'smoothstep',
    label: 'Sim',
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    type: 'smoothstep',
    label: 'Não',
  },
  {
    id: 'e4-6',
    source: '4',
    target: '6',
    type: 'smoothstep',
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'smoothstep',
  },
];

export function FluxoFerramentasPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Get workflow stage info from navigation state
  const stageInfo = location.state as { stageName?: string; stageId?: string } | null;

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSave = () => {
    toast.success('Fluxo de ferramentas salvo com sucesso!');
    navigate(-1); // Go back to previous page
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const addNewToolNode = (toolType: string) => {
    const newId = (nodes.length + 1).toString();
    const newNode: Node = {
      id: newId,
      type: 'tool',
      position: { x: Math.random() * 400 + 200, y: Math.random() * 300 + 200 },
      data: {
        label: getToolLabel(toolType),
        description: getToolDescription(toolType),
        toolType: toolType
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const getToolLabel = (toolType: string) => {
    switch (toolType) {
      case 'analyzer': return 'Analisador';
      case 'automation': return 'Automação';
      case 'database': return 'Banco de Dados';
      case 'chat': return 'Chat/IA';
      default: return 'Nova Ferramenta';
    }
  };

  const getToolDescription = (toolType: string) => {
    switch (toolType) {
      case 'analyzer': return 'Analisa e extrai dados';
      case 'automation': return 'Executa ações automáticas';
      case 'database': return 'Operações de dados';
      case 'chat': return 'Interação com IA';
      default: return 'Descrição da ferramenta';
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-white border-b border-woopi-ai-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="woopi-ai-text-primary">
            Fluxo de Ferramentas
            {stageInfo?.stageName && (
              <span className="text-woopi-ai-gray"> - {stageInfo.stageName}</span>
            )}
          </h1>
          <p className="woopi-ai-text-secondary">
            Configure o fluxo de ferramentas para automatizar processos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleBack}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            className="woopi-ai-button-primary"
          >
            <Save className="w-4 h-4 mr-2" />
            Incluir
          </Button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Toolbar */}
        <div className="w-64 p-4 bg-gray-50 border-r border-woopi-ai-border">
          <h3 className="font-medium text-woopi-ai-dark-gray mb-4">
            Ferramentas Disponíveis
          </h3>
          <div className="space-y-2">
            <Card 
              className="cursor-pointer hover:bg-woopi-ai-light-blue transition-colors"
              onClick={() => addNewToolNode('analyzer')}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-woopi-ai-blue" />
                  <div className="text-sm font-medium">Analisador</div>
                </div>
                <div className="text-xs text-woopi-ai-gray mt-1">
                  Extrai e analisa dados de documentos
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:bg-woopi-ai-light-blue transition-colors"
              onClick={() => addNewToolNode('automation')}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-woopi-ai-blue" />
                  <div className="text-sm font-medium">Automação</div>
                </div>
                <div className="text-xs text-woopi-ai-gray mt-1">
                  Executa ações automáticas
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:bg-woopi-ai-light-blue transition-colors"
              onClick={() => addNewToolNode('database')}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-woopi-ai-blue" />
                  <div className="text-sm font-medium">Banco de Dados</div>
                </div>
                <div className="text-xs text-woopi-ai-gray mt-1">
                  Operações de dados e armazenamento
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:bg-woopi-ai-light-blue transition-colors"
              onClick={() => addNewToolNode('chat')}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-woopi-ai-blue" />
                  <div className="text-sm font-medium">Chat/IA</div>
                </div>
                <div className="text-xs text-woopi-ai-gray mt-1">
                  Interação com inteligência artificial
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
          >
            <Background variant={BackgroundVariant.Dots} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}