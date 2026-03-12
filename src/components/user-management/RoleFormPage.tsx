import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save, ShieldUser, Lock, Home, BarChart3, Users, FileText, GitBranch, Settings, HelpCircle, Wrench, MessageSquare, Eye, Edit3, FileSearch } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Checkbox } from '../ui/checkbox';
import { useUserManagement } from './useUserManagement';
import { toast } from 'sonner@2.0.3';

// Types for granular permissions
interface SimplePermission {
  view: boolean;
}

interface TabPermissions {
  view: boolean;
  edit: boolean;
  delete: boolean;
}

interface TabPermissionsWithCreate {
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface GranularPermissions {
  home: SimplePermission;
  dashboard: SimplePermission;
  gestaoUsuarios: {
    view: boolean;
    edit: boolean;
    tabs: {
      usuarios: TabPermissions;
      times: TabPermissions;
      perfis: TabPermissions;
    };
  };
  documentos: {
    view: boolean;
    edit: boolean;
    actions: {
      delete: boolean;
      upload: boolean;
    };
  };
  analiseDocumentos: {
    view: boolean;
    edit: boolean;
    actions: {
      pergunteAoDoc: boolean;
      reprovar: boolean;
      editarOutputs: boolean;
      historicoAlteracoes: boolean;
    };
  };
  gestaoEsteiras: {
    view: boolean;
    edit: boolean;
    actions: {
      edit: boolean;
      delete: boolean;
    };
  };
  questionarios: {
    view: boolean;
    edit: boolean;
    tabs: {
      questionarios: TabPermissionsWithCreate;
      perguntas: TabPermissionsWithCreate;
      tipos: TabPermissionsWithCreate;
    };
  };
  ferramentas: {
    view: boolean;
    edit: boolean;
    actions: {
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
  prompts: {
    view: boolean;
    edit: boolean;
    actions: {
      create: boolean;
      editClone: boolean;
      delete: boolean;
      import: boolean;
    };
  };
}

const defaultGranularPermissions: GranularPermissions = {
  home: { view: false },
  dashboard: { view: false },
  gestaoUsuarios: {
    view: false,
    edit: false,
    tabs: {
      usuarios: { view: false, edit: false, delete: false },
      times: { view: false, edit: false, delete: false },
      perfis: { view: false, edit: false, delete: false },
    },
  },
  documentos: {
    view: false,
    edit: false,
    actions: { delete: false, upload: false },
  },
  analiseDocumentos: {
    view: false,
    edit: false,
    actions: { pergunteAoDoc: false, reprovar: false, editarOutputs: false, historicoAlteracoes: false },
  },
  gestaoEsteiras: {
    view: false,
    edit: false,
    actions: { edit: false, delete: false },
  },
  questionarios: {
    view: false,
    edit: false,
    tabs: {
      questionarios: { create: false, edit: false, delete: false },
      perguntas: { create: false, edit: false, delete: false },
      tipos: { create: false, edit: false, delete: false },
    },
  },
  ferramentas: {
    view: false,
    edit: false,
    actions: { create: false, edit: false, delete: false },
  },
  prompts: {
    view: false,
    edit: false,
    actions: { create: false, editClone: false, delete: false, import: false },
  },
};

export function RoleFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const {
    roles,
    createRole,
    updateRole
  } = useUserManagement();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    granularPermissions: { ...defaultGranularPermissions } as GranularPermissions,
    // Keep legacy screenPermissions for save compatibility
    screenPermissions: {
      manageUsers: '',
      manageTeams: '',
      manageRoles: '',
      uploadDocuments: '',
      extractData: '',
      documentTypes: '',
      questions: '',
      questionnaires: '',
      prompts: '',
      ferramentas: '',
      fluxoFerramentas: '',
      workflows: '',
      gestaoEsteiras: ''
    } as Record<string, string>,
    workflowPermissions: {
      documentApproval: {
        step1: '',
        step2: '',
        step3: ''
      },
      clientOnboarding: {
        stepA: '',
        stepB: '',
        stepC: '',
        stepD: ''
      }
    }
  });

  // Load role data if editing
  useEffect(() => {
    if (isEditing && id) {
      const role = roles.find(r => r.id === parseInt(id));
      if (role) {
        if (role.isBuiltIn) {
          toast.info('Perfis padrão não podem ser editados. Crie um clone do perfil.');
          navigate('/gestaodeusuarios?tab=roles');
          return;
        }

        setFormData(prev => ({
          ...prev,
          name: role.name,
          screenPermissions: {
            manageUsers: role.permissions.manageUsers ? 'access' : '',
            manageTeams: role.permissions.manageTeams ? 'access' : '',
            manageRoles: role.permissions.manageRoles ? 'access' : '',
            uploadDocuments: role.permissions.uploadDocuments ? 'access' : '',
            extractData: role.permissions.extractData ? 'access' : '',
            documentTypes: role.permissions.documentTypes ? 'access' : '',
            questions: role.permissions.questions ? 'access' : '',
            questionnaires: role.permissions.questionnaires ? 'access' : '',
            prompts: role.permissions.prompts ? 'access' : '',
            ferramentas: role.permissions.ferramentas ? 'access' : '',
            fluxoFerramentas: role.permissions.fluxoFerramentas ? 'access' : '',
            workflows: role.permissions.workflows ? 'access' : '',
            gestaoEsteiras: role.permissions.gestaoEsteiras ? 'access' : ''
          },
        }));
      }
    }
  }, [id, isEditing, roles, navigate]);

