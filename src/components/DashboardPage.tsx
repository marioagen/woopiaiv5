import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label as RechartsLabel } from 'recharts';

interface ChartColors {
  gridStroke: string;
  tickFill: string;
  axisStroke: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipColor: string;
  axisLabelFill: string;
}

interface DailyPoint {
  date: string;
  value: number;
}

interface MetricCardProps {
  title: string;
  accentColor: string;
  totalLabel: string;
  totalValue: string;
  planNote: string;
  periodValue: string;
  chartTitle: string;
  legendLabel: string;
  yAxisLabel: string;
  tooltipName: string;
  data: DailyPoint[];
  chartColors: ChartColors;
  headerExtra?: React.ReactNode;
}

function MetricCard({
  title,
  accentColor,
  totalLabel,
  totalValue,
  planNote,
  periodValue,
  chartTitle,
  legendLabel,
  yAxisLabel,
  tooltipName,
  data,
  chartColors,
  headerExtra,
}: MetricCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-1.5 min-w-0">
          <h2 className="text-[15px] font-semibold text-foreground leading-snug">{title}</h2>
          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        </div>
        {headerExtra}
      </div>

      {/* Stats */}
      <div className="px-6 grid grid-cols-2 gap-5">
        <div className="rounded-lg bg-muted/50 border border-border/60 px-4 py-3.5 mr-4">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2 leading-tight">{totalLabel}</div>
          <div className="text-2xl font-bold text-foreground tabular-nums leading-none">{totalValue}</div>
          <div className="text-[11px] text-muted-foreground mt-2">Valor no plano: {planNote}</div>
        </div>
        <div className="rounded-lg bg-muted/50 border border-border/60 px-4 py-4 flex flex-col">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2 leading-tight">Totalizador no Período</div>
          <div className="text-2xl font-bold tabular-nums leading-none" style={{ color: accentColor }}>{periodValue}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-6 pt-6 pb-6 mt-2 flex-1">
        <h3 className="text-sm font-medium text-foreground mb-3">{chartTitle}</h3>
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="text-xs text-muted-foreground">{legendLabel}</span>
        </div>
        <div className="w-full" style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
            <BarChart data={data} margin={{ top: 8, right: 12, bottom: 24, left: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridStroke} vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: chartColors.tickFill, fontSize: 11 }}
                axisLine={{ stroke: chartColors.axisStroke }}
                tickLine={false}
              >
                <RechartsLabel value="Dia do Mês" position="bottom" offset={4} fill={chartColors.axisLabelFill} fontSize={11} />
              </XAxis>
              <YAxis
                tick={{ fill: chartColors.tickFill, fontSize: 11 }}
                axisLine={{ stroke: chartColors.axisStroke }}
                tickLine={false}
                width={48}
                tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`)}
              >
                <RechartsLabel value={yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill={chartColors.axisLabelFill} fontSize={11} />
              </YAxis>
              <Tooltip
                cursor={{ fill: 'rgba(120,120,120,0.06)' }}
                contentStyle={{
                  backgroundColor: chartColors.tooltipBg,
                  border: `1px solid ${chartColors.tooltipBorder}`,
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: chartColors.tooltipColor,
                }}
                formatter={(value: any) => [Number(value).toLocaleString('pt-BR'), tooltipName]}
              />
              <Bar dataKey="value" fill={accentColor} radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const ACCENTS = {
  blue: '#0073ea',
  purple: '#8b5cf6',
  teal: '#14b8a6',
  violet: '#a25ddc',
};

const tokensData: DailyPoint[] = [
  { date: '01/06', value: 9000 },
  { date: '02/06', value: 7000 },
  { date: '08/06', value: 228000 },
  { date: '09/06', value: 8655 },
];

const pagesData: DailyPoint[] = [
  { date: '01/06', value: 470 },
  { date: '02/06', value: 250 },
  { date: '08/06', value: 530 },
  { date: '09/06', value: 30 },
];

const aiRunsData: DailyPoint[] = [
  { date: '01/06', value: 0 },
  { date: '02/06', value: 0 },
  { date: '08/06', value: 14 },
  { date: '09/06', value: 0 },
];

const woopiRunsData: DailyPoint[] = [
  { date: '01/06', value: 3 },
  { date: '02/06', value: 4 },
  { date: '08/06', value: 33 },
  { date: '09/06', value: 1 },
];

function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedEsteira, setSelectedEsteira] = useState('all');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');

  const today = new Date();
  const firstOfMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
  const lastOfMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()).padStart(2, '0')}`;

  const [customStart, setCustomStart] = useState(firstOfMonth);
  const [customEnd, setCustomEnd] = useState(lastOfMonth);
  const [appliedStart, setAppliedStart] = useState('');
  const [appliedEnd, setAppliedEnd] = useState('');
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [prevPeriod, setPrevPeriod] = useState('current-month');
  const pickerRef = useRef<HTMLDivElement>(null);

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!showCustomPicker) return;
    const handleOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowCustomPicker(false);
        setSelectedPeriod(prevPeriod);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showCustomPicker, prevPeriod]);

  const handlePeriodChange = (value: string) => {
    if (value === 'custom') {
      setPrevPeriod(selectedPeriod);
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
    }
    setSelectedPeriod(value);
  };

  const handleApplyCustom = () => {
    setAppliedStart(customStart);
    setAppliedEnd(customEnd);
    setShowCustomPicker(false);
  };

  const handleCancelCustom = () => {
    setShowCustomPicker(false);
    setSelectedPeriod(prevPeriod);
  };

  const displayDateRange = (() => {
    if (selectedPeriod === 'custom' && appliedStart && appliedEnd) {
      return `${formatDateBR(appliedStart)} a ${formatDateBR(appliedEnd)}`;
    }
    if (selectedPeriod === 'last-month') {
      const d = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const last = new Date(today.getFullYear(), today.getMonth(), 0);
      return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} a ${String(last.getDate()).padStart(2,'0')}/${String(last.getMonth()+1).padStart(2,'0')}/${last.getFullYear()}`;
    }
    if (selectedPeriod === 'last-30-days') {
      const from = new Date(today);
      from.setDate(from.getDate() - 30);
      return `${String(from.getDate()).padStart(2,'0')}/${String(from.getMonth()+1).padStart(2,'0')}/${from.getFullYear()} a ${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`;
    }
    return '01/06/2026 a 30/06/2026';
  })();

  const chartColors: ChartColors = {
    gridStroke: isDark ? '#393e5c' : '#eef0f4',
    tickFill: isDark ? '#9196b0' : '#6b7280',
    axisStroke: isDark ? '#393e5c' : '#e5e7eb',
    tooltipBg: isDark ? '#292f4c' : '#ffffff',
    tooltipBorder: isDark ? '#393e5c' : '#e5e7eb',
    tooltipColor: isDark ? '#d5d8e0' : '#323338',
    axisLabelFill: isDark ? '#9196b0' : '#9aa1ad',
  };

  const handleUpdate = () => {
    console.log('Atualizar clicked');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard de Consumo e Bilhetagem</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Woopi AI</p>
            </div>
            <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 text-right min-w-[180px]">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Plano Atual</div>
              <div className="text-sm font-bold text-[#0073ea] dark:text-blue-300">QA-SUBSCRIPTION</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">WTCs: 0</div>
            </div>
          </div>

          {/* Date range */}
          <div className="text-xs text-muted-foreground">{displayDateRange}</div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Period select with anchored date-picker popover */}
              <div className="relative" ref={pickerRef}>
                <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                  <SelectTrigger className={`w-[180px] bg-card transition-colors ${showCustomPicker ? 'border-ring ring-2 ring-ring/30' : ''}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-month">Este mês</SelectItem>
                    <SelectItem value="last-month">Mês passado</SelectItem>
                    <SelectItem value="last-30-days">Últimos 30 dias</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date picker dropdown */}
                {showCustomPicker && (
                  <div className="absolute top-full left-0 mt-1.5 z-50 w-[260px] rounded-xl border border-border bg-card shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150">
                    <div className="px-4 pt-3.5 pb-1">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">Selecione as datas</p>
                    </div>
                    <div className="px-4 py-3 flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-foreground font-medium">Data de início</label>
                        <input
                          type="date"
                          value={customStart}
                          max={customEnd || undefined}
                          onChange={e => setCustomStart(e.target.value)}
                          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-ring transition-colors cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-foreground font-medium">Data final</label>
                        <input
                          type="date"
                          value={customEnd}
                          min={customStart || undefined}
                          onChange={e => setCustomEnd(e.target.value)}
                          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-ring transition-colors cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                        />
                      </div>
                    </div>
                    <div className="px-4 pb-4 flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelCustom}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        disabled={!customStart || !customEnd}
                        onClick={handleApplyCustom}
                        className="text-sm bg-[#0073ea] hover:bg-[#0060c7] text-white"
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Select value={selectedEsteira} onValueChange={setSelectedEsteira}>
                <SelectTrigger className="w-[200px] bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Esteiras</SelectItem>
                  <SelectItem value="aprovacao-documentos">Aprovação de Documentos</SelectItem>
                  <SelectItem value="analise-financeira">Análise Financeira</SelectItem>
                  <SelectItem value="revisao-juridica">Revisão Jurídica</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleUpdate} className="woopi-ai-button-primary flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </Button>
            </div>
            <span className="text-xs text-muted-foreground">Atualização automática a cada 5 minutos</span>
          </div>

          {/* Total WTC hero */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-6 text-center">
            <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mb-1">
              <span>Total WTC</span>
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="text-5xl font-bold text-[#0073ea] tabular-nums">707</div>
          </div>

          {/* Metric grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MetricCard
              title="Consumo de Tokens de IA"
              accentColor={ACCENTS.blue}
              totalLabel="Total de Tokens Consumidos"
              totalValue="252.655"
              planNote="0,0000552"
              periodValue="13,9465560"
              chartTitle="Consumo Diário de Tokens"
              legendLabel="Tokens Processados"
              yAxisLabel="Volume de Tokens"
              tooltipName="Tokens"
              data={tokensData}
              chartColors={chartColors}
              headerExtra={
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="h-8 w-[120px] bg-card text-xs shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                    <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
                    <SelectItem value="embeddings-text-large-3">embeddings-3-large</SelectItem>
                  </SelectContent>
                </Select>
              }
            />

            <MetricCard
              title="Páginas de Documento Processadas (Agente Digitalizador)"
              accentColor={ACCENTS.violet}
              totalLabel="Total de Páginas Processadas"
              totalValue="1.223"
              planNote="0,0082873"
              periodValue="10,1353679"
              chartTitle="Consumo Diário"
              legendLabel="Páginas Analisadas"
              yAxisLabel="Páginas Processadas"
              tooltipName="Páginas"
              data={pagesData}
              chartColors={chartColors}
            />

            <MetricCard
              title="Execuções de Esteira de Automação de IA"
              accentColor={ACCENTS.teal}
              totalLabel="Total de Execuções de IA"
              totalValue="14"
              planNote="0,3867403"
              periodValue="5,4143642"
              chartTitle="Consumo Diário"
              legendLabel="Automações de IA"
              yAxisLabel="Total de Execuções"
              tooltipName="Execuções"
              data={aiRunsData}
              chartColors={chartColors}
            />

            <MetricCard
              title="Execuções de Esteiras de Processamento Woopi AI"
              accentColor={ACCENTS.purple}
              totalLabel="Total de Execuções Woopi AI"
              totalValue="41"
              planNote="0,3867403"
              periodValue="15,8563523"
              chartTitle="Consumo Diário"
              legendLabel="Execuções Woopi AI"
              yAxisLabel="Total de Execuções"
              tooltipName="Execuções"
              data={woopiRunsData}
              chartColors={chartColors}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
