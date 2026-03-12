import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, 
  Clock, 
  User,
  FileText,
  Hash,
  Tag,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Upload,
  Archive,
  GitBranch,
  GitCompare
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { getWorkflowById, getVersionById } from '../data/mockWorkflowVersions';

// Using basic date formatting for MVP
const formatDate = (date: Date, formatStr: string) => {
  const d = new Date(date);
  if (formatStr === "dd/MM/yyyy 'às' HH:mm") {
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} às ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
  return d.toLocaleDateString('pt-BR');
};

// Simple markdown renderer for MVP
const SimpleMarkdown = ({ children }: { children: string }) => {
  const renderMarkdown = (text: string) => {
    // Basic markdown rendering
    return text
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-3 mb-2">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-2 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith('- ')) return <li key={i} className="ml-4">{line.slice(2)}</li>;
        if (line.trim() === '') return <br key={i} />;
        return <p key={i} className="mb-2">{line}</p>;
      });
  };
  
  return <div>{renderMarkdown(children)}</div>;
};

export function WorkflowVersionDetailPage() {
  const navigate = useNavigate();
  const { id, versionId } = useParams<{ id: string; versionId: string }>();
  
  const workflow = id ? getWorkflowById(id) : undefined;
  const version = id && versionId ? getVersionById(id, versionId) : undefined;

  if (!workflow || !version) {
    return (
      <div className="p-6">
        <p>Versão não encontrada</p>
      </div>
    );
  }

  const isCurrentVersion = workflow.currentVersionId === version.id;
  const canPublish = version.status === 'draft';
  const canEdit = version.status === 'draft';

  const handlePublish = () => {
    if (!version.documentation.changelog.summary) {
      toast.error('Changelog é obrigatório para publicar');
      return;
    }
    
    toast.success('Versão publicada com sucesso!');
    navigate(`/documentos/workflows/${id}/versoes`);
  };

  const handleEdit = () => {
    navigate(`/documentos/workflows/${id}/versoes/${versionId}/editar`);
  };

  const getStatusBadge = () => {
    const configs = {
      published: { color: 'bg-green-500', label: 'Publicada', icon: CheckCircle2 },
      draft: { color: 'bg-yellow-500', label: 'Rascunho', icon: Edit2 },
      deprecated: { color: 'bg-gray-500', label: 'Depreciada', icon: Archive },
      archived: { color: 'bg-gray-400', label: 'Arquivada', icon: Archive }
    };
    
    const config = configs[version.status];
    const Icon = config.icon;
    
    return (
      <Badge variant="secondary" className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="p-6">
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
            {workflow.name} - v{version.versionNumber}
          </h1>
          <p className="woopi-ai-text-secondary">
            {version.versionName || 'Detalhes da versão'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/documentos/workflows/${id}/versoes/comparar?versionB=${versionId}`)}
          >
            <GitCompare className="w-4 h-4 mr-2" />
            Comparar
          </Button>
          {canEdit && (
            <Button 
              variant="outline"
              onClick={handleEdit}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
          {canPublish && (
            <Button 
              onClick={handlePublish}
              className="woopi-ai-button-primary"
            >
              <Upload className="w-4 h-4 mr-2" />
              Publicar
            </Button>
          )}
        </div>
      </div>

      {/* Status and Basic Info */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-semibold">
                  v{version.versionNumber}
                </h2>
                {getStatusBadge()}
                {isCurrentVersion && (
                  <Badge className="woopi-ai-badge-primary">
                    Versão Atual
                  </Badge>
                )}
              </div>
              {version.versionName && (
                <p className="text-woopi-ai-gray mb-2">{version.versionName}</p>
              )}
            </div>
          </div>

          {/* Breaking Changes Alert */}
          {version.documentation.changelog.breakingChanges && (
            <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-md mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-orange-800 mb-1">
                  ⚠️ Esta versão contém mudanças incompatíveis
                </p>
                {version.documentation.changelog.breakingChangesDescription && (
                  <p className="text-sm text-orange-700">
                    {version.documentation.changelog.breakingChangesDescription}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-woopi-ai-gray mb-1">Criado por</p>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-woopi-ai-blue" />
                <span className="font-medium">{version.lifecycle.createdBy.name}</span>
              </div>
            </div>
            <div>
              <p className="text-woopi-ai-gray mb-1">Data de criação</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-woopi-ai-blue" />
                <span className="font-medium">
                  {formatDate(new Date(version.lifecycle.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                </span>
              </div>
            </div>
            {version.lifecycle.publishedAt && (
              <>
                <div>
                  <p className="text-woopi-ai-gray mb-1">Publicado por</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-woopi-ai-blue" />
                    <span className="font-medium">{version.lifecycle.publishedBy?.name}</span>
                  </div>
                </div>
                <div>
                  <p className="text-woopi-ai-gray mb-1">Data de publicação</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-woopi-ai-blue" />
                    <span className="font-medium">
                      {formatDate(new Date(version.lifecycle.publishedAt), "dd/MM/yyyy 'às' HH:mm")}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="changelog">Changelog</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="audit">Auditoria</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumo da Versão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {version.documentation.changelog.summary}
                </p>
              </CardContent>
            </Card>

            {/* Technical Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-woopi-ai-gray text-xs mb-1">
                    <Hash className="w-3 h-3" />
                    Hash de Integridade
                  </div>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {version.hash}
                  </code>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-woopi-ai-gray text-xs mb-1">
                    <GitBranch className="w-3 h-3" />
                    Componentes do Workflow
                  </div>
                  <p className="text-sm">
                    {version.definition.nodes.length} nós, {version.definition.connections.length} conexões
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Business Justification */}
            {version.documentation.businessJustification && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Justificativa de Negócio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-woopi-ai-gray">
                    {version.documentation.businessJustification}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Metadados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-woopi-ai-gray text-xs mb-2">
                    <Building2 className="w-3 h-3" />
                    Departamento
                  </div>
                  <Badge variant="outline">{version.department}</Badge>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-woopi-ai-gray text-xs mb-2">
                    <Tag className="w-3 h-3" />
                    Categoria
                  </div>
                  <Badge variant="outline">{version.category}</Badge>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-woopi-ai-gray text-xs mb-2">
                    <Tag className="w-3 h-3" />
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {version.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Analysis */}
          {version.audit.impactAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Análise de Impacto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-woopi-ai-blue">
                      {version.audit.impactAnalysis.affectedDocuments}
                    </p>
                    <p className="text-xs text-woopi-ai-gray">Documentos Afetados</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {version.audit.impactAnalysis.affectedUsers}
                    </p>
                    <p className="text-xs text-woopi-ai-gray">Usuários Impactados</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {version.audit.impactAnalysis.affectedTeams.length}
                    </p>
                    <p className="text-xs text-woopi-ai-gray">Times Afetados</p>
                  </div>
                </div>
                {version.audit.impactAnalysis.affectedTeams.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-woopi-ai-gray mb-2">Times:</p>
                    <div className="flex flex-wrap gap-1">
                      {version.audit.impactAnalysis.affectedTeams.map(team => (
                        <Badge key={team} variant="outline" className="text-xs">
                          {team}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Changelog Tab */}
        <TabsContent value="changelog">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Mudanças</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <SimpleMarkdown>{version.documentation.changelog.detailedChanges}</SimpleMarkdown>
              
              {version.documentation.technicalNotes && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold mb-2 text-woopi-ai-blue">Notas Técnicas</h4>
                  <p className="text-sm text-woopi-ai-gray">
                    {version.documentation.technicalNotes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow">
          <Card>
            <CardHeader>
              <CardTitle>Estrutura do Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Nodes */}
                <div>
                  <h4 className="font-semibold mb-3">Nós ({version.definition.nodes.length})</h4>
                  <div className="space-y-2">
                    {version.definition.nodes.map((node, index) => (
                      <Card key={node.id} className="bg-gray-50">
                        <CardContent className="pt-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-woopi-ai-blue text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium">{node.name}</p>
                                <Badge variant="outline" className="text-xs">
                                  {node.type}
                                </Badge>
                              </div>
                              <div className="text-xs text-woopi-ai-gray">
                                <code className="bg-white px-2 py-1 rounded">
                                  {JSON.stringify(node.config, null, 2)}
                                </code>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Connections */}
                <div>
                  <h4 className="font-semibold mb-3">Conexões ({version.definition.connections.length})</h4>
                  <div className="space-y-2">
                    {version.definition.connections.map((conn) => {
                      const sourceNode = version.definition.nodes.find(n => n.id === conn.sourceNodeId);
                      const targetNode = version.definition.nodes.find(n => n.id === conn.targetNodeId);
                      return (
                        <div key={conn.id} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded">
                          <span className="font-medium">{sourceNode?.name}</span>
                          <span className="text-woopi-ai-gray">→</span>
                          <span className="font-medium">{targetNode?.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Trilha de Auditoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {version.audit.trail.map((event) => (
                  <div key={event.id} className="flex gap-3 p-3 border border-woopi-ai-border rounded-lg">
                    <div className="w-2 h-2 bg-woopi-ai-blue rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{event.action}</p>
                        <p className="text-xs text-woopi-ai-gray">
                          {formatDate(new Date(event.timestamp), "dd/MM/yyyy 'às' HH:mm")}
                        </p>
                      </div>
                      <p className="text-sm text-woopi-ai-gray mb-1">{event.details}</p>
                      <p className="text-xs text-woopi-ai-gray">
                        Por {event.userName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {version.audit.relatedTickets && version.audit.relatedTickets.length > 0 && (
                <div className="mt-4 pt-4 border-t border-woopi-ai-border">
                  <p className="text-sm font-medium mb-2">Tickets Relacionados</p>
                  <div className="flex flex-wrap gap-2">
                    {version.audit.relatedTickets.map(ticket => (
                      <Badge key={ticket} variant="outline">
                        {ticket}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}