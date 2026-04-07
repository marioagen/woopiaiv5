import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { LayoutWrapper } from './components/LayoutWrapper';
import { Login } from './components/Login';
import { HomePage } from './components/HomePage';
import { DashboardPage } from './components/DashboardPage';
import { Dashboard } from './components/Dashboard';
import { DocumentsPage } from './components/DocumentsPage';
import { DocumentUploadPage } from './components/DocumentUploadPage';
import { DocumentAnalysisPage } from './components/DocumentAnalysisPage';
import { DocumentExtractionPage } from './components/DocumentExtractionPage';
import { FerramentasManagementPage } from './components/FerramentasManagementPage';
import { FerramentasCreatePage } from './components/FerramentasCreatePage';
import { DocumentWorkflowPage } from './components/DocumentWorkflowPage';
import { WorkflowBulkAtribuirPage } from './components/workflow-board/WorkflowBulkAtribuirPage';
import { WorkflowBulkReprovarPage } from './components/workflow-board/WorkflowBulkReprovarPage';
import { WorkflowManagementPage } from './components/WorkflowManagementPage';
import { WorkflowEditorPage } from './components/WorkflowEditorPage';
import { WorkflowCreatePage } from './components/WorkflowCreatePage';
import { WorkflowGestaoPage } from './components/WorkflowGestaoPage';
import { WorkflowFormPage } from './components/WorkflowFormPage';
import { WorkflowVersionHistoryPage } from './components/WorkflowVersionHistoryPage';
import { WorkflowVersionDetailPage } from './components/WorkflowVersionDetailPage';
import { WorkflowVersionCreatePage } from './components/WorkflowVersionCreatePage';
import { WorkflowVersionComparePage } from './components/WorkflowVersionComparePage';
import { WorkflowVersioningHelpPage } from './components/WorkflowVersioningHelpPage';
import { QuestionnairesUnifiedPage } from './components/QuestionnairesUnifiedPage';
import { QuestionnaireEditPage } from './components/QuestionnaireEditPage';
import { TarefasPage } from './components/TarefasPage';
import { UserTeamRoleManagement } from './components/UserTeamRoleManagement';
import { UserFormPage } from './components/user-management/UserFormPage';
import { TeamFormPage } from './components/user-management/TeamFormPage';
import { RoleFormPage } from './components/user-management/RoleFormPage';
import { UserProfilePage } from './components/UserProfilePage';
import { StyleGuidePage } from './components/StyleGuidePage';
import { AuditPage } from './components/AuditPage';
import { ComparadorPage } from './components/ComparadorPage';
import { ComparadorAnalysisPage } from './components/ComparadorAnalysisPage';
import { DocumentAutomationPage } from './components/DocumentAutomationPage';
import { NodeConfigurationPage } from './components/NodeConfigurationPage';
import { PromptsListPage } from './components/PromptsListPage';
import { PromptEditPage } from './components/PromptEditPage';
import { PromptsImportPage } from './components/PromptsImportPage';
import { APITemplatesPage } from './components/APITemplatesPage';
import { APITemplateFormPage } from './components/APITemplateFormPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const handleLogin = () => {
    // Simular login bem-sucedido - sem backend por enquanto
    console.log('Login realizado com sucesso');
  };

  return (
    <Router>
      <Routes>
        {/* Rota raiz "/" vai para o login */}
        <Route 
          path="/" 
          element={
            <div className="contents">
              <Login onLogin={handleLogin} />
              <Toaster position="top-right" />
            </div>
          } 
        />

        {/* Todas as outras rotas vão diretamente para as páginas com layout */}
        <Route 
          path="/dashboard" 
          element={
            <LayoutWrapper>
              <DashboardPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/home" 
          element={
            <LayoutWrapper>
              <HomePage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos" 
          element={
            <LayoutWrapper>
              <DocumentsPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/carregar" 
          element={
            <LayoutWrapper>
              <DocumentUploadPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/:documentId/analisar" 
          element={
            <LayoutWrapper>
              <DocumentAnalysisPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/:id/analise/:workflow" 
          element={
            <LayoutWrapper>
              <DocumentAnalysisPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/:documentId/extrair" 
          element={
            <LayoutWrapper>
              <DocumentExtractionPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/ferramentas" 
          element={
            <LayoutWrapper>
              <FerramentasManagementPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/ferramentas/novo" 
          element={
            <LayoutWrapper>
              <FerramentasCreatePage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/workflow" 
          element={
            <LayoutWrapper>
              <DocumentWorkflowPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/workflow" 
          element={
            <LayoutWrapper>
              <DocumentWorkflowPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/workflow/atribuir" 
          element={
            <LayoutWrapper>
              <WorkflowBulkAtribuirPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/workflow/reprovar" 
          element={
            <LayoutWrapper>
              <WorkflowBulkReprovarPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/workflow/gerenciar" 
          element={
            <LayoutWrapper>
              <WorkflowManagementPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/workflow/gerenciar" 
          element={
            <LayoutWrapper>
              <WorkflowManagementPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/workflow/criar" 
          element={
            <LayoutWrapper>
              <WorkflowCreatePage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/workflow/criar" 
          element={
            <LayoutWrapper>
              <WorkflowCreatePage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/workflow/editor" 
          element={
            <LayoutWrapper>
              <WorkflowEditorPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/workflow/editor" 
          element={
            <LayoutWrapper>
              <WorkflowEditorPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/workflow/gestao" 
          element={
            <LayoutWrapper>
              <WorkflowGestaoPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/workflow/gestao/novo" 
          element={
            <LayoutWrapper>
              <WorkflowFormPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/workflow/gestao/editar/:id" 
          element={
            <LayoutWrapper>
              <WorkflowFormPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/workflow/gestao" 
          element={
            <LayoutWrapper>
              <WorkflowGestaoPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/workflow/gestao/novo" 
          element={
            <LayoutWrapper>
              <WorkflowFormPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/workflow/gestao/editar/:id" 
          element={
            <LayoutWrapper>
              <WorkflowFormPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/workflows/:id/versoes" 
          element={
            <LayoutWrapper>
              <WorkflowVersionHistoryPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/workflows/:id/versoes/nova" 
          element={
            <LayoutWrapper>
              <WorkflowVersionCreatePage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/workflows/:id/versoes/:versionId" 
          element={
            <LayoutWrapper>
              <WorkflowVersionDetailPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/workflows/:id/versoes/:versionId/editar" 
          element={
            <LayoutWrapper>
              <WorkflowEditorPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/workflows/:id/versoes/comparar" 
          element={
            <LayoutWrapper>
              <WorkflowVersionComparePage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/workflows/versionamento/ajuda" 
          element={
            <LayoutWrapper>
              <WorkflowVersioningHelpPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/workflow/automacao/:stageId" 
          element={
            <LayoutWrapper>
              <DocumentAutomationPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/workflow/automacao/:stageId/node/:nodeId" 
          element={
            <LayoutWrapper>
              <NodeConfigurationPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/gestaodeusuarios" 
          element={
            <LayoutWrapper>
              <UserTeamRoleManagement />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/gestaodeusuarios/usuarios/novo" 
          element={
            <LayoutWrapper>
              <UserFormPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/gestaodeusuarios/usuarios/editar/:id" 
          element={
            <LayoutWrapper>
              <UserFormPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/gestaodeusuarios/times/novo" 
          element={
            <LayoutWrapper>
              <TeamFormPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/gestaodeusuarios/times/editar/:id" 
          element={
            <LayoutWrapper>
              <TeamFormPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/gestaodeusuarios/perfis/novo" 
          element={
            <LayoutWrapper>
              <RoleFormPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/gestaodeusuarios/perfis/editar/:id" 
          element={
            <LayoutWrapper>
              <RoleFormPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/auditoria" 
          element={
            <LayoutWrapper>
              <AuditPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/comparador" 
          element={
            <LayoutWrapper>
              <ComparadorPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/documentos/comparador/analise" 
          element={
            <LayoutWrapper>
              <ComparadorAnalysisPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/styleguide" 
          element={
            <LayoutWrapper>
              <StyleGuidePage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/questionarios" 
          element={
            <LayoutWrapper>
              <QuestionnairesUnifiedPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/questionarios/new" 
          element={
            <LayoutWrapper>
              <QuestionnaireEditPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/questionarios/:id" 
          element={
            <LayoutWrapper>
              <QuestionnaireEditPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/tarefas" 
          element={
            <LayoutWrapper>
              <TarefasPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/perfil" 
          element={
            <LayoutWrapper>
              <UserProfilePage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/prompts" 
          element={
            <LayoutWrapper>
              <PromptsListPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/prompts/importar" 
          element={
            <LayoutWrapper>
              <PromptsImportPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/prompts/novo" 
          element={
            <LayoutWrapper>
              <PromptEditPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/prompts/edit/:id" 
          element={
            <LayoutWrapper>
              <PromptEditPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/templates/api" 
          element={
            <LayoutWrapper>
              <APITemplatesPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/templates/api/novo" 
          element={
            <LayoutWrapper>
              <APITemplateFormPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />
        <Route 
          path="/templates/api/editar/:id" 
          element={
            <LayoutWrapper>
              <APITemplateFormPage />
              <Toaster position="top-right" />
            </LayoutWrapper>
          } 
        />

        {/* Rota catch-all redireciona para login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}