  // Handlers for granular permissions
  const handleSimpleViewToggle = (module: 'home' | 'dashboard') => {
    setFormData(prev => ({
      ...prev,
      granularPermissions: {
        ...prev.granularPermissions,
        [module]: { view: !prev.granularPermissions[module].view }
      }
    }));
  };

  const handleAccordionLevelChange = (
    module: 'gestaoUsuarios' | 'documentos' | 'analiseDocumentos' | 'gestaoEsteiras' | 'questionarios' | 'ferramentas' | 'prompts',
    level: 'view' | 'edit'
  ) => {
    setFormData(prev => {
      const current = prev.granularPermissions[module];
      const currentValue = current[level];
      const newValue = !currentValue;

      // Build new module state
      const newModule = { ...current } as any;

      if (level === 'view') {
        newModule.view = newValue;
        if (newValue) {
          // View ON -> Edit OFF, disable all inner actions
          newModule.edit = false;
          if ('tabs' in newModule) {
            const newTabs: any = {};
            for (const tabKey of Object.keys(newModule.tabs)) {
              const tab = newModule.tabs[tabKey];
              const newTab: any = {};
              for (const k of Object.keys(tab)) {
                newTab[k] = false;
              }
              newTabs[tabKey] = newTab;
            }
            newModule.tabs = newTabs;
          }
          if ('actions' in newModule) {
            const newActions: any = {};
            for (const k of Object.keys(newModule.actions)) {
              newActions[k] = false;
            }
            newModule.actions = newActions;
          }
        }
      } else {
        // edit
        newModule.edit = newValue;
        if (newValue) {
          // Edit ON -> View OFF
          newModule.view = false;
        } else {
          // Edit OFF -> disable all inner actions
          if ('tabs' in newModule) {
            const newTabs: any = {};
            for (const tabKey of Object.keys(newModule.tabs)) {
              const tab = newModule.tabs[tabKey];
              const newTab: any = {};
              for (const k of Object.keys(tab)) {
                newTab[k] = false;
              }
              newTabs[tabKey] = newTab;
            }
            newModule.tabs = newTabs;
          }
          if ('actions' in newModule) {
            const newActions: any = {};
            for (const k of Object.keys(newModule.actions)) {
              newActions[k] = false;
            }
            newModule.actions = newActions;
          }
        }
      }

      return {
        ...prev,
        granularPermissions: {
          ...prev.granularPermissions,
          [module]: newModule
        }
      };
    });
  };

  const handleActionToggle = (
    module: 'documentos' | 'analiseDocumentos' | 'gestaoEsteiras' | 'ferramentas' | 'prompts',
    actionKey: string
  ) => {
    setFormData(prev => {
      const current = prev.granularPermissions[module] as any;
      return {
        ...prev,
        granularPermissions: {
          ...prev.granularPermissions,
          [module]: {
            ...current,
            actions: {
              ...current.actions,
              [actionKey]: !current.actions[actionKey]
            }
          }
        }
      };
    });
  };

  const handleTabActionToggle = (
    module: 'gestaoUsuarios' | 'questionarios',
    tab: string,
    actionKey: string
  ) => {
    setFormData(prev => {
      const current = prev.granularPermissions[module] as any;
      return {
        ...prev,
        granularPermissions: {
          ...prev.granularPermissions,
          [module]: {
            ...current,
            tabs: {
              ...current.tabs,
              [tab]: {
                ...current.tabs[tab],
                [actionKey]: !current.tabs[tab][actionKey]
              }
            }
          }
        }
      };
    });
  };

  // Workflow permission handlers
  const handleWorkflowPermissionChange = (workflow: string, step: string, value: string) => {
    setFormData(prev => {
      const currentValue = prev.workflowPermissions[workflow as keyof typeof prev.workflowPermissions][step as keyof typeof prev.workflowPermissions.documentApproval];
      const newValue = currentValue === value ? '' : value;

      return {
        ...prev,
        workflowPermissions: {
          ...prev.workflowPermissions,
          [workflow]: {
            ...prev.workflowPermissions[workflow as keyof typeof prev.workflowPermissions],
            [step]: newValue
          }
        }
      };
    });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Nome do perfil é obrigatório');
      return;
    }

