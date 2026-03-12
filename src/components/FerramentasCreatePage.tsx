import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Trash2, ChevronDown, Plus, X } from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
}

interface InputField {
  id: string;
  name: string;
}

interface OutputField {
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

export function FerramentasCreatePage() {
  const navigate = useNavigate();
  const [ferramentaName, setFerramentaName] = useState('');
  const [toolType, setToolType] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [team, setTeam] = useState('Financeiro');
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState('');
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    { id: '1', name: 'Recebimento Fiscal' }
  ]);
  
  // JSON API specific fields
  const [apiUrl, setApiUrl] = useState('');
  const [apiMethod, setApiMethod] = useState('POST');
  const [apiHeaders, setApiHeaders] = useState('');
  const [inputFields, setInputFields] = useState<InputField[]>([]);
  const [outputFields, setOutputFields] = useState<OutputField[]>([]);
  const [newInputName, setNewInputName] = useState('');
  const [newOutputName, setNewOutputName] = useState('');
  
  // N8N Connector specific fields
  const [n8nUrl, setN8nUrl] = useState('');
  const [n8nApiKey, setN8nApiKey] = useState('');

  // Caracteres restantes para o nome da ferramenta
  const remainingChars = 25 - ferramentaName.length;

  const handleBack = () => {
    navigate('/ferramentas');
  };

  const handleSave = () => {
    // TODO: Implementar lógica de salvamento
    console.log('Salvando ferramenta...', {
      ferramentaName,
      toolType,
      documentType,
      team,
      workflowSteps,
      ...(toolType === 'json-api' && {
        apiUrl,
        apiMethod,
        apiHeaders,
        inputFields,
        outputFields
      }),
      ...(toolType === 'n8n-connector' && {
        n8nUrl,
        n8nApiKey,
        inputFields,
        outputFields
      })
    });
    navigate('/ferramentas');
  };

  const handleCancel = () => {
    navigate('/ferramentas');
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

  const handleFerramentaNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 25) {
      setFerramentaName(value);
    }
  };

  // Input fields management
  const handleAddInput = () => {
    if (newInputName.trim()) {
      const newInput: InputField = {
        id: Date.now().toString(),
        name: newInputName.trim()
      };
      setInputFields(prev => [...prev, newInput]);
      setNewInputName('');
    }
  };

  const handleRemoveInput = (inputId: string) => {
    setInputFields(prev => prev.filter(input => input.id !== inputId));
  };

  // Output fields management
  const handleAddOutput = () => {
    if (newOutputName.trim()) {
      const newOutput: OutputField = {
        id: Date.now().toString(),
        name: newOutputName.trim()
      };
      setOutputFields(prev => [...prev, newOutput]);
      setNewOutputName('');
    }
  };

  const handleRemoveOutput = (outputId: string) => {
    setOutputFields(prev => prev.filter(output => output.id !== outputId));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="p-2 hover:bg-muted dark:hover:bg-[#2d3354]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-medium text-woopi-ai-dark-gray">Nova Ferramenta</h1>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Nome da Ferramenta e Tipo de Ferramenta na mesma linha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ferramenta-name" className="text-sm font-medium text-woopi-ai-gray uppercase">
              NOME DA FERRAMENTA
            </Label>
            <div className="relative">
              <Input
                id="ferramenta-name"
                value={ferramentaName}
                onChange={handleFerramentaNameChange}
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
            <Label htmlFor="tool-type" className="text-sm font-medium text-woopi-ai-gray uppercase">
              TIPO DE FERRAMENTA
            </Label>
            <Select value={toolType} onValueChange={setToolType}>
              <SelectTrigger className="w-full bg-white border border-woopi-ai-border rounded-md">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ocr">OCR</SelectItem>
                <SelectItem value="embeddings">Embeddings</SelectItem>
                <SelectItem value="prompt">Prompt</SelectItem>
                <SelectItem value="extracao">Extração</SelectItem>
                <SelectItem value="perguntas-documento">Perguntas ao Documento</SelectItem>
                <SelectItem value="anonimizacao">Anonimização</SelectItem>
                <SelectItem value="traducao">Tradução</SelectItem>
                <SelectItem value="json-api">JSON API</SelectItem>
                <SelectItem value="n8n-connector">Conector N8N</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* JSON API Fields - only show when JSON API is selected */}
        {toolType === 'json-api' && (
          <div className="space-y-6 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-medium text-woopi-ai-dark-gray">Configurações da API</h3>
            
            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="api-url" className="text-sm font-medium text-woopi-ai-gray uppercase">
                URL
              </Label>
              <Input
                id="api-url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full bg-white border border-woopi-ai-border rounded-md"
                placeholder="https://api.exemplo.com/endpoint"
              />
            </div>

            {/* Método */}
            <div className="space-y-2">
              <Label htmlFor="api-method" className="text-sm font-medium text-woopi-ai-gray uppercase">
                MÉTODO
              </Label>
              <Select value={apiMethod} onValueChange={setApiMethod}>
                <SelectTrigger className="w-full bg-white border border-woopi-ai-border rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Headers (JSON) */}
            <div className="space-y-2">
              <Label htmlFor="api-headers" className="text-sm font-medium text-woopi-ai-gray uppercase">
                HEADERS (JSON)
              </Label>
              <Textarea
                id="api-headers"
                value={apiHeaders}
                onChange={(e) => setApiHeaders(e.target.value)}
                className="w-full bg-white border border-woopi-ai-border rounded-md min-h-[100px]"
                placeholder='{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer token"\n}'
              />
            </div>

            {/* Inputs and Outputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inputs */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-woopi-ai-gray uppercase">
                  INPUTS
                </Label>
                
                {/* Add Input Field */}
                <div className="flex gap-2">
                  <Input
                    value={newInputName}
                    onChange={(e) => setNewInputName(e.target.value)}
                    placeholder="Nome do dado"
                    className="flex-1 bg-white border border-woopi-ai-border rounded-md"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddInput()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddInput}
                    className="px-3 bg-card border border-woopi-ai-border text-woopi-ai-blue hover:bg-woopi-ai-light-blue dark:hover:bg-[#1a3a6b]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Input List */}
                <div className="space-y-2">
                  {inputFields.map((input) => (
                    <div key={input.id} className="flex items-center justify-between p-2 bg-white border border-woopi-ai-border rounded-md">
                      <span className="text-sm text-woopi-ai-dark-gray">{input.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveInput(input.id)}
                        className="p-1 h-auto hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="text-woopi-ai-blue p-0 h-auto"
                  onClick={() => setNewInputName('')}
                >
                  Adicionar Input
                </Button>
              </div>

              {/* Outputs */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-woopi-ai-gray uppercase">
                  OUTPUTS
                </Label>
                
                {/* Add Output Field */}
                <div className="flex gap-2">
                  <Input
                    value={newOutputName}
                    onChange={(e) => setNewOutputName(e.target.value)}
                    placeholder="Nome do dado"
                    className="flex-1 bg-white border border-woopi-ai-border rounded-md"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddOutput()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddOutput}
                    className="px-3 bg-card border border-woopi-ai-border text-woopi-ai-blue hover:bg-woopi-ai-light-blue dark:hover:bg-[#1a3a6b]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Output List */}
                <div className="space-y-2">
                  {outputFields.map((output) => (
                    <div key={output.id} className="flex items-center justify-between p-2 bg-white border border-woopi-ai-border rounded-md">
                      <span className="text-sm text-woopi-ai-dark-gray">{output.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOutput(output.id)}
                        className="p-1 h-auto hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="text-woopi-ai-blue p-0 h-auto"
                  onClick={() => setNewOutputName('')}
                >
                  Adicionar Output
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* N8N Connector Fields - only show when N8N Connector is selected */}
        {toolType === 'n8n-connector' && (
          <div className="space-y-6 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-medium text-woopi-ai-dark-gray">Configurações do N8N</h3>
            
            {/* URL do N8N */}
            <div className="space-y-2">
              <Label htmlFor="n8n-url" className="text-sm font-medium text-woopi-ai-gray uppercase">
                URL DO N8N
              </Label>
              <Input
                id="n8n-url"
                value={n8nUrl}
                onChange={(e) => setN8nUrl(e.target.value)}
                className="w-full bg-white border border-woopi-ai-border rounded-md"
                placeholder="https://n8n.exemplo.com"
              />
            </div>

            {/* Chave da API */}
            <div className="space-y-2">
              <Label htmlFor="n8n-api-key" className="text-sm font-medium text-woopi-ai-gray uppercase">
                CHAVE DA API
              </Label>
              <Input
                id="n8n-api-key"
                type="password"
                value={n8nApiKey}
                onChange={(e) => setN8nApiKey(e.target.value)}
                className="w-full bg-white border border-woopi-ai-border rounded-md"
                placeholder="Sua chave da API do N8N"
              />
            </div>

            {/* Inputs and Outputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inputs */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-woopi-ai-gray uppercase">
                  INPUTS
                </Label>
                
                {/* Add Input Field */}
                <div className="flex gap-2">
                  <Input
                    value={newInputName}
                    onChange={(e) => setNewInputName(e.target.value)}
                    placeholder="Nome do dado"
                    className="flex-1 bg-white border border-woopi-ai-border rounded-md"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddInput()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddInput}
                    className="px-3 bg-card border border-woopi-ai-border text-woopi-ai-blue hover:bg-woopi-ai-light-blue dark:hover:bg-[#1a3a6b]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Input List */}
                <div className="space-y-2">
                  {inputFields.map((input) => (
                    <div key={input.id} className="flex items-center justify-between p-2 bg-white border border-woopi-ai-border rounded-md">
                      <span className="text-sm text-woopi-ai-dark-gray">{input.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveInput(input.id)}
                        className="p-1 h-auto hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="text-woopi-ai-blue p-0 h-auto"
                  onClick={() => setNewInputName('')}
                >
                  Adicionar Input
                </Button>
              </div>

              {/* Outputs */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-woopi-ai-gray uppercase">
                  OUTPUTS
                </Label>
                
                {/* Add Output Field */}
                <div className="flex gap-2">
                  <Input
                    value={newOutputName}
                    onChange={(e) => setNewOutputName(e.target.value)}
                    placeholder="Nome do dado"
                    className="flex-1 bg-white border border-woopi-ai-border rounded-md"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddOutput()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddOutput}
                    className="px-3 bg-card border border-woopi-ai-border text-woopi-ai-blue hover:bg-woopi-ai-light-blue dark:hover:bg-[#1a3a6b]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Output List */}
                <div className="space-y-2">
                  {outputFields.map((output) => (
                    <div key={output.id} className="flex items-center justify-between p-2 bg-white border border-woopi-ai-border rounded-md">
                      <span className="text-sm text-woopi-ai-dark-gray">{output.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOutput(output.id)}
                        className="p-1 h-auto hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="text-woopi-ai-blue p-0 h-auto"
                  onClick={() => setNewOutputName('')}
                >
                  Adicionar Output
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tipo de Documento - only show when not JSON API or N8N Connector */}
        {toolType !== 'json-api' && toolType !== 'n8n-connector' && (
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
        )}

        {/* Time - only show when not JSON API or N8N Connector */}
        {toolType !== 'json-api' && toolType !== 'n8n-connector' && (
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
        )}

        {/* Etapas e Campos da IA - only show when not JSON API or N8N Connector */}
        {toolType !== 'json-api' && toolType !== 'n8n-connector' && (
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
        )}

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