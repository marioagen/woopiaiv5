import { useNavigate } from 'react-router';
import { 
  ArrowLeft,
  GitBranch,
  FileText,
  CheckCircle2,
  Edit2,
  GitCompare,
  AlertCircle,
  Upload,
  Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function WorkflowVersioningHelpPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="woopi-ai-text-primary">
            Guia de Versionamento de Workflows
          </h1>
          <p className="woopi-ai-text-secondary">
            Aprenda a gerenciar versões de workflows de forma eficiente
          </p>
        </div>
      </div>

      {/* Introduction */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            O que é Versionamento de Workflows?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-700">
            O sistema de versionamento permite que você evolua seus workflows ao longo do tempo, 
            mantendo um histórico completo de todas as mudanças realizadas. Isso garante rastreabilidade, 
            conformidade regulatória e permite reverter para versões anteriores se necessário.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-800 mb-2">Benefícios:</p>
            <ul className="text-sm text-blue-700 space-y-1 ml-4">
              <li>✓ Histórico completo de mudanças</li>
              <li>✓ Auditoria de todas as ações</li>
              <li>✓ Documentação obrigatória de mudanças</li>
              <li>✓ Possibilidade de reverter para versões anteriores</li>
              <li>✓ Comparação visual entre versões</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Version States */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Estados de uma Versão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-yellow-500 text-white">
                  <Edit2 className="w-3 h-3 mr-1" />
                  Rascunho
                </Badge>
              </div>
              <p className="text-sm text-gray-700">
                Versão em desenvolvimento. Pode ser editada livremente e não afeta o ambiente de produção.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-green-500 text-white">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Publicada
                </Badge>
              </div>
              <p className="text-sm text-gray-700">
                Versão ativa em produção. É a versão que está sendo utilizada para processar documentos.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-gray-500 text-white">
                  Depreciada
                </Badge>
              </div>
              <p className="text-sm text-gray-700">
                Versão que foi substituída por uma mais nova, mas mantida no histórico para referência.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-gray-400 text-white">
                  Arquivada
                </Badge>
              </div>
              <p className="text-sm text-gray-700">
                Versão removida do uso ativo, mas preservada para fins de compliance e auditoria.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Semantic Versioning */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Versionamento Semântico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-700">
            O sistema utiliza versionamento semântico no formato <code className="bg-gray-100 px-2 py-1 rounded">X.Y.Z</code>:
          </p>

          <div className="space-y-3">
            <div className="p-4 border-l-4 border-red-500 bg-red-50">
              <p className="font-medium text-red-800 mb-1">Major (X.0.0) - Mudanças Incompatíveis</p>
              <p className="text-sm text-red-700">
                Use quando fizer mudanças que quebram compatibilidade com a versão anterior. 
                Exemplo: remover um nó obrigatório.
              </p>
            </div>

            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <p className="font-medium text-blue-800 mb-1">Minor (X.Y.0) - Novas Funcionalidades</p>
              <p className="text-sm text-blue-700">
                Use quando adicionar novas funcionalidades de forma compatível. 
                Exemplo: adicionar novo nó de análise.
              </p>
            </div>

            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <p className="font-medium text-green-800 mb-1">Patch (X.Y.Z) - Correções</p>
              <p className="text-sm text-green-700">
                Use para correções de bugs e pequenas melhorias. 
                Exemplo: ajustar configuração de um nó existente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Create a Version */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Como Criar uma Nova Versão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-woopi-ai-blue text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">Acessar Histórico de Versões</p>
                <p className="text-sm text-gray-700">
                  Na página de Gestão de esteiras, clique no menu (⋮) do workflow e selecione "Ver Versões".
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-woopi-ai-blue text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">Clicar em "Nova Versão"</p>
                <p className="text-sm text-gray-700">
                  No canto superior direito da página de histórico, clique no botão "Nova Versão".
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-woopi-ai-blue text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">Selecionar Versão Base</p>
                <p className="text-sm text-gray-700">
                  Escolha qual versão será usada como base e o tipo de mudança (Major, Minor ou Patch).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-woopi-ai-blue text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">Preencher Changelog (Obrigatório)</p>
                <p className="text-sm text-gray-700">
                  Documente as mudanças realizadas. Seja claro e específico sobre o que mudou e por quê.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-woopi-ai-blue text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">Adicionar Metadados</p>
                <p className="text-sm text-gray-700">
                  Categorize a versão com tags, categoria e departamento para facilitar a organização.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-woopi-ai-blue text-white rounded-full flex items-center justify-center font-bold">
                6
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">Editar o Workflow</p>
                <p className="text-sm text-gray-700">
                  Após criar a versão, você será redirecionado para o editor visual onde poderá fazer as mudanças necessárias.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-woopi-ai-blue text-white rounded-full flex items-center justify-center font-bold">
                7
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">Publicar a Versão</p>
                <p className="text-sm text-gray-700">
                  Quando estiver pronto, vá para os detalhes da versão e clique em "Publicar". 
                  A versão atual será automaticamente depreciada.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Funcionalidades Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <GitCompare className="w-5 h-5 text-woopi-ai-blue" />
                <p className="font-medium">Comparar Versões</p>
              </div>
              <p className="text-sm text-gray-700">
                Compare duas versões lado a lado para ver exatamente o que mudou entre elas.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-woopi-ai-blue" />
                <p className="font-medium">Changelog Detalhado</p>
              </div>
              <p className="text-sm text-gray-700">
                Cada versão possui documentação completa em Markdown sobre as mudanças realizadas.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-woopi-ai-blue" />
                <p className="font-medium">Trilha de Auditoria</p>
              </div>
              <p className="text-sm text-gray-700">
                Todas as ações são registradas com data, hora e usuário responsável.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-woopi-ai-blue" />
                <p className="font-medium">Análise de Impacto</p>
              </div>
              <p className="text-sm text-gray-700">
                Veja quantos documentos, usuários e times serão afetados pela mudança.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Melhores Práticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Documente todas as mudanças</p>
                <p className="text-sm text-gray-700">
                  Seja específico no changelog. Ajuda outros usuários a entenderem o que mudou e por quê.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Use versionamento semântico corretamente</p>
                <p className="text-sm text-gray-700">
                  Escolha Major para breaking changes, Minor para features e Patch para correções.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Teste antes de publicar</p>
                <p className="text-sm text-gray-700">
                  Versões em draft podem ser editadas livremente. Use isso para testar antes de publicar.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Marque breaking changes</p>
                <p className="text-sm text-gray-700">
                  Se a mudança quebrar compatibilidade, marque como breaking change e explique o impacto.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Use tags para organização</p>
                <p className="text-sm text-gray-700">
                  Tags ajudam a categorizar e encontrar versões relacionadas rapidamente.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}