import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save, ShieldUser, Lock, Home, BarChart3, Users, FileText, GitBranch, Settings, HelpCircle, Wrench, MessageSquare, Eye, Edit3, FileSearch, AlertCircle } from 'lucide-react';
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

type WorkflowPermissionsState = {
  documentApproval: { step1: string; step2: string; step3: string };
  clientOnboarding: { stepA: string; stepB: string; stepC: string; stepD: string };
};

// ─── Esteira permissions ───────────────────────────────────────────────────────
type EtapaPermission = 'none' | 'view' | 'access';

interface EtapaConfig {
  key: string;
  label: string;
}

interface EsteiraConfig {
  id: string;
  name: string;
  etapas: EtapaConfig[];
}

type EsteiraPermissions = Record<string, Record<string, EtapaPermission>>;

const AVAILABLE_ESTEIRAS: EsteiraConfig[] = [
  {
    id: 'aprovacao-documentos',
    name: 'Aprovação de Documentos',
    etapas: [
      { key: 'e1', label: 'Revisão Inicial' },
      { key: 'e2', label: 'Aprovação Gerencial' },
      { key: 'e3', label: 'Publicação' },
    ],
  },
  {
    id: 'analise-financeira',
    name: 'Análise Financeira',
    etapas: [
      { key: 'e1', label: 'Recebimento' },
      { key: 'e2', label: 'Verificação Financeira' },
      { key: 'e3', label: 'Aprovação de Pagamento' },
      { key: 'e4', label: 'Pagos e Conciliados' },
    ],
  },
  {
    id: 'revisao-juridica',
    name: 'Revisão Jurídica',
    etapas: [
      { key: 'e1', label: 'Triagem Inicial' },
      { key: 'e2', label: 'Análise Jurídica' },
      { key: 'e3', label: 'Parecer Final' },
    ],
  },
  {
    id: 'onboarding-clientes',
    name: 'Onboarding de Clientes',
    etapas: [
      { key: 'e1', label: 'Coleta de Dados' },
      { key: 'e2', label: 'Verificação de Crédito' },
      { key: 'e3', label: 'Ativação de Conta' },
      { key: 'e4', label: 'Boas-vindas' },
    ],
  },
  {
    id: 'aprovacao-contratos',
    name: 'Aprovação de Contratos',
    etapas: [
      { key: 'e1', label: 'Elaboração' },
      { key: 'e2', label: 'Revisão Jurídica' },
      { key: 'e3', label: 'Assinatura' },
      { key: 'e4', label: 'Arquivamento' },
    ],
  },
];

function hasTruthyPermissionValue(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'view' || value === 'access';
  if (value && typeof value === 'object') {
    return Object.values(value).some(hasTruthyPermissionValue);
  }
  return false;
}

