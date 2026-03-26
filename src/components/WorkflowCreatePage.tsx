import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SearchableSelect } from './ui/searchable-select';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Users, 
  Save,
  Workflow
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Mock data para times e perfis
const availableTeams = [
  'Time Financeiro',
  'Time RH', 
  'Time Jurídico',
  'Time de Entrada',
  'Analista Fiscal',
  'Suprimentos'
];

const availableProfiles = [
  'Administrador',
  'Analista Senior',
  'Analista Junior',
  'Gestor',
  'Supervisor',
  'Operador'
];

interface WorkflowStage {
  id: string;
  name: string;
  status: 'Aguardando análise' | 'Analisado' | 'Esperando aprovação' | 'Aprovado' | 'Concluído';
  responsibleProfile: string;
}



const StageCard = ({ stage, onUpdate, onDelete, allStages }: { 
  stage: WorkflowStage; 
  onUpdate: (stage: WorkflowStage) => void; 
  onDelete: (id: string) => void;
  allStages: WorkflowStage[];
}) => {
  const navigate = useNavigate();
  const [localStage, setLocalStage] = useState(stage);

  const handleUpdate = (updates: Partial<WorkflowStage>) => {
    const updatedStage = { ...localStage, ...updates };
    setLocalStage(updatedStage);
    onUpdate(updatedStage);
  };

  const handleAutomationClick = () => {
    // Navegar para a página de automação (a ser implementada)
    navigate(`/documentos/workflow/automacao/${stage.id}`, {
      state: { stageName: stage.name, stageId: stage.id }
    });
  };

  const handleTeamToggle = (team: string) => {
    const updatedTeams = localStage.responsibleTeams.includes(team)
      ? localStage.responsibleTeams.filter(t => t !== team)
      : [...localStage.responsibleTeams, team];
    handleUpdate({ responsibleTeams: updatedTeams });
  };

  const handleProfileToggle = (profile: string) => {
    const updatedProfiles = localStage.requiredProfiles.includes(profile)
      ? localStage.requiredProfiles.filter(p => p !== profile)
      : [...localStage.requiredProfiles, profile];
    handleUpdate({ requiredProfiles: updatedProfiles });
  };

  const handleFieldToggle = (field: string) => {
    const updatedFields = localStage.requiredFields.includes(field)
      ? localStage.requiredFields.filter(f => f !== field)
      : [...localStage.requiredFields, field];
    handleUpdate({ requiredFields: updatedFields });
  };

  const handleAddEntity = () => {
    if (newEntity.trim() && !localStage.extractionEntities.includes(newEntity.trim())) {
      const updatedEntities = [...localStage.extractionEntities, newEntity.trim()];
      handleUpdate({ extractionEntities: updatedEntities });
      setNewEntity('');
    }
  };

  const handleRemoveEntity = (entity: string) => {
    const updatedEntities = localStage.extractionEntities.filter(e => e !== entity);
    handleUpdate({ extractionEntities: updatedEntities });
  };

  const handleAddLogicalRule = () => {
    if (newRule.field && newRule.operator && newRule.value && newRule.actionType && newRule.actionTarget) {
      const logicalRule: LogicalRule = {
        id: Date.now().toString(),
        condition: {
          field: newRule.field,
          operator: newRule.operator,
          value: newRule.value
        },
        action: {
          type: newRule.actionType,
          target: newRule.actionTarget
        }
      };
      
      const updatedRules = [...localStage.logicalTransitionRules, logicalRule];
      handleUpdate({ logicalTransitionRules: updatedRules });
      
      // Reset form
      setNewRule({
        field: '',
        operator: '',
        value: '',
        actionType: '',
        actionTarget: ''
      });
    }
  };

  const handleRemoveLogicalRule = (ruleId: string) => {
    const updatedRules = localStage.logicalTransitionRules.filter(r => r.id !== ruleId);
    handleUpdate({ logicalTransitionRules: updatedRules });
  };

  const formatRuleText = (rule: LogicalRule) => {
    const operatorText = ruleOperators.find(op => op.value === rule.condition.operator)?.label || rule.condition.operator;
    return `SE ${rule.condition.field} ${operatorText} "${rule.condition.value}" → ${rule.action.type} "${rule.action.target}"`;
  };

  const handleTransitionRulesSave = (rules: WorkflowStage['transitionRules']) => {
    handleUpdate({ transitionRules: rules });
  };

  return (
    <Card className="w-80 flex-shrink-0 border-woopi-ai-border">
      <CardHeader className="bg-blue-50 border-b border-woopi-ai-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 h-6 bg-woopi-ai-blue text-white rounded-full flex items-center justify-center text-xs font-medium">
              {stage.id}
            </div>
            <Input
              value={localStage.name}
              onChange={(e) => handleUpdate({ name: e.target.value })}
              placeholder="Nome da etapa"
              className="border-none p-0 h-auto bg-transparent font-medium text-sm flex-1"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(stage.id)}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Status */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-woopi-ai-gray">STATUS</Label>
          <Select 
            value={localStage.status} 
            onValueChange={(value: 'Aguardando análise' | 'Analisado' | 'Esperando aprovação' | 'Aprovado' | 'Concluído') => handleUpdate({ status: value })}
          >
            <SelectTrigger className="border-woopi-ai-border">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Aguardando análise">Aguardando análise</SelectItem>
              <SelectItem value="Analisado">Analisado</SelectItem>
              <SelectItem value="Esperando aprovação">Esperando aprovação</SelectItem>
              <SelectItem value="Aprovado">Aprovado</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Perfil Responsável */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-woopi-ai-gray">PERFIL RESPONSÁVEL</Label>
          <SearchableSelect 
            value={localStage.responsibleProfile} 
            onValueChange={(value) => handleUpdate({ responsibleProfile: value })}
            placeholder="Selecione o perfil responsável"
            options={availableProfiles.map(profile => ({ label: profile, value: profile }))}
            className="border-woopi-ai-border"
          />
        </div>

        {/* Botão de Automação */}
        <div className="pt-2">
          <Button
            onClick={handleAutomationClick}
            variant="outline"
            size="sm"
            className="w-full flex items-center gap-2 text-woopi-ai-blue border-woopi-ai-blue hover:bg-woopi-ai-light-blue"
          >
            <Workflow className="w-4 h-4" />
            Automação de Documentos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export function WorkflowCreatePage() {
  const navigate = useNavigate();
  const [workflowName, setWorkflowName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [stages, setStages] = useState<WorkflowStage[]>([
    {
      id: '1',
      name: 'Recebimento',
      status: 'Aguardando análise',
      responsibleProfile: ''
    },
    {
      id: '2',
      name: 'Validação Fiscal',
      status: 'Analisado',
      responsibleProfile: ''
    }
  ]);

  const handleBack = () => {
    navigate('/documentos/workflow/gerenciar');
  };

  const handleStageUpdate = (updatedStage: WorkflowStage) => {
    setStages(prev => prev.map(stage => 
      stage.id === updatedStage.id ? updatedStage : stage
    ));
  };

  const handleStageDelete = (stageId: string) => {
    if (stages.length > 1) {
      setStages(prev => prev.filter(stage => stage.id !== stageId));
    } else {
      toast.error('É necessário ter pelo menos uma etapa no workflow');
    }
  };

  const handleAddStage = () => {
    const newStage: WorkflowStage = {
      id: (stages.length + 1).toString(),
      name: 'Nova Etapa',
      status: 'Aguardando análise',
      responsibleProfile: ''
    };
    setStages(prev => [...prev, newStage]);
  };

  const handleSaveWorkflow = () => {
    if (!workflowName.trim()) {
      toast.error('Nome do workflow é obrigatório');
      return;
    }

    if (!selectedTeam) {
      toast.error('Time responsável é obrigatório');
      return;
    }

    if (stages.length === 0) {
      toast.error('É necessário ter pelo menos uma etapa');
      return;
    }

    // Validar se todas as etapas têm nome e perfil responsável
    const invalidStages = stages.filter(stage => !stage.name.trim() || !stage.responsibleProfile);
    if (invalidStages.length > 0) {
      toast.error('Todas as etapas devem ter um nome e perfil responsável');
      return;
    }

    // Simular salvamento do workflow
    const workflowData = {
      name: workflowName.trim(),
      team: selectedTeam,
      stages: stages,
      createdAt: new Date().toISOString()
    };

    console.log('Saving workflow:', workflowData);
    
    toast.success(`Workflow "${workflowName}" criado com sucesso!`);
    
    // Navegar de volta para a página de workflows
    navigate('/documentos/workflow/gerenciar');
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="p-2 hover:bg-woopi-ai-light-gray"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold woopi-ai-text-primary">
              Criar Workflow
            </h1>
            <p className="woopi-ai-text-secondary text-sm md:text-base">
              Configure as etapas do processo de análise de documentos
            </p>
          </div>
        </div>

        <Button 
          onClick={handleSaveWorkflow}
          className="woopi-ai-button-primary"
          disabled={!workflowName.trim() || !selectedTeam}
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Workflow
        </Button>
      </div>

      {/* Nome do Workflow e Time */}
      <Card className="border-woopi-ai-border">
        <CardHeader>
          <CardTitle className="text-sm">Configuração do Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Nome do Workflow</Label>
              <Input
                id="workflow-name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Digite o nome do workflow..."
                className="border-woopi-ai-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflow-team">Time Responsável</Label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger id="workflow-team" className="border-woopi-ai-border">
                  <SelectValue placeholder="Selecione o time responsável" />
                </SelectTrigger>
                <SelectContent>
                  {availableTeams.map(team => (
                    <SelectItem key={team} value={team}>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-woopi-ai-gray" />
                        <span>{team}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Etapas do Workflow */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium woopi-ai-text-primary">
            Etapas do Workflow
          </h2>
          <Button
            onClick={handleAddStage}
            className="woopi-ai-button-secondary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Etapa
          </Button>
        </div>

        <div className="overflow-x-auto">
          <div className="flex gap-6 min-w-max pb-4">
            {stages.map((stage) => (
              <StageCard
                key={stage.id}
                stage={stage}
                onUpdate={handleStageUpdate}
                onDelete={handleStageDelete}
              />
            ))}

            {/* Card de Adicionar Etapa */}
            <Card className="w-80 flex-shrink-0 border-dashed border-woopi-ai-border">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <Button
                  onClick={handleAddStage}
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
      </div>
    </div>
  );
}