    const gp = formData.granularPermissions;
    const permissionsObject = {
      uploadDocuments: gp.documentos.view || gp.documentos.edit,
      mergeDocuments: false,
      chatWithDocuments: false,
      extractData: gp.documentos.view || gp.documentos.edit,
      createTasks: false,
      approveTasks: false,
      exportData: false,
      viewHistory: false,
      manageUsers: gp.gestaoUsuarios.view || gp.gestaoUsuarios.edit,
      manageTeams: gp.gestaoUsuarios.view || gp.gestaoUsuarios.edit,
      manageRoles: gp.gestaoUsuarios.view || gp.gestaoUsuarios.edit,
      documentTypes: false,
      questions: gp.questionarios.view || gp.questionarios.edit,
      questionnaires: gp.questionarios.view || gp.questionarios.edit,
      prompts: gp.prompts.view || gp.prompts.edit,
      ferramentas: gp.ferramentas.view || gp.ferramentas.edit,
      fluxoFerramentas: false,
      workflows: true,
      gestaoEsteiras: gp.gestaoEsteiras.view || gp.gestaoEsteiras.edit
    };

    if (isEditing) {
      updateRole(parseInt(id!), {
        name: formData.name,
        permissions: permissionsObject
      });
      toast.success('Perfil atualizado com sucesso');
    } else {
      createRole({
        name: formData.name,
        description: `Perfil ${formData.name}`,
        permissions: permissionsObject,
        usersCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      });
      toast.success('Perfil criado com sucesso');
    }

