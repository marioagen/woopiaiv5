import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft,
  Plus,
  Save,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { DualListSelector } from './DualListSelector';

interface Question {
  id: number;
  descricao: string;
  dataInclusao: string;
  proprietario: string;
}

interface Questionnaire {
  id: number;
  nome: string;
  tipoDocumento: string;
  perguntas: number;
  perguntasSelecionadas?: Question[];
  dataInclusao: string;
  proprietario: string;
}

export function QuestionnaireEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id !== 'new';

  // Form states
  const [questionnaireForm, setQuestionnaireForm] = useState({
    nome: '',
    tipoDocumento: '',
    perguntasSelecionadas: [] as Question[],
  });

  // Question creation modal states
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    descricao: '',
  });

  // Force re-render key for DualListSelector
  const [forceRenderKey, setForceRenderKey] = useState(0);

  // Mock data - in real app, this would come from API/context
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([
    {
      id: 4,
      descricao: 'summarize o teor do documento',
      dataInclusao: '2025-06-20',
      proprietario: 'milagres@bitami.etetermin.com'
    },
    {
      id: 1,
      descricao: 'Qual é o objetivo principal deste documento?',
      dataInclusao: '2025-01-15',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 2,
      descricao: 'Quais são os riscos identificados?',
      dataInclusao: '2025-01-10',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 3,
      descricao: 'Existe conformidade com as normas vigentes?',
      dataInclusao: '2025-01-05',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 5,
      descricao: 'Quais são as responsabilidades definidas?',
      dataInclusao: '2024-12-28',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 6,
      descricao: 'O documento possui data de validade?',
      dataInclusao: '2024-12-20',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 7,
      descricao: 'Existem anexos ou documentos relacionados?',
      dataInclusao: '2024-12-15',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 8,
      descricao: 'Qual é o nível de criticidade desta informação?',
      dataInclusao: '2024-12-10',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 9,
      descricao: 'Há necessidade de aprovação superior?',
      dataInclusao: '2024-12-05',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 10,
      descricao: 'O documento está atualizado com a versão mais recente?',
      dataInclusao: '2024-12-01',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 11,
      descricao: 'Existem conflitos com outras diretrizes?',
      dataInclusao: '2024-11-25',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 12,
      descricao: 'Qual é o impacto operacional desta mudança?',
      dataInclusao: '2024-11-20',
      proprietario: 'admin@empresa.com'
    }
  ]);

  // Mock questionnaires data - in real app, this would come from API/context
  const mockQuestionnaires: Questionnaire[] = [
    {
      id: 1,
      nome: 'basics',
      tipoDocumento: 'sired',
      perguntas: 4,
      perguntasSelecionadas: [
        availableQuestions.find(q => q.id === 4),
        availableQuestions.find(q => q.id === 1),
        availableQuestions.find(q => q.id === 2),
        availableQuestions.find(q => q.id === 3)
      ].filter(Boolean) as Question[],
      dataInclusao: '2025-06-20',
      proprietario: 'milagres@bitami.etetermin.com'
    },
    {
      id: 2,
      nome: 'Avaliação de Conformidade',
      tipoDocumento: 'Contrato',
      perguntas: 8,
      perguntasSelecionadas: [
        availableQuestions.find(q => q.id === 1),
        availableQuestions.find(q => q.id === 2),
        availableQuestions.find(q => q.id === 3),
        availableQuestions.find(q => q.id === 5),
        availableQuestions.find(q => q.id === 6),
        availableQuestions.find(q => q.id === 7),
        availableQuestions.find(q => q.id === 8),
        availableQuestions.find(q => q.id === 9)
      ].filter(Boolean) as Question[],
      dataInclusao: '2025-01-15',
      proprietario: 'admin@empresa.com'
    },
    {
      id: 3,
      nome: 'Análise de Riscos',
      tipoDocumento: 'Relatório',
      perguntas: 12,
      perguntasSelecionadas: availableQuestions,
      dataInclusao: '2025-01-10',
      proprietario: 'admin@empresa.com'
    }
  ];

  // Available document types
  const documentTypes = ['sired', 'Contrato', 'Relatório', 'Manual', 'Política', 'Procedimento', 'Formulário', 'Certificado', 'Licença', 'Norma', 'Instrução', 'Regulamento'];

  // Load questionnaire data when editing
  useEffect(() => {
    if (isEditing) {
      const questionnaire = mockQuestionnaires.find(q => q.id === parseInt(id as string));
      if (questionnaire) {
        setQuestionnaireForm({
          nome: questionnaire.nome,
          tipoDocumento: questionnaire.tipoDocumento,
          perguntasSelecionadas: questionnaire.perguntasSelecionadas || [],
        });
      }
    }
  }, [id, isEditing]);

  // Force complete remount whenever availableQuestions change
  useEffect(() => {
    setForceRenderKey(prev => prev + 1);
  }, [availableQuestions]);

  // Convert questions to dual list format
  const availableDualListItems = availableQuestions.map(question => ({
    id: question.id,
    text: question.descricao,
    subtitle: `ID: ${question.id} • ${question.proprietario}`
  }));

  const selectedDualListItems = questionnaireForm.perguntasSelecionadas.map(question => ({
    id: question.id,
    text: question.descricao,
    subtitle: `ID: ${question.id} • ${question.proprietario}`
  }));

  // Handle dual list selection change
  const handleQuestionSelectionChange = (selectedItems: { id: number; text: string; subtitle?: string }[]) => {
    const selectedQuestions = selectedItems.map(item => 
      availableQuestions.find(q => q.id === item.id)
    ).filter(Boolean) as Question[];
    
    setQuestionnaireForm(prev => ({
      ...prev,
      perguntasSelecionadas: selectedQuestions
    }));
  };

  // Question creation handlers
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionForm.descricao.trim()) {
      toast.error('Descrição da pergunta é obrigatória');
      return;
    }

    const newQuestion: Question = {
      id: Math.max(...availableQuestions.map(q => q.id), 0) + 1,
      descricao: questionForm.descricao.trim(),
      dataInclusao: new Date().toISOString().split('T')[0],
      proprietario: 'usuarioatual@empresa.com'
    };
    
    setAvailableQuestions(prev => [newQuestion, ...prev]);
    setQuestionForm({ descricao: '' });
    setIsQuestionModalOpen(false);
    toast.success('Pergunta criada com sucesso!');
  };

  const resetQuestionForm = () => {
    setQuestionForm({ descricao: '' });
    setIsQuestionModalOpen(false);
  };

  // Form validation
  const isFormValid = () => {
    return questionnaireForm.nome.trim() && 
           questionnaireForm.tipoDocumento && 
           questionnaireForm.perguntasSelecionadas.length > 0;
  };

  // Save questionnaire
  const handleSave = () => {
    if (!isFormValid()) {
      toast.error('Preencha todos os campos obrigatórios e selecione pelo menos uma pergunta');
      return;
    }

    // In real app, this would be an API call
    if (isEditing) {
      toast.success('Questionário atualizado com sucesso!');
    } else {
      toast.success('Questionário criado com sucesso!');
    }
    
    navigate('/questionarios');
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/questionarios');
  };

  return (
    <div className="relative h-full overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2 text-woopi-ai-gray hover:text-woopi-ai-dark-gray"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold woopi-ai-text-primary">
                  {isEditing ? 'Editar Questionário' : 'Criar Questionário'}
                </h1>
                <p className="woopi-ai-text-secondary text-sm md:text-base">
                  {isEditing ? 'Atualize as informações do questionário' : 'Crie um novo questionário para o sistema'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleBack}
                className="w-full md:w-auto"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isFormValid()}
                className="woopi-ai-button-primary w-full md:w-auto"
              >
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Configure as informações básicas do questionário
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Questionário *</Label>
                    <Input
                      id="nome"
                      placeholder="Digite o nome do questionário"
                      value={questionnaireForm.nome}
                      onChange={(e) => setQuestionnaireForm({...questionnaireForm, nome: e.target.value})}
                      className="border-gray-300 focus:border-woopi-ai-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
                    <Select 
                      value={questionnaireForm.tipoDocumento} 
                      onValueChange={(value) => setQuestionnaireForm({...questionnaireForm, tipoDocumento: value})}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-woopi-ai-blue">
                        <SelectValue placeholder="Selecione o tipo de documento" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Seleção de Perguntas</CardTitle>
                <CardDescription>
                  Selecione as perguntas que farão parte deste questionário ({questionnaireForm.perguntasSelecionadas.length} selecionadas)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px]">
                  <DualListSelector
                    key={forceRenderKey}
                    availableItems={availableDualListItems}
                    selectedItems={selectedDualListItems}
                    onSelectionChange={handleQuestionSelectionChange}
                    availableTitle="Perguntas Disponíveis"
                    selectedTitle="Perguntas Selecionadas"
                    searchPlaceholder="Buscar perguntas..."
                    summaryActionButton={
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsQuestionModalOpen(true)}
                        className="px-3 py-1 h-8 text-sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Nova Pergunta
                      </Button>
                    }
                    className="h-[400px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>

      {/* Question Creation Modal */}
      <Dialog open={isQuestionModalOpen} onOpenChange={setIsQuestionModalOpen}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Nova Pergunta</DialogTitle>
            <DialogDescription>
              Crie uma nova pergunta para ser utilizada em questionários
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleQuestionSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="questionDescricao">Descrição da Pergunta *</Label>
              <Input
                id="questionDescricao"
                placeholder="Digite a pergunta"
                value={questionForm.descricao}
                onChange={(e) => setQuestionForm({...questionForm, descricao: e.target.value})}
                className="border-gray-300 focus:border-woopi-ai-blue"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetQuestionForm}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!questionForm.descricao.trim()}
                className="woopi-ai-button-primary"
              >
                Criar Pergunta
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}