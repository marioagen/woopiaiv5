import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, 
  Clock, 
  FileText, 
  Plus,
  Eye,
  GitBranch,
  Archive,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  GitCompare,
  Copy
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { getWorkflowById } from '../data/mockWorkflowVersions';
import { WorkflowVersion } from '../types/workflow-version';
// Using basic date formatting instead of date-fns for MVP
const formatDate = (date: Date, formatStr: string) => {
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 
                  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const d = new Date(date);
  
  if (formatStr.includes("dd 'de' MMMM 'de' yyyy")) {
    return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
  }
  if (formatStr === 'dd/MM/yyyy HH:mm') {
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
  return d.toLocaleDateString('pt-BR');
};

export function WorkflowVersionHistoryPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const workflow = id ? getWorkflowById(id) : undefined;

  if (!workflow) {
    return (
      <div className="p-6">
        <p>Workflow não encontrado</p>
      </div>
    );
  }

  const handleCreateNewVersion = () => {
    navigate(`/documentos/workflows/${id}/versoes/nova`);
  };

  const handleViewVersion = (versionId: string) => {
    navigate(`/documentos/workflows/${id}/versoes/${versionId}`);
  };

  const handleEditVersion = (versionId: string) => {
    const version = workflow.versions.find(v => v.id === versionId);
    if (version?.status === 'draft') {
      navigate(`/documentos/workflows/${id}/versoes/${versionId}/editar`);
    } else {
      toast.error('Apenas versões em draft podem ser editadas');
    }
  };

  const handleCloneWorkflow = () => {
    // Navegar para o formulário de criação com os dados da esteira atual
    const cloneName = `Cópia de ${workflow.name}`;
    const cloneTeams = workflow.teams || [];
    
    // Usar state para passar os dados
    navigate('/workflow/gestao/novo', {
      state: {
        cloneData: {
          nomeWorkflow: cloneName,
          timesAssociados: cloneTeams
        }
      }
    });
    
    toast.success('Preparando clonagem da esteira...');
  };

  const getStatusBadge = (status: WorkflowVersion['status']) => {
    const configs = {
      published: { color: 'bg-green-500', label: 'Publicada', icon: CheckCircle2 },
      draft: { color: 'bg-yellow-500', label: 'Rascunho', icon: Edit2 },
      deprecated: { color: 'bg-gray-500', label: 'Depreciada', icon: Archive },
      archived: { color: 'bg-gray-400', label: 'Arquivada', icon: Archive }
    };
    
    const config = configs[status];
    const Icon = config.icon;
    
    return (
      <Badge variant="secondary" className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const sortedVersions = [...workflow.versions].sort((a, b) => {
    return new Date(b.lifecycle.createdAt).getTime() - new Date(a.lifecycle.createdAt).getTime();
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/documentos/workflows')}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="woopi-ai-text-primary">
            Histórico de Versões
          </h1>
          <p className="woopi-ai-text-secondary">
            {workflow.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/documentos/workflows/${id}/versoes/comparar`)}
          >
            <GitCompare className="w-4 h-4 mr-2" />
            Comparar
          </Button>
          <Button 
            onClick={handleCreateNewVersion}
            className="woopi-ai-button-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Versão
          </Button>
        </div>
      </div>

      {/* Version Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-woopi-ai-blue">
                {workflow.versions.length}
              </p>
              <p className="text-sm text-woopi-ai-gray">Total de Versões</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {workflow.versions.filter(v => v.status === 'published').length}
              </p>
              <p className="text-sm text-woopi-ai-gray">Publicadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {workflow.versions.filter(v => v.status === 'draft').length}
              </p>
              <p className="text-sm text-woopi-ai-gray">Em Rascunho</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600">
                {workflow.versions.filter(v => v.status === 'deprecated').length}
              </p>
              <p className="text-sm text-woopi-ai-gray">Depreciadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Version Summary */}
      <Card className="mb-6 border-woopi-ai-blue">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-woopi-ai-blue" />
            Versão Atual em Produção
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {(() => {
            const currentVersion = workflow.versions.find(v => v.id === workflow.currentVersionId);
            if (!currentVersion) return <p>Nenhuma versão publicada</p>;
            
            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">
                      {currentVersion.versionNumber}
                      {currentVersion.versionName && (
                        <span className="text-sm text-woopi-ai-gray ml-2">
                          ({currentVersion.versionName})
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-woopi-ai-gray">
                      Publicada em {formatDate(new Date(currentVersion.lifecycle.publishedAt!), "dd 'de' MMMM 'de' yyyy")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleViewVersion(currentVersion.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
                <p className="text-sm">
                  {currentVersion.documentation.changelog.summary}
                </p>
                <div className="flex gap-2 pt-2">
                  {currentVersion.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Version Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Linha do Tempo de Versões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-woopi-ai-border" />
            
            {/* Version entries */}
            <div className="space-y-6">
              {sortedVersions.map((version, index) => (
                <div key={version.id} className="relative pl-16">
                  {/* Timeline dot */}
                  <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white ${
                    version.status === 'published' ? 'bg-green-500' :
                    version.status === 'draft' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`} />
                  
                  {/* Version card */}
                  <Card className={`${version.id === workflow.currentVersionId ? 'border-woopi-ai-blue' : ''}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              v{version.versionNumber}
                            </h3>
                            {getStatusBadge(version.status)}
                            {version.id === workflow.currentVersionId && (
                              <Badge className="woopi-ai-badge-primary">
                                Atual
                              </Badge>
                            )}
                          </div>
                          {version.versionName && (
                            <p className="text-sm text-woopi-ai-gray mb-2">
                              {version.versionName}
                            </p>
                          )}
                          <p className="text-sm mb-3">
                            {version.documentation.changelog.summary}
                          </p>
                          
                          {/* Metadata */}
                          <div className="grid grid-cols-2 gap-2 text-xs text-woopi-ai-gray mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Criada em {formatDate(new Date(version.lifecycle.createdAt), 'dd/MM/yyyy HH:mm')}
                            </div>
                            <div>
                              Por {version.lifecycle.createdBy.name}
                            </div>
                            {version.lifecycle.publishedAt && (
                              <>
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Publicada em {formatDate(new Date(version.lifecycle.publishedAt), 'dd/MM/yyyy HH:mm')}
                                </div>
                                <div>
                                  Por {version.lifecycle.publishedBy?.name}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Breaking changes warning */}
                          {version.documentation.changelog.breakingChanges && (
                            <div className="flex items-start gap-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs mb-3">
                              <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium text-orange-800">Contém mudanças incompatíveis</p>
                                {version.documentation.changelog.breakingChangesDescription && (
                                  <p className="text-orange-700 mt-1">
                                    {version.documentation.changelog.breakingChangesDescription}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {version.tags.slice(0, 5).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {version.tags.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{version.tags.length - 5}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewVersion(version.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          {version.status === 'draft' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditVersion(version.id)}
                            >
                              <Edit2 className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Audit info */}
                      <div className="text-xs text-woopi-ai-gray pt-2 border-t border-woopi-ai-border">
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {version.audit.trail.length} evento(s) de auditoria
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {sortedVersions.length === 0 && (
            <div className="text-center py-8 text-woopi-ai-gray">
              <GitBranch className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma versão encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}