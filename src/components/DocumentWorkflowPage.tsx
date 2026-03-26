import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Workflow, Clock, FileText, Calendar, ChevronRight, User, UserCheck, Plus, Search, ArrowUpDown, ChevronDown, FileSearch, Eye, EyeOff, Check, Undo, AlertTriangle, List, LayoutGrid, Files, Filter, File, RefreshCw, XCircle, Edit } from 'lucide-react';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { DocumentListTab } from './DocumentListTab';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { SearchableSelect } from './ui/searchable-select';

// Mock data for teams and their workflows
const initialTeamWorkflows = {
  'financeiro': {
    id: 'financeiro',
    name: 'Time Financeiro',
    workflowName: 'Processamento de Notas Fiscais',
    stages: [
      { id: 'recebimento', name: 'Recebimento', color: 'bg-blue-100 dark:bg-blue-900/30' },
      { id: 'verificacao', name: 'Verificação Financeira', color: 'bg-blue-100 dark:bg-blue-900/30' },
      { id: 'aprovacao', name: 'Aprovação de Pagamento', color: 'bg-blue-100 dark:bg-blue-900/30' },
      { id: 'pagos', name: 'Pagos e Conciliados', color: 'bg-green-100 dark:bg-green-900/30' }
    ],
    documents: {
      'recebimento': [
        {
          id: '#8021',
          name: 'Nota Fiscal #8021',
          description: 'Nota fiscal de serviços gerais para manutenção predial',
          uploadDate: '2024-12-15',
          status: 'Aguardando análise',
          solicitante: 'Carlos Silva',
          responsavel: 'Ana Costa'
        },
        {
          id: '#8022',
          name: 'Nota Fiscal #8022',
          description: 'Compra de material de limpeza e higiene',
          uploadDate: '2024-12-15',
          status: 'Aguardando análise',
          solicitante: 'Paula Mendes',
          responsavel: 'Ana Costa'
        },
        {
          id: '#8023',
          name: 'Nota Fiscal #8023',
          description: 'Serviços de consultoria em TI',
          uploadDate: '2024-12-14',
          status: 'Aguardando análise',
          solicitante: 'Ricardo Santos',
          responsavel: 'Ana Costa'
        },
        {
          id: '#8024',
          name: 'Nota Fiscal #8024',
          description: 'Aquisição de licenças de software',
          uploadDate: '2024-12-14',
          status: 'Aguardando análise',
          solicitante: 'Fernando Lima',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#8025',
          name: 'Nota Fiscal #8025',
          description: 'Manutenção de equipamentos de ar condicionado',
          uploadDate: '2024-12-14',
          status: 'Aguardando análise',
          solicitante: 'Juliana Costa',
          responsavel: 'Ana Costa'
        },
        {
          id: '#8026',
          name: 'Nota Fiscal #8026',
          description: 'Serviços de impressão gráfica para marketing',
          uploadDate: '2024-12-13',
          status: 'Aguardando análise',
          solicitante: 'Marcos Ferreira',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#8027',
          name: 'Nota Fiscal #8027',
          description: 'Fornecimento de água mineral e café',
          uploadDate: '2024-12-13',
          status: 'Aguardando análise',
          solicitante: 'Beatriz Alves',
          responsavel: 'Ana Costa'
        },
        {
          id: '#8028',
          name: 'Nota Fiscal #8028',
          description: 'Aluguel de equipamentos audiovisuais',
          uploadDate: '2024-12-13',
          status: 'Aguardando análise',
          solicitante: 'Lucas Rodrigues',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#8029',
          name: 'Nota Fiscal #8029',
          description: 'Serviços de segurança patrimonial',
          uploadDate: '2024-12-12',
          status: 'Aguardando análise',
          solicitante: 'Amanda Silva',
          responsavel: 'Ana Costa'
        },
        {
          id: '#8030',
          name: 'Nota Fiscal #8030',
          description: 'Manutenção preventiva de elevadores',
          uploadDate: '2024-12-12',
          status: 'Aguardando análise',
          solicitante: 'Gabriel Nunes',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#8031',
          name: 'Nota Fiscal #8031',
          description: 'Fornecimento de material de escritório',
          uploadDate: '2024-12-12',
          status: 'Aguardando análise',
          solicitante: 'Camila Santos',
          responsavel: 'Ana Costa'
        },
        {
          id: '#8032',
          name: 'Nota Fiscal #8032',
          description: 'Serviços de jardinagem e paisagismo',
          uploadDate: '2024-12-11',
          status: 'Aguardando análise',
          solicitante: 'Rodrigo Oliveira',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#8033',
          name: 'Nota Fiscal #8033',
          description: 'Aquisição de mobiliário de escritório',
          uploadDate: '2024-12-11',
          status: 'Aguardando análise',
          solicitante: 'Patrícia Costa',
          responsavel: 'Ana Costa'
        },
        {
          id: '#8034',
          name: 'Nota Fiscal #8034',
          description: 'Despesas com transporte corporativo',
          uploadDate: '2024-12-11',
          status: 'Aguardando análise',
          solicitante: 'Thiago Martins',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#8035',
          name: 'Nota Fiscal #8035',
          description: 'Serviços de treinamento corporativo',
          uploadDate: '2024-12-10',
          status: 'Aguardando análise',
          solicitante: 'Larissa Ribeiro',
          responsavel: 'Ana Costa'
        }
      ],
      'verificacao': [
        {
          id: '#5673',
          name: 'Nota Fiscal #5673',
          description: 'Aquisição de equipamentos de informática',
          uploadDate: '2024-12-14',
          status: 'Analisado',
          solicitante: 'Roberto Lima',
          responsavel: 'Ana Costa'
        },
        {
          id: '#5674',
          name: 'Nota Fiscal #5674',
          description: 'Contratação de serviços de telefonia',
          uploadDate: '2024-12-13',
          status: 'Analisado',
          solicitante: 'Marina Pereira',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#5675',
          name: 'Nota Fiscal #5675',
          description: 'Assinatura de plataforma SaaS',
          uploadDate: '2024-12-13',
          status: 'Analisado',
          solicitante: 'André Souza',
          responsavel: 'Ana Costa'
        },
        {
          id: '#5676',
          name: 'Nota Fiscal #5676',
          description: 'Serviços de auditoria contábil',
          uploadDate: '2024-12-12',
          status: 'Analisado',
          solicitante: 'Vanessa Torres',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#5677',
          name: 'Nota Fiscal #5677',
          description: 'Reforma das instalações elétricas',
          uploadDate: '2024-12-12',
          status: 'Analisado',
          solicitante: 'Bruno Campos',
          responsavel: 'Ana Costa'
        },
        {
          id: '#5678',
          name: 'Nota Fiscal #5678',
          description: 'Compra de equipamentos de segurança',
          uploadDate: '2024-12-11',
          status: 'Analisado',
          solicitante: 'Daniela Rocha',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#5679',
          name: 'Nota Fiscal #5679',
          description: 'Serviços de marketing digital',
          uploadDate: '2024-12-11',
          status: 'Analisado',
          solicitante: 'Eduardo Barros',
          responsavel: 'Ana Costa'
        },
        {
          id: '#5680',
          name: 'Nota Fiscal #5680',
          description: 'Aquisição de veículos corporativos',
          uploadDate: '2024-12-10',
          status: 'Analisado',
          solicitante: 'Fernanda Gomes',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#5681',
          name: 'Nota Fiscal #5681',
          description: 'Serviços de cloud computing',
          uploadDate: '2024-12-10',
          status: 'Analisado',
          solicitante: 'Gustavo Pinto',
          responsavel: 'Ana Costa'
        },
        {
          id: '#5682',
          name: 'Nota Fiscal #5682',
          description: 'Consultoria em gestão de projetos',
          uploadDate: '2024-12-09',
          status: 'Analisado',
          solicitante: 'Helena Dias',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#5683',
          name: 'Nota Fiscal #5683',
          description: 'Aquisição de equipamentos médicos',
          uploadDate: '2024-12-09',
          status: 'Analisado',
          solicitante: 'Igor Moreira',
          responsavel: 'Ana Costa'
        },
        {
          id: '#5684',
          name: 'Nota Fiscal #5684',
          description: 'Serviços de desenvolvimento de software',
          uploadDate: '2024-12-08',
          status: 'Analisado',
          solicitante: 'Jéssica Lopes',
          responsavel: 'Pedro Oliveira'
        }
      ],
      'aprovacao': [
        {
          id: '#3209',
          name: 'Nota Fiscal #3209',
          description: 'Compra de materiais de escritório e suprimentos',
          uploadDate: '2024-12-13',
          status: 'Esperando aprovação',
          solicitante: 'Mariana Santos',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#3210',
          name: 'Nota Fiscal #3210',
          description: 'Contratação de serviços de catering',
          uploadDate: '2024-12-12',
          status: 'Esperando aprovação',
          solicitante: 'Leonardo Silva',
          responsavel: 'Ana Costa'
        },
        {
          id: '#3211',
          name: 'Nota Fiscal #3211',
          description: 'Renovação de certificados digitais',
          uploadDate: '2024-12-11',
          status: 'Esperando aprovação',
          solicitante: 'Melissa Cardoso',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#3212',
          name: 'Nota Fiscal #3212',
          description: 'Serviços de limpeza especializada',
          uploadDate: '2024-12-10',
          status: 'Esperando aprovação',
          solicitante: 'Nicolas Freitas',
          responsavel: 'Ana Costa'
        },
        {
          id: '#3213',
          name: 'Nota Fiscal #3213',
          description: 'Compra de EPIs para equipe',
          uploadDate: '2024-12-09',
          status: 'Esperando aprovação',
          solicitante: 'Olivia Monteiro',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#3214',
          name: 'Nota Fiscal #3214',
          description: 'Assinatura de jornal empresarial',
          uploadDate: '2024-12-08',
          status: 'Esperando aprovação',
          solicitante: 'Paulo Araújo',
          responsavel: 'Ana Costa'
        },
        {
          id: '#3215',
          name: 'Nota Fiscal #3215',
          description: 'Serviços de tradução de documentos',
          uploadDate: '2024-12-07',
          status: 'Esperando aprovação',
          solicitante: 'Queila Barbosa',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#3216',
          name: 'Nota Fiscal #3216',
          description: 'Manutenção de sistema de alarme',
          uploadDate: '2024-12-06',
          status: 'Esperando aprovação',
          solicitante: 'Rafael Teixeira',
          responsavel: 'Ana Costa'
        },
        {
          id: '#3217',
          name: 'Nota Fiscal #3217',
          description: 'Compra de uniformes corporativos',
          uploadDate: '2024-12-05',
          status: 'Esperando aprovação',
          solicitante: 'Sofia Carvalho',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#3218',
          name: 'Nota Fiscal #3218',
          description: 'Serviços de advocacia empresarial',
          uploadDate: '2024-12-04',
          status: 'Esperando aprovação',
          solicitante: 'Tiago Rezende',
          responsavel: 'Ana Costa'
        },
        {
          id: '#3219',
          name: 'Nota Fiscal #3219',
          description: 'Aquisição de extintores de incêndio',
          uploadDate: '2024-12-03',
          status: 'Esperando aprovação',
          solicitante: 'Ursula Farias',
          responsavel: 'Pedro Oliveira'
        }
      ],
      'pagos': [
        {
          id: '#2345',
          name: 'Boleto #2345',
          description: 'Pagamento de consultoria em gestão empresarial',
          uploadDate: '2024-12-10',
          status: 'Concluído',
          solicitante: 'João Ferreira',
          responsavel: 'Ana Costa'
        },
        {
          id: '#2346',
          name: 'Boleto #2346',
          description: 'Pagamento de aluguel de espaço comercial',
          uploadDate: '2024-12-09',
          status: 'Concluído',
          solicitante: 'Viviane Duarte',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#2347',
          name: 'Boleto #2347',
          description: 'Pagamento de energia elétrica',
          uploadDate: '2024-12-08',
          status: 'Concluído',
          solicitante: 'Wagner Souza',
          responsavel: 'Ana Costa'
        },
        {
          id: '#2348',
          name: 'Boleto #2348',
          description: 'Pagamento de fornecedor de matéria-prima',
          uploadDate: '2024-12-07',
          status: 'Concluído',
          solicitante: 'Xuxa Meneghel',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#2349',
          name: 'Boleto #2349',
          description: 'Pagamento de internet corporativa',
          uploadDate: '2024-12-06',
          status: 'Concluído',
          solicitante: 'Yara Cunha',
          responsavel: 'Ana Costa'
        },
        {
          id: '#2350',
          name: 'Boleto #2350',
          description: 'Pagamento de impostos municipais',
          uploadDate: '2024-12-05',
          status: 'Concluído',
          solicitante: 'Zélia Ramos',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#2351',
          name: 'Boleto #2351',
          description: 'Pagamento de folha de pagamento',
          uploadDate: '2024-12-04',
          status: 'Concluído',
          solicitante: 'Alberto Mendes',
          responsavel: 'Ana Costa'
        },
        {
          id: '#2352',
          name: 'Boleto #2352',
          description: 'Pagamento de seguro empresarial',
          uploadDate: '2024-12-03',
          status: 'Concluído',
          solicitante: 'Bianca Moura',
          responsavel: 'Pedro Oliveira'
        },
        {
          id: '#2353',
          name: 'Boleto #2353',
          description: 'Pagamento de IPTU',
          uploadDate: '2024-12-02',
          status: 'Concluído',
          solicitante: 'Caio Andrade',
          responsavel: 'Ana Costa'
        },
        {
          id: '#2354',
          name: 'Boleto #2354',
          description: 'Pagamento de condomínio',
          uploadDate: '2024-12-01',
          status: 'Concluído',
          solicitante: 'Diana Leal',
          responsavel: 'Pedro Oliveira'
        }
      ]
    }
  },
  'rh': {
    id: 'rh',
    name: 'Time RH',
    workflowName: 'Gestão de Documentos RH',
    stages: [
      { id: 'triagem', name: 'Triagem Inicial', color: 'bg-blue-100 dark:bg-blue-900/30' },
      { id: 'validacao', name: 'Validação Documentos', color: 'bg-blue-100 dark:bg-blue-900/30' },
      { id: 'aprovacao-gestor', name: 'Aprovação Gestor', color: 'bg-blue-100 dark:bg-blue-900/30' },
      { id: 'processados', name: 'Processados', color: 'bg-green-100 dark:bg-green-900/30' }
    ],
    documents: {
      'triagem': [
        {
          id: '#HR001',
          name: 'Contrato João Silva',
          description: 'Contrato de trabalho CLT para desenvolvedor sênior',
          uploadDate: '2024-12-15',
          status: 'Aguardando análise',
          solicitante: 'Fernanda Alves',
          responsavel: 'Lucas Mendes'
        }
      ],
      'validacao': [
        {
          id: '#HR002',
          name: 'Alteração Salarial',
          description: 'Solicitação de reajuste salarial - Maria Santos',
          uploadDate: '2024-12-14',
          status: 'Analisado',
          solicitante: 'Maria Santos',
          responsavel: 'Ricardo Torres'
        }
      ],
      'aprovacao-gestor': [
        {
          id: '#HR003',
          name: 'Férias Programadas',
          description: 'Programação de férias do colaborador Pedro Costa',
          uploadDate: '2024-12-12',
          status: 'Esperando aprovação',
          solicitante: 'Pedro Costa',
          responsavel: 'Lucas Mendes'
        }
      ],
      'processados': [
        {
          id: '#HR004',
          name: 'Rescisão Contrato',
          description: 'Processo de rescisão amigável - Ana Oliveira',
          uploadDate: '2024-12-08',
          status: 'Aprovado',
          solicitante: 'Ana Oliveira',
          responsavel: 'Ricardo Torres'
        }
      ]
    }
  },
  'juridico': {
    id: 'juridico',
    name: 'Time Jurídico',
    workflowName: 'Análise Jurídica de Contratos',
    stages: [
      { id: 'protocolo', name: 'Protocolo', color: 'bg-blue-100 dark:bg-blue-900/30' },
      { id: 'analise-juridica', name: 'Análise Jurídica', color: 'bg-blue-100 dark:bg-blue-900/30' },
      { id: 'parecer', name: 'Elaboração Parecer', color: 'bg-blue-100 dark:bg-blue-900/30' },
      { id: 'aprovado', name: 'Aprovado', color: 'bg-green-100 dark:bg-green-900/30' }
    ],
    documents: {
      'protocolo': [
        {
          id: '#JUR001',
          name: 'Contrato Fornecedor',
          description: 'Contrato de prestação de serviços TechCorp Ltda',
          uploadDate: '2024-12-15',
          status: 'Aguardando análise',
          solicitante: 'Carla Ribeiro',
          responsavel: 'Eduardo Martins'
        }
      ],
      'analise-juridica': [
        {
          id: '#JUR002',
          name: 'Ação Trabalhista',
          description: 'Defesa em ação movida por ex-funcionário',
          uploadDate: '2024-12-11',
          status: 'Analisado',
          solicitante: 'Marcos Rodrigues',
          responsavel: 'Juliana Pereira'
        }
      ],
      'parecer': [
        {
          id: '#JUR003',
          name: 'Acordo Societário',
          description: 'Análise de acordo com novo sócio investidor',
          uploadDate: '2024-12-09',
          status: 'Esperando aprovação',
          solicitante: 'Beatriz Campos',
          responsavel: 'Eduardo Martins'
        }
      ],
      'aprovado': [
        {
          id: '#JUR004',
          name: 'Licença Ambiental',
          description: 'Renovação de licença junto ao órgão regulador',
          uploadDate: '2024-12-05',
          status: 'Concluído',
          solicitante: 'Gabriel Nunes',
          responsavel: 'Juliana Pereira'
        }
      ]
    }
  },
  'ti': {
    id: 'ti',
    name: 'Time de TI',
    workflowName: 'Suporte Técnico Nível 2',
    stages: [],
    documents: {}
  },
  'compras': {
    id: 'compras',
    name: 'Time de Compras',
    workflowName: 'Aprovação de Fornecedores',
    stages: [],
    documents: {}
  },
  'vendas': {
    id: 'vendas',
    name: 'Time de Vendas',
    workflowName: 'Propostas Comerciais',
    stages: [],
    documents: {}
  },
  'marketing': {
    id: 'marketing',
    name: 'Time de Marketing',
    workflowName: 'Aprovação de Campanhas',
    stages: [],
    documents: {}
  },
  'operacoes': {
    id: 'operacoes',
    name: 'Time de Operações',
    workflowName: 'Gestão de Frotas',
    stages: [],
    documents: {}
  },
  'suporte': {
    id: 'suporte',
    name: 'Time de Suporte',
    workflowName: 'Atendimento ao Cliente',
    stages: [],
    documents: {}
  },
  'logistica': {
    id: 'logistica',
    name: 'Time de Logística',
    workflowName: 'Controle de Estoque',
    stages: [],
    documents: {}
  }
};

