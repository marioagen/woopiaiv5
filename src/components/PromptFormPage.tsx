import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

interface PromptFormData {
  name: string;
  description: string;
  content: string;
  isActive: boolean;
  category: string;
  tags: string;
}

export function PromptFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState<PromptFormData>({
    name: '',
    description: '',
    content: '',
    isActive: true,
    category: '',
    tags: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if there's cloned data from navigation state
    const clonedData = (location.state as any)?.clonedData;
    
    if (clonedData) {
      // Preencher formulário com dados clonados
      setFormData({
        name: clonedData.name || '',
        description: clonedData.description || '',
        content: clonedData.content || '',
        isActive: true,
        category: '',
        tags: ''
      });
    } else if (isEditing) {
      // Simular carregamento dos dados do prompt para edição
      setFormData({
        name: 'Prompt Name',
        description: 'Item para revisar informações referentes a papéis jurídicos, extra judiciais, penalidades, etc',
        content: 'Você é um assistente especializado em análise de documentos jurídicos. Sua função é revisar e extrair informações relevantes de documentos legais, incluindo contratos, petições, e outros papéis jurídicos. Sempre forneça respostas precisas e detalhadas baseadas no conteúdo fornecido.',
        isActive: true,
        category: 'Jurídico',
        tags: 'jurídico, análise, documentos'
      });
    }
  }, [isEditing, location.state]);

  const handleInputChange = (field: keyof PromptFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Nome do prompt é obrigatório');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Conteúdo do prompt é obrigatório');
      return;
    }

    setIsLoading(true);

    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEditing) {
        toast.success('Prompt atualizado com sucesso!');
      } else {
        toast.success('Prompt criado com sucesso!');
      }
      
      navigate('/prompts');
    } catch (error) {
      toast.error('Erro ao salvar prompt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/prompts');
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        
        <div>
          <h1 className="text-2xl font-semibold text-woopi-ai-dark-gray">
            {isEditing ? 'Editar Prompt' : 'Criar Novo Prompt'}
          </h1>
          <p className="text-sm text-woopi-ai-gray">
            {isEditing ? 'Edite as informações do prompt' : 'Preencha as informações para criar um novo prompt'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="woopi-ai-card">
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Prompt *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Digite o nome do prompt"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      handleInputChange('description', e.target.value);
                    }
                  }}
                  placeholder="Digite uma breve descrição do prompt"
                  rows={3}
                  maxLength={500}
                />
                <p className={`text-xs text-right ${formData.description.length >= 450 ? 'text-woopi-ai-error font-medium' : 'text-woopi-ai-gray'}`}>
                  {formData.description.length}/500
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="Ex: Jurídico, Análise, Revisão"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="Tags separadas por vírgula"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="woopi-ai-card">
            <CardHeader>
              <CardTitle>Conteúdo do Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="content">Texto do Prompt *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Digite o conteúdo completo do prompt..."
                  rows={12}
                  className="resize-none"
                />
                <p className="text-xs text-woopi-ai-gray">
                  Escreva instruções claras e específicas para o que o prompt deve realizar.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="woopi-ai-card">
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Status</Label>
                  <p className="text-sm text-woopi-ai-gray">
                    {formData.isActive ? 'Ativo' : 'Inativo'}
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="woopi-ai-card">
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isEditing && (
                <>
                  <div>
                    <Label className="text-xs text-woopi-ai-gray">Criado em</Label>
                    <p className="text-sm">16/04/2025</p>
                  </div>
                  <div>
                    <Label className="text-xs text-woopi-ai-gray">Última modificação</Label>
                    <p className="text-sm">16/04/2025</p>
                  </div>
                  <div>
                    <Label className="text-xs text-woopi-ai-gray">Criado por</Label>
                    <p className="text-sm">João Silva</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="space-y-3">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full woopi-ai-button-primary gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Salvando...' : 'Salvar Prompt'}
            </Button>

            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}