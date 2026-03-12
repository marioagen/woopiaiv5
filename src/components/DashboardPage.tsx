import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedModel, setSelectedModel] = useState('embeddings-text-large-3');

  // Detectar dark mode para cores inline do gráfico
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Cores do gráfico baseadas no tema
  const chartColors = {
    gridStroke: isDark ? '#393e5c' : '#f0f0f0',
    tickFill: isDark ? '#9196b0' : '#6b7280',
    axisStroke: isDark ? '#393e5c' : '#e5e7eb',
    tooltipBg: isDark ? '#292f4c' : 'white',
    tooltipBorder: isDark ? '#393e5c' : '#e5e7eb',
    tooltipColor: isDark ? '#d5d8e0' : '#323338',
  };

  // Dados estáticos para o gráfico
  const dailyConsumptionData = [
    { date: '01/12', tokens: 12000 },
    { date: '02/12', tokens: 10000 },
    { date: '03/12', tokens: 52000 },
    { date: '04/12', tokens: 19000 },
    { date: '05/12', tokens: 29000 },
    { date: '06/12', tokens: 11000 },
    { date: '07/12', tokens: 5000 },
    { date: '08/12', tokens: 3000 },
    { date: '09/12', tokens: 41000 },
    { date: '10/12', tokens: 39000 },
    { date: '11/12', tokens: 15000 },
    { date: '12/12', tokens: 36000 },
    { date: '13/12', tokens: 9000 },
    { date: '14/12', tokens: 7000 },
    { date: '15/12', tokens: 31000 },
    { date: '16/12', tokens: 18000 },
  ];

  const models = [
    { id: 'embeddings-text-large-3', name: 'embeddings-text-large-3' },
    { id: 'gpt-4-turbo', name: 'gpt-4-turbo' },
    { id: 'gpt-3.5-turbo', name: 'gpt-3.5-turbo' },
  ];

  const handleExportCSV = () => {
    console.log('Exportar CSV clicked');
  };

  const handleUpdate = () => {
    console.log('Atualizar clicked');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl text-foreground">
                Dashboard de Consumo e Bilhetagem
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Woopi AI</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 px-4 py-2">
                Plano Atual
              </Badge>
              <Badge className="bg-[#0073ea] text-white px-4 py-2 hover:bg-[#0073ea]/90">
                Plano Enterprise
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px] bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Este mês</SelectItem>
                  <SelectItem value="last-month">Mês anterior</SelectItem>
                  <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
                  <SelectItem value="last-6-months">Últimos 6 meses</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleUpdate}
                className="woopi-ai-button-primary flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </Button>
            </div>
            <Button 
              variant="outline"
              onClick={handleExportCSV}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          </div>

          {/* Total WTC Card */}
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
              <span>TOTAL WTC</span>
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="text-5xl text-[#0073ea]">
              526,39
            </div>
          </div>

          {/* Consumo de Tokens Card */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg text-foreground">
                    Consumo de Tokens de IA
                  </h2>
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-[#2d3354]">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-foreground min-w-[200px] text-center">
                    {models.find(m => m.id === selectedModel)?.name}
                  </span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-[#2d3354]">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Total de Tokens Consumidos */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2">
                    TOTAL DE TOKENS CONSUMIDOS
                  </div>
                  <div className="text-3xl text-foreground mb-1">
                    342.529
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Valor unitário no plano atual: 0,000001
                  </div>
                </div>

                {/* Totalizador no Período */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2">
                    TOTALIZADOR NO PERÍODO
                  </div>
                  <div className="text-3xl text-[#0073ea]">
                    0,03
                  </div>
                </div>
              </div>

              {/* Gráfico */}
              <div>
                <h3 className="text-base text-foreground mb-4">
                  Consumo Diário de Tokens
                </h3>
                <div className="w-full" style={{ height: '300px', minHeight: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
                    <BarChart data={dailyConsumptionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridStroke} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: chartColors.tickFill, fontSize: 12 }}
                        axisLine={{ stroke: chartColors.axisStroke }}
                      />
                      <YAxis 
                        tick={{ fill: chartColors.tickFill, fontSize: 12 }}
                        axisLine={{ stroke: chartColors.axisStroke }}
                        tickFormatter={(value) => {
                          if (value >= 1000) {
                            return `${(value / 1000).toFixed(0)}k`;
                          }
                          return value.toString();
                        }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: chartColors.tooltipBg,
                          border: `1px solid ${chartColors.tooltipBorder}`,
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: chartColors.tooltipColor,
                        }}
                        formatter={(value: any) => [value.toLocaleString(), 'Tokens']}
                      />
                      <Bar 
                        dataKey="tokens" 
                        fill="#0073ea" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}