function hasAtLeastOneModuleSelected(
  granularPermissions: GranularPermissions,
  workflowPermissions: WorkflowPermissionsState
): boolean {
  if (granularPermissions.home.view || granularPermissions.dashboard.view) {
    return true;
  }

  const accordionModules: Array<
    'gestaoUsuarios' | 'documentos' | 'analiseDocumentos' | 'gestaoEsteiras' | 'questionarios' | 'ferramentas' | 'prompts'
  > = [
    'gestaoUsuarios',
    'documentos',
    'analiseDocumentos',
    'gestaoEsteiras',
    'questionarios',
    'ferramentas',
    'prompts',
  ];

  if (accordionModules.some((module) => hasTruthyPermissionValue(granularPermissions[module]))) {
    return true;
  }

  return hasTruthyPermissionValue(workflowPermissions);
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

  const [showModulesRequiredAlert, setShowModulesRequiredAlert] = useState(false);

  // Esteira permissions state
  const [selectedEsteiraIds, setSelectedEsteiraIds] = useState<string[]>([]);
  const [esteiraPermissions, setEsteiraPermissions] = useState<EsteiraPermissions>({});

  const handleToggleEsteira = (esteiraId: string) => {
    setSelectedEsteiraIds(prev => {
      if (prev.includes(esteiraId)) {
        return prev.filter(id => id !== esteiraId);
      }
      // Init permissions for this esteira
      const esteira = AVAILABLE_ESTEIRAS.find(e => e.id === esteiraId);
      if (esteira) {
        const defaultEtapas: Record<string, EtapaPermission> = {};
        esteira.etapas.forEach(et => { defaultEtapas[et.key] = 'none'; });
        setEsteiraPermissions(prev => ({ ...prev, [esteiraId]: defaultEtapas }));
      }
      return [...prev, esteiraId];
    });
  };

  const handleEtapaPermissionChange = (
    esteiraId: string,
    etapaKey: string,
    perm: 'view' | 'access'
  ) => {
    setEsteiraPermissions(prev => {
      const current = prev[esteiraId]?.[etapaKey] ?? 'none';
      const next: EtapaPermission = current === perm ? 'none' : perm;
      return {
        ...prev,
        [esteiraId]: { ...prev[esteiraId], [etapaKey]: next },
      };
    });
  };

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

  useEffect(() => {
    if (
      showModulesRequiredAlert &&
      hasAtLeastOneModuleSelected(formData.granularPermissions, formData.workflowPermissions)
    ) {
      setShowModulesRequiredAlert(false);
    }
  }, [formData.granularPermissions, formData.workflowPermissions, showModulesRequiredAlert]);

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
      toast.error('Informe um nome para o perfil antes de salvar.');
      return;
    }

    if (!hasAtLeastOneModuleSelected(formData.granularPermissions, formData.workflowPermissions)) {
      setShowModulesRequiredAlert(true);
      toast.error('Selecione ao menos um módulo para continuar.');
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
              <Label>Permissões por Módulo</Label>
              {showModulesRequiredAlert && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="flex items-center gap-2.5 rounded-md border border-red-200 border-l-[3px] border-l-red-500 bg-red-50 px-3 py-2 text-sm dark:border-red-900/50 dark:border-l-red-400 dark:bg-red-950/30 animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-woopi-ai-error" aria-hidden />
                  <p className="min-w-0 leading-tight text-woopi-ai-dark-gray">
                    <span className="font-semibold text-woopi-ai-error">Selecione ao menos um módulo.</span>{' '}
                    Marque <span className="font-medium">Visualizar</span> ou <span className="font-medium">Editar</span> em um dos módulos abaixo.
                  </p>
                </div>
              )}
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

                </Accordion>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Esteiras de Processamento (optional) ─────────────────────── */}
        <Card className="woopi-ai-card">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-woopi-ai-blue shrink-0" />
                <div>
                  <CardTitle className="woopi-ai-text-primary">
                    Permissões de Esteira de Processamento
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Opcional — selecione as esteiras e defina o acesso por etapa
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-woopi-ai-gray bg-muted border border-woopi-ai-border rounded px-2 py-0.5 mt-1">
                Opcional
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Esteira selector chips */}
            <div className="mb-4">
              <p className="text-xs font-medium text-woopi-ai-gray uppercase tracking-wide mb-2">
                Esteiras disponíveis
              </p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_ESTEIRAS.map(esteira => {
                  const isSelected = selectedEsteiraIds.includes(esteira.id);
                  return (
                    <button
                      key={esteira.id}
                      type="button"
                      onClick={() => handleToggleEsteira(esteira.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                        isSelected
                          ? 'bg-woopi-ai-blue text-white border-woopi-ai-blue shadow-sm'
                          : 'bg-card text-woopi-ai-dark-gray border-woopi-ai-border hover:border-woopi-ai-blue hover:text-woopi-ai-blue'
                      }`}
                    >
                      <GitBranch className="w-3 h-3" />
                      {esteira.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected esteiras — permission tables */}
            {selectedEsteiraIds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 rounded-lg border border-dashed border-woopi-ai-border bg-muted/40 gap-2">
                <Lock className="w-8 h-8 text-woopi-ai-border" />
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  Nenhuma esteira selecionada. Selecione acima para definir permissões por etapa.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedEsteiraIds.map(esteiraId => {
                  const esteira = AVAILABLE_ESTEIRAS.find(e => e.id === esteiraId);
                  if (!esteira) return null;
                  const perms = esteiraPermissions[esteiraId] ?? {};

                  return (
                    <div key={esteiraId} className="rounded-lg border border-woopi-ai-border overflow-hidden">
                      {/* Esteira header */}
                      <div className="flex items-center justify-between px-4 py-2.5 bg-muted border-b border-woopi-ai-border">
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-3.5 h-3.5 text-woopi-ai-blue" />
                          <span className="text-sm font-semibold text-woopi-ai-dark-gray">
                            {esteira.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleEsteira(esteiraId)}
                          className="text-xs text-muted-foreground hover:text-woopi-ai-error transition-colors flex items-center gap-1"
                          aria-label={`Remover ${esteira.name}`}
                        >
                          <span>Remover</span>
                        </button>
                      </div>

                      {/* Column headers */}
                      <div className="grid grid-cols-[1fr_160px_160px] text-[11px] font-medium uppercase tracking-wide text-muted-foreground px-4 py-2 border-b border-woopi-ai-border/60 bg-muted/30">
                        <span>Etapa</span>
                        <span className="flex items-center justify-center gap-1">
                          <Eye className="w-3 h-3" /> Visualizar Etapas
                        </span>
                        <span className="flex items-center justify-center gap-1">
                          <Edit3 className="w-3 h-3" /> Acessar Etapas
                        </span>
                      </div>

                      {/* Etapa rows */}
                      {esteira.etapas.map((etapa, idx) => {
                        const val = perms[etapa.key] ?? 'none';
                        return (
                          <div
                            key={etapa.key}
                            className={`grid grid-cols-[1fr_160px_160px] items-center px-4 py-2.5 ${
                              idx < esteira.etapas.length - 1
                                ? 'border-b border-woopi-ai-border/40'
                                : ''
                            }`}
                          >
                            <span className="text-sm text-woopi-ai-dark-gray">
                              {etapa.label}
                            </span>
                            <div className="flex justify-center">
                              <Checkbox
                                id={`${esteiraId}-${etapa.key}-view`}
                                checked={val === 'view' || val === 'access'}
                                onCheckedChange={() =>
                                  handleEtapaPermissionChange(esteiraId, etapa.key, 'view')
                                }
                              />
                            </div>
                            <div className="flex justify-center">
                              <Checkbox
                                id={`${esteiraId}-${etapa.key}-access`}
                                checked={val === 'access'}
                                disabled={val !== 'view' && val !== 'access'}
                                onCheckedChange={() =>
                                  handleEtapaPermissionChange(esteiraId, etapa.key, 'access')
                                }
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}