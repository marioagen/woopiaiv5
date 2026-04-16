import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import {
  ShieldCheck,
  Download,
  ArrowLeft,
  ExternalLink,
  Clock,
  FileText,
} from 'lucide-react';
import { Toaster } from './ui/sonner';
import { toast } from 'sonner';
import { AnonimizarButton, AnonymizationResult, ANONYMIZATION_TYPES, PROMPTS } from './AnonimizarButton';

// ---------------------------------------------------------------------------
// Redaction renderer
// ---------------------------------------------------------------------------

function getRedaction(text: string, type: string): React.ReactNode {
  if (!type || type === 'mascaramento_total') {
    return (
      <span
        className="inline-block align-middle rounded-[2px] select-none"
        style={{ background: '#1e293b', color: 'transparent', letterSpacing: 0 }}
      >
        {'█'.repeat(text.length)}
      </span>
    );
  }
  if (type === 'mascaramento_parcial') {
    const visible = text.slice(0, Math.max(1, Math.floor(text.length * 0.3)));
    return (
      <>
        <span className="opacity-50">{visible}</span>
        <span
          className="inline-block align-middle rounded-[2px] select-none"
          style={{ background: '#475569', color: 'transparent' }}
        >
          {'█'.repeat(text.length - visible.length)}
        </span>
      </>
    );
  }
  if (type === 'substituir_iniciais') {
    const initials = text
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0].toUpperCase() + '.')
      .join(' ');
    return (
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#b45309' }}>
        {initials}
      </span>
    );
  }
  if (type === 'dados_ficticios') {
    const fakeMap: Record<string, string> = {
      'Empresa ABC S.A.': 'Sigma Soluções S.A.',
      'TechCorp Solutions Ltda.': 'Nexum Tecnologia Ltda.',
      '98.705.432/0001-10': '33.444.555/0001-22',
      '12.345.678/0001-99': '77.666.555/0001-33',
      'R$ 4.967,89': 'R$ 3.211,00',
      'NF-2023-7845': 'NF-2023-9991',
      '3524 0019 0349 3404 7940 0/3': '8811 0072 4412 9900 0023 1/8',
    };
    return (
      <span style={{ color: '#7c3aed', fontStyle: 'italic' }}>
        {fakeMap[text] ?? text.split('').reverse().join('').slice(0, text.length)}
      </span>
    );
  }
  if (type === 'referencias_relativas') {
    const refMap: Record<string, string> = {
      'Empresa ABC S.A.': 'Parte Emitente',
      'TechCorp Solutions Ltda.': 'Parte Destinatária',
      '98.705.432/0001-10': 'CNPJ do Destinatário',
      '12.345.678/0001-99': 'CNPJ do Destinatário',
      'R$ 4.967,89': 'Valor Total',
      'NF-2023-7845': 'Nº do Documento',
    };
    return (
      <span style={{ color: '#0369a1', fontWeight: 600 }}>
        [{refMap[text] ?? 'Dado referenciado'}]
      </span>
    );
  }
  return (
    <span
      className="inline-block rounded-[2px] select-none"
      style={{ background: '#1e293b', color: 'transparent' }}
    >
      {'█'.repeat(text.length)}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Redacted NF document — fills its container height, scrolls internally
// ---------------------------------------------------------------------------

function RedactedNFDocument({ type }: { type: string }) {
  const R = (text: string) => getRedaction(text, type);
  const typeLabel = ANONYMIZATION_TYPES.find((t) => t.value === type)?.label ?? 'Mascaramento total';

  return (
    <div
      className="h-full flex flex-col bg-white rounded-xl overflow-hidden"
      style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
    >
      {/* Document header strip */}
      <div
        className="flex-shrink-0 px-8 py-3 border-b border-slate-100 flex items-center justify-between"
        style={{ background: '#f8fafc' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: '#ecfdf5', border: '1px solid #bbf7d0' }}
          >
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#059669' }} />
          </div>
          <div>
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.15em',
                color: '#64748b',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Versão Anonimizada
            </p>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{typeLabel}</p>
          </div>
        </div>
        <span
          className="text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #bbf7d0' }}
        >
          Dados sensíveis protegidos
        </span>
      </div>

      {/* Scrollable document body */}
      <div
        className="flex-1 min-h-0 overflow-y-auto"
        style={{ fontFamily: "'IBM Plex Serif', Georgia, serif" }}
      >
        <div
          className="max-w-2xl mx-auto px-10 py-8 space-y-6"
          style={{ fontSize: '14px', lineHeight: 1.8, color: '#1e293b' }}
        >
          {/* Title block */}
          <div className="text-center space-y-1 pb-5 border-b border-slate-100">
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: '#94a3b8',
                textTransform: 'uppercase',
              }}
            >
              Nota Fiscal Eletrônica
            </p>
            <h2 className="text-lg font-bold tracking-tight" style={{ color: '#0f172a' }}>
              N° {R('NF-2023-7845')}
            </h2>
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                color: '#94a3b8',
              }}
            >
              Chave de acesso: {R('3524 0019 0349 3404 7940 0/3')}
            </p>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1.5">
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Emitente
              </p>
              <p className="font-semibold">{R('Empresa ABC S.A.')}</p>
              <p className="text-sm" style={{ color: '#64748b' }}>
                CNPJ: <strong>{R('98.705.432/0001-10')}</strong>
              </p>
            </div>
            <div className="space-y-1.5">
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Destinatário
              </p>
              <p className="font-semibold">{R('TechCorp Solutions Ltda.')}</p>
              <p className="text-sm" style={{ color: '#64748b' }}>
                CNPJ: <strong>{R('12.345.678/0001-99')}</strong>
              </p>
            </div>
          </div>

          {/* Key values row */}
          <div className="grid grid-cols-3 gap-4 py-5 border-y border-slate-100">
            {[
              { label: 'Data de Emissão', value: '10/03/2023', redact: false },
              { label: 'Valor Total', value: 'R$ 4.967,89', redact: true },
              { label: 'Vencimento', value: '10/04/2023', redact: false },
            ].map(({ label, value, redact }) => (
              <div key={label} className="text-center space-y-1">
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '9px',
                    letterSpacing: '0.15em',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </p>
                <p className="font-semibold text-sm">
                  {redact ? R(value) : value}
                </p>
              </div>
            ))}
          </div>

          {/* Description table */}
          <div className="space-y-3">
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.15em',
                color: '#94a3b8',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Descrição dos Serviços / Produtos
            </p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th className="text-left py-2 pr-4 font-medium" style={{ color: '#64748b', fontWeight: 500 }}>
                    Item
                  </th>
                  <th className="text-right py-2 px-4 font-medium" style={{ color: '#64748b', fontWeight: 500 }}>
                    Qtd
                  </th>
                  <th className="text-right py-2 pl-4 font-medium" style={{ color: '#64748b', fontWeight: 500 }}>
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="py-3 pr-4">Serviços de consultoria — Módulo A</td>
                  <td className="py-3 px-4 text-right">1</td>
                  <td className="py-3 pl-4 text-right">{R('R$ 4.967,89')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Compliance note */}
          <div
            className="rounded-xl px-5 py-4 flex items-start gap-3"
            style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
          >
            <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#059669' }} />
            <p className="text-sm" style={{ color: '#166534' }}>
              Documento processado com anonimização{' '}
              <strong>{typeLabel}</strong>. Todos os dados pessoais e sensíveis foram
              protegidos conforme configuração selecionada.
            </p>
          </div>

          {/* Bottom spacer so last element isn't flush against edge */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page — h-screen, light header, no footer
// ---------------------------------------------------------------------------

export function AnonymizedDocumentPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const type = searchParams.get('type') ?? '';
  const prompt = searchParams.get('prompt') ?? '';
  const docName = searchParams.get('docName') ?? 'Documento';
  const docId = searchParams.get('docId') ?? '';
  const workflowTitle = searchParams.get('workflowTitle') ?? '';
  const sourceUrl = searchParams.get('sourceUrl') ?? '';

  const [timestamp] = useState(() => new Date());

  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Serif:wght@400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const handleReAnonymized = (result: AnonymizationResult) => {
    setSearchParams(
      new URLSearchParams({
        type: result.type ?? '',
        prompt: result.prompt ?? '',
        docName,
        docId,
        workflowTitle,
        sourceUrl,
      }),
      { replace: true }
    );
    toast.success('Documento re-anonimizado com sucesso!');
  };

  const handleDownload = () => {
    const blob = new Blob(['Conteúdo simulado do documento anonimizado'], { type: 'application/pdf' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${docName.replace(/\s+/g, '_')}_anonimizado.pdf`;
    a.click();
    toast.success('Download iniciado!');
  };

  const typeLabel = ANONYMIZATION_TYPES.find((t) => t.value === type)?.label ?? 'Mascaramento total';
  const promptLabel = PROMPTS.find((p) => p.value === prompt)?.label;
  const formattedTime = timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}
    >
      <Toaster position="top-right" />

      {/* ── Light header ── */}
      <header
        className="flex-shrink-0 sticky top-0 z-20"
        style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}
      >
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-3" style={{ height: '52px' }}>

          {/* Compact shield badge — icon + short label only */}
          <div
            className="flex-shrink-0 flex items-center gap-1.5 rounded-md px-2 py-1"
            style={{ background: '#ecfdf5', border: '1px solid #bbf7d0' }}
            title="Documento anonimizado"
          >
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#059669' }} />
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#059669',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              Anonimizado
            </span>
          </div>

          {/* Separator */}
          <div className="w-px h-5 bg-slate-200 flex-shrink-0" />

          {/* Breadcrumb: workflow / document — takes all available space, both truncate proportionally */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
            <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#94a3b8' }} />

            {workflowTitle ? (
              <>
                {/* Workflow: takes up to 45% of the flex space */}
                <span
                  className="truncate"
                  style={{
                    color: '#64748b',
                    fontSize: '13px',
                    minWidth: 0,
                    maxWidth: '45%',
                  }}
                  title={workflowTitle}
                >
                  {workflowTitle}
                </span>

                <span
                  className="flex-shrink-0 select-none"
                  style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: 1 }}
                >
                  /
                </span>

                {/* Document name: takes remaining space */}
                <span
                  className="font-semibold truncate"
                  style={{ color: '#0f172a', fontSize: '14px', minWidth: 0 }}
                  title={docName}
                >
                  {docName}
                </span>
              </>
            ) : (
              <span
                className="font-semibold truncate"
                style={{ color: '#0f172a', fontSize: '14px' }}
                title={docName}
              >
                {docName}
              </span>
            )}
          </div>

          {/* Timestamp — icon + time, no label prefix */}
          <div
            className="hidden sm:flex items-center gap-1 flex-shrink-0 text-xs"
            style={{ color: '#94a3b8' }}
            title={`Gerado às ${formattedTime}`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formattedTime}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <AnonimizarButton onAnonymized={handleReAnonymized} variant="re-anonymize" />

            {/* Download — icon only, label in tooltip */}
            <button
              onClick={handleDownload}
              title="Baixar PDF anonimizado"
              className="flex items-center justify-center rounded-lg transition-colors"
              style={{
                width: '32px',
                height: '32px',
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #0f172a',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#1e293b'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#0f172a'; }}
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Return-to-analysis banner ── */}
      {sourceUrl && (
        <div
          className="flex-shrink-0"
          style={{ background: '#fffbeb', borderBottom: '1px solid #fde68a' }}
        >
          <div className="max-w-4xl mx-auto px-6 h-8 flex items-center gap-2">
            <ArrowLeft className="w-3 h-3 flex-shrink-0" style={{ color: '#92400e' }} />
            <span className="text-xs" style={{ color: '#92400e' }}>
              Esta versão foi gerada a partir de
            </span>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
              style={{ color: '#b45309' }}
            >
              Análise de extração — {docName}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* ── Document area — boxed, fills remaining viewport height ── */}
      <main className="flex-1 min-h-0 py-5 px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="h-full max-w-4xl mx-auto">
          <RedactedNFDocument type={type} />
        </div>
      </main>
    </div>
  );
}