interface DocumentCard {
  id: string;
  name: string;
  description: string;
  uploadDate: string;
  status: string;
  solicitante: string;
  responsavel: string;
  isFinalized?: boolean;
}

interface Stage {
  id: string;
  name: string;
  color: string;
}

interface WorkflowData {
  id: string;
  name: string;
  workflowName: string;
  stages: Stage[];
  documents: Record<string, DocumentCard[]>;
}

export function DocumentWorkflowPage() {
  const navigate = useNavigate();
  const [teamWorkflows, setTeamWorkflows] = useState(initialTeamWorkflows);
  const [selectedTeam, setSelectedTeam] = useState('financeiro');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderDocumentsBy, setOrderDocumentsBy] = useState<'recent' | 'oldest'>('recent');
  
  // State to track visible items per column (stageId -> number of visible items)
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  
  // State to control if last column items are hidden
  const [lastColumnHidden, setLastColumnHidden] = useState(false);
  
  // State to control visibility of finalized items
  const [showFinalizedItems, setShowFinalizedItems] = useState(false);
  
  // State for finalize confirmation modal
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [documentToFinalize, setDocumentToFinalize] = useState<{ id: string; stageId: string } | null>(null);
  
  // State for tabs
  const [activeTab, setActiveTab] = useState<'board' | 'list'>('board');
  
  // State for batch document filter in Kanban
  const [kanbanBatchFilter, setKanbanBatchFilter] = useState<'all' | 'batch' | 'single'>('all');

  // State for demo processing/failure cards
  const [demoCardReprocessing, setDemoCardReprocessing] = useState(false);
  
  const currentWorkflow = teamWorkflows[selectedTeam as keyof typeof teamWorkflows];
  
  const INITIAL_VISIBLE_COUNT = 10;

  const handleTeamChange = (teamId: string) => {
    setSelectedTeam(teamId);
    // Reset visible counts when changing teams
    setVisibleCounts({});
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Filter documents based on search term
  const filterDocuments = (documents: DocumentCard[]) => {
    if (!searchTerm.trim()) return documents;
    
    const searchTermLower = searchTerm.toLowerCase();
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(searchTermLower) ||
      doc.description.toLowerCase().includes(searchTermLower) ||
      doc.solicitante.toLowerCase().includes(searchTermLower)
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aguardando análise':
        return 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300';
      case 'Analisado':
        return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300';
      case 'Esperando aprovação':
        return 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300';
      case 'Aprovado':
        return 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300';
      case 'Finalizado':
        return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300';
    }
  };

  const getNextStage = (currentStageId: string) => {
    const stages = currentWorkflow.stages;
    const currentIndex = stages.findIndex(stage => stage.id === currentStageId);
    if (currentIndex < stages.length - 1) {
      return stages[currentIndex + 1];
    }
    return null;
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Aguardando análise':
        return 'Analisado';
      case 'Analisado':
        return 'Esperando aprovação';
      case 'Esperando aprovação':
        return 'Aprovado';
      case 'Aprovado':
        return 'Finalizado';
      default:
        return currentStatus;
    }
  };

  const handleAnalyzeDocument = (documentId: string) => {
    // Show loading toast
    toast.loading('Iniciando análise do documento...', {
      duration: 2000,
    });
    
    // Navigate to analysis page after short delay, with workflow origin parameter
    setTimeout(() => {
      navigate(`/documentos/${documentId.replace('#', '')}/analisar?from=workflow`);
    }, 2000);
  };

  const handleAdvanceDocument = (documentId: string, currentStageId: string) => {
    const nextStage = getNextStage(currentStageId);
    
    if (!nextStage) {
      toast.error('Documento já está na última etapa');
      return;
    }

    setTeamWorkflows(prev => {
      const newWorkflows = { ...prev };
      const currentTeamWorkflow = newWorkflows[selectedTeam as keyof typeof newWorkflows];
      
      // Encontrar o documento na etapa atual
      const documentIndex = currentTeamWorkflow.documents[currentStageId].findIndex(
        doc => doc.id === documentId
      );
      
      if (documentIndex === -1) return prev;
      
      // Remover documento da etapa atual
      const document = currentTeamWorkflow.documents[currentStageId][documentIndex];
      currentTeamWorkflow.documents[currentStageId].splice(documentIndex, 1);
      
      // Atualizar status do documento
      const updatedDocument = {
        ...document,
        status: getNextStatus(document.status)
      };
      
      // Adicionar documento à próxima etapa
      if (!currentTeamWorkflow.documents[nextStage.id]) {
        currentTeamWorkflow.documents[nextStage.id] = [];
      }
      currentTeamWorkflow.documents[nextStage.id].push(updatedDocument);
      
      return newWorkflows;
    });

    toast.success(`Documento ${documentId} avançou para ${nextStage.name}`);
  };

  const handleFinalizeDocument = (documentId: string, stageId: string) => {
    setTeamWorkflows(prev => {
      const newWorkflows = { ...prev };
      const currentTeamWorkflow = newWorkflows[selectedTeam as keyof typeof newWorkflows];
      
      // Remover o documento da etapa (não mostra mais no board)
      currentTeamWorkflow.documents[stageId] = currentTeamWorkflow.documents[stageId].filter(
        doc => doc.id !== documentId
      );
      
      return newWorkflows;
    });

    toast.success(`Documento ${documentId} foi finalizado com sucesso`);
  };

  const handleUnfinalizeDocument = (documentId: string, stageId: string) => {
    setTeamWorkflows(prev => {
      const newWorkflows = { ...prev };
      const currentTeamWorkflow = newWorkflows[selectedTeam as keyof typeof newWorkflows];
      
      // Encontrar o documento na etapa atual
      const documentIndex = currentTeamWorkflow.documents[stageId].findIndex(
        doc => doc.id === documentId
      );
      
      if (documentIndex === -1) return prev;
      
      // Desmarcar documento como finalizado
      currentTeamWorkflow.documents[stageId][documentIndex].isFinalized = false;
      
      return newWorkflows;
    });

    toast.success(`Finalização do documento ${documentId} foi desfeita`);
  };

  // Helper function to determine if a document is a batch document
  // This matches the logic used in DocumentCard component
  const isBatchDoc = (doc: DocumentCard, stageId: string, indexInStage: number) => {
    return stageId === 'recebimento' && indexInStage < 2;
  };

  // ── Demo card: estado Processando ────────────────────────────────────────
  const ProcessingDemoCard = () => (
    <Card className="mb-2 rounded-lg border border-blue-200 dark:border-blue-800/50 bg-card overflow-hidden gap-0 relative">
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Título */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm leading-tight text-foreground">Nota Fiscal #9087</h4>
          </div>

          {/* Conteúdo com spinner sobreposto */}
          <div className="relative">
            <div className="opacity-40">
              <div className="flex items-start gap-2">
                <FileText className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-snug">
                  Extraindo informações e validando regras de negócio do workflow...
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground">
                  Carregado em: <span className="text-foreground font-medium">20/02/2026</span>
                </span>
              </div>
            </div>
            {/* Spinner centralizado */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg
                className="w-9 h-9 animate-spin text-[#0073ea]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-border my-1.5" />

          {/* Solicitante */}
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground">
              Solicitante: <span className="text-foreground font-medium">Sistema Woopi</span>
            </span>
          </div>

          {/* Barra de progresso */}
          <div className="pt-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#0073ea] font-medium">Processando Validação de Notas Fiscais</span>
              <span className="text-xs text-[#0073ea] font-semibold">80%</span>
            </div>
            <div className="w-full h-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
              <div className="h-full bg-[#0073ea] rounded-full" style={{ width: '80%' }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // ── Demo card: estado Falha ───────────────────────────────────────────────
  const FailureDemoCard = () => (
    <Card className="mb-2 rounded-lg border border-border bg-card overflow-hidden gap-0">
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Título + Badge FALHA */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm leading-tight text-foreground">Nota Fiscal #9087</h4>
            <Badge className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 text-[11px] px-2 py-0.5 whitespace-nowrap leading-tight border border-red-200 dark:border-red-700/50">
              FALHA
            </Badge>
          </div>

          {/* Descrição */}
          <div className="flex items-start gap-2">
            <FileText className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-snug">
              Extraindo informações e validando regras de negócio do workflow...
            </p>
          </div>

          {/* Data */}
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground">
              Carregado em: <span className="text-foreground font-medium">20/02/2026</span>
            </span>
          </div>

          {/* Separador */}
          <div className="border-t border-border my-1.5" />

          {/* Solicitante */}
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground">
              Solicitante: <span className="text-foreground font-medium">Jhonny</span>
            </span>
          </div>

          {/* Rodapé: mensagem de falha + botão Reprocessar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span className="text-xs text-red-600 dark:text-red-400 font-semibold uppercase tracking-wide">
                Falha ao processar
              </span>
            </div>
            <Button
              onClick={() => setDemoCardReprocessing(true)}
              className="bg-[#0073ea] hover:bg-[#005bbd] text-white text-xs font-medium px-3 py-1.5 h-auto rounded-md flex items-center gap-1.5 flex-shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reprocessar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DocumentCard = ({ document, stageId, index }: { document: DocumentCard; stageId: string; index: number }) => {
    const nextStage = getNextStage(stageId);
    const isLastStage = !nextStage;
    const isFirstStage = currentWorkflow.stages[0].id === stageId;
    const isFinalized = document.isFinalized || false;
    
    // Verificar se é documento em lote (primeiros dois docs da coluna recebimento)
    const isBatchDocument = isBatchDoc(document, stageId, index);

    return (
      <Card className={`mb-2 rounded-lg hover:shadow-lg transition-shadow overflow-hidden gap-0 ${
        isFinalized 
          ? 'opacity-60 bg-muted border-2 border-green-600' 
          : isBatchDocument
            ? 'bg-card border-[1.5px] border-blue-400/80'
            : 'bg-card border border-border'
      }`}>
        {isBatchDocument && (
          <div className="h-[3px] bg-blue-400/70"></div>
        )}
        <CardContent className="p-3">
          <div className="space-y-2">
            {/* Título e Badge de Status */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {isBatchDocument && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Files className="w-4 h-4 text-woopi-ai-blue flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>documentos em lote</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <h4 className={`font-semibold text-sm leading-tight ${isFinalized ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {document.name}
                </h4>
              </div>
              <div className="flex flex-col items-end gap-1">
                {/* Se finalizado, mostra apenas badge "Finalizado". Senão, mostra badge de status */}
                {isFinalized ? (
                  <Badge 
                    className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 text-[11px] px-2 py-0.5 whitespace-nowrap leading-tight"
                  >
                    Finalizado
                  </Badge>
                ) : (
                  <Badge 
                    className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-[11px] px-2 py-0.5 whitespace-nowrap leading-tight"
                  >
                    {isLastStage && document.status === 'Concluído' ? 'Finalizado' : document.status}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Descrição com ícone */}
            <div className="flex items-start gap-2">
              <FileText className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                {document.description}
              </p>
            </div>
            
            {/* Data de carregamento */}
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground">
                Carregado em: <span className="text-foreground font-medium">{formatDate(document.uploadDate)}</span>
              </span>
            </div>
            
            {/* Separador */}
            <div className="border-t border-border my-1.5"></div>
            
            {/* Solicitante */}
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground">
                Solicitante: <span className="text-foreground font-medium">{document.solicitante}</span>
              </span>
            </div>
            
            {/* Responsável */}
            <div className="flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground">
                Responsável: <span className="text-foreground font-medium">{document.responsavel}</span>
              </span>
            </div>
            
            {/* Botões de Ação */}
            {!isFinalized && (
              <div className="flex items-center gap-1.5 pt-0.5">
                {/* Botão Analisar (sempre visível) */}
                <Button
                  onClick={() => handleAnalyzeDocument(document.id)}
                  className="flex-1 bg-[#0073ea] hover:bg-[#0073ea]/90 text-white text-xs font-medium px-3 py-1.5 h-auto rounded-md"
                >
                  <FileSearch className="w-3.5 h-3.5 mr-1.5" />
                  Analisar
                </Button>
                
                {/* Botão Avançar (não exibir na última coluna) */}
                {!isLastStage && (
                  <Button
                    onClick={() => handleAdvanceDocument(document.id, stageId)}
                    variant="outline"
                    className="flex-1 border-2 border-[#0073ea] text-[#0073ea] hover:bg-blue-50 dark:border-blue-400/60 dark:text-blue-400 dark:hover:bg-blue-900/20 text-xs font-medium px-3 py-1.5 h-auto rounded-md"
                  >
                    Avançar
                    <ChevronRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                )}
                
                {/* Botão Finalizar (apenas na última coluna) */}
                {isLastStage && (
                  <Button
                    onClick={() => {
                      setDocumentToFinalize({ id: document.id, stageId });
                      setIsFinalizeModalOpen(true);
                    }}
                    variant="outline"
                    className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400/60 dark:text-green-400 dark:hover:bg-green-900/20 text-xs font-medium px-3 py-1.5 h-auto rounded-md"
                  >
                    <Check className="w-3.5 h-3.5 mr-1.5" />
                    Finalizar
                  </Button>
                )}
              </div>
            )}
            {isFinalized && (
              <div className="pt-0.5 flex items-center justify-center gap-2">
                <span className="text-xs text-green-600 font-medium">✓ Documento finalizado</span>
                <Button
                  onClick={() => handleUnfinalizeDocument(document.id, stageId)}
                  variant="ghost"
                  size="sm"
                  className="hidden h-6 w-6 p-0 hover:bg-muted transition-colors"
                  title="Desfazer finalização"
                >
                  <Undo className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const KanbanColumn = ({ stage }: { stage: Stage }) => {
    const allDocuments = currentWorkflow.documents[stage.id] || [];
    const filteredDocuments = filterDocuments(allDocuments);
    
    const isLastColumn = currentWorkflow.stages[currentWorkflow.stages.length - 1].id === stage.id;
    
    // Sort documents based on orderDocumentsBy
    const sortedDocuments = [...filteredDocuments].sort((a, b) => {
      const dateA = new Date(a.uploadDate).getTime();
      const dateB = new Date(b.uploadDate).getTime();
      
      if (orderDocumentsBy === 'recent') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    // Apply batch filter - we need to track original index for batch detection
    const documents = kanbanBatchFilter === 'all' 
      ? sortedDocuments 
      : sortedDocuments.filter((doc, idx) => {
          const originalIdx = allDocuments.indexOf(doc);
          const isBatch = isBatchDoc(doc, stage.id, originalIdx);
          return kanbanBatchFilter === 'batch' ? isBatch : !isBatch;
        });
    
    // Get the number of visible items for this stage
    const visibleCount = visibleCounts[stage.id] || INITIAL_VISIBLE_COUNT;
    
    return (
      <div className="w-80 flex-shrink-0">
        <div className={`${stage.color} rounded-t-lg border border-woopi-ai-border`}>
          <div className="p-4 flex flex-col gap-2">
            {/* Primeira linha: Nome da etapa */}
            <div className="flex items-center">
              <h3 className="font-medium text-woopi-ai-dark-gray text-sm">
                {stage.name}
              </h3>
            </div>
            
            {/* Segunda linha: Badges e botão de toggle (apenas na última coluna) */}
            {isLastColumn && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <Badge className="bg-gray-200 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-xs px-2 py-0.5">
                    {documents.length}
                  </Badge>
                </div>
                
                {/* Botão de toggle para ocultar/mostrar todos os cards da última coluna */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLastColumnHidden(!lastColumnHidden)}
                  className="h-7 px-2 hover:bg-muted transition-colors"
                  title={lastColumnHidden ? "Mostrar itens" : "Ocultar itens"}
                >
                  {lastColumnHidden ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-1" />
                      <span className="text-xs">Mostrar itens</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="text-xs">Ocultar itens</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-card border-l border-r border-b border-woopi-ai-border rounded-b-lg min-h-[500px] p-4">
          {/* Mostrar mensagem "Itens ocultos" se for a última coluna e estiver oculta */}
          {isLastColumn && lastColumnHidden ? (
            <div className="flex flex-col items-center justify-center h-[450px] text-muted-foreground">
              <EyeOff className="w-12 h-12 mb-3" />
              <span className="text-sm font-medium">Itens ocultos</span>
            </div>
          ) : (
            <>
              {/* Cards de exemplo: apenas na coluna "recebimento" */}
              {stage.id === 'recebimento' && (
                <>
                  <ProcessingDemoCard />
                  {demoCardReprocessing ? <ProcessingDemoCard /> : <FailureDemoCard />}
                </>
              )}

              {documents.slice(0, visibleCount).map((document, index) => (
                <DocumentCard 
                  key={document.id} 
                  document={document} 
                  stageId={stage.id}
                  index={index}
                />
              ))}
              
              {documents.length === 0 && (
                <div className="text-center text-woopi-ai-gray text-sm py-8">
                  {searchTerm.trim() 
                    ? 'Nenhum documento encontrado com os critérios de busca' 
                    : kanbanBatchFilter !== 'all'
                      ? `Nenhum documento ${kanbanBatchFilter === 'batch' ? 'em lote' : 'único'} nesta etapa`
                      : 'Nenhum documento nesta etapa'}
                </div>
              )}
              
              {documents.length > visibleCount && (
                <div className="text-center text-woopi-ai-gray text-sm py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVisibleCounts(prev => ({
                      ...prev,
                      [stage.id]: (prev[stage.id] || INITIAL_VISIBLE_COUNT) + INITIAL_VISIBLE_COUNT
                    }))}
                    className="text-woopi-ai-gray hover:text-woopi-ai-dark-gray"
                  >
                    Mostrar mais
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const getWorkflowOptions = () => {
    return Object.entries(teamWorkflows).map(([key, workflow]) => ({
      value: key,
      label: `${workflow.name} - ${workflow.workflowName}`
    }));
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold woopi-ai-text-primary">
            Esteiras de processamento
          </h1>
          <p className="woopi-ai-text-secondary text-sm md:text-base">
            {activeTab === 'board' ? 'Visualize o fluxo de documentos através das etapas de processamento' : 'Gerencie todos os documentos do sistema'}
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-card border border-woopi-ai-border rounded-lg">
        <div className="flex border-b border-woopi-ai-border">
          <button
            onClick={() => setActiveTab('board')}
            className={`flex-1 px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'board'
                ? 'text-woopi-ai-blue border-b-2 border-woopi-ai-blue bg-woopi-ai-light-blue/30'
                : 'text-woopi-ai-gray hover:text-woopi-ai-dark-gray hover:bg-muted'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              <span>Board Esteiras de processamento</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'list'
                ? 'text-woopi-ai-blue border-b-2 border-woopi-ai-blue bg-woopi-ai-light-blue/30'
                : 'text-woopi-ai-gray hover:text-woopi-ai-dark-gray hover:bg-muted'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <List className="w-4 h-4" />
              <span>Lista de Documentos</span>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'board' ? (
        <>
          {/* Workflow Selection and Search */}
          <div className="bg-card border border-woopi-ai-border rounded-lg p-4 sticky top-0 z-10 shadow-sm">
            <div className="flex flex-col gap-3">
              {/* Linha 1: Visualizando workflow + seletores */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Clock className="w-4 h-4 text-woopi-ai-gray" />
                  <span className="text-sm text-woopi-ai-gray whitespace-nowrap">Visualizando workflow:</span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="w-56">
                    <SearchableSelect
                      value={selectedTeam}
                      onValueChange={handleTeamChange}
                      options={getWorkflowOptions()}
                      placeholder="Selecionar Esteira"
                      emptyMessage="Nenhuma esteira encontrada."
                      className="border-woopi-ai-border"
                    />
                  </div>

                  {/* Workflow Name Display with Edit Action */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 bg-woopi-ai-light-gray rounded-md">
                      <Workflow className="w-4 h-4 text-woopi-ai-blue flex-shrink-0" />
                      <span className="text-sm font-medium text-woopi-ai-dark-gray whitespace-nowrap">
                        {currentWorkflow.workflowName}
                      </span>
                    </div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-woopi-ai-gray hover:text-woopi-ai-blue hover:bg-woopi-ai-light-blue/20"
                          onClick={() => navigate(`/workflow/gestao/editar/${selectedTeam}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar configuração da esteira</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Linha 2: Filtros e busca */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Order By Select */}
                <Select value={orderDocumentsBy} onValueChange={(value: 'recent' | 'oldest') => setOrderDocumentsBy(value)}>
                  <SelectTrigger 
                    className="border-woopi-ai-border h-9 w-9 flex items-center justify-center flex-shrink-0 px-[20px] py-[0px]"
                    title="Ordenar documentos"
                  >
                    <ArrowUpDown className="w-4 h-4 text-woopi-ai-gray" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais Recente</SelectItem>
                    <SelectItem value="oldest">Mais Antigo</SelectItem>
                  </SelectContent>
                </Select>

                {/* Batch Document Filter - Compact */}
                <Select value={kanbanBatchFilter} onValueChange={(value: 'all' | 'batch' | 'single') => setKanbanBatchFilter(value)}>
                  <SelectTrigger 
                    className={`border-woopi-ai-border h-9 w-[148px] text-xs flex-shrink-0 px-3 ${kanbanBatchFilter !== 'all' ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    title="Filtrar por tipo de documento"
                  >
                    <div className="flex items-center gap-2">
                      {kanbanBatchFilter === 'all' && <Filter className="w-3.5 h-3.5 text-woopi-ai-gray flex-shrink-0" />}
                      {kanbanBatchFilter === 'batch' && <Files className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                      {kanbanBatchFilter === 'single' && <File className="w-3.5 h-3.5 text-woopi-ai-gray flex-shrink-0" />}
                      <span className="truncate">
                        {kanbanBatchFilter === 'all' ? 'Todos' : kanbanBatchFilter === 'batch' ? 'Em Lote' : 'Únicos'}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Filter className="w-3.5 h-3.5" />
                        <span>Todos os Documentos</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="batch">
                      <div className="flex items-center gap-2">
                        <Files className="w-3.5 h-3.5" />
                        <span>Documentos em Lote</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="single">
                      <div className="flex items-center gap-2">
                        <File className="w-3.5 h-3.5" />
                        <span>Documentos Únicos</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-woopi-ai-gray" />
                  <Input
                    type="text"
                    placeholder="Buscar por nome, descrição ou solicitante..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 border border-woopi-ai-border focus:border-woopi-ai-blue text-sm"
                  />
                </div>
                
                {/* User Filter Icon */}
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2 h-9 w-9 border-woopi-ai-border hover:bg-woopi-ai-light-gray flex-shrink-0"
                  title="Filtrar por usuário"
                >
                  <User className="w-4 h-4 text-woopi-ai-gray" />
                </Button>
                
                {/* Novo Documento Button */}
                <Button 
                  className="woopi-ai-button-primary h-9 flex-shrink-0"
                  onClick={() => navigate('/documentos/carregar')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo documento
                </Button>
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="bg-card border border-woopi-ai-border rounded-lg p-4">
            <div className="overflow-x-auto">
              <div className="flex gap-4 min-w-max pb-4">
                {currentWorkflow.stages.map((stage) => (
                  <KanbanColumn key={stage.id} stage={stage} />
                ))}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-card border border-woopi-ai-border rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-woopi-ai-gray">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <span>Workflow: <strong className="text-woopi-ai-dark-gray">{currentWorkflow.workflowName}</strong></span>
                <span>Time: <strong className="text-woopi-ai-dark-gray">{currentWorkflow.name}</strong></span>
                <span>Total de documentos: <strong className="text-woopi-ai-dark-gray">
                  {Object.values(currentWorkflow.documents).flat().length}
                </strong></span>
                {searchTerm.trim() && (
                  <span>Filtrados: <strong className="text-woopi-ai-blue">
                    {Object.values(currentWorkflow.documents).flat().filter(doc => 
                      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      doc.solicitante.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length}
                  </strong></span>
                )}
              </div>
              {searchTerm.trim() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="text-woopi-ai-gray hover:text-woopi-ai-dark-gray"
                >
                  Limpar busca
                </Button>
              )}
            </div>
          </div>
        </>
      ) : (
        <DocumentListTab />
      )}

      {/* Finalize Confirmation Modal */}
      <Dialog open={isFinalizeModalOpen} onOpenChange={setIsFinalizeModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Finalizar Documento</DialogTitle>
            <DialogDescription>
              Você tem certeza de que deseja finalizar este documento?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFinalizeModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
              onClick={() => {
                if (documentToFinalize) {
                  handleFinalizeDocument(documentToFinalize.id, documentToFinalize.stageId);
                }
                setIsFinalizeModalOpen(false);
              }}
            >
              Finalizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}