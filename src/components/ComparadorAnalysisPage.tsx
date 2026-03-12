import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FileDiff,
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  Send,
  Plus,
  Minus,
  RotateCcw,
  X,
  PanelLeftClose,
  PanelRightClose,
  ListChecks,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { toast } from 'sonner@2.0.3';

// ─── Types ───
interface DiffItem {
  id: string;
  type: 'ADDED' | 'REMOVED' | 'MODIFIED';
  content: string;
  context: string;
  page: number;
  explanation: string;
  /** Text to search/highlight in V1 document */
  v1SearchKey?: string;
  /** Text to search/highlight in V2 document */
  v2SearchKey?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/** Which diff is currently active + highlight color info */
interface ActiveDiffHighlight {
  diff: DiffItem;
  bgColor: string;
  borderColor: string;
}

// ─── Color Maps ───
const DIFF_COLORS = {
  ADDED: { bg: 'rgba(16,185,129,0.18)', border: '#10b981', ring: 'ring-emerald-400' },
  REMOVED: { bg: 'rgba(239,68,68,0.18)', border: '#ef4444', ring: 'ring-red-400' },
  MODIFIED: { bg: 'rgba(245,158,11,0.18)', border: '#f59e0b', ring: 'ring-amber-400' },
};

// ─── Mock Data ───
const mockV1Pages = [
  {
    page: 1,
    text: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS – VERSÃO 1

CONTRATO nº 2024/001

CONTRATANTE: Empresa Alta Tecnologia Ltda., com sede na Rua das Inovações, 500, São Paulo/SP, inscrita no CNPJ sob o nº 12.345.678/0001-90.

CONTRATADA: Software Solutions S.A., com sede na Av. Digital, 1200, Campinas/SP, inscrita no CNPJ sob o nº 98.765.432/0001-10.

As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas e condições a seguir descritas.

CLÁUSULA 1 – DO OBJETO
O presente contrato tem por objeto a prestação de serviços de desenvolvimento, manutenção e suporte de software, incluindo atividades de análise de requisitos, implementação, testes e implantação.

CLÁUSULA 2 – DO PRAZO
O prazo de vigência deste contrato é de 12 (doze) meses, contados a partir da data de assinatura, podendo ser prorrogado mediante termo aditivo.

CLÁUSULA 3 – DO VALOR
Pelo serviço prestado, a CONTRATANTE pagará à CONTRATADA o valor mensal de R$ 25.000,00 (vinte e cinco mil reais), totalizando R$ 300.000,00 (trezentos mil reais) no período de vigência do contrato.`,
  },
  {
    page: 2,
    text: `CLÁUSULA 4 – DO PAGAMENTO
O pagamento será realizado mensalmente, até o dia 15 (quinze) de cada mês subsequente à prestação dos serviços, mediante apresentação de nota fiscal.

CLÁUSULA 5 – DAS OBRIGAÇÕES DA CONTRATADA
a) Executar os serviços com qualidade e dentro dos prazos estabelecidos;
b) Manter equipe técnica qualificada para a execução dos serviços;
c) Garantir a confidencialidade das informações da CONTRATANTE;
d) Fornecer relatórios mensais de acompanhamento dos serviços.

CLÁUSULA 6 – REAJUSTE
O valor poderá ser reajustado anualmente pelo índice IPCA.

CLÁUSULA 7 – PENALIDADES
Em caso de descumprimento contratual, será aplicada multa equivalente a 10% do valor mensal.

CLÁUSULA 8 – DA CONFIDENCIALIDADE
As partes comprometem-se a manter sigilo sobre todas as informações confidenciais trocadas durante a vigência deste contrato, incluindo dados de clientes, estratégias de negócio e propriedade intelectual.

CLÁUSULA 9 – RESCISÃO
O contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de 30 dias.

São Paulo, 15 de janeiro de 2024.

