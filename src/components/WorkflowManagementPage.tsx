import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { Workflow, Plus, Edit3, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Mock data for teams and their workflows - simplified without documents
const initialTeamWorkflows = {
  'financeiro': {
    id: 'financeiro',
    name: 'Time Financeiro',
    workflowName: 'Processamento de Notas Fiscais',
    stages: [
      { id: 'recebimento', name: 'Recebimento', color: 'bg-blue-100' },
      { id: 'verificacao', name: 'Verificação Financeira', color: 'bg-blue-100' },
      { id: 'aprovacao', name: 'Aprovação de Pagamento', color: 'bg-blue-100' },
      { id: 'pagos', name: 'Pagos e Conciliados', color: 'bg-green-100' }
    ]
  },
  'rh': {
    id: 'rh',
    name: 'Time RH',
    workflowName: 'Gestão de Documentos RH',
    stages: [
      { id: 'triagem', name: 'Triagem Inicial', color: 'bg-blue-100' },
      { id: 'validacao', name: 'Validação Documentos', color: 'bg-blue-100' },
      { id: 'aprovacao-gestor', name: 'Aprovação Gestor', color: 'bg-blue-100' },
      { id: 'processados', name: 'Processados', color: 'bg-green-100' }
    ]
  },
  'juridico': {
    id: 'juridico',
    name: 'Time Jurídico',
    workflowName: 'Análise Jurídica de Contratos',
    stages: [
      { id: 'protocolo', name: 'Protocolo', color: 'bg-blue-100' },
      { id: 'analise-juridica', name: 'Análise Jurídica', color: 'bg-blue-100' },
      { id: 'parecer', name: 'Elaboração Parecer', color: 'bg-blue-100' },
      { id: 'aprovado', name: 'Aprovado', color: 'bg-green-100' }
    ]
  }
};

interface Stage {
  id: string;
  name: string;
  color: string;
}

interface WorkflowData {
  id: string;
  name: string;
  workflowName: string;
  stages: Stage[];
}

interface DeleteWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  workflowName: string;
}

const DeleteWorkflowModal = ({ isOpen, onClose, onConfirm, workflowName }: DeleteWorkflowModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o workflow "{workflowName}"?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium">!</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-800">
                  Esta ação não pode ser desfeita
                </p>
                <p className="text-sm text-red-700">
                  Todos os documentos e configurações deste workflow serão permanentemente removidos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm}
            className="woopi-ai-button-error"
          >
            Excluir Workflow
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function WorkflowManagementPage() {
  const [teamWorkflows, setTeamWorkflows] = useState(initialTeamWorkflows);
  const [selectedTeam, setSelectedTeam] = useState('financeiro');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const currentWorkflow = teamWorkflows[selectedTeam as keyof typeof teamWorkflows];

  const handleTeamChange = (teamId: string) => {
    setSelectedTeam(teamId);
  };

  const handleCreateWorkflow = () => {
    navigate('/documentos/workflow/criar');
  };

  const handleEditWorkflow = () => {
    navigate('/documentos/workflow/editor', { 
      state: { 
        workflowId: selectedTeam,
        workflowName: currentWorkflow.workflowName 
      } 
    });
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    const workflow = teamWorkflows[workflowId as keyof typeof teamWorkflows];
    if (workflow) {
      setWorkflowToDelete(workflowId);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDeleteWorkflow = () => {
    if (workflowToDelete) {
      const newWorkflows = { ...teamWorkflows };
      delete newWorkflows[workflowToDelete as keyof typeof teamWorkflows];
      setTeamWorkflows(newWorkflows);

      // Se o workflow sendo excluído é o selecionado, muda para o primeiro disponível
      if (workflowToDelete === selectedTeam) {
        const firstAvailable = Object.keys(newWorkflows)[0];
        if (firstAvailable) {
          setSelectedTeam(firstAvailable);
        }
      }

      toast.success('Workflow excluído com sucesso!');
      setWorkflowToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const KanbanColumn = ({ stage }: { stage: Stage }) => {
    return (
      <div className="w-80 flex-shrink-0">
        <div className={`${stage.color} rounded-t-lg border border-woopi-ai-border`}>
          <div className="p-4">
            <h3 className="font-medium text-woopi-ai-dark-gray text-sm">
              {stage.name}
            </h3>
          </div>
        </div>
        
        <div className="bg-white border-l border-r border-b border-woopi-ai-border rounded-b-lg min-h-[300px] p-4">
          <div className="text-center text-woopi-ai-gray text-sm py-8">
            <div className="w-12 h-12 bg-woopi-ai-light-gray rounded-full flex items-center justify-center mx-auto mb-3">
              <Workflow className="w-6 h-6 text-woopi-ai-gray" />
            </div>
            <p>Etapa do workflow</p>
            <p className="text-xs mt-1">Configure as regras e responsáveis</p>
          </div>
        </div>
      </div>
    );
  };

  const getWorkflowOptions = () => {
    return Object.entries(teamWorkflows).map(([key, workflow]) => ({
      value: key,
      label: workflow.name,
      workflowName: workflow.workflowName
    }));
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold woopi-ai-text-primary">
            Editor de Workflow
          </h1>
          <p className="woopi-ai-text-secondary text-sm md:text-base">
            Gerencie e configure workflows de processamento de documentos
          </p>
        </div>
      </div>

      {/* Workflow Management Controls */}
      <div className="bg-white border border-woopi-ai-border rounded-lg p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          {/* Workflow Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-woopi-ai-gray" />
              <span className="text-sm text-woopi-ai-gray">Gerenciar workflow:</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <Select value={selectedTeam} onValueChange={handleTeamChange}>
                <SelectTrigger className="w-64 border border-woopi-ai-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getWorkflowOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-woopi-ai-gray">{option.workflowName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Workflow Name Display */}
              <div className="flex items-center gap-2 px-3 py-2 bg-woopi-ai-light-gray rounded-md">
                <Workflow className="w-4 h-4 text-woopi-ai-blue" />
                <span className="text-sm font-medium text-woopi-ai-dark-gray">
                  {currentWorkflow.workflowName}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button 
              className="woopi-ai-button-secondary"
              onClick={handleCreateWorkflow}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Workflow
            </Button>
            
            <Button 
              className="bg-woopi-ai-blue hover:bg-woopi-ai-blue/90 text-white"
              onClick={handleEditWorkflow}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Editar
            </Button>
            
            <Button 
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800/40 dark:text-red-400 dark:hover:bg-red-900/20"
              onClick={() => handleDeleteWorkflow(selectedTeam)}
              disabled={Object.keys(teamWorkflows).length <= 1}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>
      </div>

      {/* Simplified Kanban Board - Structure Only */}
      <div className="bg-white border border-woopi-ai-border rounded-lg p-4">
        <div className="mb-4">
          <h3 className="font-medium text-woopi-ai-dark-gray">
            Estrutura do Workflow
          </h3>
          <p className="text-sm text-woopi-ai-gray mt-1">
            Visualize as etapas e configure as regras de processamento
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex gap-6 min-w-max pb-4">
            {currentWorkflow.stages.map((stage) => (
              <KanbanColumn key={stage.id} stage={stage} />
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Exclusão */}
      <DeleteWorkflowModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setWorkflowToDelete(null);
        }}
        onConfirm={confirmDeleteWorkflow}
        workflowName={workflowToDelete ? teamWorkflows[workflowToDelete as keyof typeof teamWorkflows]?.workflowName || '' : ''}
      />
    </div>
  );
}