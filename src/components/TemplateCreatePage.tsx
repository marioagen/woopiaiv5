import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Trash2, ChevronDown } from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
}

// Mapeamento de times para suas etapas específicas
const TEAM_WORKFLOW_STEPS = {
  'Financeiro': [
    { value: 'recebimento-fiscal', label: 'Recebimento Fiscal' },
    { value: 'validacao-financeira', label: 'Validação Financeira' },
    { value: 'aprovacao-pagamento', label: 'Aprovação de Pagamento' },
    { value: 'processamento-pagamento', label: 'Processamento de Pagamento' },
    { value: 'conciliacao', label: 'Conciliação Bancária' }
  ],
  'Jurídico': [
    { value: 'analise-juridica', label: 'Análise Jurídica' },
    { value: 'revisao-contrato', label: 'Revisão de Contrato' },
    { value: 'aprovacao-juridica', label: 'Aprovação Jurídica' },
    { value: 'arquivo-juridico', label: 'Arquivo Jurídico' }
  ],
  'Recursos Humanos': [
    { value: 'triagem-documento', label: 'Triagem de Documento' },
    { value: 'validacao-dados', label: 'Validação de Dados' },
    { value: 'aprovacao-rh', label: 'Aprovação RH' },
    { value: 'arquivo-pessoal', label: 'Arquivo Pessoal' }
  ],
  'Operações': [
    { value: 'recebimento-operacional', label: 'Recebimento Operacional' },
    { value: 'validacao-tecnica', label: 'Validação Técnica' },
    { value: 'aprovacao-operacional', label: 'Aprovação Operacional' },
    { value: 'implementacao', label: 'Implementação' }
  ],
  'Comercial': [
    { value: 'analise-comercial', label: 'Análise Comercial' },
    { value: 'validacao-proposta', label: 'Validação de Proposta' },
    { value: 'aprovacao-comercial', label: 'Aprovação Comercial' },
    { value: 'follow-up', label: 'Follow-up' }
  ]
};

export function TemplateCreatePage() {
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [team, setTeam] = useState('Financeiro');
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState('');
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    { id: '1', name: 'Recebimento Fiscal' }
  ]);

  // Caracteres restantes para o nome do template
  const remainingChars = 25 - templateName.length;

  const handleBack = () => {
    navigate('/templates');
  };

  const handleSave = () => {
    // TODO: Implementar lógica de salvamento
    console.log('Salvando template...', {
      templateName,
      documentType,
      team,
      workflowSteps
    });
    navigate('/templates');
  };

  const handleCancel = () => {
    navigate('/templates');
  };

  // Etapas disponíveis baseadas no time selecionado
  const availableSteps = useMemo(() => {
    return TEAM_WORKFLOW_STEPS[team as keyof typeof TEAM_WORKFLOW_STEPS] || [];
  }, [team]);

  const handleRemoveStep = (stepId: string) => {
    setWorkflowSteps(prev => prev.filter(step => step.id !== stepId));
  };

  const handleAddStep = () => {
    if (!selectedWorkflowStep) return;
    
    const stepData = availableSteps.find(step => step.value === selectedWorkflowStep);
    if (!stepData) return;

    // Verificar se a etapa já foi adicionada
    const stepExists = workflowSteps.some(step => step.name === stepData.label);
    if (stepExists) return;

    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      name: stepData.label
    };

    setWorkflowSteps(prev => [...prev, newStep]);
    setSelectedWorkflowStep('');
  };

  const handleTemplateNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 25) {
      setTemplateName(value);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-medium text-woopi-ai-dark-gray">Novo Template</h1>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Nome do Template e Tipo de Documento na mesma linha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="template-name" className="text-sm font-medium text-woopi-ai-gray uppercase">
              NOME DO TEMPLATE
            </Label>
            <div className="relative">
              <Input
                id="template-name"
                value={templateName}
                onChange={handleTemplateNameChange}
                className="w-full bg-white border border-woopi-ai-border rounded-md pr-16"
                placeholder=""
                maxLength={25}
              />
              <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs ${
                remainingChars < 5 ? 'text-woopi-ai-error' : 'text-woopi-ai-gray'
              }`}>
                {remainingChars}/25
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-type" className="text-sm font-medium text-woopi-ai-gray uppercase">
              TIPO DE DOCUMENTO
            </Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger className="w-full bg-white border border-woopi-ai-border rounded-md">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nfe">Nota Fiscal Eletrônica</SelectItem>
                <SelectItem value="contrato">Contrato</SelectItem>
                <SelectItem value="recibo">Recibo</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Time */}
        <div className="space-y-2">
          <Label htmlFor="team" className="text-sm font-medium text-woopi-ai-gray uppercase">
            TIME
          </Label>
          <Select value={team} onValueChange={setTeam}>
            <SelectTrigger className="w-full bg-white border border-woopi-ai-border rounded-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Financeiro">Financeiro</SelectItem>
              <SelectItem value="Jurídico">Jurídico</SelectItem>
              <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
              <SelectItem value="Operações">Operações</SelectItem>
              <SelectItem value="Comercial">Comercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Etapas e Campos da IA */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-woopi-ai-dark-gray">Etapas e Campos da IA</h3>
          
          {/* Adicionar Etapa do Workflow */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-woopi-ai-gray uppercase">
              ADICIONAR ETAPA DO WORKFLOW
            </Label>
            <div className="flex gap-3">
              <Select value={selectedWorkflowStep} onValueChange={setSelectedWorkflowStep}>
                <SelectTrigger className="flex-1 bg-white border border-woopi-ai-border rounded-md">
                  <SelectValue placeholder="Selecione uma etapa..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSteps.map((step) => (
                    <SelectItem 
                      key={step.value} 
                      value={step.value}
                      disabled={workflowSteps.some(ws => ws.name === step.label)}
                    >
                      {step.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={handleAddStep}
                disabled={!selectedWorkflowStep}
                className="px-4 bg-white border border-woopi-ai-border text-woopi-ai-dark-gray hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar
              </Button>
            </div>
          </div>

          {/* Lista de Etapas Adicionadas */}
          <div className="space-y-2">
            {workflowSteps.map((step) => (
              <div
                key={step.id}
                className="flex items-center justify-between p-3 bg-white border border-woopi-ai-border rounded-md"
              >
                <span className="text-sm text-woopi-ai-dark-gray font-medium">
                  {step.name}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveStep(step.id)}
                    className="p-1 h-auto hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <ChevronDown className="h-4 w-4 text-woopi-ai-gray" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 pt-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-6 border-woopi-ai-border text-woopi-ai-dark-gray hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 woopi-ai-button-primary"
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}