_________________________          _________________________
CONTRATANTE                        CONTRATADA`,
  },
];

const mockV2Pages = [
  {
    page: 1,
    text: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS – VERSÃO 2

CONTRATO nº 2024/001-A

CONTRATANTE: Empresa Alta Tecnologia Ltda., com sede na Rua das Inovações, 500, São Paulo/SP, inscrita no CNPJ sob o nº 12.345.678/0001-90.

CONTRATADA: Software Solutions S.A., com sede na Av. Digital, 1200, Campinas/SP, inscrita no CNPJ sob o nº 98.765.432/0001-10.

As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas e condições a seguir descritas.

CLÁUSULA 1 – DO OBJETO
O presente contrato tem por objeto a prestação de serviços de desenvolvimento, manutenção e suporte de software e consultoria em software, incluindo atividades de análise de requisitos, implementação, testes e implementação.

CLÁUSULA 2 – DO PRAZO
O prazo de vigência deste contrato é de 24 (vinte e quatro) meses, contados a partir da data de assinatura, podendo ser prorrogado mediante termo aditivo assinado por ambas as partes.

CLÁUSULA 3 – DO VALOR
Pelo serviço prestado, a CONTRATANTE pagará à CONTRATADA o valor mensal de R$ 35.000,00 (trinta e cinco mil reais), totalizando R$ 840.000,00 (oitocentos e quarenta mil reais) no período de vigência do contrato.`,
  },
  {
    page: 2,
    text: `CLÁUSULA 4 – DO PAGAMENTO
O valor mensal será de R$ 35.000,00 (trinta e cinco mil reais), com pagamento em até 15 dias após a emissão da nota fiscal.

CLÁUSULA 5 – DAS OBRIGAÇÕES DA CONTRATADA
a) Executar os serviços com qualidade e dentro dos prazos estabelecidos;
b) Manter equipe técnica qualificada e certificada para a execução dos serviços;
c) Garantir a confidencialidade das informações da CONTRATANTE;
d) Fornecer relatórios mensais de acompanhamento dos serviços;
e) Disponibilizar suporte técnico 24/7 para incidentes críticos.

CLÁUSULA 6 – REAJUSTE
O valor poderá ser reajustado anualmente pelo índice IPCA, aplicado sobre o valor vigente na data do reajuste.

CLÁUSULA 7 – PENALIDADES
Em caso de descumprimento contratual, será aplicada multa equivalente a 15% do valor mensal, além de possível suspensão dos serviços.

CLÁUSULA 8 – RESCISÃO
O contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de 60 dias, com pagamento proporcional aos serviços já prestados.

CLÁUSULA 9 – SLA DE ATENDIMENTO
A CONTRATADA compromete-se a atender chamados críticos em até 2 horas e chamados normais em até 8 horas úteis.

São Paulo, 15 de março de 2024.

_________________________          _________________________
CONTRATANTE                        CONTRATADA`,
  },
];

const mockDifferences: DiffItem[] = [
  {
    id: 'diff-1',
    type: 'MODIFIED',
    content: '"CONTRATO DE PRESTAÇÃO DE SERVIÇOS – VERSÃO 2"',
    context: 'Contexto: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS – VERSÃO 1" → CONTRATANTE: Empresa Alta Tecnologia Ltda...',
    page: 1,
    explanation: 'O número da versão do contrato foi alterado.',
    v1SearchKey: 'VERSÃO 1',
    v2SearchKey: 'VERSÃO 2',
  },
  {
    id: 'diff-2',
    type: 'MODIFIED',
    content: '"suporte de software e consultoria em software, incluindo atividades de análise de requisitos, implementação, testes e implementação."',
    context: 'Contexto: "...O presente contrato tem por objeto a prestação de serviços de desenvolvimento, manutenção e suporte de software, incluindo atividades de análise de requisitos, implementação, testes e implantação..."',
    page: 1,
    explanation: 'A descrição dos serviços foi alterada.',
    v1SearchKey: 'suporte de software, incluindo',
    v2SearchKey: 'suporte de software e consultoria em software',
  },
  {
    id: 'diff-3',
    type: 'MODIFIED',
    content: '"24 (vinte e quatro) meses"',
    context: 'Contexto: "O prazo de vigência deste contrato é de 12 (doze) meses..."',
    page: 1,
    explanation: 'O prazo do contrato foi estendido de 12 para 24 meses.',
    v1SearchKey: '12 (doze) meses',
    v2SearchKey: '24 (vinte e quatro) meses',
  },
  {
    id: 'diff-4',
    type: 'MODIFIED',
    content: '"R$ 35.000,00 (trinta e cinco mil reais)"',
    context: 'Contexto: "...a CONTRATANTE pagará à CONTRATADA o valor mensal de R$ 25.000,00..."',
    page: 1,
    explanation: 'O valor mensal foi reajustado de R$ 25.000 para R$ 35.000.',
    v1SearchKey: 'R$ 25.000,00',
    v2SearchKey: 'R$ 35.000,00',
  },
  {
    id: 'diff-5',
    type: 'ADDED',
    content: '"e) Disponibilizar suporte técnico 24/7 para incidentes críticos."',
    context: 'Contexto: Cláusula 5 – Das obrigações da contratada, após item d)',
    page: 2,
    explanation: 'Adicionada nova obrigação de suporte 24/7 para incidentes críticos.',
    v2SearchKey: 'Disponibilizar suporte técnico 24/7',
  },
  {
    id: 'diff-6',
    type: 'MODIFIED',
    content: '"multa equivalente a 15% do valor mensal, além de possível suspensão dos serviços"',
    context: 'Contexto: "...será aplicada multa equivalente a 10% do valor mensal..."',
    page: 2,
    explanation: 'A multa por descumprimento foi aumentada de 10% para 15%, com adição de possível suspensão.',
    v1SearchKey: '10% do valor mensal',
    v2SearchKey: '15% do valor mensal',
  },
  {
    id: 'diff-7',
    type: 'REMOVED',
    content: '"CLÁUSULA 8 – DA CONFIDENCIALIDADE" (cláusula inteira)',
    context: 'Contexto: "As partes comprometem-se a manter sigilo sobre todas as informações confidenciais..."',
    page: 2,
    explanation: 'A cláusula de confidencialidade foi removida do contrato.',
    v1SearchKey: 'DA CONFIDENCIALIDADE',
  },
  {
    id: 'diff-8',
    type: 'MODIFIED',
    content: '"aviso prévio de 60 dias"',
    context: 'Contexto: "O contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de 30 dias..."',
    page: 2,
    explanation: 'O prazo de aviso prévio para rescisão foi aumentado de 30 para 60 dias.',
    v1SearchKey: 'aviso prévio de 30 dias',
    v2SearchKey: 'aviso prévio de 60 dias',
  },
  {
    id: 'diff-9',
    type: 'ADDED',
    content: '"CLÁUSULA 9 – SLA DE ATENDIMENTO"',
    context: 'Contexto: Nova cláusula adicionada após a cláusula de rescisão',
    page: 2,
    explanation: 'Adicionada nova cláusula de SLA com tempos de atendimento definidos.',
    v2SearchKey: 'SLA DE ATENDIMENTO',
  },
];

