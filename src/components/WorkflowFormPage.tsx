import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Plus, 
  X,
  Users,
  ArrowLeft,
  Save,
  Workflow,
  ChevronRight,
  ChevronLeft,
  GripVertical,
  AlertTriangle,
  Trash2,
  FileText,
  ShieldAlert
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface WorkflowStep {
  id: string;
  nomeEtapa: string;
  perfilResponsavel: string;
}

interface WorkflowGestao {
  id: number;
  nomeWorkflow: string;
  timesAssociados: string[];
  usuarios: string[];
  etapas: WorkflowStep[];
  criadoEm: string;
  status: 'Ativo' | 'Inativo';
  ultimaExecucao?: string;
}

// Card de Etapa para Slide 2 (SEM botão de fluxo)
const StageCardStep2 = ({ 
  stage, 
  onUpdate, 
  onDelete, 
  stageNumber,
  index,
  moveCard,
  totalStages
}: { 
  stage: WorkflowStep; 
  onUpdate: (stage: WorkflowStep) => void; 
  onDelete: (id: string) => void;
  stageNumber: number;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  totalStages: number;
}) => {
  const [localStage, setLocalStage] = useState(stage);
  
  const ref = React.useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'STAGE_CARD',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'STAGE_CARD',
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = clientOffset!.x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const handleUpdate = (updates: Partial<WorkflowStep>) => {
    const updatedStage = { ...localStage, ...updates };
    setLocalStage(updatedStage);
    onUpdate(updatedStage);
  };

  const availableProfiles = [
    'Advogado Sênior', 'Advogado Júnior', 'Gerente Financeiro', 'Analista Financeiro', 
    'Contador', 'Assistente Contábil', 'Gerente de RH', 'Analista de RH',
    'Gerente de Marketing', 'Analista de Marketing', 'Desenvolvedor Sênior', 'Desenvolvedor',
    'Analista de Qualidade', 'Supervisor de Qualidade'
  ];

  return (
    <div 
      ref={ref}
      className={`transition-all ${isDragging ? 'opacity-40' : 'opacity-100'}`}
      style={{ 
        cursor: 'grab',
        transform: isOver ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <Card className={`w-full min-w-[320px] max-w-[400px] flex-shrink-0 border-woopi-ai-border ${
        isOver ? 'ring-2 ring-woopi-ai-blue shadow-lg' : ''
      }`}>
        <CardHeader className="bg-blue-50 dark:bg-[#292f4c] border-b border-woopi-ai-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <div className="flex flex-col gap-1">
                <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0" />
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (index > 0) {
                        moveCard(index, index - 1);
                      }
                    }}
                    disabled={index === 0}
                    className={`p-0.5 rounded hover:bg-muted dark:hover:bg-[#393e5c] transition-colors ${
                      index === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    title="Mover para esquerda"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (index < totalStages - 1) {
                        moveCard(index, index + 1);
                      }
                    }}
                    disabled={index === totalStages - 1}
                    className={`p-0.5 rounded hover:bg-muted dark:hover:bg-[#393e5c] transition-colors ${
                      index === totalStages - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    title="Mover para direita"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="w-6 h-6 bg-woopi-ai-blue text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                {stageNumber}
              </div>
              <Input
                value={localStage.nomeEtapa}
                onChange={(e) => handleUpdate({ nomeEtapa: e.target.value })}
                placeholder="Nome da etapa"
                className="border-none p-0 h-auto bg-transparent font-medium text-sm flex-1"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(stage.id)}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Perfil Responsável */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-woopi-ai-gray uppercase tracking-wide">
              RESPONSÁVEL
            </Label>
            <Select 
              value={localStage.perfilResponsavel} 
              onValueChange={(value) => handleUpdate({ perfilResponsavel: value })}
            >
              <SelectTrigger className="border border-woopi-ai-border text-sm w-full">
                <SelectValue placeholder="Selecione o perfil responsável" />
              </SelectTrigger>
              <SelectContent>
                {/* Opção Avanço automático em destaque */}
                <SelectItem value="Avanço automático">
                  <div className="flex items-center gap-2 py-1">
                    <div className="w-4 h-4 bg-woopi-ai-orange rounded-sm flex items-center justify-center">
                      <Workflow className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-medium text-woopi-ai-orange">Avanço automático</span>
                  </div>
                </SelectItem>
                
                {/* Separador visual */}
                <div className="h-px bg-woopi-ai-border mx-2 my-1" />
                
                {/* Perfis de usuários */}
                {availableProfiles.map(profile => (
                  <SelectItem key={profile} value={profile}>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-woopi-ai-gray" />
                      <span>{profile}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Card de Etapa para Slide 3 (COM botão de fluxo)
const StageCardStep3 = ({ 
  stage, 
  stageNumber 
}: { 
  stage: WorkflowStep; 
  stageNumber: number;
}) => {
  const navigate = useNavigate();

  return (
    <Card className="w-full min-w-[320px] max-w-[400px] flex-shrink-0 border-woopi-ai-border">
      <CardHeader className="bg-blue-50 dark:bg-[#292f4c] border-b border-woopi-ai-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-woopi-ai-blue text-white rounded-full flex items-center justify-center text-xs font-medium">
            {stageNumber}
          </div>
          <div className="font-medium text-sm">{stage.nomeEtapa}</div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Perfil Responsável - Read Only */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-woopi-ai-gray uppercase tracking-wide">
            RESPONSÁVEL
          </Label>
          <div className="flex items-center gap-2 p-2 border border-woopi-ai-border rounded-md bg-gray-50 dark:bg-[#1f2132]">
            {stage.perfilResponsavel === 'Avanço automático' ? (
              <>
                <div className="w-4 h-4 bg-woopi-ai-orange rounded-sm flex items-center justify-center">
                  <Workflow className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-woopi-ai-orange">{stage.perfilResponsavel}</span>
              </>
            ) : (
              <>
                <Users className="w-4 h-4 text-woopi-ai-gray" />
                <span className="text-sm">{stage.perfilResponsavel}</span>
              </>
            )}
          </div>
        </div>

        {/* Botão de Ferramentas - APENAS AQUI */}
        <div className="pt-2">
          <Button
            onClick={() => {
              navigate(`/documentos/workflow/automacao/${stage.id}`);
            }}
            variant="outline"
            size="sm"
            className="w-full flex items-center gap-2 text-woopi-ai-blue border border-woopi-ai-border hover:bg-woopi-ai-light-blue"
          >
            <Plus className="w-4 h-4" />
            Adicionar Fluxo de Ferramentas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export function WorkflowFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  // Slide state (1, 2, ou 3)
  const [currentSlide, setCurrentSlide] = useState(1);
  
  // Save confirmation modal state (only for editing)
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [documentAction, setDocumentAction] = useState<'delete'>('delete');
  const [selectedTargetStage, setSelectedTargetStage] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Sugestão 1: Dados dinâmicos de documentos por etapa (mock conectável ao backend)
  const [documentsPerStage, setDocumentsPerStage] = useState<Record<string, number>>({});
  
  useEffect(() => {
    if (isEditing && id) {
      // Simula busca de dados reais do backend - contagem de documentos por etapa
      const mockDocumentsPerStage: Record<string, Record<string, number>> = {
        '1': { '1': 5, '2': 7 },       // Workflow 1: 5 docs na etapa 1, 7 na etapa 2
        '2': { '1': 3 },                // Workflow 2: 3 docs na etapa 1
        '3': {},                          // Workflow 3: nenhum doc
        '4': { '1': 2, '2': 8 },        // Workflow 4: 2 e 8
        '5': { '1': 1 },                // Workflow 5: 1 doc
      };
      setDocumentsPerStage(mockDocumentsPerStage[id] || {});
    }
  }, [id, isEditing]);

  const totalDocumentsInFlow = Object.values(documentsPerStage).reduce((sum, count) => sum + count, 0);
  const hasDocumentsInFlow = totalDocumentsInFlow > 0;

  // Form data
  const [formData, setFormData] = useState({
    nomeWorkflow: '',
    timesAssociados: [] as string[],
    etapas: [] as WorkflowStep[]
  });

  // Available teams
  const availableTeams = ['Jurídico', 'Financeiro', 'RH', 'Marketing', 'Desenvolvimento', 'Contabilidade', 'Qualidade'];

  // Mock data
  const mockWorkflows: WorkflowGestao[] = [
    {
      id: 1,
      nomeWorkflow: 'Aprovação de Contratos',
      timesAssociados: ['Jurídico', 'Financeiro'],
      usuarios: ['João Silva', 'Maria Santos', 'Pedro Costa'],
      etapas: [
        { id: '1', nomeEtapa: 'Análise Jurídica', perfilResponsavel: 'Advogado Sênior' },
        { id: '2', nomeEtapa: 'Aprovação Financeira', perfilResponsavel: 'Gerente Financeiro' }
      ],
      criadoEm: '2024-01-15',
      status: 'Ativo',
      ultimaExecucao: '2024-01-20'
    }
  ];

  // Load data if editing
  useEffect(() => {
    if (isEditing && id) {
      const workflow = mockWorkflows.find(w => w.id === parseInt(id));
      if (workflow) {
        setFormData({
          nomeWorkflow: workflow.nomeWorkflow,
          timesAssociados: workflow.timesAssociados,
          etapas: workflow.etapas || []
        });
      }
    } else {
      // Initialize with one default step for new workflows
      setFormData(prev => ({
        ...prev,
        etapas: [
          {
            id: '1',
            nomeEtapa: 'Nova Etapa',
            perfilResponsavel: ''
          }
        ]
      }));
    }
  }, [id, isEditing]);

  // Workflow Steps Management
  const addWorkflowStep = () => {
    const newStep: WorkflowStep = {
      id: (formData.etapas.length + 1).toString(),
      nomeEtapa: 'Nova Etapa',
      perfilResponsavel: ''
    };
    setFormData(prev => ({
      ...prev,
      etapas: [...prev.etapas, newStep]
    }));
  };

  const removeWorkflowStep = (stepId: string) => {
    if (formData.etapas.length > 1) {
      setFormData(prev => ({
        ...prev,
        etapas: prev.etapas.filter(step => step.id !== stepId)
      }));
    } else {
      toast.error('É necessário ter pelo menos uma etapa no workflow');
    }
  };

  // Validation function for navigation
  const canNavigateToSlide = (targetSlide: number): boolean => {
    // Pode sempre voltar para etapas anteriores
    if (targetSlide <= currentSlide) {
      return true;
    }

    // Validar etapa 1 antes de ir para 2 ou 3
    if (targetSlide >= 2) {
      if (!formData.nomeWorkflow.trim()) {
        toast.error('Preencha o nome do workflow');
        return false;
      }
      if (formData.timesAssociados.length === 0) {
        toast.error('Selecione pelo menos um time');
        return false;
      }
    }

    // Validar etapa 2 antes de ir para 3
    if (targetSlide >= 3) {
      const invalidStages = formData.etapas.filter(etapa => !etapa.nomeEtapa.trim() || !etapa.perfilResponsavel);
      if (invalidStages.length > 0) {
        toast.error('Todas as etapas devem ter nome e perfil responsável');
        return false;
      }
    }

    return true;
  };

  // Navigation between slides
  const handleNext = () => {
    if (canNavigateToSlide(currentSlide + 1)) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSave = () => {
    if (!formData.nomeWorkflow || formData.timesAssociados.length === 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    // Validar etapas
    const invalidStages = formData.etapas.filter(etapa => !etapa.nomeEtapa.trim() || !etapa.perfilResponsavel);
    if (invalidStages.length > 0) {
      toast.error('Todas as etapas devem ter nome e perfil responsável');
      return;
    }

    if (isEditing) {
      if (hasDocumentsInFlow) {
        // Show confirmation modal for editing workflows with documents in flow
        setShowSaveModal(true);
        return;
      }
      // No documents in flow, save directly
      toast.success('Workflow atualizado com sucesso.');
      navigate('/workflow/gestao');
      return;
    }

    toast.success('Workflow criado com sucesso');
    navigate('/workflow/gestao');
  };

  const handleConfirmSave = () => {
    if (documentAction === 'move-to-stage' && !selectedTargetStage) {
      toast.error('Selecione a etapa de destino para os documentos');
      return;
    }

    // Sugestão 2: Confirmação extra para ação destrutiva
    if (documentAction === 'delete') {
      setShowDeleteConfirmation(true);
      return;
    }

    executeSave();
  };

  const executeSave = () => {
    toast.success(`${totalDocumentsInFlow} documentos removidos permanentemente. Workflow atualizado.`);
    setShowSaveModal(false);
    setShowDeleteConfirmation(false);
    setDeleteConfirmText('');
    setDocumentAction('delete');
    setSelectedTargetStage('');
    navigate('/workflow/gestao');
  };

  const handleCancel = () => {
    navigate('/workflow/gestao');
  };

  // Progress indicator
  const progressSteps = [
    { number: 1, label: 'Nome e Associações' },
    { number: 2, label: 'Etapas' },
    { number: 3, label: 'Ferramentas' }
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="woopi-ai-text-primary">
              {isEditing ? 'Editar Workflow' : 'Novo Workflow'}
            </h1>
            <p className="woopi-ai-text-secondary">
              {isEditing 
                ? 'Atualize as informações do workflow selecionado'
                : 'Crie um novo workflow para processar documentos'}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {progressSteps.map((step, index) => (
            <div className="contents" key={step.number}>
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => {
                    if (canNavigateToSlide(step.number)) {
                      setCurrentSlide(step.number);
                    }
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all cursor-pointer hover:scale-110 ${
                    currentSlide === step.number
                      ? 'text-white shadow-lg'
                      : currentSlide > step.number
                      ? 'bg-gray-400 dark:bg-gray-600 text-white hover:bg-gray-500 dark:hover:bg-gray-500'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  style={currentSlide === step.number ? { backgroundColor: '#004C99' } : {}}
                >
                  {step.number}
                </button>
                <span className={`text-xs font-medium ${
                  currentSlide === step.number 
                    ? 'text-gray-900 dark:text-gray-100' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < progressSteps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 mb-6" />
              )}
            </div>
          ))}
        </div>

        {/* Slide 1: Informações Básicas */}
        {currentSlide === 1 && (
          <div className="w-full">
            <Card className="woopi-ai-card">
              <CardHeader>
                <CardTitle className="woopi-ai-text-primary">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Nome do Workflow */}
                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="nomeWorkflow">Nome do Workflow</Label>
                    <Input
                      id="nomeWorkflow"
                      placeholder="Ex: Aprovação de Contratos"
                      value={formData.nomeWorkflow}
                      onChange={(e) => setFormData(prev => ({ ...prev, nomeWorkflow: e.target.value }))}
                      className="border border-woopi-ai-border w-full"
                    />
                  </div>

                  {/* Times Associados */}
                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="timesAssociados">Times Associados</Label>
                    <div className="border border-woopi-ai-border rounded-md p-4 space-y-3 max-h-40 overflow-y-auto">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {availableTeams.map((team) => (
                          <div key={team} className="flex items-center space-x-2">
                            <Checkbox
                              id={`team-${team}`}
                              checked={formData.timesAssociados.includes(team)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    timesAssociados: [...prev.timesAssociados, team]
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    timesAssociados: prev.timesAssociados.filter(t => t !== team)
                                  }));
                                }
                              }}
                            />
                            <Label 
                              htmlFor={`team-${team}`} 
                              className="text-sm cursor-pointer flex-1"
                            >
                              {team}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    {formData.timesAssociados.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.timesAssociados.map((team, index) => (
                          <Badge 
                            key={index}
                            variant="outline"
                            className="bg-white dark:bg-[#292f4c] border-woopi-ai-border dark:border-[#393e5c] text-woopi-ai-dark-gray dark:text-[#d5d8e0] text-xs"
                          >
                            <Users className="w-3 h-3 mr-1" />
                            {team}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleNext}
                className="woopi-ai-button-primary"
              >
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Slide 2: Etapas (SEM botão de fluxo) */}
        {currentSlide === 2 && (
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium woopi-ai-text-primary">
                Etapas do Workflow
              </h2>
              <Button
                onClick={addWorkflowStep}
                className="woopi-ai-button-secondary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Etapa
              </Button>
            </div>

            <div className="overflow-x-auto table-scroll-container">
              <div className="flex gap-6 min-w-max pb-4 px-1">
                {formData.etapas.map((step, index) => (
                  <StageCardStep2
                    key={step.id}
                    stage={step}
                    onUpdate={(updatedStep) => {
                      setFormData(prev => ({
                        ...prev,
                        etapas: prev.etapas.map(s => 
                          s.id === updatedStep.id ? updatedStep : s
                        )
                      }));
                    }}
                    onDelete={removeWorkflowStep}
                    stageNumber={index + 1}
                    index={index}
                    moveCard={(dragIndex, hoverIndex) => {
                      const newEtapas = [...formData.etapas];
                      const [draggedItem] = newEtapas.splice(dragIndex, 1);
                      newEtapas.splice(hoverIndex, 0, draggedItem);
                      setFormData(prev => ({
                        ...prev,
                        etapas: newEtapas
                      }));
                    }}
                    totalStages={formData.etapas.length}
                  />
                ))}

                {/* Card de Adicionar Etapa */}
                <Card className="w-full min-w-[320px] max-w-[400px] flex-shrink-0 border-dashed border-woopi-ai-border">
                  <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
                    <Button
                      onClick={addWorkflowStep}
                      variant="ghost"
                      className="h-auto p-4 flex flex-col items-center gap-2 text-woopi-ai-gray hover:text-woopi-ai-blue"
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                        <Plus className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-medium">Adicionar Etapa</div>
                        <div className="text-xs">Clique para criar uma nova etapa</div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              <Button
                onClick={handleNext}
                className="woopi-ai-button-primary"
              >
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Slide 3: Ferramentas (COM botão de fluxo) */}
        {currentSlide === 3 && (
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium woopi-ai-text-primary">
                Adicionar Fluxo de Ferramentas
              </h2>
            </div>

            <div className="overflow-x-auto table-scroll-container">
              <div className="flex gap-6 min-w-max pb-4 px-1">
                {formData.etapas.map((step, index) => (
                  <StageCardStep3
                    key={step.id}
                    stage={step}
                    stageNumber={index + 1}
                  />
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              <Button
                onClick={handleSave}
                className="woopi-ai-button-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Salvar Alterações' : 'Criar Workflow'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmação ao Salvar (somente edição) */}
      <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <DialogContent className="max-w-lg mx-4">
          <DialogHeader className="space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <DialogTitle className="text-center text-lg woopi-ai-text-primary">
              Existem documentos em andamento nesta esteira
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-woopi-ai-gray leading-relaxed">
              Encontramos <span className="font-semibold text-woopi-ai-dark-gray">{totalDocumentsInFlow} documentos</span> sendo processados neste workflow.
              Ao salvar as alterações, todos os documentos em andamento serão permanentemente excluídos.
            </DialogDescription>
          </DialogHeader>

          {/* Sugestão 1: Resumo de documentos por etapa */}
          {Object.keys(documentsPerStage).length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {formData.etapas.map((etapa, index) => {
                const count = documentsPerStage[etapa.id] || 0;
                if (count === 0) return null;
                return (
                  <div key={etapa.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#2d3354] border border-woopi-ai-border">
                    <div className="w-4 h-4 bg-woopi-ai-blue text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                      {index + 1}
                    </div>
                    <span className="text-xs text-woopi-ai-gray">{etapa.nomeEtapa}:</span>
                    <span className="text-xs font-semibold woopi-ai-text-primary">{count}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Alert box */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/40">
            <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-woopi-ai-gray leading-relaxed">
              <span className="font-semibold text-red-600 dark:text-red-400">{totalDocumentsInFlow} documentos</span> serão excluídos permanentemente ao salvar as alterações.
              Esta ação é irreversível e não pode ser desfeita. Novos documentos seguirão a estrutura atualizada.
            </p>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowSaveModal(false);
                setDocumentAction('delete');
                setSelectedTargetStage('');
              }}
              className="border-woopi-ai-border"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmSave}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir documentos e salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent className="max-w-lg mx-4">
          <DialogHeader className="space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Trash2 className="w-7 h-7 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-center text-lg woopi-ai-text-primary">
              Confirmar Exclusão de Documentos
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-woopi-ai-gray leading-relaxed">
              Você está prestes a excluir permanentemente <span className="font-semibold text-woopi-ai-dark-gray">{totalDocumentsInFlow} documentos</span> em andamento neste workflow.
              Essa ação é irreversível. Digite <span className="font-mono font-bold text-red-500">EXCLUIR</span> para confirmar:
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Digite 'EXCLUIR' para confirmar"
              className="border border-woopi-ai-border w-full"
            />
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteConfirmation(false);
                setDeleteConfirmText('');
              }}
              className="border-woopi-ai-border"
            >
              Cancelar
            </Button>
            <Button
              onClick={executeSave}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteConfirmText !== 'EXCLUIR'}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir e salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DndProvider>
  );
}