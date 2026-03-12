import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { 
  ArrowLeft, 
  GitCompare,
  Plus,
  Minus,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { getWorkflowById } from '../data/mockWorkflowVersions';
import { WorkflowVersion } from '../types/workflow-version';

export function WorkflowVersionComparePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  
  const workflow = id ? getWorkflowById(id) : undefined;
  
  const [versionAId, setVersionAId] = useState<string>(
    searchParams.get('versionA') || workflow?.versions[workflow.versions.length - 1]?.id || ''
  );
  const [versionBId, setVersionBId] = useState<string>(
    searchParams.get('versionB') || workflow?.currentVersionId || ''
  );

  if (!workflow) {
    return (
      <div className="p-6">
        <p>Workflow não encontrado</p>
      </div>
    );
  }

  const versionA = workflow.versions.find(v => v.id === versionAId);
  const versionB = workflow.versions.find(v => v.id === versionBId);

  const compareVersions = (vA: WorkflowVersion | undefined, vB: WorkflowVersion | undefined) => {
    if (!vA || !vB) return null;

    const nodesA = new Map(vA.definition.nodes.map(n => [n.id, n]));
    const nodesB = new Map(vB.definition.nodes.map(n => [n.id, n]));

    const added = vB.definition.nodes.filter(n => !nodesA.has(n.id));
    const removed = vA.definition.nodes.filter(n => !nodesB.has(n.id));
    const modified = vB.definition.nodes.filter(n => {
      const nodeA = nodesA.get(n.id);
      if (!nodeA) return false;
      return JSON.stringify(nodeA.config) !== JSON.stringify(n.config) || nodeA.name !== n.name;
    });

    const connectionsA = new Set(vA.definition.connections.map(c => `${c.sourceNodeId}-${c.targetNodeId}`));
    const connectionsB = new Set(vB.definition.connections.map(c => `${c.sourceNodeId}-${c.targetNodeId}`));

    const connectionsAdded = vB.definition.connections.filter(c => !connectionsA.has(`${c.sourceNodeId}-${c.targetNodeId}`));
    const connectionsRemoved = vA.definition.connections.filter(c => !connectionsB.has(`${c.sourceNodeId}-${c.targetNodeId}`));

    return {
      nodes: { added, removed, modified },
      connections: { added: connectionsAdded, removed: connectionsRemoved }
    };
  };

  const differences = compareVersions(versionA, versionB);

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
            Comparar Versões
          </h1>
          <p className="woopi-ai-text-secondary">
            {workflow.name}
          </p>
        </div>
      </div>

      {/* Version Selectors */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="space-y-2">
              <label className="text-sm font-medium">Versão A (Base)</label>
              <Select value={versionAId} onValueChange={setVersionAId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma versão" />
                </SelectTrigger>
                <SelectContent>
                  {workflow.versions.map(v => (
                    <SelectItem key={v.id} value={v.id}>
                      v{v.versionNumber} - {v.status === 'published' ? 'Publicada' : v.status === 'draft' ? 'Rascunho' : 'Depreciada'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <GitCompare className="w-6 h-6 text-woopi-ai-gray" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Versão B (Comparar com)</label>
              <Select value={versionBId} onValueChange={setVersionBId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma versão" />
                </SelectTrigger>
                <SelectContent>
                  {workflow.versions.map(v => (
                    <SelectItem key={v.id} value={v.id}>
                      v{v.versionNumber} - {v.status === 'published' ? 'Publicada' : v.status === 'draft' ? 'Rascunho' : 'Depreciada'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {versionA && versionB && differences && (
        <>
          {/* Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Resumo das Diferenças</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-2xl font-bold text-green-600">
                    {differences.nodes.added.length}
                  </p>
                  <p className="text-xs text-green-700">Nós Adicionados</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-2xl font-bold text-red-600">
                    {differences.nodes.removed.length}
                  </p>
                  <p className="text-xs text-red-700">Nós Removidos</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">
                    {differences.nodes.modified.length}
                  </p>
                  <p className="text-xs text-blue-700">Nós Modificados</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-2xl font-bold text-purple-600">
                    {differences.connections.added.length + differences.connections.removed.length}
                  </p>
                  <p className="text-xs text-purple-700">Conexões Alteradas</p>
                </div>
              </div>

              {(versionB.documentation.changelog.breakingChanges) && (
                <div className="mt-4 flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-800">
                      A versão B contém mudanças incompatíveis
                    </p>
                    {versionB.documentation.changelog.breakingChangesDescription && (
                      <p className="text-sm text-orange-700 mt-1">
                        {versionB.documentation.changelog.breakingChangesDescription}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Version A */}
            <Card>
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge variant="outline">v{versionA.versionNumber}</Badge>
                  Versão A (Base)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Nós ({versionA.definition.nodes.length})</p>
                  {versionA.definition.nodes.map((node, index) => {
                    const isRemoved = differences.nodes.removed.some(n => n.id === node.id);
                    const isModified = differences.nodes.modified.some(n => n.id === node.id);
                    
                    return (
                      <div 
                        key={node.id} 
                        className={`p-2 mb-2 rounded border ${
                          isRemoved ? 'bg-red-50 border-red-200' :
                          isModified ? 'bg-blue-50 border-blue-200' :
                          'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isRemoved && <Minus className="w-4 h-4 text-red-600" />}
                          {isModified && <AlertCircle className="w-4 h-4 text-blue-600" />}
                          <span className="text-sm font-medium">{index + 1}. {node.name}</span>
                          <Badge variant="outline" className="text-xs">{node.type}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Version B */}
            <Card>
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge variant="outline">v{versionB.versionNumber}</Badge>
                  Versão B (Comparação)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Nós ({versionB.definition.nodes.length})</p>
                  {versionB.definition.nodes.map((node, index) => {
                    const isAdded = differences.nodes.added.some(n => n.id === node.id);
                    const isModified = differences.nodes.modified.some(n => n.id === node.id);
                    
                    return (
                      <div 
                        key={node.id} 
                        className={`p-2 mb-2 rounded border ${
                          isAdded ? 'bg-green-50 border-green-200' :
                          isModified ? 'bg-blue-50 border-blue-200' :
                          'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isAdded && <Plus className="w-4 h-4 text-green-600" />}
                          {isModified && <AlertCircle className="w-4 h-4 text-blue-600" />}
                          <span className="text-sm font-medium">{index + 1}. {node.name}</span>
                          <Badge variant="outline" className="text-xs">{node.type}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Changes */}
          {(differences.nodes.added.length > 0 || 
            differences.nodes.removed.length > 0 || 
            differences.nodes.modified.length > 0) && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Mudanças Detalhadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {differences.nodes.added.length > 0 && (
                  <div>
                    <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Nós Adicionados ({differences.nodes.added.length})
                    </h4>
                    {differences.nodes.added.map(node => (
                      <div key={node.id} className="ml-6 p-2 bg-green-50 rounded mb-2">
                        <p className="text-sm font-medium">{node.name}</p>
                        <p className="text-xs text-gray-600">Tipo: {node.type}</p>
                      </div>
                    ))}
                  </div>
                )}

                {differences.nodes.removed.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                      <Minus className="w-4 h-4" />
                      Nós Removidos ({differences.nodes.removed.length})
                    </h4>
                    {differences.nodes.removed.map(node => (
                      <div key={node.id} className="ml-6 p-2 bg-red-50 rounded mb-2">
                        <p className="text-sm font-medium">{node.name}</p>
                        <p className="text-xs text-gray-600">Tipo: {node.type}</p>
                      </div>
                    ))}
                  </div>
                )}

                {differences.nodes.modified.length > 0 && (
                  <div>
                    <h4 className="font-medium text-blue-600 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Nós Modificados ({differences.nodes.modified.length})
                    </h4>
                    {differences.nodes.modified.map(node => {
                      const oldNode = versionA.definition.nodes.find(n => n.id === node.id);
                      return (
                        <div key={node.id} className="ml-6 p-2 bg-blue-50 rounded mb-2">
                          <p className="text-sm font-medium">{node.name}</p>
                          <p className="text-xs text-gray-600">Tipo: {node.type}</p>
                          <div className="text-xs mt-1">
                            <span className="text-gray-500">Configuração alterada</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Changelog Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Changelog - Versão A</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  {versionA.documentation.changelog.summary}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Changelog - Versão B</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  {versionB.documentation.changelog.summary}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {(!versionA || !versionB) && (
        <Card>
          <CardContent className="py-12 text-center">
            <GitCompare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Selecione duas versões para comparar</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}