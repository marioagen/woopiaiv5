import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
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
  CircleX
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { AnonimizarButton } from './AnonimizarButton';

interface ExtractedField {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  confidence: number;
  category: 'Identificação' | 'Valores' | 'Datas' | 'Endereço' | 'Outros';
}

export function DocumentAnalysisPage() {
  const navigate = useNavigate();
  const { id, workflow } = useParams();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'document' | 'split' | 'fields'>('split');
  
  // Resizable column width state
  const [leftColumnWidth, setLeftColumnWidth] = useState(50); // percentage

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
      navigate('/documentos');
    }, 1500);
  };

  const handleBack = () => {
    navigate('/documentos');
  };

  // Reprovar modal state
  const [isReprovarModalOpen, setIsReprovarModalOpen] = useState(false);
  const [reprovarJustificativa, setReprovarJustificativa] = useState('');
  const [reprovarEtapa, setReprovarEtapa] = useState('');

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
    setTimeout(() => navigate('/documentos'), 1500);
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
              <span className="hidden sm:inline">Documentos e Análise</span>
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
              onClick={() => { setIsReprovarModalOpen(false); setReprovarJustificativa(''); setReprovarEtapa(''); }}
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
                <div className="mb-4 text-center">
                  <h3 className="text-sm text-woopi-ai-dark-gray mb-3">
                    <span className="font-bold">{workflowName}</span> - <span className="font-medium">{documentInfo.name}</span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-woopi-ai-gray">
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                      Anterior
                    </Button>
                    <span>Página 1 de 2</span>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                      Próxima
                    </Button>
                    <div className="ml-auto">
                      <AnonimizarButton />
                    </div>
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
            <div className="bg-gray-50 border-r border-woopi-ai-border flex flex-col w-full">
              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-4 text-center">
                  <h3 className="text-sm text-woopi-ai-dark-gray mb-3">
                    <span className="font-bold">{workflowName}</span> - <span className="font-medium">{documentInfo.name}</span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-woopi-ai-gray">
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                      Anterior
                    </Button>
                    <span>Página 1 de 2</span>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                      Próxima
                    </Button>
                    <div className="ml-auto">
                      <AnonimizarButton />
                    </div>
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