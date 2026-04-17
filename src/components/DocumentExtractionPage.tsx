import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Resizable } from 're-resizable';
import { 
  ArrowLeft,
  CheckCircle,
  Edit3,
  Eye,
  User,
  Calendar,
  FileText,
  Hash,
  CreditCard,
  Building,
  DollarSign,
  Key,
  ChevronLeft,
  ChevronRight,
  Send,
  UserCheck,
  Clock,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  ScrollText,
  Users,
  MessageCircle,
  X,
  ShieldUser,
  Check,
  Code,
  ArrowUp,
  Columns2,
  PanelLeft,
  PanelRight,
  History,
  Search,
  Copy,
  ArrowUpDown,
  Files,
  AlertCircle,
  Filter,
  CircleX
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { toast } from 'sonner';
import { AnonimizarButton, AnonymizationResult } from './AnonimizarButton';
import { ExternalLink, ShieldCheck as ShieldCheckIcon } from 'lucide-react';

interface ExtractedField {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  status: 'confirmed' | 'pending' | 'edited';
  editable: boolean;
}

interface HistoryItem {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  avatar: string;
}

interface PillTab {
  id: string;
  title: string;
  icon: React.ReactNode;
  type: 'extraction' | 'generation' | 'sensitive' | 'workflows';
}

export function DocumentExtractionPage() {
  const navigate = useNavigate();
  const { documentId } = useParams();

  // Anonymization history state
  interface AnonymizationEntry {
    url: string;
    docName: string;
    type: string;
    prompt: string;
    workflowTitle: string;
    timestamp: Date;
  }
  const [anonymizationHistory, setAnonymizationHistory] = useState<AnonymizationEntry[]>([]);
  const [showAnonymizationModal, setShowAnonymizationModal] = useState(false);

  // Pills navigation state
  const [currentPillIndex, setCurrentPillIndex] = useState(0);
  
  // View mode state
  const [viewMode, setViewMode] = useState<'document' | 'split' | 'fields'>('split');
  
  // Resizable column width state
  const [leftColumnWidth, setLeftColumnWidth] = useState(50); // percentage
  
  // Editable generation result state
  const [isEditingGeneration, setIsEditingGeneration] = useState(false);
  
  // Mock generation result - always present
  const [editableGenerationResult, setEditableGenerationResult] = useState('Este documento apresenta uma nota fiscal eletrônica emitida pela empresa ABC S.A. no valor total de R$ 4.967,89, com data de emissão em 10/03/2023. O documento contém as seguintes informações relevantes:\\\\n\\\\n• Número da Nota Fiscal: NF-2023-7845\\\\n• CNPJ do Destinatário: 98.705.432/0001-10\\\\n• Chave de Acesso: 3524 0019 0349 3404 7940 0/3\\\\n\\\\nAnálise de conformidade:\\\\n- Todos os campos obrigatórios estão preenchidos corretamente\\\\n- Os cálculos de impostos estão em conformidade com a legislação vigente\\\\n- Não foram identificadas inconsistências nos valores apresentados\\\\n\\\\nRecomendações:\\\\n1. Verificar se o valor total corresponde ao acordado comercialmente\\\\n2. Confirmar os dados do destinatário antes do processamento\\\\n3. Arquivar o documento conforme procedimentos internos de compliance fiscal\\\\n\\\\nEste documento está apto para processamento e pode ser aprovado para as próximas etapas do workflow.');
  
  // Modal state for field content viewing
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingField, setViewingField] = useState<ExtractedField | null>(null);
  
  // Modal state for generation result viewing
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  
  // Modal state for JSON/Text viewing
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [viewingJson, setViewingJson] = useState<{ title: string; content: string; type: 'text' | 'json' } | null>(null);
  
  // Modal state for questionnaire answer viewing
  const [isQuestionnaireAnswerModalOpen, setIsQuestionnaireAnswerModalOpen] = useState(false);
  const [viewingQuestionnaireAnswer, setViewingQuestionnaireAnswer] = useState<{ question: string; answer: string } | null>(null);
  
  // Ask Doc mode state
  const [isAskDocMode, setIsAskDocMode] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState('');
  const [freeQuestionPrompt, setFreeQuestionPrompt] = useState('');
  const [askDocPrompt, setAskDocPrompt] = useState('');
  const [askDocResult, setAskDocResult] = useState('');
  const [questionnaireResults, setQuestionnaireResults] = useState<Array<{question: string, answer: string}>>([]);
  
  // History modal state
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyDisplayLimit, setHistoryDisplayLimit] = useState(10);
  const [historyUserFilter, setHistoryUserFilter] = useState('all');
  const [historyUserSearch, setHistoryUserSearch] = useState('');
  const [historySortOrder, setHistorySortOrder] = useState<'newest' | 'oldest'>('newest');
  
  // Mock historical questions and answers
  const historicalInteractions = [
    {
      id: 1,
      timestamp: '2024-12-15 14:30',
      question: 'Qual é o valor total desta nota fiscal?',
      answer: 'O valor total da nota fiscal é R$ 4.967,89, conforme indicado no campo "Valor Total da Nota".',
      type: 'free' as const,
      userName: 'Maria Silva'
    },
    {
      id: 2,
      timestamp: '2024-12-15 14:32',
      question: 'Quem é o destinatário deste documento?',
      answer: 'O destinatário é a empresa com CNPJ 98.705.432/0001-10. O documento não especifica o nome completo da razão social nesta seção visível.',
      type: 'free' as const,
      userName: 'João Santos'
    },
    {
      id: 3,
      timestamp: '2024-12-15 14:35',
      question: 'As partes contratantes estão devidamente identificadas e o documento atende às normas fiscais vigentes?',
      answer: 'Resultado do questionário aplicado:\n\n1. Identificação das partes: ABC S.A. (emitente) e destinatário CNPJ 98.705.432/0001-10\n2. Data de emissão: 10/03/2023\n3. Valores: R$ 4.967,89\n4. Conformidade: Documento em conformidade com normas fiscais',
      type: 'questionnaire' as const,
      userName: 'Maria Silva'
    },
    {
      id: 4,
      timestamp: '2024-12-15 14:40',
      question: 'Este documento está dentro da validade fiscal?',
      answer: 'Sim, o documento foi emitido em 10/03/2023 e está dentro do período fiscal vigente. A chave de acesso é válida e pode ser consultada junto à Receita Federal.',
      type: 'free' as const,
      userName: 'Carlos Oliveira'
    },
    {
      id: 5,
      timestamp: '2024-12-15 14:42',
      question: 'Qual a categoria de despesa e o status de aprovação para este valor?',
      answer: 'Análise financeira realizada:\n\n1. Categoria de despesa: Serviços\n2. Valor: R$ 4.967,89\n3. Centro de custo: A definir\n4. Aprovação necessária: Sim (valor acima de R$ 1.000,00)\n5. Status de pagamento: Pendente',
      type: 'questionnaire' as const,
      userName: 'João Santos'
    },
    {
      id: 6,
      timestamp: '2024-12-15 15:10',
      question: 'Quais são os impostos discriminados nesta nota?',
      answer: 'Os impostos discriminados na nota fiscal são:\n\n• ICMS: R$ 894,22 (18%)\n• PIS: R$ 81,97 (1,65%)\n• COFINS: R$ 377,56 (7,6%)\n• IPI: Isento\n\nTotal de impostos: R$ 1.353,75, representando 27,25% do valor total.',
      type: 'free' as const,
      userName: 'Maria Silva'
    },
    {
      id: 7,
      timestamp: '2024-12-15 15:15',
      question: 'O documento atende a todos os requisitos de compliance e verificação documental?',
      answer: 'Checklist de compliance aplicado:\n\n1. Autenticidade do documento: Verificada via chave de acesso\n2. Dados do emitente: Completos e válidos\n3. Dados do destinatário: Completos\n4. Classificação fiscal: NCM correto\n5. Retenções tributárias: Aplicadas conforme legislação\n6. Prazo de arquivamento: 5 anos (conforme CTN)',
      type: 'questionnaire' as const,
      userName: 'Carlos Oliveira'
    },
    {
      id: 8,
      timestamp: '2024-12-15 15:25',
      question: 'Qual a data de vencimento do pagamento?',
      answer: 'A data de vencimento do pagamento consta como 10/04/2023, ou seja, 30 dias corridos a partir da data de emissão (10/03/2023). O documento indica modalidade de pagamento via boleto bancário.',
      type: 'free' as const,
      userName: 'João Santos'
    },
    {
      id: 9,
      timestamp: '2024-12-15 15:30',
      question: 'Quais são as condições de frete, transporte e prazo de entrega deste documento?',
      answer: 'Análise logística do documento:\n\n1. Tipo de frete: CIF (por conta do emitente)\n2. Transportadora: TransLog Ltda.\n3. Peso bruto: 125,5 kg\n4. Volume: 3 caixas\n5. Prazo de entrega estimado: 5 dias úteis\n6. Local de entrega: Endereço do destinatário conforme cadastro',
      type: 'questionnaire' as const,
      userName: 'Maria Silva'
    },
    {
      id: 10,
      timestamp: '2024-12-15 15:45',
      question: 'Existe alguma divergência nos valores calculados?',
      answer: 'Após análise detalhada, não foram identificadas divergências nos cálculos. A base de cálculo do ICMS está correta, os valores de PIS e COFINS conferem com as alíquotas aplicáveis, e o valor total da nota corresponde à soma dos itens com seus respectivos impostos.',
      type: 'free' as const,
      userName: 'Carlos Oliveira'
    },
    {
      id: 11,
      timestamp: '2024-12-15 16:00',
      question: 'Qual o regime tributário do emitente?',
      answer: 'De acordo com as informações disponíveis no documento, o emitente opera sob o regime de Lucro Real. Isso é evidenciado pela discriminação separada dos impostos (ICMS, PIS, COFINS) com alíquotas não-cumulativas aplicadas sobre o valor dos produtos.',
      type: 'free' as const,
      userName: 'João Santos'
    },
    {
      id: 12,
      timestamp: '2024-12-15 16:15',
      question: 'O documento passou na revisão periódica de auditoria e está apto para pagamento?',
      answer: 'Resultado da auditoria periódica:\n\n1. Conformidade documental: Aprovado\n2. Consistência de dados: Sem divergências\n3. Prazo de processamento: Dentro do SLA\n4. Classificação contábil: Correta\n5. Evidências anexadas: 3 documentos suporte\n6. Recomendação: Aprovar para pagamento\n7. Risco identificado: Baixo',
      type: 'questionnaire' as const,
      userName: 'Carlos Oliveira'
    }
  ];

  // Extract unique user names for the filter
  const historyUsers = Array.from(new Set(historicalInteractions.map(i => i.userName))).sort();

  // Pills configuration
  const pillTabs: PillTab[] = [
    {
      id: 'nota-fiscal',
      title: 'Etapa 1',
      icon: <FileText className="w-4 h-4" />,
      type: 'extraction'
    },
    {
      id: 'recursos-humanos',
      title: 'Etapa 2',
      icon: <Users className="w-4 h-4" />,
      type: 'extraction'
    },
    {
      id: 'contratos',
      title: 'Etapa 3',
      icon: <ScrollText className="w-4 h-4" />,
      type: 'extraction'
    },
    {
      id: 'workflows-output',
      title: 'Fluxos',
      icon: <Code className="w-4 h-4" />,
      type: 'workflows'
    },
    {
      id: 'geracao-ai',
      title: 'Geração IA',
      icon: <Send className="w-4 h-4" />,
      type: 'generation'
    },
    {
      id: 'dados-sensiveis',
      title: 'Dados Sensíveis PII e PHI',
      icon: <ShieldUser className="w-4 h-4" />,
      type: 'sensitive'
    }
  ];

  // Workflows data with text and JSON outputs
  const workflowsData = [
    {
      id: 'workflow-1',
      name: 'Nome do fluxo 1',
      outputs: [
        {
          id: 'output-1',
          title: 'Output Texto (Resumo do Documento)',
          type: 'text',
          content: `Este documento apresenta uma nota fiscal eletrônica emitida pela empresa ABC S.A. no valor total de R$ 4.967,89, com data de emissão em 10/03/2023.

O documento contém informações fiscais completas incluindo o CNPJ do destinatário (98.705.432/0001-10) e chave de acesso válida para consulta na Receita Federal.

A análise automática identificou conformidade com as normas fiscais vigentes e todos os campos obrigatórios estão devidamente preenchidos. O documento está apto para processamento nas próximas etapas do workflow de aprovação.`
        },
        {
          id: 'output-2',
          title: 'Output Texto (Observações)',
          type: 'text',
          content: `Verificações realizadas:
• Validação de CNPJ - OK
• Conferência de valores - OK
• Chave de acesso - Válida
• Data de emissão - Dentro do período fiscal

Recomendações:
1. Confirmar recebimento dos itens descritos
2. Arquivar cópia digital conforme política de compliance
3. Processar pagamento dentro do prazo estabelecido

Próximos passos: Aguardando aprovação do gestor financeiro para liberação de pagamento.`
        }
      ]
    },
    {
      id: 'workflow-2',
      name: 'Nome do fluxo 2',
      outputs: [
        {
          id: 'output-3',
          title: 'Output JSON (Resumo de Processamento)',
          type: 'json',
          content: `{
  "processamento_id": "PROC-2023-1524",
  "documento": "NF-2023-7845",
  "timestamp_inicio": "2023-10-26T14:35:12Z",
  "timestamp_fim": "2023-10-26T14:38:47Z",
  "status": "concluido",
  "etapas_executadas": 5,
  "erros": 0
}`
        }
      ]
    },
    {
      id: 'workflow-3',
      name: 'Nome do fluxo 3',
      outputs: [
        {
          id: 'output-4',
          title: 'Output JSON (Metadados)',
          type: 'json',
          content: `{
  "versao_schema": "2.1.0",
  "modelo_ia": "gpt-4",
  "confianca_extracao": 0.96,
  "campos_extraidos": 12,
  "tempo_processamento_ms": 3420,
  "origem": "upload_manual"
}`
        }
      ]
    }
  ];

  // Different extraction field sets based on document type
  const extractionFieldSets = {
    'nota-fiscal': [
      {
        id: 'nf-number',
        label: 'Número da Nota Fiscal',
        value: 'NF-2023-7845',
        icon: <Hash className="w-4 h-4" />,
        status: 'confirmed' as const,
        editable: false
      },
      {
        id: 'emission-date',
        label: 'Data de Emissão',
        value: '10/03/2023',
        icon: <Calendar className="w-4 h-4" />,
        status: 'confirmed' as const,
        editable: true
      },
      {
        id: 'cnpj',
        label: 'CNPJ Destinatário',
        value: '98.705.432/0001-10',
        icon: <CreditCard className="w-4 h-4" />,
        status: 'confirmed' as const,
        editable: false
      },
      {
        id: 'company',
        label: 'Razão Social Destinatário',
        value: 'Empresa ABC S.A.',
        icon: <Building className="w-4 h-4" />,
        status: 'confirmed' as const,
        editable: true
      },
      {
        id: 'total-value',
        label: 'Valor Total',
        value: 'R$ 4.967,89',
        icon: <DollarSign className="w-4 h-4" />,
        status: 'edited' as const,
        editable: true
      },
      {
        id: 'access-key',
        label: 'Chave de Acesso',
        value: '3524 0019 0349 3404 7940 0/3',
        icon: <Key className="w-4 h-4" />,
        status: 'confirmed' as const,
        editable: false
      },
      {
        id: 'payment-deadline',
        label: 'Condições de Pagamento',
        value: 'O pagamento deverá ser efetuado em até 30 dias corridos após a emissão da nota fiscal, mediante apresentação da documentação fiscal completa e validação dos dados cadastrais do destinatário.\n\nO não cumprimento do prazo estabelecido acarretará em multa de 2% ao mês sobre o valor total, além de juros de mora de 1% ao dia, conforme previsto no contrato comercial vigente entre as partes.',
        icon: <Clock className="w-4 h-4" />,
        status: 'pending' as const,
        editable: true
      }
    ],
    'recursos-humanos': [
      {
        id: 'employee-name',
        label: 'Nome do Funcionário',
        value: 'Maria Silva Santos',
        icon: <UserCheck className="w-4 h-4" />,
        status: 'confirmed' as const,
        editable: true
      },
      {
        id: 'employee-id',
        label: 'Matrícula',
        value: '202301045',
        icon: <Hash className="w-4 h-4" />,
        status: 'confirmed' as const,
        editable: false
      },
      {
        id: 'position',
        label: 'Cargo',
        value: 'Analista de Marketing Jr.',
        icon: <Briefcase className="w-4 h-4" />,
        status: 'confirmed' as const,
        editable: true
      },
      {
        id: 'hire-date',
        label: 'Data de Admissão',
        value: '15/01/2023',
        icon: <Calendar className="w-4 h-4" />,
        status: 'confirmed' as const,
        editable: true
      },
      {
        id: 'salary',
        label: 'Salário Base',
        value: 'R$ 3.500,00',
        icon: <DollarSign className="w-4 h-4" />,
        status: 'edited' as const,
        editable: true
      },
      {
        id: 'department',
        label: 'Departamento',
        value: 'Marketing Digital',
        icon: <Building className="w-4 h-4" />,
        status: 'confirmed' as const,
        editable: true
      },
      {
        id: 'work-schedule',
        label: 'Jornada de Trabalho',
        value: 'O funcionário deverá cumprir jornada de trabalho regular de segunda a sexta-feira, no horário compreendido entre 08:00 e 17:00 horas, com intervalo de uma hora para almoço entre 12:00 e 13:00 horas, totalizando 40 horas semanais.\n\nEm casos excepcionais, mediante acordo prévio com a gestão imediata, poderá ser solicitada a realização de horas extras, que serão devidamente compensadas conforme previsto na legislação trabalhista vigente e política interna da empresa.',
        icon: <Clock className="w-4 h-4" />,
        status: 'pending' as const,
        editable: true
      }
    ],
    'contratos': [
      {
        id: 'contract-number',
        label: 'Número do Contrato',
        value: 'CONT-2023-0892',
        icon: <Hash className="w-4 h-4" />,
        status: 'confirmed' as const,
        editable: false
      },
      {
        id: 'contracting-party',
        label: 'Contratante',
        value: 'TechCorp Solutions Ltd.',
        icon: <Building className="w-4 h-4" />,
        status: 'confirmed' as const,
        editable: true
      },
      {
        id: 'contracted-party',
        label: 'Contratado',
        value: 'João Desenvolvedores LTDA',
        icon: <User className="w-4 h-4" />,
        status: 'confirmed' as const,
        editable: true
      },
      {
        id: 'contract-value',
        label: 'Valor do Contrato',
        value: 'R$ 85.000,00',
        icon: <DollarSign className="w-4 h-4" />,
        status: 'edited' as const,
        editable: true
      },
      {
        id: 'start-date',
        label: 'Data de Início',
        value: '01/04/2023',
        icon: <Calendar className="w-4 h-4" />,
        status: 'confirmed' as const,
        editable: true
      },
      {
        id: 'end-date',
        label: 'Data de Término',
        value: '31/12/2023',
        icon: <Calendar className="w-4 h-4" />,
        status: 'confirmed' as const,
        editable: true
      },
      {
        id: 'payment-terms',
        label: 'Prazo de Pagamento',
        value: 'O pagamento deverá ser realizado em até 30 dias corridos após a entrega completa dos serviços descritos neste contrato, mediante apresentação da nota fiscal correspondente e comprovação da conclusão das atividades previstas.',
        icon: <Clock className="w-4 h-4" />,
        status: 'pending' as const,
        editable: true
      }
    ]
  };

  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>(
    extractionFieldSets['nota-fiscal']
  );

  // Mock history data - now as state to allow dynamic updates
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    {
      id: '1',
      user: 'Mariana Santos',
      action: 'Alterou o Valor Total',
      timestamp: '15/03/2023 14:32',
      field: 'Valor Total',
      oldValue: 'R$ 4.536,90',
      newValue: 'R$ 4.967,89',
      avatar: 'MS'
    },
    {
      id: '2',
      user: 'Carlos Mendes',
      action: 'Alterou a Quantidade',
      timestamp: '15/03/2023 11:05',
      field: 'Quantidade',
      oldValue: '5 un para 400',
      newValue: '',
      avatar: 'CM'
    },
    {
      id: '3',
      user: 'Sistema IA',
      action: 'Realizou a Extração Automática',
      timestamp: '15/03/2023 10:38',
      avatar: 'IA'
    }
  ]);

  // Handle pill navigation
  const handlePillChange = (index: number) => {
    setCurrentPillIndex(index);
    const pill = pillTabs[index];
    
    if (pill.type === 'extraction') {
      // Use the selected batch document's fields when available
      const doc = batchDocuments.find(d => d.id === selectedBatchDocId);
      const fieldKey = pill.id as keyof typeof extractionFieldSets;
      if (doc) {
        const docFields = doc.extractionFields[fieldKey as keyof typeof doc.extractionFields];
        if (docFields) {
          setExtractedFields(docFields as ExtractedField[]);
        } else {
          setExtractedFields(extractionFieldSets[fieldKey] || []);
        }
      } else {
        setExtractedFields(extractionFieldSets[fieldKey] || []);
      }
      
      // Reset history when changing pills
      setHistoryItems([
        {
          id: '3',
          user: 'Sistema IA',
          action: 'Realizou a Extração Automática',
          timestamp: '15/03/2023 10:38',
          avatar: 'IA'
        }
      ]);
    }
    // Para o pill de dados sensíveis, não precisamos fazer nada específico
    // pois o conteúdo é estático
  };

  const navigatePills = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPillIndex > 0) {
      handlePillChange(currentPillIndex - 1);
    } else if (direction === 'next' && currentPillIndex < pillTabs.length - 1) {
      handlePillChange(currentPillIndex + 1);
    }
  };

  // Handle field edit
  const handleFieldEdit = (fieldId: string, newValue: string) => {
    // Find the current field to get its old value
    const currentField = extractedFields.find(f => f.id === fieldId);
    
    if (!currentField) return;
    
    const oldValue = currentField.value;
    
    // Only update if value actually changed
    if (oldValue === newValue) return;
    
    // Update the field
    setExtractedFields(prev => prev.map(field => 
      field.id === fieldId 
        ? { ...field, value: newValue, status: 'edited' as const }
        : field
    ));
    
    // Add to history
    const now = new Date();
    const timestamp = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      user: 'Mariana Santos',
      action: `Alterou ${currentField.label}`,
      timestamp: timestamp,
      field: currentField.label,
      oldValue: oldValue,
      newValue: newValue,
      avatar: 'MS'
    };
    
    // Add new item at the beginning of the history
    setHistoryItems(prev => [newHistoryItem, ...prev]);
  };

  // Handle field content view
  const handleViewField = (field: ExtractedField) => {
    setViewingField(field);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingField(null);
  };

  // Handle generation result view
  const handleViewGenerationResult = () => {
    setIsGenerationModalOpen(true);
  };

  const handleCloseGenerationModal = () => {
    setIsGenerationModalOpen(false);
  };

  // Handle JSON/Text view
  const handleViewJson = (title: string, content: string, type: 'text' | 'json' = 'json') => {
    setViewingJson({ title, content, type });
    setIsJsonModalOpen(true);
  };

  const handleCloseJsonModal = () => {
    setIsJsonModalOpen(false);
    setViewingJson(null);
  };

  const handleViewQuestionnaireAnswer = (question: string, answer: string) => {
    setViewingQuestionnaireAnswer({ question, answer });
    setIsQuestionnaireAnswerModalOpen(true);
  };

  const handleCloseQuestionnaireAnswerModal = () => {
    setIsQuestionnaireAnswerModalOpen(false);
    setViewingQuestionnaireAnswer(null);
  };

  // Handle Ask Doc mode
  const handleToggleAskDocMode = () => {
    setIsAskDocMode(!isAskDocMode);
    if (!isAskDocMode) {
      setSelectedQuestionnaire('');
      setFreeQuestionPrompt('');
      setAskDocPrompt('');
      setAskDocResult('');
      setQuestionnaireResults([]);
    }
  };

  const handleAskDoc = () => {
    if (!selectedQuestionnaire && !freeQuestionPrompt.trim()) {
      toast.error('Por favor, selecione um questionário ou digite uma pergunta.');
      return;
    }

    toast.info('Processando pergunta...');
    
    // Simulate AI response delay
    setTimeout(() => {
      // Se for questionário, gera resposta estruturada
      if (selectedQuestionnaire) {
        const mockQuestionnaireResults = [
          { question: 'Qual é o valor total do documento?', answer: 'R$ 4.967,89' },
          { question: 'Qual é a data de emissão?', answer: '10/03/2023' },
          { question: 'Qual é o CNPJ do destinatário?', answer: '98.705.432/0001-10' },
          { question: 'Qual é a razão social do destinatário?', answer: 'Empresa ABC S.A.' },
          { question: 'Qual é a chave de acesso?', answer: '3524 0019 0349 3404 7940 0/3' },
          { question: 'O documento está em conformidade?', answer: 'Sim, todos os campos obrigatórios estão preenchidos corretamente' }
        ];
        setQuestionnaireResults(mockQuestionnaireResults);
        setAskDocResult('');
      } else {
      const mockResponse = `Baseado na análise do documento, posso responder que:\\n\\n• O valor total da nota fiscal é R$ 4.967,89\\n• A data de emissão é 10/03/2023\\n• O destinatário é a Empresa ABC S.A. com CNPJ 98.705.432/0001-10\\n• A chave de acesso é 3524 0019 0349 3404 7940 0/3\\n\\nTodos os dados foram extraídos automaticamente e estão em conformidade com as normas fiscais vigentes. O documento está apto para processamento nas próximas etapas do workflow.`;
      
        setAskDocResult(mockResponse);
        setQuestionnaireResults([]);
      }
      
      toast.success('Resposta gerada com sucesso!');
    }, 2000);
  };

  // Safe clipboard copy function
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copiado para área de transferência');
    } catch (error) {
      // Fallback for when Clipboard API is blocked
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Copiado para área de transferência');
      } catch (err) {
        toast.error('Erro ao copiar para área de transferência');
      }
      document.body.removeChild(textArea);
    }
  };

  // Handle questionnaire answer edit
  const handleQuestionnaireAnswerEdit = (index: number, newAnswer: string) => {
    setQuestionnaireResults(prev => prev.map((item, i) => 
      i === index ? { ...item, answer: newAnswer } : item
    ));
  };

  // Mock questionnaires data
  const questionnaires = [
    { id: 'fiscal', name: 'Análise Fiscal' },
    { id: 'compliance', name: 'Compliance Regulatório' },
    { id: 'contabil', name: 'Verificação Contábil' },
    { id: 'juridico', name: 'Análise Jurídica' }
  ];

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'edited':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'pending':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'edited':
        return 'Editado';
      case 'pending':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  };

  // Handle approve document
  const handleApproveDocument = () => {
    toast.success('Documento aprovado com sucesso!');
    setTimeout(() => {
      navigate('/documentos/workflow');
    }, 1500);
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/documentos/workflow');
  };

  // Reprovar modal state
  const [isReprovarModalOpen, setIsReprovarModalOpen] = useState(false);
  const [reprovarJustificativa, setReprovarJustificativa] = useState('');
  const [reprovarEtapa, setReprovarEtapa] = useState('');
  const [reprovarAtribuir, setReprovarAtribuir] = useState('');
  const [reprovarUserSearch, setReprovarUserSearch] = useState('');

  const REPROVAR_USERS = [
    { value: 'ana-silva', name: 'Ana Silva', role: 'Analista', initials: 'AS', color: 'bg-[#0073ea]' },
    { value: 'carlos-mendes', name: 'Carlos Mendes', role: 'Supervisor', initials: 'CM', color: 'bg-[#0073ea]' },
    { value: 'juliana-costa', name: 'Juliana Costa', role: 'Revisora', initials: 'JC', color: 'bg-[#0073ea]' },
    { value: 'roberto-alves', name: 'Roberto Alves', role: 'Gerente', initials: 'RA', color: 'bg-[#0073ea]' },
    { value: 'fernanda-lima', name: 'Fernanda Lima', role: 'Analista', initials: 'FL', color: 'bg-[#0073ea]' },
  ];

  const handleReprovar = () => {
    if (!reprovarJustificativa.trim()) {
      toast.error('Por favor, forneça uma justificativa para a reprovação.');
      return;
    }
    if (!reprovarEtapa) {
      toast.error('Por favor, selecione a etapa de retorno.');
      return;
    }
    toast.error(`Documento reprovado. Retornando para: ${reprovarEtapa}`);
    setIsReprovarModalOpen(false);
    setReprovarJustificativa('');
    setReprovarEtapa('');
    setReprovarAtribuir('');
    setReprovarUserSearch('');
    setTimeout(() => navigate('/documentos/workflow'), 1500);
  };

  // Estado para controle do modal de histórico de alterações do documento
  const [isDocumentHistoryModalOpen, setIsDocumentHistoryModalOpen] = useState(false);
  const [documentHistorySearch, setDocumentHistorySearch] = useState('');
  const [documentHistorySort, setDocumentHistorySort] = useState<'newest' | 'oldest'>('newest');
  
  // Mock de histórico de alterações do documento atual
  const documentHistory = [
    {
      id: '1',
      user: 'Ana Costa',
      action: 'Upload',
      timestamp: '2024-02-11 09:15:23',
      details: 'Documento carregado no sistema'
    },
    {
      id: '2',
      user: 'Ana Costa',
      action: 'Atribuir',
      timestamp: '2024-02-11 09:16:10',
      details: 'Documento atribuído para Carlos Silva'
    },
    {
      id: '3',
      user: 'Carlos Silva',
      action: 'Perguntar ao documento',
      timestamp: '2024-02-11 10:22:45',
      details: 'Pergunta: "Qual o valor total da nota fiscal?"'
    },
    {
      id: '4',
      user: 'Carlos Silva',
      action: 'Editar resposta',
      timestamp: '2024-02-11 10:35:18',
      details: 'Campo "Valor Total" alterado de "R$ 4.500,00" para "R$ 4.967,89"'
    },
    {
      id: '5',
      user: 'Pedro Oliveira',
      action: 'Avançar',
      timestamp: '2024-02-11 11:20:05',
      details: 'Documento avançado para "Verificação Financeira"'
    },
    {
      id: '6',
      user: 'Pedro Oliveira',
      action: 'Editar resposta',
      timestamp: '2024-02-11 11:25:30',
      details: 'Campo "CNPJ" validado e confirmado'
    },
    {
      id: '7',
      user: 'Ana Costa',
      action: 'Anonimizar',
      timestamp: '2024-02-11 11:45:30',
      details: 'Documento anonimizado com tipo "Mascaramento parcial" e prompt "LGPD — dados pessoais sensíveis" na esteira "Processamento de Notas Fiscais"'
    }
  ];

  const filteredDocumentHistory = documentHistory
    .filter(item => 
      !documentHistorySearch || 
      item.user.toLowerCase().includes(documentHistorySearch.toLowerCase()) ||
      item.action.toLowerCase().includes(documentHistorySearch.toLowerCase()) ||
      item.details.toLowerCase().includes(documentHistorySearch.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.timestamp.replace(' ', 'T')).getTime();
      const dateB = new Date(b.timestamp.replace(' ', 'T')).getTime();
      return documentHistorySort === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const currentPill = pillTabs[currentPillIndex];

  // Batch documents data (documentos em lote)
  const batchDocuments = [
    {
      id: documentId || '8021',
      name: 'Nota Fiscal #8021',
      pages: 2,
      workflowTitle: 'Workflow de Aprovação de Notas Fiscais',
      extractionFields: {
        'nota-fiscal': [
          { id: 'nf-number', label: 'Número da Nota Fiscal', value: 'NF-2023-7845', icon: <Hash className="w-4 h-4" />, status: 'confirmed' as const, editable: false },
          { id: 'emission-date', label: 'Data de Emissão', value: '10/03/2023', icon: <Calendar className="w-4 h-4" />, status: 'confirmed' as const, editable: true },
          { id: 'cnpj', label: 'CNPJ Destinatário', value: '98.705.432/0001-10', icon: <CreditCard className="w-4 h-4" />, status: 'confirmed' as const, editable: false },
          { id: 'company', label: 'Razão Social Destinatário', value: 'Empresa ABC S.A.', icon: <Building className="w-4 h-4" />, status: 'confirmed' as const, editable: true },
          { id: 'total-value', label: 'Valor Total', value: 'R$ 4.967,89', icon: <DollarSign className="w-4 h-4" />, status: 'edited' as const, editable: true },
          { id: 'access-key', label: 'Chave de Acesso', value: '3524 0019 0349 3404 7940 0/3', icon: <Key className="w-4 h-4" />, status: 'confirmed' as const, editable: false },
        ],
        'recursos-humanos': extractionFieldSets['recursos-humanos'],
        'contratos': extractionFieldSets['contratos'],
      },
      generationResult: editableGenerationResult,
    },
    {
      id: '8022',
      name: 'Nota Fiscal #8022',
      pages: 1,
      workflowTitle: 'Workflow de Aprovação de Notas Fiscais',
      extractionFields: {
        'nota-fiscal': [
          { id: 'nf-number', label: 'Número da Nota Fiscal', value: 'NF-2023-8102', icon: <Hash className="w-4 h-4" />, status: 'confirmed' as const, editable: false },
          { id: 'emission-date', label: 'Data de Emissão', value: '12/03/2023', icon: <Calendar className="w-4 h-4" />, status: 'pending' as const, editable: true },
          { id: 'cnpj', label: 'CNPJ Destinatário', value: '12.345.678/0001-99', icon: <CreditCard className="w-4 h-4" />, status: 'confirmed' as const, editable: false },
          { id: 'company', label: 'Razão Social Destinatário', value: 'TechCorp Solutions Ltda.', icon: <Building className="w-4 h-4" />, status: 'confirmed' as const, editable: true },
          { id: 'total-value', label: 'Valor Total', value: 'R$ 12.340,50', icon: <DollarSign className="w-4 h-4" />, status: 'confirmed' as const, editable: true },
          { id: 'access-key', label: 'Chave de Acesso', value: '4521 0087 1234 5678 9101 2/1', icon: <Key className="w-4 h-4" />, status: 'confirmed' as const, editable: false },
        ],
        'recursos-humanos': extractionFieldSets['recursos-humanos'],
        'contratos': extractionFieldSets['contratos'],
      },
      generationResult: 'Este documento apresenta uma nota fiscal eletrônica emitida pela empresa TechCorp Solutions Ltda. no valor total de R$ 12.340,50, com data de emissão em 12/03/2023. O documento contém informações completas do destinatário e está em conformidade com normas fiscais. Recomenda-se a validação cruzada com o pedido de compra original antes da aprovação.',
    },
    {
      id: '8023',
      name: 'Nota Fiscal #8023',
      pages: 3,
      workflowTitle: 'Workflow de Aprovação de Notas Fiscais',
      extractionFields: {
        'nota-fiscal': [
          { id: 'nf-number', label: 'Número da Nota Fiscal', value: 'NF-2023-9530', icon: <Hash className="w-4 h-4" />, status: 'pending' as const, editable: false },
          { id: 'emission-date', label: 'Data de Emissão', value: '15/03/2023', icon: <Calendar className="w-4 h-4" />, status: 'confirmed' as const, editable: true },
          { id: 'cnpj', label: 'CNPJ Destinatário', value: '55.321.098/0001-44', icon: <CreditCard className="w-4 h-4" />, status: 'confirmed' as const, editable: false },
          { id: 'company', label: 'Razão Social Destinatário', value: 'Global Serviços de TI S.A.', icon: <Building className="w-4 h-4" />, status: 'edited' as const, editable: true },
          { id: 'total-value', label: 'Valor Total', value: 'R$ 78.500,00', icon: <DollarSign className="w-4 h-4" />, status: 'confirmed' as const, editable: true },
          { id: 'access-key', label: 'Chave de Acesso', value: '7812 0045 9876 5432 1098 7/6', icon: <Key className="w-4 h-4" />, status: 'confirmed' as const, editable: false },
        ],
        'recursos-humanos': extractionFieldSets['recursos-humanos'],
        'contratos': extractionFieldSets['contratos'],
      },
      generationResult: 'Este documento apresenta uma nota fiscal eletrônica emitida pela empresa Global Serviços de TI S.A. no valor total de R$ 78.500,00. A nota fiscal refere-se a serviços de consultoria e infraestrutura de TI. Atenção: o valor supera o limite de aprovação automática (R$ 50.000,00), necessitando de aprovação pelo diretor financeiro conforme política interna.',
      hasError: true,
    },
  ];

  const [selectedBatchDocId, setSelectedBatchDocId] = useState(batchDocuments[0].id);
  const [filterFailures, setFilterFailures] = useState(false);

  const filteredBatchDocuments = filterFailures 
    ? batchDocuments.filter(doc => doc.hasError) 
    : batchDocuments;
  
  // If the currently selected document is filtered out, select the first available one
  useEffect(() => {
    if (filterFailures && filteredBatchDocuments.length > 0) {
      const isSelectedInList = filteredBatchDocuments.some(doc => doc.id === selectedBatchDocId);
      if (!isSelectedInList) {
        handleBatchDocChange(filteredBatchDocuments[0].id);
      }
    }
  }, [filterFailures, filteredBatchDocuments, selectedBatchDocId]);

  const selectedBatchDoc = batchDocuments.find(d => d.id === selectedBatchDocId) || batchDocuments[0];

  const handleBatchDocChange = (docId: string) => {
    setSelectedBatchDocId(docId);
    const doc = batchDocuments.find(d => d.id === docId);
    if (!doc) return;

    // Reset pill to first extraction
    setCurrentPillIndex(0);
    
    // Update extraction fields for the first pill of the new doc
    const firstPillKey = pillTabs[0].id as keyof typeof doc.extractionFields;
    const newFields = doc.extractionFields[firstPillKey];
    if (newFields) {
      setExtractedFields(newFields as ExtractedField[]);
    }

    // Update generation result
    setEditableGenerationResult(doc.generationResult);

    // Reset history for this doc
    setHistoryItems([
      {
        id: '3',
        user: 'Sistema IA',
        action: 'Realizou a Extração Automática',
        timestamp: '15/03/2023 10:38',
        avatar: 'IA'
      }
    ]);

    // Reset ask doc state
    setIsAskDocMode(false);
    setAskDocResult('');
    setQuestionnaireResults([]);
    setIsEditingGeneration(false);
  };

  // Handler placed here so selectedBatchDoc is in scope
  const handleAnonymized = (result: AnonymizationResult) => {
    const docName = selectedBatchDoc?.name ?? 'Documento';
    const params = new URLSearchParams({
      type: result.type ?? '',
      prompt: result.prompt ?? '',
      docName,
      docId: documentId ?? '',
      workflowTitle: selectedBatchDoc?.workflowTitle ?? '',
      sourceUrl: window.location.href,
    });
    const url = `/documentos/${documentId ?? 'doc'}/anonimizado?${params.toString()}`;
    setAnonymizationHistory(prev => [{
      url,
      docName,
      type: result.type ?? '',
      prompt: result.prompt ?? '',
      workflowTitle: selectedBatchDoc?.workflowTitle ?? '',
      timestamp: new Date(),
    }, ...prev]);
    window.open(url, '_blank');
  };

  // Render document batch selector inline
  const renderBatchSelector = () => (
    <div className="flex items-center gap-2 mb-3">
      <Files className="w-4 h-4 text-[#0073ea] flex-shrink-0" />
      <Select value={selectedBatchDocId} onValueChange={handleBatchDocChange}>
        <SelectTrigger className="h-8 w-auto min-w-[180px] border border-gray-300 dark:border-[#393e5c] bg-white dark:bg-[#292f4c] text-sm font-medium">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {filteredBatchDocuments.length === 0 ? (
            <div className="p-2 text-xs text-center text-woopi-ai-gray">Nenhum documento encontrado</div>
          ) : (
            filteredBatchDocuments.map((doc) => (
              <SelectItem key={doc.id} value={doc.id} className="flex items-center gap-2">
                <span className="flex items-center gap-2">
                  {doc.name}
                  {doc.hasError && (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                </span>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setFilterFailures(!filterFailures)}
        className={`h-8 w-8 ${filterFailures ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:text-gray-600'}`}
        title={filterFailures ? "Mostrar todos" : "Filtrar com falha"}
      >
        <Filter className="w-4 h-4" />
        {filterFailures && <span className="sr-only">Filtrado</span>}
      </Button>
      <Badge variant="outline" className="text-xs bg-blue-50 text-[#0073ea] border-blue-200 whitespace-nowrap">
        {filteredBatchDocuments.length} docs {filterFailures ? '(filtrado)' : 'no lote'}
      </Badge>
      <div className="ml-auto flex items-center gap-2">
        {anonymizationHistory.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAnonymizationModal(true)}
            className="flex items-center gap-1.5 rounded-md px-2.5 h-7 text-xs font-medium transition-all border relative"
            style={{ color: '#059669', borderColor: '#a7f3d0', background: '#ecfdf5' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#d1fae5'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#ecfdf5'; }}
            title="Ver histórico de anonimizações"
          >
            <ShieldCheckIcon className="w-3.5 h-3.5" />
            Última anonimização
            {anonymizationHistory.length > 1 && (
              <span
                className="flex items-center justify-center rounded-full text-[10px] font-bold min-w-[16px] h-4 px-1 leading-none"
                style={{ background: '#059669', color: '#fff' }}
              >
                {anonymizationHistory.length}
              </span>
            )}
            <ChevronRight className="w-3 h-3 opacity-50" />
          </button>
        )}
        <AnonimizarButton onAnonymized={handleAnonymized} />
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col document-extraction-page">
      {/* Header */}
      <div className="flex-shrink-0 p-4 md:p-6 border-b border-woopi-ai-border bg-white dark:bg-[#1a1b2e]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 text-woopi-ai-gray hover:text-woopi-ai-dark-gray"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Board de Processamento</span>
              <span className="sm:hidden">Voltar</span>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-bold woopi-ai-text-primary">
                  Análise de Documento
                </h1>
                <p className="woopi-ai-text-secondary text-sm md:text-base">
                  Revise e confirme os dados extraídos pela IA
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDocumentHistoryModalOpen(true)}
                className="flex items-center gap-2 border-woopi-ai-border hover:bg-woopi-ai-light-gray"
              >
                <History className="w-4 h-4" />
                <span className="hidden lg:inline">Histórico de alterações</span>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1f2132] p-1 rounded-lg">
              <Button
                variant={viewMode === 'document' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('document')}
                className="h-8 px-3"
                title="Visualizar apenas documento"
              >
                <PanelLeft className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'split' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('split')}
                className="h-8 px-3"
                title="Visualização dividida"
              >
                <Columns2 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'fields' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('fields')}
                className="h-8 px-3"
                title="Visualizar apenas campos"
              >
                <PanelRight className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReprovarModalOpen(true)}
              className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <CircleX className="w-4 h-4" />
              Reprovar
            </Button>

            <Button 
              onClick={handleApproveDocument}
              className="woopi-ai-button-primary w-full md:w-auto hidden"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Aprovar Documento
            </Button>
          </div>
        </div>
      </div>

      {/* Reprovar Modal */}
      <Dialog open={isReprovarModalOpen} onOpenChange={setIsReprovarModalOpen}>
        <DialogContent className="sm:max-w-lg dark:bg-[#292f4c] dark:border-[#393e5c]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex-shrink-0">
                <CircleX className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-left text-lg font-bold dark:text-[#d5d8e0]">
                  Reprovar Documento
                </DialogTitle>
                <DialogDescription className="text-left dark:text-[#9196b0]">
                  Forneça uma justificativa e selecione para qual etapa o documento deve retornar.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="reprovar-justificativa" className="text-sm font-medium dark:text-[#d5d8e0]">
                Justificativa <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reprovar-justificativa"
                placeholder="Descreva o motivo da reprovação..."
                value={reprovarJustificativa}
                onChange={(e) => setReprovarJustificativa(e.target.value)}
                rows={4}
                className="resize-none dark:bg-[#1f2132] dark:border-[#393e5c] dark:text-[#d5d8e0] dark:placeholder-[#6b7280]"
              />
            </div>

            {/* Atribuir a */}
            <div className="space-y-2">
              <Label className="text-sm font-medium dark:text-[#d5d8e0]">
                Atribuir a{' '}
                <span className="text-xs font-normal text-gray-400 dark:text-gray-500">opcional</span>
              </Label>
              <div className="border border-gray-200 dark:border-[#393e5c] rounded-lg overflow-hidden bg-white dark:bg-[#1f2132]">
                <div className="relative border-b border-gray-100 dark:border-[#393e5c]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  <input
                    type="text"
                    value={reprovarUserSearch}
                    onChange={(e) => setReprovarUserSearch(e.target.value)}
                    placeholder="Buscar usuário..."
                    className="w-full h-8 pl-9 pr-3 text-xs bg-gray-50 dark:bg-[#1a1b2e] text-gray-800 dark:text-[#d5d8e0] placeholder-gray-400 dark:placeholder-[#6b7280] focus:outline-none"
                  />
                </div>
                <div className="max-h-36 overflow-y-auto dark:bg-[#1a1b2e]">
                  {REPROVAR_USERS.filter(u => u.name.toLowerCase().includes(reprovarUserSearch.toLowerCase())).map(user => {
                    const isSelected = reprovarAtribuir === user.value;
                    return (
                      <button
                        key={user.value}
                        type="button"
                        onClick={() => setReprovarAtribuir(isSelected ? '' : user.value)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-[#2d3354]'}`}
                      >
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${user.color}`}>
                          {user.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${isSelected ? 'text-[#0073ea] dark:text-[#4a9ff5]' : 'text-gray-800 dark:text-[#d5d8e0]'}`}>{user.name}</p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{user.role}</p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#0073ea] dark:text-[#4a9ff5] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              {reprovarAtribuir && (
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Atribuído a:</span>
                  <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-500/30 rounded-full px-2 py-0.5">
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{REPROVAR_USERS.find(u => u.value === reprovarAtribuir)?.name}</span>
                    <button type="button" onClick={() => setReprovarAtribuir('')} className="text-blue-400 hover:text-blue-600 ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium dark:text-[#d5d8e0]">
                Retornar para a etapa
              </Label>
              <Select value={reprovarEtapa} onValueChange={setReprovarEtapa}>
                <SelectTrigger className="dark:bg-[#1f2132] dark:border-[#393e5c] dark:text-[#d5d8e0]">
                  <SelectValue placeholder="Selecione a etapa..." />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#292f4c] dark:border-[#393e5c]">
                  <SelectItem value="Recebimento">Recebimento</SelectItem>
                  <SelectItem value="Análise">Análise</SelectItem>
                  <SelectItem value="Revisão">Revisão</SelectItem>
                  <SelectItem value="Validação Fiscal">Validação Fiscal</SelectItem>
                  <SelectItem value="Aprovação Gerencial">Aprovação Gerencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => { setIsReprovarModalOpen(false); setReprovarJustificativa(''); setReprovarEtapa(''); setReprovarAtribuir(''); setReprovarUserSearch(''); }}
              className="dark:border-[#393e5c] dark:text-[#d5d8e0] dark:hover:bg-[#2d3354]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleReprovar}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Confirmar Reprovação
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Document Viewer - Left Side - Split Mode */}
          {viewMode === 'split' && (
            <Resizable
              size={{ width: `${leftColumnWidth}%`, height: '100%' }}
              onResizeStop={(e, direction, ref, d) => {
                const container = ref.parentElement;
                if (container) {
                  const newWidth = (ref.offsetWidth / container.offsetWidth) * 100;
                  setLeftColumnWidth(Math.max(20, Math.min(80, newWidth)));
                }
              }}
              minWidth="20%"
              maxWidth="80%"
              enable={{ right: true }}
              handleStyles={{
                right: {
                  width: '4px',
                  right: '-2px',
                  cursor: 'col-resize',
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.2s'
                }
              }}
              handleClasses={{
                right: 'hover:bg-woopi-ai-blue'
              }}
              className="bg-gray-50 dark:bg-[#1f2132] border-r border-woopi-ai-border flex flex-col"
            >
              <div className="flex-1 overflow-y-auto p-4">
                {renderBatchSelector()}
                <div className="mb-4 text-center">
                  <h3 className="text-sm text-woopi-ai-dark-gray mb-3">
                    <span className="font-bold">{selectedBatchDoc.workflowTitle}</span> - <span className="font-medium">Documento #{selectedBatchDoc.id}</span>
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-xs text-woopi-ai-gray">
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                      Anterior
                    </Button>
                    <span>Página 1 de {selectedBatchDoc.pages}</span>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                      Próxima
                    </Button>
                  </div>
                </div>

                <div className="w-full min-h-[600px] bg-white rounded-lg shadow-sm border border-woopi-ai-border flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <FileText className="w-16 h-16 text-woopi-ai-gray mx-auto" />
                    <div>
                      <h4 className="text-lg font-medium text-woopi-ai-dark-gray mb-2">
                        DOCUMENTO AQUI
                      </h4>
                      <p className="text-sm text-woopi-ai-gray">
                        Visualização do documento seria carregada aqui
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Resizable>
          )}

          {/* Document Viewer - Left Side - Document Only Mode */}
          {viewMode === 'document' && (
            <div className="bg-gray-50 dark:bg-[#1f2132] border-r border-woopi-ai-border flex flex-col w-full">
              <div className="flex-1 overflow-y-auto p-4">
                {renderBatchSelector()}
                <div className="mb-4 text-center">
                  <h3 className="text-sm text-woopi-ai-dark-gray mb-3">
                    <span className="font-bold">{selectedBatchDoc.workflowTitle}</span> - <span className="font-medium">Documento #{selectedBatchDoc.id}</span>
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-xs text-woopi-ai-gray">
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                      Anterior
                    </Button>
                    <span>Página 1 de {selectedBatchDoc.pages}</span>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                      Próxima
                    </Button>
                  </div>
                </div>

                <div className="w-full min-h-[600px] bg-white rounded-lg shadow-sm border border-woopi-ai-border flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <FileText className="w-16 h-16 text-woopi-ai-gray mx-auto" />
                    <div>
                      <h4 className="text-lg font-medium text-woopi-ai-dark-gray mb-2">
                        DOCUMENTO AQUI
                      </h4>
                      <p className="text-sm text-woopi-ai-gray">
                        Visualização do documento seria carregada aqui
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Extraction Panel - Right Side */}
          {(viewMode === 'fields' || viewMode === 'split') && (
            <div 
              className={`bg-white dark:bg-[#292f4c] flex flex-col ${
                viewMode === 'split' ? 'flex-1' : 'w-full'
              }`}
            >
              {/* Fields content with independent scroll */}
              <div className="flex-1 overflow-y-auto">
              <div className="space-y-6">
                {/* Batch selector when in fields-only mode */}
                {viewMode === 'fields' && (
                  <div className="p-4 pb-0">
                    {renderBatchSelector()}
                  </div>
                )}

                {/* Pergunte ao Doc Button - Posicionado no canto superior direito */}
                <div className="p-4 pb-0 flex justify-end">
                  <Button
                    onClick={handleToggleAskDocMode}
                    variant={isAskDocMode ? "default" : "outline"}
                    size="sm"
                    className={`flex items-center gap-2 ${
                      isAskDocMode 
                        ? 'bg-woopi-ai-gray hover:bg-woopi-ai-dark-gray text-white' 
                        : 'border-woopi-ai-border text-woopi-ai-gray hover:bg-woopi-ai-light-gray'
                    }`}
                  >
                    {isAskDocMode ? (
                      <>
                        <X className="w-4 h-4" />
                        Fechar Chat
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4" />
                        Pergunte à IA
                      </>
                    )}
                  </Button>
                </div>

                {/* Ask Doc Chat Interface - Espaço expansível abaixo do botão */}
                {isAskDocMode && (
                  <div className="px-4">
                    <Card className="border border-woopi-ai-blue bg-woopi-ai-light-blue/20">
                      <CardContent className="p-4 space-y-4">
                        {/* Header da conversa */}
                        <div className="relative text-center pb-3 border-b border-woopi-ai-border">
                          <div className="w-8 h-8 bg-woopi-ai-blue rounded-full flex items-center justify-center mx-auto mb-2">
                            <MessageCircle className="w-4 h-4 text-white" />
                          </div>
                          <h4 className="text-sm font-medium text-woopi-ai-dark-gray">Conversa com o Documento</h4>
                          
                          {/* Botão de histórico no canto superior direito */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsHistoryModalOpen(true)}
                            className="absolute top-0 right-0 h-8 w-8 p-0 hover:bg-woopi-ai-light-blue"
                            title="Ver histórico de perguntas"
                          >
                            <History className="w-4 h-4 text-woopi-ai-gray" />
                          </Button>
                        </div>
                        
                        {/* Campo de seleção de questionário */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-woopi-ai-dark-gray uppercase">
                            QUESTIONÁRIO A APLICAR
                          </Label>
                          <div className="flex gap-2 items-center">
                            <Select
                              value={selectedQuestionnaire}
                              onValueChange={setSelectedQuestionnaire}
                            >
                              <SelectTrigger className="flex-1 border-woopi-ai-border focus:border-woopi-ai-blue bg-white dark:bg-[#292f4c]">
                                <SelectValue placeholder="Selecione um questionário..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="questionario-juridico-contratos">Questionário Jurídico - Análise de Contratos</SelectItem>
                                <SelectItem value="questionario-compliance-auditoria">Questionário Compliance - Auditoria Interna</SelectItem>
                                <SelectItem value="questionario-financeiro-despesas">Questionário Financeiro - Controle de Despesas</SelectItem>
                                <SelectItem value="questionario-rh-candidatos">Questionário RH - Avaliação de Candidatos</SelectItem>
                                <SelectItem value="questionario-comercial-propostas">Questionário Comercial - Análise de Propostas</SelectItem>
                                <SelectItem value="questionario-operacional-processos">Questionário Operacional - Mapeamento de Processos</SelectItem>
                                <SelectItem value="questionario-qualidade-normas">Questionário Qualidade - Conformidade com Normas</SelectItem>
                                <SelectItem value="questionario-ti-seguranca">Questionário TI - Segurança da Informação</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={handleAskDoc}
                              disabled={!selectedQuestionnaire}
                              className="bg-woopi-ai-blue hover:bg-woopi-ai-dark-blue text-white h-10 px-3"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Campo de pergunta livre à IA */}
                        <div className="space-y-2">
                          <Textarea
                            value={freeQuestionPrompt}
                            onChange={(e) => setFreeQuestionPrompt(e.target.value)}
                            placeholder="Ou digite uma pergunta personalizada sobre o documento..."
                            className="min-h-[60px] text-sm border border-woopi-ai-border focus:border-woopi-ai-blue bg-white dark:bg-[#292f4c]"
                          />
                          <Button
                            onClick={handleAskDoc}
                            disabled={!freeQuestionPrompt.trim()}
                            className="w-full bg-woopi-ai-blue hover:bg-woopi-ai-dark-blue text-white"
                            size="sm"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Enviar
                          </Button>
                        </div>

                        {/* Área de resposta da IA */}
                        {(askDocResult || questionnaireResults.length > 0) && (
                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-woopi-ai-dark-gray uppercase">
                              SAÍDA
                            </Label>
                            
                            {/* Formato questionário estruturado */}
                            {questionnaireResults.length > 0 && (
                              <div className="space-y-3">
                                {questionnaireResults.map((item, index) => (
                                  <div key={index} className="p-3 bg-white dark:bg-[#292f4c] rounded-lg border border-woopi-ai-border">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <Label className="text-xs font-medium text-woopi-ai-gray">{item.question}</Label>
                                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0 flex-shrink-0">
                                        <Check className="w-3 h-3 mr-1" />
                                        Confirmado
                                      </Badge>
                                    </div>
                                    <div className="flex gap-2">
                                      <Textarea
                                        value={item.answer}
                                        onChange={(e) => handleQuestionnaireAnswerEdit(index, e.target.value)}
                                        className="flex-1 text-sm border border-woopi-ai-border focus:border-woopi-ai-blue bg-white dark:bg-[#292f4c] resize-none"
                                        rows={3}
                                      />
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewQuestionnaireAnswer(item.question, item.answer)}
                                        className="flex-shrink-0"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Formato texto livre */}
                            {askDocResult && (
                              <div className="p-3 bg-white dark:bg-[#292f4c] rounded-lg border border-woopi-ai-border">
                                <p className="text-sm text-woopi-ai-dark-gray leading-relaxed whitespace-pre-wrap">
                                  {askDocResult}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const textToCopy = questionnaireResults.length > 0
                                    ? questionnaireResults.map(item => `${item.question}\n${item.answer}`).join('\n\n')
                                    : askDocResult;
                                  copyToClipboard(textToCopy);
                                }}
                                className="text-xs border-woopi-ai-border hover:bg-woopi-ai-light-blue"
                              >
                                Copiar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setAskDocResult('');
                                  setQuestionnaireResults([]);
                                }}
                                className="text-xs border-woopi-ai-border hover:bg-woopi-ai-light-blue"
                              >
                                Limpar
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Conteúdo principal - Pills Navigation e dados extraídos */}
                <div className="p-4 pt-0 space-y-6">
                  {/* Pills Navigation */}
                  <Card className="border border-woopi-ai-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigatePills('prev')}
                          disabled={currentPillIndex === 0}
                          className="h-8 w-8 p-0 flex-shrink-0"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        
                        <div className="flex-1 mx-4 overflow-hidden">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handlePillChange(currentPillIndex)}
                              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-woopi-ai-blue text-white shadow-sm transition-all"
                            >
                              {currentPill.icon}
                              {currentPill.title}
                            </button>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigatePills('next')}
                          disabled={currentPillIndex === pillTabs.length - 1}
                          className="h-8 w-8 p-0 flex-shrink-0"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-woopi-ai-gray">
                          {currentPillIndex + 1} de {pillTabs.length}
                        </p>
                        {pillTabs.length > 1 && (
                          <div className="flex justify-center mt-2 gap-1">
                            {pillTabs.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => handlePillChange(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  index === currentPillIndex
                                    ? 'bg-woopi-ai-blue'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dynamic Content Based on Selected Pill */}
                  {currentPill.type === 'extraction' ? (
                    <>
                      {/* Extracted Data Section */}
                      <Card className="border border-woopi-ai-border">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {currentPill.icon}
                            Dados Extraídos - {currentPill.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {extractedFields.map((field) => (
                            <div key={field.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium text-woopi-ai-dark-gray">
                                  {field.label}
                                </Label>
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs px-2 py-0 ${getStatusColor(field.status)}`}
                                  >
                                    {getStatusText(field.status)}
                                  </Badge>
                                  {/* Ícone de olho para campos com texto longo */}
                                  {field.value.length > 100 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleViewField(field)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Eye className="w-4 h-4 text-woopi-ai-gray" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              
                              {field.editable ? (
                                field.value.length > 100 ? (
                                  <div className="relative">
                                    <Input
                                      value={field.value.substring(0, 100) + '...'}
                                      readOnly
                                      className="text-sm border border-woopi-ai-border bg-gray-50 dark:bg-[#1f2132] cursor-default"
                                    />
                                  </div>
                                ) : (
                                  <div className="relative">
                                    <Input
                                      value={field.value}
                                      onChange={(e) => handleFieldEdit(field.id, e.target.value)}
                                      className="text-sm border border-woopi-ai-border"
                                    />
                                    <Edit3 className="w-3 h-3 text-woopi-ai-gray absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  </div>
                                )
                              ) : (
                                <div className="p-2 bg-gray-50 dark:bg-[#1f2132] rounded text-sm text-woopi-ai-dark-gray border border-woopi-ai-border">
                                  {field.value.length > 100 ? field.value.substring(0, 100) + '...' : field.value}
                                </div>
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Generation IA Result Section */}
                      <Card className="border border-woopi-ai-border">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Send className="w-4 h-4" />
                              Resultado da Geração IA
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsEditingGeneration(!isEditingGeneration)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit3 className="w-4 h-4 text-woopi-ai-gray" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {isEditingGeneration ? (
                            <Textarea
                              value={editableGenerationResult}
                              onChange={(e) => setEditableGenerationResult(e.target.value)}
                              className="min-h-[200px] text-sm border border-woopi-ai-border"
                            />
                          ) : (
                            <div className="p-4 bg-woopi-ai-light-blue/10 rounded-lg border border-woopi-ai-border">
                              <p className="text-sm text-woopi-ai-dark-gray leading-relaxed whitespace-pre-wrap">
                                {editableGenerationResult.substring(0, 300)}...
                              </p>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={handleViewGenerationResult}
                              className="flex items-center gap-2 border border-woopi-ai-border"
                            >
                              <Eye className="w-4 h-4" />
                              Ver Completo
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => copyToClipboard(editableGenerationResult)}
                              className="border border-woopi-ai-border"
                            >
                              Copiar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* History Section */}
                      <Card className="border border-woopi-ai-border">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Histórico de Alterações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {historyItems.map((item) => (
                            <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#1f2132] border border-woopi-ai-border">
                              <div className="w-8 h-8 rounded-full bg-woopi-ai-blue flex items-center justify-center text-white text-xs font-medium">
                                {item.avatar}
                              </div>
                              <div className="flex-1 text-sm">
                                <p className="font-medium text-woopi-ai-dark-gray">
                                  {item.user}
                                </p>
                                <p className="text-woopi-ai-gray">
                                  {item.action}
                                </p>
                                {item.oldValue && item.newValue && (
                                  <div className="mt-1 text-xs">
                                    <span className="text-red-600">- {item.oldValue}</span>
                                    <br />
                                    <span className="text-green-600">+ {item.newValue}</span>
                                  </div>
                                )}
                                <p className="text-xs text-woopi-ai-gray mt-1">
                                  {item.timestamp}
                                </p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </>
                  ) : currentPill.type === 'workflows' ? (
                    /* Workflows Content */
                    <Card className="border border-woopi-ai-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Code className="w-4 h-4" />
                          Outputs dos Fluxos
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          {workflowsData.map((workflow) => (
                            <AccordionItem key={workflow.id} value={workflow.id}>
                              <AccordionTrigger className="text-sm font-medium">
                                {workflow.name}
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-6 pt-2">
                                  {workflow.outputs.map((output) => (
                                    <div key={output.id} className="space-y-2">
                                      <Label className="text-sm font-medium text-woopi-ai-dark-gray">
                                        {output.title}
                                      </Label>
                                      {output.type === 'text' ? (
                                        <div className="p-4 bg-gray-50 dark:bg-[#1f2132] rounded-lg border border-woopi-ai-border">
                                          <p className="text-sm text-woopi-ai-dark-gray leading-relaxed whitespace-pre-wrap">
                                            {output.content}
                                          </p>
                                        </div>
                                      ) : (
                                        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                                          <pre className="text-xs text-green-400 font-mono">
                                            <code>{output.content}</code>
                                          </pre>
                                        </div>
                                      )}
                                      <div className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleViewJson(output.title, output.content, output.type as 'text' | 'json')}
                                          className="flex items-center gap-2 text-xs"
                                        >
                                          <Eye className="w-3 h-3" />
                                          Ver Completo
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={async () => {
                                            await copyToClipboard(output.content);
                                          }}
                                          className="text-xs"
                                        >
                                          Copiar
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  ) : currentPill.type === 'generation' ? (
                    /* Generation Content */
                    <Card className="border border-woopi-ai-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Resultado da Geração IA
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-woopi-ai-light-blue/10 rounded-lg border border-woopi-ai-border">
                          <p className="text-sm text-woopi-ai-dark-gray leading-relaxed whitespace-pre-wrap">
                            {editableGenerationResult.substring(0, 300)}...
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleViewGenerationResult}
                            className="flex items-center gap-2 border border-woopi-ai-border"
                          >
                            <Eye className="w-4 h-4" />
                            Ver Completo
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyToClipboard(editableGenerationResult)}
                            className="border border-woopi-ai-border"
                          >
                            Copiar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    /* Sensitive Data Content */
                    <Card className="border border-woopi-ai-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <ShieldUser className="w-4 h-4" />
                          Dados Sensíveis PII e PHI
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-woopi-ai-gray mb-4">
                          Detecção automática de informações pessoais identificáveis (PII) e dados protegidos de saúde (PHI).
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-700">
                                Dados Pessoais (PII) Detectados
                              </p>
                              <p className="text-xs text-green-600">
                                Nome, CNPJ e informações comerciais identificadas
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-700">
                                Dados de Saúde (PHI) 
                              </p>
                              <p className="text-xs text-green-600">
                                Nenhum dado sensível de saúde detectado
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-700">
                            <strong>Nota:</strong> Todos os dados sensíveis são processados de acordo com a LGPD e mantidos seguros em nossos sistemas.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for viewing field content */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {viewingField?.label}
            </DialogTitle>
            <DialogDescription>
              Visualização completa do conteúdo do campo extraído
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-[#1f2132] rounded-lg max-h-96 overflow-y-auto">
              <p className="text-sm text-woopi-ai-dark-gray leading-relaxed whitespace-pre-wrap">
                {viewingField?.value}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(viewingField?.value || '')}
              >
                Copiar
              </Button>
              <Button onClick={handleCloseViewModal}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal for viewing generation result */}
      <Dialog open={isGenerationModalOpen} onOpenChange={setIsGenerationModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Resultado Completo da Geração IA
            </DialogTitle>
            <DialogDescription>
              Análise completa do documento gerada pela inteligência artificial
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-[#1f2132] rounded-lg max-h-96 overflow-y-auto">
              <p className="text-sm text-woopi-ai-dark-gray leading-relaxed whitespace-pre-wrap">
                {editableGenerationResult}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(editableGenerationResult)}
              >
                Copiar
              </Button>
              <Button onClick={handleCloseGenerationModal}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal for viewing JSON/Text output */}
      <Dialog open={isJsonModalOpen} onOpenChange={setIsJsonModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              {viewingJson?.title}
            </DialogTitle>
            <DialogDescription>
              Visualização completa do output {viewingJson?.type === 'text' ? 'de texto' : 'JSON'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {viewingJson?.type === 'text' ? (
              <div className="p-4 bg-gray-50 dark:bg-[#1f2132] rounded-lg border border-woopi-ai-border max-h-96 overflow-y-auto">
                <p className="text-sm text-woopi-ai-dark-gray leading-relaxed whitespace-pre-wrap">
                  {viewingJson?.content}
                </p>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-green-400 font-mono">
                  <code>{viewingJson?.content}</code>
                </pre>
              </div>
            )}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={async () => {
                  await copyToClipboard(viewingJson?.content || '');
                }}
              >
                Copiar
              </Button>
              <Button onClick={handleCloseJsonModal}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal for Questionnaire Answer Viewing */}
      <Dialog open={isQuestionnaireAnswerModalOpen} onOpenChange={setIsQuestionnaireAnswerModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resposta Completa</DialogTitle>
            <DialogDescription>
              {viewingQuestionnaireAnswer?.question}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-[#1f2132] rounded-lg border border-woopi-ai-border max-h-96 overflow-y-auto">
              <p className="text-sm text-woopi-ai-dark-gray leading-relaxed whitespace-pre-wrap">
                {viewingQuestionnaireAnswer?.answer}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(viewingQuestionnaireAnswer?.answer || '')}
              >
                Copiar
              </Button>
              <Button onClick={handleCloseQuestionnaireAnswerModal}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Histórico de Alterações do Documento */}
      <Dialog open={isDocumentHistoryModalOpen} onOpenChange={setIsDocumentHistoryModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-woopi-ai-blue" />
              Histórico de Alterações - Documento {documentId}
            </DialogTitle>
            <DialogDescription>
              Acompanhe todas as ações realizadas neste documento
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-woopi-ai-gray" />
              <Input
                placeholder="Buscar no histórico..."
                value={documentHistorySearch}
                onChange={(e) => setDocumentHistorySearch(e.target.value)}
                className="pl-9 bg-white dark:bg-[#1f2132] border-woopi-ai-border h-9 text-sm focus-visible:ring-[#0073ea]"
              />
            </div>
            <Select
              value={documentHistorySort}
              onValueChange={(value: 'newest' | 'oldest') => setDocumentHistorySort(value)}
            >
              <SelectTrigger className="w-[180px] bg-white dark:bg-[#1f2132] border-woopi-ai-border h-9 text-sm focus:ring-[#0073ea]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mais recentes</SelectItem>
                <SelectItem value="oldest">Mais antigos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {filteredDocumentHistory.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-8 text-woopi-ai-gray">
                 <History className="w-8 h-8 mb-2 opacity-20" />
                 <p className="text-sm">Nenhuma alteração encontrada</p>
               </div>
            ) : (
              filteredDocumentHistory.map((entry, index) => (
              <div 
                key={entry.id}
                className="p-4 border border-woopi-ai-border rounded-lg bg-white dark:bg-[#292f4c] hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20 transition-shadow relative"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-woopi-ai-blue/10 flex items-center justify-center z-10 bg-white dark:bg-[#292f4c] ring-2 ring-white dark:ring-[#292f4c]">
                          <User className="w-4 h-4 text-woopi-ai-blue" />
                        </div>
                        <span className="font-semibold text-woopi-ai-dark-gray">{entry.user}</span>
                      </div>
                      <Badge className={`${
                        entry.action === 'Upload' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' :
                        entry.action === 'Atribuir' ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' :
                        entry.action === 'Avançar' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' :
                        entry.action === 'Editar resposta' ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' :
                        entry.action === 'Reprovar' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' :
                        entry.action === 'Finalizar' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' :
                        entry.action === 'Deletar' ? 'bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300' :
                        entry.action === 'Perguntar ao documento' ? 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300' :
                        entry.action === 'Anonimizar' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' :
                        'bg-gray-100 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300'
                      } hover:bg-opacity-100 text-xs px-2 py-1`}>
                        {entry.action}
                      </Badge>
                    </div>
                    <p className="text-sm text-woopi-ai-gray mb-1 pl-10">
                      {entry.details}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-woopi-ai-gray pl-10">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{entry.timestamp}</span>
                    </div>
                  </div>
                  {index !== filteredDocumentHistory.length - 1 && (
                    <div className="w-px bg-woopi-ai-border absolute left-[2.25rem] top-12 bottom-[-1.5rem] z-0"></div>
                  )}
                </div>
              </div>
            ))
            )}
          </div>
          
          <div className="pt-4 border-t border-woopi-ai-border flex justify-between items-center">
            <span className="text-xs text-woopi-ai-gray">
              {filteredDocumentHistory.length} {filteredDocumentHistory.length === 1 ? 'alteração registrada' : 'alterações registradas'}
            </span>
            <Button onClick={() => setIsDocumentHistoryModalOpen(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal for Historical Questions */}
      <Dialog open={isHistoryModalOpen} onOpenChange={(open) => {
        setIsHistoryModalOpen(open);
        if (!open) {
          setHistorySearchTerm('');
          setHistoryDisplayLimit(10);
          setHistoryUserFilter('all');
          setHistoryUserSearch('');
          setHistorySortOrder('newest');
        }
      }}>
        <DialogContent className="max-w-[84rem] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-woopi-ai-blue" />
              Histórico de Conversas
            </DialogTitle>
            <DialogDescription>
              Perguntas e respostas anteriores realizadas sobre este documento
            </DialogDescription>
          </DialogHeader>
          
          {/* Campos de busca e filtro */}
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-woopi-ai-gray" />
              <Input
                type="text"
                placeholder="Buscar em perguntas ou respostas..."
                value={historySearchTerm}
                onChange={(e) => {
                  setHistorySearchTerm(e.target.value);
                  setHistoryDisplayLimit(10);
                }}
                className="pl-9 border border-gray-300 dark:border-woopi-ai-border bg-white dark:bg-[#1f2132]"
              />
            </div>
            <div className="w-[220px]">
              <Select
                value={historyUserFilter}
                onValueChange={(value) => {
                  setHistoryUserFilter(value);
                  setHistoryDisplayLimit(10);
                  setHistoryUserSearch('');
                }}
              >
                <SelectTrigger className="h-9 border border-gray-300 dark:border-woopi-ai-border bg-white dark:bg-[#1f2132]">
                  <User className="w-4 h-4 mr-2 text-woopi-ai-gray shrink-0" />
                  <SelectValue placeholder="Filtrar por usuário" />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 pb-2 pt-1 sticky top-0 bg-white">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-woopi-ai-gray" />
                      <input
                        type="text"
                        placeholder="Buscar usuário..."
                        value={historyUserSearch}
                        onChange={(e) => setHistoryUserSearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        className="w-full h-8 pl-7 pr-2 text-sm border border-gray-200 dark:border-woopi-ai-border bg-white dark:bg-[#1f2132] rounded-md focus:outline-none focus:ring-1 focus:ring-[#0073ea] focus:border-[#0073ea]"
                      />
                    </div>
                  </div>
                  <SelectItem value="all">Todos os usuários</SelectItem>
                  {historyUsers
                    .filter((user) => 
                      !historyUserSearch.trim() || 
                      user.toLowerCase().includes(historyUserSearch.toLowerCase())
                    )
                    .map((user) => (
                      <SelectItem key={user} value={user}>{user}</SelectItem>
                    ))
                  }
                  {historyUsers.filter((user) => 
                    !historyUserSearch.trim() || 
                    user.toLowerCase().includes(historyUserSearch.toLowerCase())
                  ).length === 0 && historyUserSearch.trim() && (
                    <div className="px-2 py-3 text-center text-xs text-woopi-ai-gray">
                      Nenhum usuário encontrado
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            {(historySearchTerm.trim() || historyUserFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setHistorySearchTerm('');
                  setHistoryUserFilter('all');
                  setHistoryUserSearch('');
                  setHistoryDisplayLimit(10);
                }}
                className="h-9 px-3 text-xs text-woopi-ai-gray hover:text-red-600 shrink-0 gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Limpar filtros
              </Button>
            )}
          </div>
          
          {/* Barra de ordenação */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-woopi-ai-gray font-medium">
              Ordenado por: {historySortOrder === 'newest' ? 'Mais recentes' : 'Mais antigos'}
            </span>
            <button
              onClick={() => setHistorySortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-woopi-ai-dark-gray rounded-md border border-gray-300 dark:border-woopi-ai-border bg-white dark:bg-[#1f2132] hover:bg-gray-50 dark:hover:bg-[#292f4c] hover:border-[#0073ea] hover:text-[#0073ea] transition-colors"
              title={historySortOrder === 'newest' ? 'Ordenar por mais antigos' : 'Ordenar por mais recentes'}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {historySortOrder === 'newest' ? 'Mais recentes' : 'Mais antigos'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {(() => {
              // Filter interactions based on search term and user filter
              const filteredInteractions = historicalInteractions.filter((interaction) => {
                // User filter
                if (historyUserFilter !== 'all' && interaction.userName !== historyUserFilter) return false;
                // Text search
                if (!historySearchTerm.trim()) return true;
                const searchLower = historySearchTerm.toLowerCase();
                return (
                  interaction.question.toLowerCase().includes(searchLower) ||
                  interaction.answer.toLowerCase().includes(searchLower)
                );
              });
              
              // Sort by timestamp based on sort order, then group questionnaires first
              const sortedInteractions = [...filteredInteractions].sort((a, b) => {
                // Primary sort: questionnaire types grouped first
                if (a.type === 'questionnaire' && b.type !== 'questionnaire') return -1;
                if (a.type !== 'questionnaire' && b.type === 'questionnaire') return 1;
                // Secondary sort: by timestamp
                const timeA = new Date(a.timestamp.replace(' ', 'T')).getTime();
                const timeB = new Date(b.timestamp.replace(' ', 'T')).getTime();
                return historySortOrder === 'newest' ? timeB - timeA : timeA - timeB;
              });
              
              // Apply display limit for lazy loading (10 at a time)
              const displayedInteractions = sortedInteractions.slice(0, historyDisplayLimit);
              const hasMore = sortedInteractions.length > historyDisplayLimit;
              
              if (sortedInteractions.length === 0) {
                return (
                  <div className="text-center py-12 text-woopi-ai-gray">
                    <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">
                      {historySearchTerm.trim() || historyUserFilter !== 'all'
                        ? 'Nenhuma interação encontrada para os filtros aplicados' 
                        : 'Nenhuma interação anterior registrada'}
                    </p>
                  </div>
                );
              }
              
              return (
                <>
                  {displayedInteractions.map((interaction) => (
                <div 
                  key={interaction.id} 
                  className="p-3 bg-white dark:bg-[#292f4c] rounded-lg border border-woopi-ai-border hover:border-woopi-ai-blue transition-colors"
                >
                  {/* Header da interação */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#0073ea]" />
                        <span className="text-xs font-medium text-woopi-ai-dark-gray">{interaction.userName}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-woopi-ai-gray" />
                        <span className="text-xs text-woopi-ai-gray">{interaction.timestamp}</span>
                      </div>
                    </div>
                    <Badge 
                      className={`text-xs px-2 py-0.5 ${
                        interaction.type === 'questionnaire' 
                          ? 'bg-purple-100 text-purple-700 border-purple-200' 
                          : 'bg-blue-100 text-blue-700 border-blue-200'
                      }`}
                    >
                      {interaction.type === 'questionnaire' ? 'Questionário' : 'Pergunta Livre'}
                    </Badge>
                  </div>
                  
                  {/* Pergunta com ícone de copiar */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MessageCircle className="w-3.5 h-3.5 text-woopi-ai-gray" />
                        <span className="text-xs font-semibold text-woopi-ai-gray uppercase tracking-wide">Pergunta</span>
                      </div>
                      <p className="text-sm text-woopi-ai-dark-gray font-medium">
                        {interaction.question}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        copyToClipboard(`Pergunta: ${interaction.question}\n\nResposta: ${interaction.answer}`);
                        toast.success('Conversa copiada para a área de transferência');
                      }}
                      className="shrink-0 p-1 rounded hover:bg-gray-100 text-woopi-ai-gray hover:text-[#0073ea] transition-colors"
                      title="Copiar conversa"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  {/* Resposta */}
                  <div className="p-2.5 bg-gray-50 dark:bg-[#1f2132] rounded-md border border-gray-200 dark:border-woopi-ai-border">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-xs font-semibold text-woopi-ai-gray uppercase tracking-wide">Resposta</span>
                    </div>
                    <p className="text-sm text-woopi-ai-dark-gray leading-relaxed whitespace-pre-wrap">
                      {interaction.answer}
                    </p>
                  </div>
                </div>
                  ))}
                  
                  {/* Botão Carregar Mais */}
                  {hasMore && (
                    <div className="flex justify-center pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setHistoryDisplayLimit(prev => prev + 10)}
                        className="w-full"
                      >
                        Carregar mais ({sortedInteractions.length - historyDisplayLimit} restantes)
                      </Button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
          
          <div className="pt-4 border-t border-woopi-ai-border flex justify-between items-center">
            <span className="text-xs text-woopi-ai-gray">
              {(() => {
                const filteredCount = historicalInteractions.filter((interaction) => {
                  if (historyUserFilter !== 'all' && interaction.userName !== historyUserFilter) return false;
                  if (!historySearchTerm.trim()) return true;
                  const searchLower = historySearchTerm.toLowerCase();
                  return (
                    interaction.question.toLowerCase().includes(searchLower) ||
                    interaction.answer.toLowerCase().includes(searchLower)
                  );
                }).length;
                
                const hasFilters = historySearchTerm.trim() || historyUserFilter !== 'all';
                if (hasFilters) {
                  return `${filteredCount} de ${historicalInteractions.length} ${filteredCount === 1 ? 'interação encontrada' : 'interações encontradas'}`;
                }
                return `${historicalInteractions.length} ${historicalInteractions.length === 1 ? 'interação' : 'interações'} registrada${historicalInteractions.length === 1 ? '' : 's'}`;
              })()}
            </span>
            <Button onClick={() => setIsHistoryModalOpen(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Anonymization History Modal */}
      {showAnonymizationModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAnonymizationModal(false); }}
        >
          <div
            className="relative flex flex-col rounded-2xl shadow-2xl overflow-hidden"
            style={{
              width: 480,
              maxWidth: '95vw',
              maxHeight: '82vh',
              background: '#fff',
              border: '1.5px solid #d1fae5',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)', borderBottom: '1px solid #bbf7d0' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 2px 8px rgba(16,185,129,0.3)' }}
                >
                  <ShieldCheckIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold" style={{ color: '#065f46' }}>Histórico de Anonimizações</h2>
                  <p className="text-[11px]" style={{ color: '#6ee7b7' }}>
                    {anonymizationHistory.length} {anonymizationHistory.length === 1 ? 'versão gerada' : 'versões geradas'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAnonymizationModal(false)}
                className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors hover:bg-white/60"
                style={{ color: '#6ee7b7' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cards list */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5" style={{ background: '#f9fafb' }}>
              {anonymizationHistory.map((entry, index) => {
                const isFirst = index === 0;
                const date = entry.timestamp;
                const dateLabel = date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
                const timeLabel = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => { window.open(entry.url, '_blank'); }}
                    className="w-full text-left group rounded-xl border transition-all duration-150 overflow-hidden"
                    style={{
                      background: isFirst ? '#fff' : '#fff',
                      borderColor: isFirst ? '#6ee7b7' : '#e5e7eb',
                      boxShadow: isFirst ? '0 2px 12px rgba(16,185,129,0.10)' : '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#6ee7b7';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(16,185,129,0.15)';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = isFirst ? '#6ee7b7' : '#e5e7eb';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = isFirst ? '0 2px 12px rgba(16,185,129,0.10)' : '0 1px 4px rgba(0,0,0,0.04)';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="flex items-stretch">
                      {/* Left color bar */}
                      <div
                        className="w-1 flex-shrink-0"
                        style={{ background: isFirst ? 'linear-gradient(180deg, #10b981, #059669)' : '#e5e7eb' }}
                      />
                      <div className="flex-1 px-4 py-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {isFirst && (
                              <span
                                className="flex-shrink-0 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full"
                                style={{ background: '#d1fae5', color: '#059669' }}
                              >
                                Mais recente
                              </span>
                            )}
                            <span className="text-xs font-semibold truncate" style={{ color: '#111827' }}>
                              {entry.docName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <ExternalLink
                              className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity"
                              style={{ color: '#059669' }}
                            />
                          </div>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" style={{ color: '#9ca3af' }} />
                            <span className="text-[11px] capitalize" style={{ color: '#6b7280' }}>{dateLabel}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" style={{ color: '#9ca3af' }} />
                            <span className="text-[11px]" style={{ color: '#6b7280' }}>{timeLabel}</span>
                          </div>
                          {entry.type && (
                            <span
                              className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                              style={{ background: '#f3f4f6', color: '#374151' }}
                            >
                              {entry.type}
                            </span>
                          )}
                        </div>
                        {entry.workflowTitle && (
                          <div className="mt-1 flex items-center gap-1">
                            <Briefcase className="w-3 h-3 flex-shrink-0" style={{ color: '#9ca3af' }} />
                            <span className="text-[11px] truncate" style={{ color: '#9ca3af' }}>{entry.workflowTitle}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div
              className="flex-shrink-0 flex items-center justify-between px-6 py-3"
              style={{ background: '#fff', borderTop: '1px solid #e5e7eb' }}
            >
              <span className="text-[11px]" style={{ color: '#9ca3af' }}>
                Clique em um item para abrir em nova aba
              </span>
              <button
                type="button"
                onClick={() => setShowAnonymizationModal(false)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: '#f3f4f6', color: '#374151' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#e5e7eb'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f3f4f6'; }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}