// ─── PDF Page Viewer (with diff highlighting) ───
function PdfPageViewer({
  pages,
  currentPage,
  zoom,
  viewMode,
  searchTerm,
  diffHighlightKey,
  diffHighlightColor,
}: {
  pages: { page: number; text: string }[];
  currentPage: number;
  zoom: number;
  viewMode: 'pdf' | 'texto';
  searchTerm: string;
  diffHighlightKey?: string;
  diffHighlightColor?: { bg: string; border: string };
}) {
  const pageData = pages[currentPage - 1];
  if (!pageData) return null;

  const renderLine = (line: string, lineIdx: number, baseFontSize: number) => {
    if (!line.trim()) return line;

    // Diff highlight takes priority
    if (diffHighlightKey) {
      const escaped = diffHighlightKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const diffRegex = new RegExp(`(${escaped})`, 'gi');
      if (diffRegex.test(line)) {
        const parts = line.split(diffRegex);
        return parts.map((part, i) => {
          if (diffRegex.test(part)) {
            return (
              <mark
                key={`dh-${lineIdx}-${i}`}
                data-diff-highlight="true"
                className="rounded px-0.5 transition-all duration-300"
                style={{
                  backgroundColor: diffHighlightColor?.bg || 'rgba(245,158,11,0.2)',
                  borderBottom: `2px solid ${diffHighlightColor?.border || '#f59e0b'}`,
                  boxShadow: `0 0 0 1px ${diffHighlightColor?.border || '#f59e0b'}33`,
                }}
              >
                {part}
              </mark>
            );
          }
          // Within the line but outside the diff match, still apply search highlight
          return applySearchHighlight(part, `s-${lineIdx}-${i}`);
        });
      }
    }

    // Regular search highlight
    return applySearchHighlight(line, `line-${lineIdx}`);
  };

  const applySearchHighlight = (text: string, keyPrefix: string): React.ReactNode => {
    if (!searchTerm.trim()) return text;
    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={`${keyPrefix}-${i}`} className="bg-yellow-300 text-black rounded px-0.5">{part}</mark>
      ) : (
        <span key={`${keyPrefix}-${i}`}>{part}</span>
      )
    );
  };

  if (viewMode === 'texto') {
    return (
      <div
        className="p-4 sm:p-6 md:p-8"
        style={{ fontSize: `${14 * (zoom / 100)}px`, lineHeight: 1.7 }}
      >
        {pageData.text.split('\n').map((line, i) => (
          <p key={i} className={`${line.trim() === '' ? 'h-4' : ''} whitespace-pre-wrap`}>
            {renderLine(line, i, 14)}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 min-h-full">
      <div
        className="bg-white dark:bg-[#292f4c] shadow-lg border border-gray-200 dark:border-[#393e5c] rounded"
        style={{
          width: `${595 * (zoom / 100)}px`,
          maxWidth: '100%',
          minHeight: `${842 * (zoom / 100)}px`,
          padding: `${40 * (zoom / 100)}px`,
        }}
      >
        <div style={{ fontSize: `${11 * (zoom / 100)}px`, lineHeight: 1.6, color: undefined }} className="text-[#1a1a1a] dark:text-[#d5d8e0]">
          {pageData.text.split('\n').map((line, i) => {
            const isTitle = line === line.toUpperCase() && line.trim().length > 5 && !line.startsWith('_');
            const isClause = line.trim().startsWith('CLÁUSULA');
            return (
              <p
                key={i}
                className={`${line.trim() === '' ? 'h-3' : ''} whitespace-pre-wrap`}
                style={{
                  fontWeight: isTitle || isClause ? 600 : 400,
                  fontSize: isTitle ? `${13 * (zoom / 100)}px` : undefined,
                  marginBottom: isClause ? `${4 * (zoom / 100)}px` : undefined,
                  marginTop: isClause ? `${8 * (zoom / 100)}px` : undefined,
                }}
              >
                {renderLine(line, i, 11)}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Collapsed Strip ───
function CollapsedStrip({
  label,
  icon,
  color,
  side,
  onExpand,
}: {
  label: string;
  icon: React.ReactNode;
  color: string;
  side: 'left' | 'right';
  onExpand: () => void;
}) {
  return (
    <div className="w-10 flex-shrink-0 bg-gray-50 dark:bg-[#1f2132] border-r border-gray-200 dark:border-[#393e5c] last:border-r-0 flex flex-col items-center relative group cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2d3354] transition-colors"
      onClick={onExpand}
    >
      <div className="py-2 flex items-center justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1 rounded hover:bg-white dark:hover:bg-[#292f4c] transition-colors">
              {side === 'left' ? (
                <PanelRightClose className="w-3.5 h-3.5 text-gray-400 dark:text-[#7a7f9d] group-hover:text-[#0073ea] transition-colors" />
              ) : (
                <PanelLeftClose className="w-3.5 h-3.5 text-gray-400 dark:text-[#7a7f9d] group-hover:text-[#0073ea] transition-colors" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side={side === 'left' ? 'right' : 'left'}>Expandir {label}</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div
          className="flex items-center gap-1.5 whitespace-nowrap"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
          }}
        >
          <span className="text-xs text-gray-500 dark:text-[#9196b0] group-hover:text-gray-700 dark:group-hover:text-[#d5d8e0] transition-colors">{label}</span>
        </div>
      </div>
      <div className="w-5 h-1 rounded-full mb-3" style={{ backgroundColor: color }} />
    </div>
  );
}

// ─── Document Column ───
function DocumentColumn({
  title,
  pages,
  color,
  onCollapse,
  activeDiff,
  columnType,
}: {
  title: string;
  pages: { page: number; text: string }[];
  color: string;
  onCollapse: () => void;
  activeDiff?: ActiveDiffHighlight | null;
  columnType: 'v1' | 'v2';
}) {
  const [viewMode, setViewMode] = useState<'pdf' | 'texto'>('texto');
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatExpanded, setChatExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const totalPages = pages.length;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 15, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 15, 50));
  const handleZoomReset = () => setZoom(100);
  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // Determine the search key for this column based on the active diff
  const diffSearchKey = activeDiff
    ? columnType === 'v1'
      ? activeDiff.diff.v1SearchKey
      : activeDiff.diff.v2SearchKey
    : undefined;

  const diffColor = activeDiff
    ? DIFF_COLORS[activeDiff.diff.type]
    : undefined;

  // Navigate to the correct page and scroll when activeDiff changes
  useEffect(() => {
    if (!activeDiff || !diffSearchKey) return;

    const targetPage = activeDiff.diff.page;
    setCurrentPage(targetPage);

    // Wait for the page render, then scroll to highlighted element
    const scrollTimer = setTimeout(() => {
      if (!contentRef.current) return;
      const highlightEl = contentRef.current.querySelector('[data-diff-highlight="true"]');
      if (highlightEl) {
        highlightEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);

    return () => clearTimeout(scrollTimer);
  }, [activeDiff?.diff.id, diffSearchKey]);

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: `Analisando o documento: "${chatInput}"\n\nBaseado no conteúdo do ${title}, este documento trata de um contrato de prestação de serviços entre a Empresa Alta Tecnologia Ltda. e a Software Solutions S.A. O documento contém ${totalPages} páginas com ${totalPages === 2 ? '9 cláusulas' : 'múltiplas cláusulas'} regulamentando os termos do acordo.`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full min-w-0">
      {/* Column Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-[#393e5c] bg-white dark:bg-[#292f4c] flex-shrink-0 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          <span className="text-sm truncate">{title}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="flex items-center gap-0">
            <button
              onClick={() => setViewMode('pdf')}
              className={`px-2 py-1 text-xs rounded-l-md border transition-colors ${
                viewMode === 'pdf'
                  ? 'bg-[#0073ea] text-white border-[#0073ea]'
                  : 'bg-white dark:bg-[#1f2132] text-gray-600 dark:text-[#b0b4c8] border-gray-300 dark:border-[#393e5c] hover:bg-gray-50 dark:hover:bg-[#2d3354]'
              }`}
            >
              PDF
            </button>
            <button
              onClick={() => setViewMode('texto')}
              className={`px-2 py-1 text-xs rounded-r-md border border-l-0 transition-colors ${
                viewMode === 'texto'
                  ? 'bg-[#0073ea] text-white border-[#0073ea]'
                  : 'bg-white dark:bg-[#1f2132] text-gray-600 dark:text-[#b0b4c8] border-gray-300 dark:border-[#393e5c] hover:bg-gray-50 dark:hover:bg-[#2d3354]'
              }`}
            >
              Texto
            </button>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onCollapse}
                className="hidden lg:flex p-1 rounded hover:bg-gray-100 dark:hover:bg-[#393e5c] transition-colors"
              >
                <PanelLeftClose className="w-3.5 h-3.5 text-gray-400 dark:text-[#7a7f9d] hover:text-gray-600 dark:hover:text-[#d5d8e0]" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Recolher painel</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Chat area */}
      <div className="border-b border-gray-100 dark:border-[#393e5c] bg-gray-50/50 dark:bg-[#1f2132]/50 flex-shrink-0">
        {chatExpanded && chatMessages.length > 0 && (
          <div className="max-h-40 overflow-y-auto px-3 py-2 space-y-2">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`text-xs p-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-[#0073ea]/10 text-gray-700 dark:text-[#d5d8e0] ml-4'
                    : 'bg-white dark:bg-[#292f4c] border border-gray-100 dark:border-[#393e5c] text-gray-600 dark:text-[#b0b4c8] mr-4'
                }`}
              >
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} className={line.trim() === '' ? 'h-1' : ''}>{line}</p>
                ))}
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 px-3 py-2">
          {chatMessages.length > 0 && (
            <button
              onClick={() => setChatExpanded(!chatExpanded)}
              className="text-xs text-[#0073ea] hover:underline flex-shrink-0"
            >
              {chatExpanded ? 'Ocultar' : `${chatMessages.length} msgs`}
            </button>
          )}
          <div className="flex-1 flex items-center gap-1 bg-white dark:bg-[#292f4c] border border-gray-200 dark:border-[#393e5c] rounded-lg px-2 py-1.5">
            <Input
              ref={chatInputRef}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
              placeholder="Pergunte sobre este documento..."
              className="border-0 h-6 text-xs p-0 focus-visible:ring-0 shadow-none"
            />
            <button
              onClick={handleChatSend}
              disabled={!chatInput.trim()}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded bg-[#0073ea] text-white disabled:opacity-30 hover:bg-[#0060c2] transition-colors"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-100 dark:border-[#393e5c] bg-white dark:bg-[#292f4c] flex-shrink-0 mx-[10px] my-[0px]">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#393e5c] disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Página anterior</TooltipContent>
          </Tooltip>
          <span className="text-xs text-gray-600 dark:text-[#b0b4c8] min-w-[48px] text-center">
            {currentPage} / {totalPages}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#393e5c] disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Próxima página</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#393e5c] disabled:opacity-30 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Reduzir zoom</TooltipContent>
          </Tooltip>
          <button
            onClick={handleZoomReset}
            className="text-xs text-gray-500 dark:text-[#9196b0] hover:text-gray-700 dark:hover:text-[#d5d8e0] min-w-[32px] text-center"
          >
            {zoom}%
          </button>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#393e5c] disabled:opacity-30 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Aumentar zoom</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-gray-200 dark:bg-[#393e5c] mx-0.5" />

          {searchOpen ? (
            <div className="flex items-center gap-1">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                className="h-6 text-xs w-24 sm:w-28 border-gray-200 dark:border-[#393e5c]"
                autoFocus
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchTerm(''); }}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#393e5c]"
              >
                <X className="w-3 h-3 text-gray-400 dark:text-[#7a7f9d]" />
              </button>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#393e5c] transition-colors"
                >
                  <Search className="w-3.5 h-3.5 text-gray-500 dark:text-[#9196b0]" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Buscar no documento</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Active diff indicator bar */}
      {activeDiff && diffSearchKey && (
        <div
          className="flex items-center gap-2 px-3 py-1.5 text-xs flex-shrink-0 transition-all duration-300"
          style={{
            backgroundColor: diffColor?.bg || 'transparent',
            borderBottom: `2px solid ${diffColor?.border || 'transparent'}`,
          }}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: diffColor?.border }}
          />
          <span className="truncate" style={{ color: diffColor?.border }}>
            {activeDiff.diff.type === 'ADDED' ? 'Adicionado' : activeDiff.diff.type === 'REMOVED' ? 'Removido' : 'Modificado'}
            {' · PÁG '}
            {activeDiff.diff.page}
          </span>
        </div>
      )}

      {/* Document Content */}
      <div
        ref={contentRef}
        className="flex-1 overflow-auto bg-gray-100/80 dark:bg-[#1f2132]"
      >
        <PdfPageViewer
          pages={pages}
          currentPage={currentPage}
          zoom={zoom}
          viewMode={viewMode}
          searchTerm={searchTerm}
          diffHighlightKey={diffSearchKey}
          diffHighlightColor={diffColor}
        />
      </div>
    </div>
  );
}

// ─── Diff Card ───
function DiffCard({
  diff,
  isActive,
  onClick,
}: {
  diff: DiffItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const colorMap = {
    ADDED: {
      border: 'border-l-emerald-500',
      bg: 'bg-emerald-50/50 dark:bg-emerald-900/20',
      activeBg: 'bg-emerald-100/80 dark:bg-emerald-900/40',
      badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300',
      dot: 'bg-emerald-500',
      label: 'Adicionado',
      ring: 'ring-emerald-400',
    },
    REMOVED: {
      border: 'border-l-red-500',
      bg: 'bg-red-50/50 dark:bg-red-900/20',
      activeBg: 'bg-red-100/80 dark:bg-red-900/40',
      badge: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300',
      dot: 'bg-red-500',
      label: 'Removido',
      ring: 'ring-red-400',
    },
    MODIFIED: {
      border: 'border-l-amber-500',
      bg: 'bg-amber-50/50 dark:bg-amber-900/20',
      activeBg: 'bg-amber-100/80 dark:bg-amber-900/40',
      badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300',
      dot: 'bg-amber-500',
      label: 'Modificado',
      ring: 'ring-amber-400',
    },
  };

  const style = colorMap[diff.type];

  return (
    <div
      onClick={onClick}
      className={`rounded-lg border border-l-4 ${style.border} ${isActive ? style.activeBg : style.bg} p-3 cursor-pointer transition-all duration-200 ${
        isActive ? `ring-2 ${style.ring} shadow-md scale-[1.01]` : 'hover:shadow-sm hover:scale-[1.005]'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${style.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {style.label}
        </span>
        <div className="flex items-center gap-1.5">
          {isActive && (
            <span className="text-[10px] text-gray-400 dark:text-[#7a7f9d] uppercase tracking-wide">Ativo</span>
          )}
          <span className="text-xs text-gray-400 dark:text-[#7a7f9d]">PÁG {diff.page}</span>
        </div>
      </div>
      <p className="text-xs mb-2" style={{ fontWeight: 600 }}>
        {diff.content}
      </p>
      <div className="text-xs text-gray-500 dark:text-[#9196b0] mb-2 line-clamp-2">
        {diff.context}
      </div>
      <p className="text-xs text-gray-600 dark:text-[#b0b4c8] italic border-t border-gray-200/60 dark:border-[#393e5c]/60 pt-2 mt-1">
        {diff.explanation}
      </p>
    </div>
  );
}

// ─── Results Panel ───
function ResultsPanel({
  diffFilter,
  setDiffFilter,
  searchDiff,
  setSearchDiff,
  filteredDiffs,
  totalDiffs,
  addedCount,
  removedCount,
  modifiedCount,
  onCollapse,
  activeDiffId,
  onDiffClick,
}: {
  diffFilter: 'all' | 'ADDED' | 'REMOVED' | 'MODIFIED';
  setDiffFilter: (f: 'all' | 'ADDED' | 'REMOVED' | 'MODIFIED') => void;
  searchDiff: string;
  setSearchDiff: (s: string) => void;
  filteredDiffs: DiffItem[];
  totalDiffs: number;
  addedCount: number;
  removedCount: number;
  modifiedCount: number;
  onCollapse: () => void;
  activeDiffId: string | null;
  onDiffClick: (diff: DiffItem) => void;
}) {
  const activeCardRef = useRef<HTMLDivElement>(null);

  // Scroll the active card into view within the results panel
  useEffect(() => {
    if (activeDiffId && activeCardRef.current) {
      activeCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeDiffId]);

  return (
    <div className="flex flex-col h-full min-w-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-[#393e5c] flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm flex items-center gap-1.5">
            <ListChecks className="w-4 h-4 text-[#0073ea]" />
            Resumo de Alterações
          </h3>
          <div className="flex items-center gap-1">
            {activeDiffId && (
              <button
                onClick={() => onDiffClick({ id: '' } as DiffItem)}
                className="text-xs text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-[#393e5c] transition-colors"
              >
                Limpar seleção
              </button>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onCollapse}
                  className="hidden lg:flex p-1 rounded hover:bg-gray-100 dark:hover:bg-[#393e5c] transition-colors"
                >
                  <PanelRightClose className="w-3.5 h-3.5 text-gray-400 dark:text-[#7a7f9d] hover:text-gray-600 dark:hover:text-[#d5d8e0]" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Recolher painel</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => setDiffFilter(diffFilter === 'ADDED' ? 'all' : 'ADDED')}
            className={`flex items-center gap-1 text-xs cursor-pointer transition-opacity ${
              diffFilter !== 'all' && diffFilter !== 'ADDED' ? 'opacity-40' : ''
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Adicionado ({addedCount})</span>
          </button>
          <button
            onClick={() => setDiffFilter(diffFilter === 'REMOVED' ? 'all' : 'REMOVED')}
            className={`flex items-center gap-1 text-xs cursor-pointer transition-opacity ${
              diffFilter !== 'all' && diffFilter !== 'REMOVED' ? 'opacity-40' : ''
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Removido ({removedCount})</span>
          </button>
          <button
            onClick={() => setDiffFilter(diffFilter === 'MODIFIED' ? 'all' : 'MODIFIED')}
            className={`flex items-center gap-1 text-xs cursor-pointer transition-opacity ${
              diffFilter !== 'all' && diffFilter !== 'MODIFIED' ? 'opacity-40' : ''
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Modificado ({modifiedCount})</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-gray-100 dark:border-[#393e5c] flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-[#7a7f9d]" />
          <Input
            value={searchDiff}
            onChange={(e) => setSearchDiff(e.target.value)}
            placeholder="Buscar nas diferenças..."
            className="h-7 text-xs pl-7 border-gray-200 dark:border-[#393e5c]"
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-gray-400 dark:text-[#7a7f9d]">
            {filteredDiffs.length} de {totalDiffs} diferenças
          </span>
          {diffFilter !== 'all' && (
            <button
              onClick={() => setDiffFilter('all')}
              className="text-xs text-[#0073ea] hover:underline"
            >
              Limpar filtro
            </button>
          )}
        </div>
      </div>

      {/* Instruction hint */}
      {!activeDiffId && (
        <div className="px-3 pt-2 pb-0 flex-shrink-0">
          <p className="text-[10px] text-gray-400 dark:text-[#7a7f9d] text-center italic">
            Clique em uma diferença para localizar no documento
          </p>
        </div>
      )}

      {/* Differences */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredDiffs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400 dark:text-[#7a7f9d]">
            <Search className="w-6 h-6 mb-2" />
            <p className="text-xs">Nenhuma diferença encontrada</p>
          </div>
        ) : (
          filteredDiffs.map((diff) => (
            <div key={diff.id} ref={diff.id === activeDiffId ? activeCardRef : undefined}>
              <DiffCard
                diff={diff}
                isActive={diff.id === activeDiffId}
                onClick={() => onDiffClick(diff)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Mobile Tab Bar ───
type MobileTab = 'v1' | 'v2' | 'resumo';

function MobileTabBar({
  activeTab,
  setActiveTab,
  diffCount,
}: {
  activeTab: MobileTab;
  setActiveTab: (t: MobileTab) => void;
  diffCount: number;
}) {
  const tabs: { key: MobileTab; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'v1', label: 'V1 Original', icon: <FileText className="w-3.5 h-3.5" />, color: '#0073ea' },
    { key: 'v2', label: 'V2 Modificada', icon: <FileText className="w-3.5 h-3.5" />, color: '#f59e0b' },
    { key: 'resumo', label: 'Resumo', icon: <ListChecks className="w-3.5 h-3.5" />, color: '#0073ea' },
  ];

  return (
    <div className="flex bg-white dark:bg-[#292f4c] border-b border-gray-200 dark:border-[#393e5c] flex-shrink-0 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs transition-colors relative ${
            activeTab === tab.key
              ? 'text-gray-800 dark:text-[#e2e4ea]'
              : 'text-gray-500 dark:text-[#9196b0] hover:text-gray-700 dark:hover:text-[#d5d8e0] hover:bg-gray-50 dark:hover:bg-[#2d3354]'
          }`}
        >
          <span style={{ color: activeTab === tab.key ? tab.color : undefined }}>
            {tab.icon}
          </span>
          <span className="truncate">{tab.label}</span>
          {tab.key === 'resumo' && (
            <Badge className="bg-[#0073ea]/10 text-[#0073ea] text-[10px] px-1.5 py-0 h-4 min-w-0">
              {diffCount}
            </Badge>
          )}
          {activeTab === tab.key && (
            <div
              className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
              style={{ backgroundColor: tab.color }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Main Analysis Page ───
export function ComparadorAnalysisPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    fileA?: { name: string; size: number };
    fileB?: { name: string; size: number };
    fromHistory?: boolean;
    comparisonId?: string;
  } | null;

  const [isLoading, setIsLoading] = useState(true);
  const [diffFilter, setDiffFilter] = useState<'all' | 'ADDED' | 'REMOVED' | 'MODIFIED'>('all');
  const [searchDiff, setSearchDiff] = useState('');

  // Collapse states (desktop)
  const [col1Collapsed, setCol1Collapsed] = useState(false);
  const [col2Collapsed, setCol2Collapsed] = useState(false);
  const [col3Collapsed, setCol3Collapsed] = useState(false);

  // Mobile active tab
  const [mobileTab, setMobileTab] = useState<MobileTab>('v1');

  // Active diff for cross-column navigation
  const [activeDiffId, setActiveDiffId] = useState<string | null>(null);

  const fileAName = state?.fileA?.name || 'Documento_V1.pdf';
  const fileBName = state?.fileB?.name || 'Documento_V2.pdf';

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const filteredDiffs = mockDifferences.filter((d) => {
    const matchesType = diffFilter === 'all' || d.type === diffFilter;
    const matchesSearch =
      !searchDiff.trim() ||
      d.content.toLowerCase().includes(searchDiff.toLowerCase()) ||
      d.explanation.toLowerCase().includes(searchDiff.toLowerCase()) ||
      d.context.toLowerCase().includes(searchDiff.toLowerCase());
    return matchesType && matchesSearch;
  });

  const addedCount = mockDifferences.filter((d) => d.type === 'ADDED').length;
  const removedCount = mockDifferences.filter((d) => d.type === 'REMOVED').length;
  const modifiedCount = mockDifferences.filter((d) => d.type === 'MODIFIED').length;

  // Build the active diff highlight object
  const activeDiffHighlight: ActiveDiffHighlight | null = activeDiffId
    ? (() => {
        const diff = mockDifferences.find((d) => d.id === activeDiffId);
        if (!diff) return null;
        const colors = DIFF_COLORS[diff.type];
        return { diff, bgColor: colors.bg, borderColor: colors.border };
      })()
    : null;

  const handleDiffClick = useCallback((diff: DiffItem) => {
    if (!diff.id) {
      // Clear selection
      setActiveDiffId(null);
      return;
    }
    // Toggle: clicking the same card again deselects
    setActiveDiffId((prev) => (prev === diff.id ? null : diff.id));
  }, []);

  // On mobile, when clicking a diff, switch to the appropriate tab (V2 for ADDED, V1 for REMOVED, V2 for MODIFIED)
  const handleMobileDiffClick = useCallback((diff: DiffItem) => {
    if (!diff.id) {
      setActiveDiffId(null);
      return;
    }
    setActiveDiffId((prev) => {
      const newId = prev === diff.id ? null : diff.id;
      if (newId) {
        // Navigate to the most relevant tab
        if (diff.type === 'REMOVED') {
          setMobileTab('v1');
        } else {
          setMobileTab('v2');
        }
      }
      return newId;
    });
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-[#1f2132]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-[#393e5c]" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#0073ea] animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-[#b0b4c8]">Analisando diferenças entre documentos...</p>
          <p className="text-xs text-gray-400 dark:text-[#7a7f9d] mt-1">
            {fileAName} vs {fileBName}
          </p>
        </div>
      </div>
    );
  }

  const expandedCols = [!col1Collapsed, !col2Collapsed, !col3Collapsed].filter(Boolean).length;

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-gray-50 dark:bg-[#1f2132]">
        {/* Top Header Bar */}
        <div className="h-12 bg-white dark:bg-[#292f4c] border-b border-gray-200 dark:border-[#393e5c] flex items-center justify-between px-3 sm:px-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <FileDiff className="w-5 h-5 text-[#0073ea]" />
            <span className="text-sm italic text-[#0073ea] hidden sm:inline">Comparador de documentos</span>
            <span className="text-sm italic text-[#0073ea] sm:hidden">DocDiff</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/documentos/comparador')}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nova Comparação</span>
            <span className="sm:hidden">Nova</span>
          </Button>
        </div>

        {/* ─── Mobile / Tablet: Tab-based layout (< lg) ─── */}
        <div className="lg:hidden flex-1 flex flex-col overflow-hidden min-h-0">
          <MobileTabBar
            activeTab={mobileTab}
            setActiveTab={setMobileTab}
            diffCount={mockDifferences.length}
          />
          <div className="flex-1 overflow-hidden min-h-0">
            {mobileTab === 'v1' && (
              <DocumentColumn
                title={`V1 (Original) – ${fileAName}`}
                pages={mockV1Pages}
                color="#0073ea"
                onCollapse={() => {}}
                activeDiff={activeDiffHighlight}
                columnType="v1"
              />
            )}
            {mobileTab === 'v2' && (
              <DocumentColumn
                title={`V2 (Modificada) – ${fileBName}`}
                pages={mockV2Pages}
                color="#f59e0b"
                onCollapse={() => {}}
                activeDiff={activeDiffHighlight}
                columnType="v2"
              />
            )}
            {mobileTab === 'resumo' && (
              <div className="h-full bg-white dark:bg-[#292f4c]">
                <ResultsPanel
                  diffFilter={diffFilter}
                  setDiffFilter={setDiffFilter}
                  searchDiff={searchDiff}
                  setSearchDiff={setSearchDiff}
                  filteredDiffs={filteredDiffs}
                  totalDiffs={mockDifferences.length}
                  addedCount={addedCount}
                  removedCount={removedCount}
                  modifiedCount={modifiedCount}
                  onCollapse={() => {}}
                  activeDiffId={activeDiffId}
                  onDiffClick={handleMobileDiffClick}
                />
              </div>
            )}
          </div>
        </div>

        {/* ─── Desktop: 3 collapsible columns (>= lg) ─── */}
        <div className="hidden lg:flex flex-1 overflow-hidden min-h-0">
          {/* Column 1: V1 */}
          {col1Collapsed ? (
            <CollapsedStrip
              label="V1 Original"
              icon={<FileText className="w-3.5 h-3.5" />}
              color="#0073ea"
              side="left"
              onExpand={() => setCol1Collapsed(false)}
            />
          ) : (
            <div
              className="min-w-0 border-r border-gray-200 dark:border-[#393e5c] transition-all duration-300 ease-in-out"
              style={{
                flex: expandedCols === 1 ? '1 1 100%' : expandedCols === 2 && col3Collapsed ? '1 1 50%' : '1 1 0%',
              }}
            >
              <DocumentColumn
                title={`Versão 1 (Original) – ${fileAName}`}
                pages={mockV1Pages}
                color="#0073ea"
                onCollapse={() => setCol1Collapsed(true)}
                activeDiff={activeDiffHighlight}
                columnType="v1"
              />
            </div>
          )}

          {/* Column 2: V2 */}
          {col2Collapsed ? (
            <CollapsedStrip
              label="V2 Modificada"
              icon={<FileText className="w-3.5 h-3.5" />}
              color="#f59e0b"
              side="left"
              onExpand={() => setCol2Collapsed(false)}
            />
          ) : (
            <div
              className="min-w-0 border-r border-gray-200 dark:border-[#393e5c] transition-all duration-300 ease-in-out"
              style={{
                flex: expandedCols === 1 ? '1 1 100%' : expandedCols === 2 && col3Collapsed ? '1 1 50%' : '1 1 0%',
              }}
            >
              <DocumentColumn
                title={`Versão 2 (Modificada) – ${fileBName}`}
                pages={mockV2Pages}
                color="#f59e0b"
                onCollapse={() => setCol2Collapsed(true)}
                activeDiff={activeDiffHighlight}
                columnType="v2"
              />
            </div>
          )}

          {/* Column 3: Results */}
          {col3Collapsed ? (
            <CollapsedStrip
              label="Resumo"
              icon={<ListChecks className="w-3.5 h-3.5" />}
              color="#0073ea"
              side="right"
              onExpand={() => setCol3Collapsed(false)}
            />
          ) : (
            <div
              className="bg-white dark:bg-[#292f4c] flex flex-col h-full transition-all duration-300 ease-in-out"
              style={{
                flex: expandedCols === 1 ? '1 1 100%' : '0 0 340px',
                minWidth: expandedCols === 1 ? undefined : '280px',
                maxWidth: expandedCols === 1 ? undefined : '400px',
              }}
            >
              <ResultsPanel
                diffFilter={diffFilter}
                setDiffFilter={setDiffFilter}
                searchDiff={searchDiff}
                setSearchDiff={setSearchDiff}
                filteredDiffs={filteredDiffs}
                totalDiffs={mockDifferences.length}
                addedCount={addedCount}
                removedCount={removedCount}
                modifiedCount={modifiedCount}
                onCollapse={() => setCol3Collapsed(true)}
                activeDiffId={activeDiffId}
                onDiffClick={handleDiffClick}
              />
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}