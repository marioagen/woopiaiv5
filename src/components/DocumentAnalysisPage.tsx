import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { Resizable } from 're-resizable';
import { 
  ArrowLeft,
  CheckCircle,
  FileText,
  Hash,
  Calendar,
  CreditCard,
  Building,
  DollarSign,
  Key,
  Clock,
  Eye,
  Copy,
  Check,
  Columns2,
  PanelLeft,
  PanelRight,
  CircleX,
  Search,
  X,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { AnonimizarButton, AnonymizationResult, ANONYMIZATION_TYPES } from './AnonimizarButton';

// ---------------------------------------------------------------------------
// Anonymized document preview — simulates a redacted contract
// ---------------------------------------------------------------------------

function getRedaction(text: string, type: string): React.ReactNode {
  if (!type || type === 'mascaramento_total') {
    return <span className="inline-block align-middle bg-gray-800 dark:bg-gray-200 text-transparent rounded-sm select-none leading-none" style={{ letterSpacing: 0, fontSize: 'inherit' }}>{'\u2588'.repeat(text.length)}</span>;
  }
  if (type === 'mascaramento_parcial') {
    const visible = text.slice(0, Math.max(1, Math.floor(text.length * 0.3)));
    return <><span className="opacity-60">{visible}</span><span className="inline-block align-middle bg-gray-700 dark:bg-gray-300 text-transparent rounded-sm select-none">{'\u2588'.repeat(text.length - visible.length)}</span></>;
  }
  if (type === 'substituir_iniciais') {
    const initials = text.split(' ').filter(Boolean).map(w => w[0].toUpperCase() + '.').join(' ');
    return <span className="font-mono text-amber-700 dark:text-amber-400">{initials}</span>;
  }
  if (type === 'dados_ficticios') {
    const fakeMap: Record<string, string> = {
      'Empresa ABC Tecnologia Ltda': 'Sigma Corp Soluções Ltda',
      'Fornecedor XYZ S.A.': 'Omega Suprimentos S.A.',
      '12.345.678/0001-90': '99.888.777/0001-11',
      '98.765.432/0001-10': '11.222.333/0001-44',
      'Av. Paulista, 1000 - São Paulo/SP': 'Rua das Nações, 200 - Curitiba/PR',
      'Rua das Flores, 500 - Rio de Janeiro/RJ': 'Av. Central, 800 - Belo Horizonte/MG',
      'R$ 450.000,00': 'R$ 312.000,00',
      'R$ 37.500,00': 'R$ 26.000,00',
    };
    return <span className="text-purple-700 dark:text-purple-400 italic">{fakeMap[text] ?? text.split('').reverse().join('').slice(0, text.length)}</span>;
  }
  if (type === 'referencias_relativas') {
    const refMap: Record<string, string> = {
      'Empresa ABC Tecnologia Ltda': 'Parte Contratante',
      'Fornecedor XYZ S.A.': 'Parte Contratada',
      '12.345.678/0001-90': 'CNPJ da Contratante',
      '98.765.432/0001-10': 'CNPJ da Contratada',
      'Av. Paulista, 1000 - São Paulo/SP': 'Sede da Contratante',
      'Rua das Flores, 500 - Rio de Janeiro/RJ': 'Sede da Contratada',
    };
    return <span className="text-blue-700 dark:text-blue-400 font-medium">[{refMap[text] ?? 'Dado referenciado'}]</span>;
  }
  return <span className="inline-block bg-gray-800 text-transparent rounded-sm select-none">{'\u2588'.repeat(text.length)}</span>;
}

interface AnonymizedDocumentViewProps {
  type: string;
}

function AnonymizedDocumentView({ type }: AnonymizedDocumentViewProps) {
  const R = (text: string) => getRedaction(text, type);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-woopi-ai-border overflow-hidden">
      {/* Anonymized badge banner */}
      <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 border-b border-emerald-200">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span className="text-xs font-medium text-emerald-700">
          Versão anonimizada —{' '}
          {ANONYMIZATION_TYPES.find(t => t.value === type)?.label ?? 'Mascaramento total'}
        </span>
      </div>

      {/* Simulated document body */}
      <div className="p-8 font-serif text-sm text-gray-800 leading-relaxed space-y-5 max-w-2xl mx-auto">
        <div className="text-center space-y-1 mb-8">
          <p className="text-xs font-sans text-gray-400 tracking-widest uppercase">Contrato</p>
          <h2 className="text-base font-bold tracking-wide">
            CONTRATO DE FORNECIMENTO N° CT-████-████
          </h2>
        </div>

        <p>
          Pelo presente instrumento particular de contrato de fornecimento de materiais e
          serviços, de um lado, na qualidade de <strong>CONTRATANTE</strong>:{' '}
          <strong>{R('Empresa ABC Tecnologia Ltda')}</strong>, sociedade limitada inscrita no
          CNPJ/ME sob n° <strong>{R('12.345.678/0001-90')}</strong>, com sede
          à {R('Av. Paulista, 1000 - São Paulo/SP')}.
        </p>

        <p>
          E do outro lado, na qualidade de <strong>CONTRATADA</strong>:{' '}
          <strong>{R('Fornecedor XYZ S.A.')}</strong>, inscrita no CNPJ/ME sob n°{' '}
          <strong>{R('98.765.432/0001-10')}</strong>, com sede
          à {R('Rua das Flores, 500 - Rio de Janeiro/RJ')}.
        </p>

        <div className="border-l-2 border-gray-200 pl-4 space-y-2">
          <p className="font-sans text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Cláusula 1ª — Objeto
          </p>
          <p>
            O presente contrato tem por objeto o fornecimento de materiais de escritório e
            equipamentos conforme especificações constantes no Anexo I.
          </p>
        </div>

        <div className="border-l-2 border-gray-200 pl-4 space-y-2">
          <p className="font-sans text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Cláusula 2ª — Valor e Pagamento
          </p>
          <p>
            O valor total do contrato é de <strong>{R('R$ 450.000,00')}</strong>, a ser pago
            mensalmente em parcelas de <strong>{R('R$ 37.500,00')}</strong>, mediante boleto
            bancário com vencimento em 30 dias.
          </p>
        </div>

        <div className="border-l-2 border-gray-200 pl-4 space-y-2">
          <p className="font-sans text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Cláusula 3ª — Vigência
          </p>
          <p>
            Este contrato vigorará pelo prazo de <strong>12 (doze) meses</strong>, com início
            em <strong>01/02/2024</strong> e término em <strong>31/01/2025</strong>, podendo
            ser renovado mediante acordo entre as partes.
          </p>
        </div>

        <div className="border-l-2 border-gray-200 pl-4 space-y-2">
          <p className="font-sans text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Cláusula 4ª — Reajuste
          </p>
          <p>
            Os valores serão reajustados trimestralmente pelo índice <strong>IPCA</strong>,
            acumulado no período.
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 space-y-8 text-xs text-gray-500 font-sans">
          <p className="text-center">São Paulo, 15 de janeiro de 2024.</p>
          <div className="grid grid-cols-2 gap-8 text-center">
            <div className="space-y-1">
              <div className="border-b border-gray-300 pb-1 mb-2">&nbsp;</div>
              <p className="font-medium">{R('Empresa ABC Tecnologia Ltda')}</p>
              <p className="text-gray-400">CONTRATANTE</p>
            </div>
            <div className="space-y-1">
              <div className="border-b border-gray-300 pb-1 mb-2">&nbsp;</div>
              <p className="font-medium">{R('Fornecedor XYZ S.A.')}</p>
              <p className="text-gray-400">CONTRATADA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DocumentViewerPanel — toolbar + viewer area shared by split and doc-only modes
// ---------------------------------------------------------------------------

interface DocumentViewerPanelProps {
  workflowName: string;
  documentName: string;
  anonymizationResult: AnonymizationResult | null;
  docView: 'original' | 'anonymized';
  onDocViewChange: (v: 'original' | 'anonymized') => void;
  onAnonymized: (result: AnonymizationResult) => void;
  onDownload: () => void;
  hideAnonymize?: boolean;
}

function DocumentViewerPanel({
  workflowName,
  documentName,
  anonymizationResult,
  docView,
  onDocViewChange,
  onAnonymized,
  onDownload,
  hideAnonymize = false,
}: DocumentViewerPanelProps) {
  return (
    <div className="space-y-4">
      {/* Title row */}
      <div className="text-center">
        <h3 className="text-sm text-woopi-ai-dark-gray">
          <span className="font-bold">{workflowName}</span> -{' '}
          <span className="font-medium">{documentName}</span>
        </h3>
      </div>

      {/* Toolbar row */}
      <div className="flex items-center gap-2 text-xs text-woopi-ai-gray flex-wrap">
        <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
          Anterior
        </Button>
        <span>Página 1 de 2</span>
        <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
          Próxima
        </Button>

        <div className="ml-auto flex items-center gap-2">
          {anonymizationResult ? (
            <>
              {/* View toggle pill */}
              <div className="flex items-center rounded-md border border-border overflow-hidden text-xs font-medium shadow-sm">
                <button
                  onClick={() => onDocViewChange('original')}
                  className={`flex items-center gap-1.5 px-3 h-7 transition-colors ${
                    docView === 'original'
                      ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                      : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  Original
                </button>
                <div className="w-px h-7 bg-border" />
                <button
                  onClick={() => onDocViewChange('anonymized')}
                  className={`flex items-center gap-1.5 px-3 h-7 transition-colors ${
                    docView === 'anonymized'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  Anonimizado
                </button>
              </div>

              {/* Download anonymized */}
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="h-7 px-2 text-xs flex items-center gap-1.5 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <Download className="w-3 h-3" />
                Baixar
              </Button>

              {/* Re-anonymize */}
              {!hideAnonymize && (
                <AnonimizarButton
                  onAnonymized={onAnonymized}
                  variant="re-anonymize"
                />
              )}
            </>
          ) : (
            !hideAnonymize && <AnonimizarButton onAnonymized={onAnonymized} />
          )}
        </div>
      </div>

      {/* Document viewer area */}
      {docView === 'anonymized' && anonymizationResult ? (
        <AnonymizedDocumentView type={anonymizationResult.type} />
      ) : (
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
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

interface ExtractedField {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  confidence: number;
  category: 'Identificação' | 'Valores' | 'Datas' | 'Endereço' | 'Outros';
}

const PATH_DOCUMENTS = '/documentos';
const PATH_WORKFLOW_BOARD = '/documentos/workflow';

export function DocumentAnalysisPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id, workflow } = useParams();

  const fromWorkflow = searchParams.get('from') === 'workflow';
  const returnPath = fromWorkflow ? PATH_WORKFLOW_BOARD : PATH_DOCUMENTS;
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'document' | 'split' | 'fields'>('split');
  
  // Resizable column width state
  const [leftColumnWidth, setLeftColumnWidth] = useState(50); // percentage

  // Anonymization state
  const [anonymizationResult, setAnonymizationResult] = useState<AnonymizationResult | null>(null);
  const [docView, setDocView] = useState<'original' | 'anonymized'>('original');

  const handleAnonymized = (result: AnonymizationResult) => {
    setAnonymizationResult(result);
    setDocView('anonymized');
  };

  const handleDownloadAnonymized = () => {
    if (!anonymizationResult) return;
    const a = document.createElement('a');
    a.href = anonymizationResult.downloadUrl;
    a.download = 'documento_anonimizado.pdf';
    a.click();
    toast.success('Download iniciado!');
  };

  // Mock document database - simulating fetching by ID
  const documentDatabase: Record<string, { name: string; type: string }> = {
    '1': { name: 'Contrato_Fornecedor_2024.pdf', type: 'PDF' },
    '2': { name: 'Relatório_Financeiro_Q1.xlsx', type: 'Excel' },
    '3': { name: 'Apresentação_Projeto.pptx', type: 'PowerPoint' },
    '4': { name: 'Manual_Procedimentos.docx', type: 'Word' },
    '5': { name: 'Fatura_Janeiro_2024.pdf', type: 'PDF' },
    '6': { name: 'Política_Segurança.pdf', type: 'PDF' },
    '7': { name: 'Planilha_Custos.xlsx', type: 'Excel' },
    '8': { name: 'Ata_Reunião_Janeiro.docx', type: 'Word' },
  };

  // Get document info from database or use default
  const documentInfo = id && documentDatabase[id] 
    ? documentDatabase[id] 
    : { name: 'Documento.pdf', type: 'PDF' };

  const workflowName = workflow ? decodeURIComponent(workflow) : 'Workflow Padrão';

  // Mock extraction data
  const extractedFields: ExtractedField[] = [
    {
      id: 'contract-number',
      label: 'Número do Contrato',
      value: 'CT-2024-0012',
      icon: <Hash className="w-4 h-4" />,
      confidence: 98,
      category: 'Identificação'
    },
    {
      id: 'contractor-name',
      label: 'Razão Social Contratante',
      value: 'Empresa ABC Tecnologia Ltda',
      icon: <Building className="w-4 h-4" />,
      confidence: 99,
      category: 'Identificação'
    },
    {
      id: 'contractor-cnpj',
      label: 'CNPJ Contratante',
      value: '12.345.678/0001-90',
      icon: <CreditCard className="w-4 h-4" />,
      confidence: 99,
      category: 'Identificação'
    },
    {
      id: 'contracted-name',
      label: 'Razão Social Contratada',
      value: 'Fornecedor XYZ S.A.',
      icon: <Building className="w-4 h-4" />,
      confidence: 98,
      category: 'Identificação'
    },
    {
      id: 'contracted-cnpj',
      label: 'CNPJ Contratada',
      value: '98.765.432/0001-10',
      icon: <CreditCard className="w-4 h-4" />,
      confidence: 99,
      category: 'Identificação'
    },
    {
      id: 'total-value',
      label: 'Valor Total do Contrato',
      value: 'R$ 450.000,00',
      icon: <DollarSign className="w-4 h-4" />,
      confidence: 97,
      category: 'Valores'
    },
    {
      id: 'monthly-value',
      label: 'Valor Mensal',
      value: 'R$ 37.500,00',
      icon: <DollarSign className="w-4 h-4" />,
      confidence: 96,
      category: 'Valores'
    },
    {
      id: 'payment-method',
      label: 'Forma de Pagamento',
      value: 'Boleto bancário - 30 dias',
      icon: <Clock className="w-4 h-4" />,
      confidence: 94,
      category: 'Valores'
    },
    {
      id: 'signature-date',
      label: 'Data de Assinatura',
      value: '15/01/2024',
      icon: <Calendar className="w-4 h-4" />,
      confidence: 99,
      category: 'Datas'
    },
    {
      id: 'start-date',
      label: 'Data de Início',
      value: '01/02/2024',
      icon: <Calendar className="w-4 h-4" />,
      confidence: 98,
      category: 'Datas'
    },
    {
      id: 'end-date',
      label: 'Data de Término',
      value: '31/01/2025',
      icon: <Calendar className="w-4 h-4" />,
      confidence: 98,
      category: 'Datas'
    },
    {
      id: 'duration',
      label: 'Vigência',
      value: '12 meses',
      icon: <Clock className="w-4 h-4" />,
      confidence: 99,
      category: 'Datas'
    },
    {
      id: 'contractor-address',
      label: 'Endereço Contratante',
      value: 'Av. Paulista, 1000 - São Paulo/SP',
      icon: <Building className="w-4 h-4" />,
      confidence: 95,
      category: 'Endereço'
    },
    {
      id: 'contracted-address',
      label: 'Endereço Contratada',
      value: 'Rua das Flores, 500 - Rio de Janeiro/RJ',
      icon: <Building className="w-4 h-4" />,
      confidence: 94,
      category: 'Endereço'
    },
    {
      id: 'contract-object',
      label: 'Objeto do Contrato',
      value: 'Fornecimento de materiais de escritório e equipamentos',
      icon: <FileText className="w-4 h-4" />,
      confidence: 96,
      category: 'Outros'
    },
    {
      id: 'adjustment-clause',
      label: 'Cláusula de Reajuste',
      value: 'IPCA - Trimestral',
      icon: <Key className="w-4 h-4" />,
      confidence: 92,
      category: 'Outros'
    }
  ];

  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 95) return 'bg-green-100 text-green-700 border-green-200';
    if (confidence >= 85) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-orange-100 text-orange-700 border-orange-200';
  };

  const handleCopyField = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    toast.success(`${label} copiado!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleApproveDocument = () => {
    toast.success('Documento aprovado com sucesso!');
    setTimeout(() => {
      navigate(returnPath);
    }, 1500);
  };

  const handleBack = () => {
    navigate(returnPath);
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
    setTimeout(() => navigate(returnPath), 1500);
  };

  // Group fields by category
  const groupedFields = extractedFields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, ExtractedField[]>);

  return (
    <div className="h-screen flex flex-col document-analysis-page">
      {/* Header */}
      <div className="flex-shrink-0 p-4 md:p-6 border-b border-woopi-ai-border bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 text-woopi-ai-gray hover:text-woopi-ai-dark-gray"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">
                {returnPath === PATH_WORKFLOW_BOARD
                  ? 'Esteiras de Processamento'
                  : 'Documentos e Análise'}
              </span>
              <span className="sm:hidden">Voltar</span>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold woopi-ai-text-primary">
                Análise de Documento
              </h1>
              <p className="woopi-ai-text-secondary text-sm md:text-base">
                Revise e confirme os dados extraídos pela IA
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
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
              <Label htmlFor="reprovar-justificativa-analysis" className="text-sm font-medium dark:text-[#d5d8e0]">
                Justificativa <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reprovar-justificativa-analysis"
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
              className="bg-gray-50 border-r border-woopi-ai-border flex flex-col"
            >
              <div className="flex-1 overflow-y-auto p-4">
                <DocumentViewerPanel
                  workflowName={workflowName}
                  documentName={documentInfo.name}
                  anonymizationResult={anonymizationResult}
                  docView={docView}
                  onDocViewChange={setDocView}
                  onAnonymized={handleAnonymized}
                  onDownload={handleDownloadAnonymized}
                  hideAnonymize={fromWorkflow}
                />
              </div>
            </Resizable>
          )}

          {/* Document Viewer - Left Side - Document Only Mode */}
          {viewMode === 'document' && (
            <div className="bg-gray-50 border-r border-woopi-ai-border flex flex-col w-full">
              <div className="flex-1 overflow-y-auto p-4">
                <DocumentViewerPanel
                  workflowName={workflowName}
                  documentName={documentInfo.name}
                  anonymizationResult={anonymizationResult}
                  docView={docView}
                  onDocViewChange={setDocView}
                  onAnonymized={handleAnonymized}
                  onDownload={handleDownloadAnonymized}
                  hideAnonymize={fromWorkflow}
                />
              </div>
            </div>
          )}

          {/* Extraction Panel - Right Side */}
          {(viewMode === 'fields' || viewMode === 'split') && (
            <div 
              className={`bg-white flex flex-col ${
                viewMode === 'split' ? 'flex-1' : 'w-full'
              }`}
            >
              {/* Fields content with independent scroll */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Extracted Fields by Category */}
                {Object.entries(groupedFields).map(([category, fields]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold woopi-ai-text-primary mb-4 flex items-center gap-2">
                      <div className="w-1 h-4 bg-[#0073ea] rounded"></div>
                      {category}
                    </h3>
                    <div className="space-y-3">
                      {fields.map((field) => (
                        <Card key={field.id} className="woopi-ai-card hover:border-[#0073ea] transition-colors group">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="text-woopi-ai-gray">
                                  {field.icon}
                                </div>
                                <label className="text-sm woopi-ai-text-secondary">
                                  {field.label}
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getConfidenceBadgeColor(field.confidence)}`}
                                >
                                  {field.confidence}%
                                </Badge>
                                <button
                                  onClick={() => handleCopyField(field.label, field.value)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                                  title="Copiar valor"
                                >
                                  {copiedField === field.label ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Copy className="w-4 h-4 text-gray-500" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <p className="woopi-ai-text-primary break-words pl-6">
                              {field.value}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Statistics Card */}
                <Card className="woopi-ai-card border-l-4 border-l-[#0073ea]">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold woopi-ai-text-primary mb-4">
                      Estatísticas da Extração
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold woopi-ai-text-primary">
                          {extractedFields.length}
                        </p>
                        <p className="text-xs woopi-ai-text-secondary mt-1">
                          Campos Extraídos
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {Math.round(
                            extractedFields.reduce((sum, f) => sum + f.confidence, 0) /
                              extractedFields.length
                          )}%
                        </p>
                        <p className="text-xs woopi-ai-text-secondary mt-1">
                          Confiança Média
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold woopi-ai-text-primary">
                          {extractedFields.filter(f => f.confidence >= 95).length}
                        </p>
                        <p className="text-xs woopi-ai-text-secondary mt-1">
                          Alta Confiança
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Card */}
                <Card className="woopi-ai-card">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold woopi-ai-text-primary mb-3">
                      Resumo Automático
                    </h3>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm woopi-ai-text-primary leading-relaxed">
                        Contrato de fornecimento de materiais e serviços com vigência de 12 meses, 
                        valor total de R$ 450.000,00, com cláusulas de reajuste trimestral e condições 
                        especiais de pagamento. Todos os campos obrigatórios foram extraídos com alta 
                        confiança e o documento está apto para processamento.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}