    navigate('/gestaodeusuarios?tab=roles');
  };

  const handleCancel = () => {
    navigate('/gestaodeusuarios?tab=roles');
  };

  // Helper: check if inner items should be disabled (view mode = view only, no actions)
  const isInnerDisabled = (module: 'gestaoUsuarios' | 'documentos' | 'analiseDocumentos' | 'gestaoEsteiras' | 'questionarios' | 'ferramentas' | 'prompts') => {
    const current = formData.granularPermissions[module];
    return current.view || !current.edit;
  };

  // Reusable checkbox row component
  const CheckboxRow = ({
    id,
    label,
    checked,
    onChange,
    disabled = false,
  }: {
    id: string;
    label: string;
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
  }) => (
    <div className={`flex items-center space-x-2 ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={disabled ? undefined : onChange}
        disabled={disabled}
        className={disabled ? 'pointer-events-none' : ''}
      />
      <Label
        htmlFor={id}
        className={`text-sm cursor-pointer select-none ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-woopi-ai-dark-gray'}`}
      >
        {label}
      </Label>
    </div>
  );

  const gp = formData.granularPermissions;

  return (
    <div className="user-management-layout">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="woopi-ai-text-primary">
            {isEditing ? 'Editar Perfil' : 'Novo Perfil'}
          </h1>
          <p className="woopi-ai-text-secondary">
            {isEditing
              ? 'Atualize as informações do perfil selecionado'
              : 'Crie um novo perfil de permissões para o sistema'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="woopi-ai-button-primary"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Salvar Alterações' : 'Criar Perfil'}
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className="w-full">
        {/* Profile Info Card */}
        <Card className="woopi-ai-card">
          <CardHeader>
            <CardTitle className="woopi-ai-text-primary flex items-center gap-2">
              <ShieldUser className="w-5 h-5" />
              Informações do Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Perfil *</Label>
              <Input
                id="name"
                placeholder="Nome do perfil"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border border-woopi-ai-border"
              />
            </div>

            {/* Granular Permissions */}
            <div className="space-y-2">
              <Label>Permissões Granulares por Módulo</Label>
              <div className="border rounded-md p-4 bg-muted space-y-3">

                {/* ===== HOME - Simple Card ===== */}
                <div className="border rounded-md bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-woopi-ai-blue" />
                      <span className="font-medium text-woopi-ai-dark-gray">Home</span>
                    </div>
                    <CheckboxRow
                      id="home-view"
                      label="Visualizar"
                      checked={gp.home.view}
                      onChange={() => handleSimpleViewToggle('home')}
                    />
                  </div>
                </div>

                {/* ===== DASHBOARD - Simple Card ===== */}
                <div className="border rounded-md bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-woopi-ai-blue" />
                      <span className="font-medium text-woopi-ai-dark-gray">Dashboard</span>
                    </div>
                    <CheckboxRow
                      id="dashboard-view"
                      label="Visualizar"
                      checked={gp.dashboard.view}
                      onChange={() => handleSimpleViewToggle('dashboard')}
                    />
                  </div>
                </div>

                {/* ===== GESTÃO DE USUÁRIOS - Accordion ===== */}
                <Accordion type="multiple" className="w-full space-y-3">
                  <AccordionItem value="gestaoUsuarios" className="border rounded-md bg-card">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-2 flex-1">
                        <Users className="w-4 h-4 text-woopi-ai-blue" />
                        <span className="font-medium text-woopi-ai-dark-gray">Gestão de Usuários</span>
                      </div>
                    </AccordionTrigger>
                    {/* Top-level view/edit checkboxes - OUTSIDE accordion content so always visible */}
                    <div className="flex items-center gap-6 px-4 pb-3 border-b border-border">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="gestaoUsuarios-view"
                          checked={gp.gestaoUsuarios.view}
                          onCheckedChange={() => handleAccordionLevelChange('gestaoUsuarios', 'view')}
                        />
                        <Label htmlFor="gestaoUsuarios-view" className="text-sm cursor-pointer select-none flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-woopi-ai-gray" />
                          Visualizar
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="gestaoUsuarios-edit"
                          checked={gp.gestaoUsuarios.edit}
                          onCheckedChange={() => handleAccordionLevelChange('gestaoUsuarios', 'edit')}
                        />
                        <Label htmlFor="gestaoUsuarios-edit" className="text-sm cursor-pointer select-none flex items-center gap-1">
                          <Edit3 className="w-3.5 h-3.5 text-woopi-ai-gray" />
                          Editar
                        </Label>
                      </div>
                      {gp.gestaoUsuarios.view && (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Somente leitura - ações internas bloqueadas</span>
                      )}
                    </div>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4 pt-3">
                        {/* Aba Usuários */}
                        <div className="pl-4 border-l-2 border-woopi-ai-blue/20">
                          <p className="text-sm font-semibold text-woopi-ai-dark-gray mb-2">Aba Usuários</p>
                          <div className="flex flex-wrap gap-4">
                            <CheckboxRow id="gu-usuarios-view" label="Visualizar" checked={gp.gestaoUsuarios.tabs.usuarios.view} onChange={() => handleTabActionToggle('gestaoUsuarios', 'usuarios', 'view')} disabled={isInnerDisabled('gestaoUsuarios')} />
                            <CheckboxRow id="gu-usuarios-edit" label="Editar" checked={gp.gestaoUsuarios.tabs.usuarios.edit} onChange={() => handleTabActionToggle('gestaoUsuarios', 'usuarios', 'edit')} disabled={isInnerDisabled('gestaoUsuarios')} />
                            <CheckboxRow id="gu-usuarios-delete" label="Excluir" checked={gp.gestaoUsuarios.tabs.usuarios.delete} onChange={() => handleTabActionToggle('gestaoUsuarios', 'usuarios', 'delete')} disabled={isInnerDisabled('gestaoUsuarios')} />
                          </div>
                        </div>
                        {/* Aba Times */}
                        <div className="pl-4 border-l-2 border-woopi-ai-blue/20">
                          <p className="text-sm font-semibold text-woopi-ai-dark-gray mb-2">Aba Times</p>
                          <div className="flex flex-wrap gap-4">
                            <CheckboxRow id="gu-times-view" label="Visualizar" checked={gp.gestaoUsuarios.tabs.times.view} onChange={() => handleTabActionToggle('gestaoUsuarios', 'times', 'view')} disabled={isInnerDisabled('gestaoUsuarios')} />
                            <CheckboxRow id="gu-times-edit" label="Editar" checked={gp.gestaoUsuarios.tabs.times.edit} onChange={() => handleTabActionToggle('gestaoUsuarios', 'times', 'edit')} disabled={isInnerDisabled('gestaoUsuarios')} />
                            <CheckboxRow id="gu-times-delete" label="Excluir" checked={gp.gestaoUsuarios.tabs.times.delete} onChange={() => handleTabActionToggle('gestaoUsuarios', 'times', 'delete')} disabled={isInnerDisabled('gestaoUsuarios')} />
                          </div>
                        </div>
                        {/* Aba Perfis e Permissões */}
                        <div className="pl-4 border-l-2 border-woopi-ai-blue/20">
                          <p className="text-sm font-semibold text-woopi-ai-dark-gray mb-2">Aba Perfis e Permissões</p>
                          <div className="flex flex-wrap gap-4">
                            <CheckboxRow id="gu-perfis-view" label="Visualizar" checked={gp.gestaoUsuarios.tabs.perfis.view} onChange={() => handleTabActionToggle('gestaoUsuarios', 'perfis', 'view')} disabled={isInnerDisabled('gestaoUsuarios')} />
                            <CheckboxRow id="gu-perfis-edit" label="Editar" checked={gp.gestaoUsuarios.tabs.perfis.edit} onChange={() => handleTabActionToggle('gestaoUsuarios', 'perfis', 'edit')} disabled={isInnerDisabled('gestaoUsuarios')} />
                            <CheckboxRow id="gu-perfis-delete" label="Excluir" checked={gp.gestaoUsuarios.tabs.perfis.delete} onChange={() => handleTabActionToggle('gestaoUsuarios', 'perfis', 'delete')} disabled={isInnerDisabled('gestaoUsuarios')} />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* ===== DOCUMENTOS - Accordion ===== */}
                  <AccordionItem value="documentos" className="border rounded-md bg-card">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-2 flex-1">
                        <FileText className="w-4 h-4 text-woopi-ai-blue" />
                        <span className="font-medium text-woopi-ai-dark-gray">Documentos</span>
                      </div>
                    </AccordionTrigger>
                    <div className="flex items-center gap-6 px-4 pb-3 border-b border-border">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="documentos-view"
                          checked={gp.documentos.view}
                          onCheckedChange={() => handleAccordionLevelChange('documentos', 'view')}
                        />
                        <Label htmlFor="documentos-view" className="text-sm cursor-pointer select-none flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-woopi-ai-gray" />
                          Visualizar
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="documentos-edit"
                          checked={gp.documentos.edit}
                          onCheckedChange={() => handleAccordionLevelChange('documentos', 'edit')}
                        />
                        <Label htmlFor="documentos-edit" className="text-sm cursor-pointer select-none flex items-center gap-1">
                          <Edit3 className="w-3.5 h-3.5 text-woopi-ai-gray" />
                          Editar
                        </Label>
                      </div>
                      {gp.documentos.view && (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Somente leitura - ações internas bloqueadas</span>
                      )}
                    </div>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3 pt-3">
                        <div className="pl-4 border-l-2 border-woopi-ai-blue/20">
                          <p className="text-sm font-semibold text-woopi-ai-dark-gray mb-2">Ações</p>
                          <div className="flex flex-wrap gap-4">
                            <CheckboxRow id="doc-delete" label="Excluir" checked={gp.documentos.actions.delete} onChange={() => handleActionToggle('documentos', 'delete')} disabled={isInnerDisabled('documentos')} />
                            <CheckboxRow id="doc-upload" label="Upload" checked={gp.documentos.actions.upload} onChange={() => handleActionToggle('documentos', 'upload')} disabled={isInnerDisabled('documentos')} />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* ===== ANÁLISE DE DOCUMENTOS - Accordion ===== */}
                  <AccordionItem value="analiseDocumentos" className="border rounded-md bg-card">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-2 flex-1">
                        <FileSearch className="w-4 h-4 text-woopi-ai-blue" />
                        <span className="font-medium text-woopi-ai-dark-gray">Análise de Documentos</span>
                      </div>
                    </AccordionTrigger>
                    <div className="flex items-center gap-6 px-4 pb-3 border-b border-border">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="analiseDocumentos-view"
                          checked={gp.analiseDocumentos.view}
                          onCheckedChange={() => handleAccordionLevelChange('analiseDocumentos', 'view')}
                        />
                        <Label htmlFor="analiseDocumentos-view" className="text-sm cursor-pointer select-none flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-woopi-ai-gray" />
                          Visualizar
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="analiseDocumentos-edit"
                          checked={gp.analiseDocumentos.edit}
                          onCheckedChange={() => handleAccordionLevelChange('analiseDocumentos', 'edit')}
                        />
                        <Label htmlFor="analiseDocumentos-edit" className="text-sm cursor-pointer select-none flex items-center gap-1">
                          <Edit3 className="w-3.5 h-3.5 text-woopi-ai-gray" />
                          Editar
                        </Label>
                      </div>
                      {gp.analiseDocumentos.view && (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Somente leitura - ações internas bloqueadas</span>
                      )}
                    </div>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3 pt-3">
                        <div className="pl-4 border-l-2 border-woopi-ai-blue/20">
                          <p className="text-sm font-semibold text-woopi-ai-dark-gray mb-2">Ações</p>
                          <div className="flex flex-wrap gap-4">
                            <CheckboxRow id="ad-pergunteAoDoc" label="Pergunte ao Doc" checked={gp.analiseDocumentos.actions.pergunteAoDoc} onChange={() => handleActionToggle('analiseDocumentos', 'pergunteAoDoc')} disabled={isInnerDisabled('analiseDocumentos')} />
                            <CheckboxRow id="ad-reprovar" label="Reprovar" checked={gp.analiseDocumentos.actions.reprovar} onChange={() => handleActionToggle('analiseDocumentos', 'reprovar')} disabled={isInnerDisabled('analiseDocumentos')} />
                            <CheckboxRow id="ad-editarOutputs" label="Editar Outputs" checked={gp.analiseDocumentos.actions.editarOutputs} onChange={() => handleActionToggle('analiseDocumentos', 'editarOutputs')} disabled={isInnerDisabled('analiseDocumentos')} />
                            <CheckboxRow id="ad-historicoAlteracoes" label="Histórico de Alterações" checked={gp.analiseDocumentos.actions.historicoAlteracoes} onChange={() => handleActionToggle('analiseDocumentos', 'historicoAlteracoes')} disabled={isInnerDisabled('analiseDocumentos')} />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* ===== GESTÃO DE ESTEIRAS - Accordion ===== */}
                  <AccordionItem value="gestaoEsteiras" className="border rounded-md bg-card">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-2 flex-1">
                        <Settings className="w-4 h-4 text-woopi-ai-blue" />
                        <span className="font-medium text-woopi-ai-dark-gray">Gestão de Esteiras</span>
                      </div>
                    </AccordionTrigger>
                    <div className="flex items-center gap-6 px-4 pb-3 border-b border-border">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="gestaoEsteiras-view"
                          checked={gp.gestaoEsteiras.view}
                          onCheckedChange={() => handleAccordionLevelChange('gestaoEsteiras', 'view')}
                        />
                        <Label htmlFor="gestaoEsteiras-view" className="text-sm cursor-pointer select-none flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-woopi-ai-gray" />
                          Visualizar
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="gestaoEsteiras-edit"
                          checked={gp.gestaoEsteiras.edit}
                          onCheckedChange={() => handleAccordionLevelChange('gestaoEsteiras', 'edit')}
                        />
                        <Label htmlFor="gestaoEsteiras-edit" className="text-sm cursor-pointer select-none flex items-center gap-1">
                          <Edit3 className="w-3.5 h-3.5 text-woopi-ai-gray" />
                          Editar
                        </Label>
                      </div>
                      {gp.gestaoEsteiras.view && (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Somente leitura - ações internas bloqueadas</span>
                      )}
                    </div>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3 pt-3">
                        <div className="pl-4 border-l-2 border-woopi-ai-blue/20">
                          <p className="text-sm font-semibold text-woopi-ai-dark-gray mb-2">Ações</p>
                          <div className="flex flex-wrap gap-4">
                            <CheckboxRow id="ge-edit" label="Editar" checked={gp.gestaoEsteiras.actions.edit} onChange={() => handleActionToggle('gestaoEsteiras', 'edit')} disabled={isInnerDisabled('gestaoEsteiras')} />
                            <CheckboxRow id="ge-delete" label="Excluir" checked={gp.gestaoEsteiras.actions.delete} onChange={() => handleActionToggle('gestaoEsteiras', 'delete')} disabled={isInnerDisabled('gestaoEsteiras')} />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* ===== QUESTIONÁRIOS - Accordion ===== */}
                  <AccordionItem value="questionarios" className="border rounded-md bg-card">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-2 flex-1">
                        <HelpCircle className="w-4 h-4 text-woopi-ai-blue" />
                        <span className="font-medium text-woopi-ai-dark-gray">Questionários</span>
                      </div>
                    </AccordionTrigger>
                    <div className="flex items-center gap-6 px-4 pb-3 border-b border-border">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="questionarios-view"
                          checked={gp.questionarios.view}
                          onCheckedChange={() => handleAccordionLevelChange('questionarios', 'view')}
                        />
                        <Label htmlFor="questionarios-view" className="text-sm cursor-pointer select-none flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-woopi-ai-gray" />
                          Visualizar
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="questionarios-edit"
                          checked={gp.questionarios.edit}
                          onCheckedChange={() => handleAccordionLevelChange('questionarios', 'edit')}
                        />
                        <Label htmlFor="questionarios-edit" className="text-sm cursor-pointer select-none flex items-center gap-1">
                          <Edit3 className="w-3.5 h-3.5 text-woopi-ai-gray" />
                          Editar
                        </Label>
                      </div>
                      {gp.questionarios.view && (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Somente leitura - ações internas bloqueadas</span>
                      )}
                    </div>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4 pt-3">
                        {/* Aba Questionários */}
                        <div className="pl-4 border-l-2 border-woopi-ai-blue/20">
                          <p className="text-sm font-semibold text-woopi-ai-dark-gray mb-2">Aba Questionários</p>
                          <div className="flex flex-wrap gap-4">
                            <CheckboxRow id="q-quest-create" label="Criar" checked={gp.questionarios.tabs.questionarios.create} onChange={() => handleTabActionToggle('questionarios', 'questionarios', 'create')} disabled={isInnerDisabled('questionarios')} />
                            <CheckboxRow id="q-quest-edit" label="Editar" checked={gp.questionarios.tabs.questionarios.edit} onChange={() => handleTabActionToggle('questionarios', 'questionarios', 'edit')} disabled={isInnerDisabled('questionarios')} />
                            <CheckboxRow id="q-quest-delete" label="Excluir" checked={gp.questionarios.tabs.questionarios.delete} onChange={() => handleTabActionToggle('questionarios', 'questionarios', 'delete')} disabled={isInnerDisabled('questionarios')} />
                          </div>
                        </div>
                        {/* Aba Perguntas */}
                        <div className="pl-4 border-l-2 border-woopi-ai-blue/20">
                          <p className="text-sm font-semibold text-woopi-ai-dark-gray mb-2">Aba Perguntas</p>
                          <div className="flex flex-wrap gap-4">
                            <CheckboxRow id="q-perg-create" label="Criar" checked={gp.questionarios.tabs.perguntas.create} onChange={() => handleTabActionToggle('questionarios', 'perguntas', 'create')} disabled={isInnerDisabled('questionarios')} />
                            <CheckboxRow id="q-perg-edit" label="Editar" checked={gp.questionarios.tabs.perguntas.edit} onChange={() => handleTabActionToggle('questionarios', 'perguntas', 'edit')} disabled={isInnerDisabled('questionarios')} />
                            <CheckboxRow id="q-perg-delete" label="Excluir" checked={gp.questionarios.tabs.perguntas.delete} onChange={() => handleTabActionToggle('questionarios', 'perguntas', 'delete')} disabled={isInnerDisabled('questionarios')} />
                          </div>
                        </div>
                        {/* Aba Tipos */}
                        <div className="pl-4 border-l-2 border-woopi-ai-blue/20">
                          <p className="text-sm font-semibold text-woopi-ai-dark-gray mb-2">Aba Tipos</p>
                          <div className="flex flex-wrap gap-4">
                            <CheckboxRow id="q-tipos-create" label="Criar" checked={gp.questionarios.tabs.tipos.create} onChange={() => handleTabActionToggle('questionarios', 'tipos', 'create')} disabled={isInnerDisabled('questionarios')} />
                            <CheckboxRow id="q-tipos-edit" label="Editar" checked={gp.questionarios.tabs.tipos.edit} onChange={() => handleTabActionToggle('questionarios', 'tipos', 'edit')} disabled={isInnerDisabled('questionarios')} />
                            <CheckboxRow id="q-tipos-delete" label="Excluir" checked={gp.questionarios.tabs.tipos.delete} onChange={() => handleTabActionToggle('questionarios', 'tipos', 'delete')} disabled={isInnerDisabled('questionarios')} />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* ===== FERRAMENTAS - Accordion ===== */}
                  <AccordionItem value="ferramentas" className="border rounded-md bg-card">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-2 flex-1">
                        <Wrench className="w-4 h-4 text-woopi-ai-blue" />
                        <span className="font-medium text-woopi-ai-dark-gray">Ferramentas</span>
                      </div>
                    </AccordionTrigger>
                    <div className="flex items-center gap-6 px-4 pb-3 border-b border-border">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="ferramentas-view"
                          checked={gp.ferramentas.view}
                          onCheckedChange={() => handleAccordionLevelChange('ferramentas', 'view')}
                        />
                        <Label htmlFor="ferramentas-view" className="text-sm cursor-pointer select-none flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-woopi-ai-gray" />
                          Visualizar
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="ferramentas-edit"
                          checked={gp.ferramentas.edit}
                          onCheckedChange={() => handleAccordionLevelChange('ferramentas', 'edit')}
                        />
                        <Label htmlFor="ferramentas-edit" className="text-sm cursor-pointer select-none flex items-center gap-1">
                          <Edit3 className="w-3.5 h-3.5 text-woopi-ai-gray" />
                          Editar
                        </Label>
                      </div>
                      {gp.ferramentas.view && (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Somente leitura - ações internas bloqueadas</span>
                      )}
                    </div>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3 pt-3">
                        <div className="pl-4 border-l-2 border-woopi-ai-blue/20">
                          <p className="text-sm font-semibold text-woopi-ai-dark-gray mb-2">Ações</p>
                          <div className="flex flex-wrap gap-4">
                            <CheckboxRow id="ferr-create" label="Criar" checked={gp.ferramentas.actions.create} onChange={() => handleActionToggle('ferramentas', 'create')} disabled={isInnerDisabled('ferramentas')} />
                            <CheckboxRow id="ferr-edit" label="Editar" checked={gp.ferramentas.actions.edit} onChange={() => handleActionToggle('ferramentas', 'edit')} disabled={isInnerDisabled('ferramentas')} />
                            <CheckboxRow id="ferr-delete" label="Excluir" checked={gp.ferramentas.actions.delete} onChange={() => handleActionToggle('ferramentas', 'delete')} disabled={isInnerDisabled('ferramentas')} />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* ===== PROMPTS - Accordion ===== */}
                  <AccordionItem value="prompts" className="border rounded-md bg-card">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-2 flex-1">
                        <MessageSquare className="w-4 h-4 text-woopi-ai-blue" />
                        <span className="font-medium text-woopi-ai-dark-gray">Prompts</span>
                      </div>
                    </AccordionTrigger>
                    <div className="flex items-center gap-6 px-4 pb-3 border-b border-border">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="prompts-view"
                          checked={gp.prompts.view}
                          onCheckedChange={() => handleAccordionLevelChange('prompts', 'view')}
                        />
                        <Label htmlFor="prompts-view" className="text-sm cursor-pointer select-none flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-woopi-ai-gray" />
                          Visualizar
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="prompts-edit"
                          checked={gp.prompts.edit}
                          onCheckedChange={() => handleAccordionLevelChange('prompts', 'edit')}
                        />
                        <Label htmlFor="prompts-edit" className="text-sm cursor-pointer select-none flex items-center gap-1">
                          <Edit3 className="w-3.5 h-3.5 text-woopi-ai-gray" />
                          Editar
                        </Label>
                      </div>
                      {gp.prompts.view && (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Somente leitura - ações internas bloqueadas</span>
                      )}
                    </div>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3 pt-3">
                        <div className="pl-4 border-l-2 border-woopi-ai-blue/20">
                          <p className="text-sm font-semibold text-woopi-ai-dark-gray mb-2">Ações</p>
                          <div className="flex flex-wrap gap-4">
                            <CheckboxRow id="prompt-create" label="Criar" checked={gp.prompts.actions.create} onChange={() => handleActionToggle('prompts', 'create')} disabled={isInnerDisabled('prompts')} />
                            <CheckboxRow id="prompt-editClone" label="Editar e Clonar" checked={gp.prompts.actions.editClone} onChange={() => handleActionToggle('prompts', 'editClone')} disabled={isInnerDisabled('prompts')} />
                            <CheckboxRow id="prompt-delete" label="Excluir" checked={gp.prompts.actions.delete} onChange={() => handleActionToggle('prompts', 'delete')} disabled={isInnerDisabled('prompts')} />
                            <CheckboxRow id="prompt-import" label="Importar" checked={gp.prompts.actions.import} onChange={() => handleActionToggle('prompts', 'import')} disabled={isInnerDisabled('prompts')} />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* ===== ESTEIRAS DE PROCESSAMENTO (WORKFLOW) ===== */}
                  <AccordionItem value="esteirasProcessamento" className="border rounded-md bg-card">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-2 flex-1">
                        <GitBranch className="w-4 h-4 text-woopi-ai-blue" />
                        <span className="font-medium text-woopi-ai-dark-gray">Esteiras de Processamento (Workflow)</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-6 pt-3">
                        {/* Workflow de Aprovação de Documentos */}
                        <div className="pl-4 border-l-2 border-woopi-ai-blue/20">
                          <p className="text-sm font-semibold text-woopi-ai-dark-gray mb-3">Workflow de Aprovação de Documentos</p>
                          <div className="space-y-2">
                            {[
                              { key: 'step1', label: 'Etapa 1: Revisão Inicial' },
                              { key: 'step2', label: 'Etapa 2: Aprovação Gerencial' },
                              { key: 'step3', label: 'Etapa 3: Publicação' },
                            ].map(step => (
                              <div key={step.key} className="flex items-center justify-between py-2 border-b last:border-b-0 border-border">
                                <span className="text-sm text-woopi-ai-dark-gray">{step.label}</span>
                                <div className="flex items-center gap-6">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`doc-${step.key}-view`}
                                      checked={formData.workflowPermissions.documentApproval[step.key as keyof typeof formData.workflowPermissions.documentApproval] === 'view'}
                                      onCheckedChange={() => handleWorkflowPermissionChange('documentApproval', step.key, 'view')}
                                    />
                                    <Label htmlFor={`doc-${step.key}-view`} className="text-sm text-woopi-ai-gray cursor-pointer">Visualizar</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`doc-${step.key}-access`}
                                      checked={formData.workflowPermissions.documentApproval[step.key as keyof typeof formData.workflowPermissions.documentApproval] === 'access'}
                                      onCheckedChange={() => handleWorkflowPermissionChange('documentApproval', step.key, 'access')}
                                    />
                                    <Label htmlFor={`doc-${step.key}-access`} className="text-sm text-woopi-ai-gray cursor-pointer">Editar</Label>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Workflow de Onboarding de Cliente */}
                        <div className="pl-4 border-l-2 border-woopi-ai-blue/20">
                          <p className="text-sm font-semibold text-woopi-ai-dark-gray mb-3">Workflow de Onboarding de Cliente</p>
                          <div className="space-y-2">
                            {[
                              { key: 'stepA', label: 'Etapa A: Coleta de Dados' },
                              { key: 'stepB', label: 'Etapa B: Verificação de Crédito' },
                              { key: 'stepC', label: 'Etapa C: Ativação de Conta' },
                              { key: 'stepD', label: 'Etapa D: Boas-vindas' },
                            ].map(step => (
                              <div key={step.key} className="flex items-center justify-between py-2 border-b last:border-b-0 border-border">
                                <span className="text-sm text-woopi-ai-dark-gray">{step.label}</span>
                                <div className="flex items-center gap-6">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`client-${step.key}-view`}
                                      checked={formData.workflowPermissions.clientOnboarding[step.key as keyof typeof formData.workflowPermissions.clientOnboarding] === 'view'}
                                      onCheckedChange={() => handleWorkflowPermissionChange('clientOnboarding', step.key, 'view')}
                                    />
                                    <Label htmlFor={`client-${step.key}-view`} className="text-sm text-woopi-ai-gray cursor-pointer">Visualizar</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`client-${step.key}-access`}
                                      checked={formData.workflowPermissions.clientOnboarding[step.key as keyof typeof formData.workflowPermissions.clientOnboarding] === 'access'}
                                      onCheckedChange={() => handleWorkflowPermissionChange('clientOnboarding', step.key, 'access')}
                                    />
                                    <Label htmlFor={`client-${step.key}-access`} className="text-sm text-woopi-ai-gray cursor-pointer">Editar</Label>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}