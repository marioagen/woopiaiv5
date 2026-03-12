import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, 
  Save,
  AlertCircle,
  ChevronRight,
  GitBranch,
  FileText,
  Tag as TagIcon
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';
import { getWorkflowById, mockCurrentUser } from '../data/mockWorkflowVersions';
import { generateVersionNumber, generateHash, createAuditEvent } from '../types/workflow-version';

export function WorkflowVersionCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const workflow = id ? getWorkflowById(id) : undefined;
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    baseVersionId: workflow?.currentVersionId || '',
    changeType: 'minor' as 'major' | 'minor' | 'patch',
    versionName: '',
    changelogSummary: '',
    changelogDetailed: '',
    breakingChanges: false,
    breakingChangesDescription: '',
    businessJustification: '',
    technicalNotes: '',
    tags: workflow?.versions.find(v => v.id === workflow.currentVersionId)?.tags || [],
    category: workflow?.versions.find(v => v.id === workflow.currentVersionId)?.category || '',
    department: workflow?.versions.find(v => v.id === workflow.currentVersionId)?.department || ''
  });

  const [newTag, setNewTag] = useState('');

  if (!workflow) {
    return (
      <div className="p-6">
        <p>Workflow não encontrado</p>
      </div>
    );
  }

  const baseVersion = workflow.versions.find(v => v.id === formData.baseVersionId);
  const newVersionNumber = baseVersion 
    ? generateVersionNumber(baseVersion.versionNumber, formData.changeType)
    : '1.0.0';

  const handleNext = () => {
    if (step === 1) {
      if (!formData.baseVersionId) {
        toast.error('Selecione uma versão base');
        return;
      }
    } else if (step === 2) {
      if (!formData.changelogSummary.trim()) {
        toast.error('Resumo do changelog é obrigatório');
        return;
      }
      if (!formData.changelogDetailed.trim()) {
        toast.error('Detalhes do changelog são obrigatórios');
        return;
      }
      if (formData.breakingChanges && !formData.breakingChangesDescription.trim()) {
        toast.error('Descreva as mudanças incompatíveis');
        return;
      }
    }
    
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSave = () => {
    if (!baseVersion) {
      toast.error('Versão base não encontrada');
      return;
    }

    // Create new version
    const newVersion = {
      id: `wf_${workflow.id}_v${Date.now()}`,
      workflowId: workflow.id,
      versionNumber: newVersionNumber,
      versionName: formData.versionName || undefined,
      status: 'draft' as const,
      lifecycle: {
        createdAt: new Date(),
        createdBy: mockCurrentUser
      },
      documentation: {
        changelog: {
          summary: formData.changelogSummary,
          detailedChanges: formData.changelogDetailed,
          breakingChanges: formData.breakingChanges,
          breakingChangesDescription: formData.breakingChanges ? formData.breakingChangesDescription : undefined
        },
        businessJustification: formData.businessJustification || undefined,
        technicalNotes: formData.technicalNotes || undefined
      },
      audit: {
        trail: [
          createAuditEvent(
            mockCurrentUser.id,
            mockCurrentUser.name,
            'created',
            `Nova versão ${newVersionNumber} criada baseada na versão ${baseVersion.versionNumber}`
          )
        ]
      },
      definition: { ...baseVersion.definition }, // Clone definition
      hash: generateHash(baseVersion.definition),
      tags: formData.tags,
      category: formData.category,
      department: formData.department
    };

    toast.success(`Versão ${newVersionNumber} criada com sucesso!`);
    navigate(`/documentos/workflows/${id}/versoes/${newVersion.id}/editar`);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/documentos/workflows/${id}/versoes`)}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="woopi-ai-text-primary">
            Criar Nova Versão
          </h1>
          <p className="woopi-ai-text-secondary">
            {workflow.name}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                s <= step 
                  ? 'border-woopi-ai-blue bg-woopi-ai-blue text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  s < step ? 'bg-woopi-ai-blue' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-woopi-ai-gray">
          <span>Versão Base</span>
          <span>Changelog</span>
          <span>Metadados</span>
        </div>
      </div>

      {/* Step 1: Base Version Selection */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Selecionar Versão Base
            </CardTitle>
            <CardDescription>
              Escolha a versão que servirá como base para a nova versão
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Version Selection */}
            <RadioGroup
              value={formData.baseVersionId}
              onValueChange={(value) => setFormData({ ...formData, baseVersionId: value })}
            >
              {workflow.versions
                .filter(v => v.status !== 'archived')
                .sort((a, b) => new Date(b.lifecycle.createdAt).getTime() - new Date(a.lifecycle.createdAt).getTime())
                .map((version) => (
                  <div key={version.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={version.id} id={version.id} />
                    <label htmlFor={version.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">v{version.versionNumber}</span>
                        <Badge 
                          variant="secondary" 
                          className={
                            version.status === 'published' ? 'bg-green-500 text-white' :
                            version.status === 'draft' ? 'bg-yellow-500 text-white' :
                            'bg-gray-500 text-white'
                          }
                        >
                          {version.status === 'published' ? 'Publicada' : 
                           version.status === 'draft' ? 'Rascunho' : 'Depreciada'}
                        </Badge>
                        {version.id === workflow.currentVersionId && (
                          <Badge className="woopi-ai-badge-primary text-xs">
                            Atual
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-woopi-ai-gray">
                        {version.documentation.changelog.summary}
                      </p>
                    </label>
                  </div>
                ))}
            </RadioGroup>

            {/* Change Type */}
            {formData.baseVersionId && (
              <div className="space-y-3 pt-4 border-t">
                <Label>Tipo de Mudança</Label>
                <RadioGroup
                  value={formData.changeType}
                  onValueChange={(value) => setFormData({ ...formData, changeType: value as any })}
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="major" id="major" />
                    <label htmlFor="major" className="flex-1 cursor-pointer">
                      <div className="font-medium">Major (Breaking Changes)</div>
                      <div className="text-xs text-woopi-ai-gray">
                        Para mudanças incompatíveis que quebram funcionalidades existentes
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="minor" id="minor" />
                    <label htmlFor="minor" className="flex-1 cursor-pointer">
                      <div className="font-medium">Minor (New Features)</div>
                      <div className="text-xs text-woopi-ai-gray">
                        Para novas funcionalidades compatíveis com versão anterior
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="patch" id="patch" />
                    <label htmlFor="patch" className="flex-1 cursor-pointer">
                      <div className="font-medium">Patch (Bug Fixes)</div>
                      <div className="text-xs text-woopi-ai-gray">
                        Para correções de bugs e pequenas melhorias
                      </div>
                    </label>
                  </div>
                </RadioGroup>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Nova versão será:</span>{' '}
                    <span className="text-woopi-ai-blue font-bold">v{newVersionNumber}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Optional Version Name */}
            <div className="space-y-2">
              <Label htmlFor="versionName">Nome da Versão (opcional)</Label>
              <Input
                id="versionName"
                placeholder="Ex: Integração com ERP, Análise Aprimorada..."
                value={formData.versionName}
                onChange={(e) => setFormData({ ...formData, versionName: e.target.value })}
              />
              <p className="text-xs text-woopi-ai-gray">
                Um nome descritivo ajuda a identificar rapidamente o propósito da versão
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Changelog */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Changelog (Obrigatório)
            </CardTitle>
            <CardDescription>
              Documente as mudanças desta versão
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary">
                Resumo das Mudanças *
              </Label>
              <Textarea
                id="summary"
                placeholder="Descreva brevemente as principais mudanças desta versão..."
                value={formData.changelogSummary}
                onChange={(e) => setFormData({ ...formData, changelogSummary: e.target.value })}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-woopi-ai-gray">
                Um resumo claro e conciso (1-2 frases)
              </p>
            </div>

            {/* Detailed Changes */}
            <div className="space-y-2">
              <Label htmlFor="detailed">
                Mudanças Detalhadas *
              </Label>
              <Textarea
                id="detailed"
                placeholder="# Versão X.X.X&#10;&#10;## Novas Funcionalidades&#10;- Feature 1&#10;- Feature 2&#10;&#10;## Melhorias&#10;- Melhoria 1&#10;&#10;## Correções&#10;- Bug fix 1"
                value={formData.changelogDetailed}
                onChange={(e) => setFormData({ ...formData, changelogDetailed: e.target.value })}
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-woopi-ai-gray">
                Suporta Markdown. Seja específico sobre o que mudou.
              </p>
            </div>

            {/* Breaking Changes */}
            <div className="space-y-4 p-4 border border-orange-200 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <Label htmlFor="breaking" className="cursor-pointer">
                    Esta versão contém mudanças incompatíveis?
                  </Label>
                </div>
                <Switch
                  id="breaking"
                  checked={formData.breakingChanges}
                  onCheckedChange={(checked) => setFormData({ ...formData, breakingChanges: checked })}
                />
              </div>
              
              {formData.breakingChanges && (
                <div className="space-y-2">
                  <Label htmlFor="breakingDesc">
                    Descreva as Mudanças Incompatíveis *
                  </Label>
                  <Textarea
                    id="breakingDesc"
                    placeholder="Explique quais mudanças podem quebrar integrações ou workflows existentes e como mitigar..."
                    value={formData.breakingChangesDescription}
                    onChange={(e) => setFormData({ ...formData, breakingChangesDescription: e.target.value })}
                    rows={4}
                  />
                </div>
              )}
            </div>

            {/* Business Justification */}
            <div className="space-y-2">
              <Label htmlFor="justification">
                Justificativa de Negócio (recomendado)
              </Label>
              <Textarea
                id="justification"
                placeholder="Por que esta mudança é necessária? Qual problema ela resolve? Qual o benefício esperado?"
                value={formData.businessJustification}
                onChange={(e) => setFormData({ ...formData, businessJustification: e.target.value })}
                rows={4}
              />
            </div>

            {/* Technical Notes */}
            <div className="space-y-2">
              <Label htmlFor="technical">
                Notas Técnicas (opcional)
              </Label>
              <Textarea
                id="technical"
                placeholder="Detalhes técnicos de implementação, dependências, considerações de performance..."
                value={formData.technicalNotes}
                onChange={(e) => setFormData({ ...formData, technicalNotes: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Metadata */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TagIcon className="w-5 h-5" />
              Metadados
            </CardTitle>
            <CardDescription>
              Organize e categorize a versão
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                placeholder="Ex: Jurídico, Fiscal, RH..."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Input
                id="department"
                placeholder="Ex: Legal, Financeiro, TI..."
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Adicionar
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="woopi-ai-badge-primary">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="p-4 bg-gray-50 border rounded-lg space-y-3">
              <h4 className="font-semibold">Resumo da Nova Versão</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-woopi-ai-gray">Versão:</span>
                  <p className="font-medium">v{newVersionNumber}</p>
                </div>
                {formData.versionName && (
                  <div>
                    <span className="text-woopi-ai-gray">Nome:</span>
                    <p className="font-medium">{formData.versionName}</p>
                  </div>
                )}
                <div>
                  <span className="text-woopi-ai-gray">Categoria:</span>
                  <p className="font-medium">{formData.category || '-'}</p>
                </div>
                <div>
                  <span className="text-woopi-ai-gray">Departamento:</span>
                  <p className="font-medium">{formData.department || '-'}</p>
                </div>
              </div>
              {formData.breakingChanges && (
                <div className="flex items-center gap-2 text-orange-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Contém mudanças incompatíveis</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/documentos/workflows/${id}/versoes`)}
          >
            Cancelar
          </Button>
          
          {step < 3 ? (
            <Button onClick={handleNext} className="woopi-ai-button-primary">
              Próximo
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSave} className="woopi-ai-button-primary">
              <Save className="w-4 h-4 mr-2" />
              Criar Versão
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}