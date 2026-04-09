export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  roles: string[];
  teams: string[];
  status: 'Ativo' | 'Inativo' | 'Suspenso';
  lastLogin: string | null;
  documentsCount: number;
  avatar?: string;
}

export interface Team {
  id: number;
  name: string;
  description: string;
  color: string;
  members: number[];
  membersCount: number;
  leader: string;
  createdAt: string;
  status: 'Ativo' | 'Inativo';
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: {
    uploadDocuments: boolean;
    mergeDocuments: boolean;
    chatWithDocuments: boolean;
    extractData: boolean;
    createTasks: boolean;
    approveTasks: boolean;
    exportData: boolean;
    viewHistory: boolean;
    manageUsers: boolean;
    manageTeams: boolean;
    manageRoles: boolean;
    documentTypes: boolean;
    questions: boolean;
    questionnaires: boolean;
    prompts: boolean;
    ferramentas: boolean;
    fluxoFerramentas: boolean;
    workflows: boolean;
  };
  usersCount: number;
  createdAt: string;
  isBuiltIn?: boolean; // Indicates if this is a system role that cannot be edited/deleted
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@empresa.com',
    phone: '(11) 99999-9999',
    roles: ['Administrador'],
    teams: ['TI'],
    status: 'Ativo',
    lastLogin: '09/04/2026 12:03',
    documentsCount: 127,
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    phone: '(11) 88888-8888',
    roles: ['Gestor'],
    teams: ['Financeiro'],
    status: 'Ativo',
    lastLogin: '08/04/2026 09:47',
    documentsCount: 89,
  },
  {
    id: 3,
    name: 'Pedro Costa',
    email: 'pedro.costa@empresa.com',
    phone: '(11) 77777-7777',
    roles: ['Analista'],
    teams: ['RH'],
    status: 'Ativo',
    lastLogin: '09/04/2026 11:22',
    documentsCount: 45,
  },
  {
    id: 4,
    name: 'Ana Oliveira',
    email: 'ana.oliveira@empresa.com',
    phone: '(11) 66666-6666',
    roles: ['Gestor'],
    teams: ['Marketing'],
    status: 'Ativo',
    lastLogin: '09/04/2026 09:05',
    documentsCount: 67,
  },
  {
    id: 5,
    name: 'Carlos Mendes',
    email: 'carlos.mendes@empresa.com',
    phone: '(11) 55555-5555',
    roles: ['Analista'],
    teams: ['Jurídico'],
    status: 'Ativo',
    lastLogin: '07/04/2026 16:38',
    documentsCount: 34,
  },
  {
    id: 6,
    name: 'Fernanda Lima',
    email: 'fernanda.lima@empresa.com',
    phone: '(11) 44444-4444',
    roles: ['Auditor'],
    teams: ['Financeiro'],
    status: 'Ativo',
    lastLogin: '09/04/2026 13:14',
    documentsCount: 98,
  },
  {
    id: 7,
    name: 'Roberto Alves',
    email: 'roberto.alves@empresa.com',
    phone: '(11) 33333-3333',
    roles: ['Analista'],
    teams: ['TI'],
    status: 'Ativo',
    lastLogin: '09/04/2026 10:51',
    documentsCount: 56,
  },
  {
    id: 8,
    name: 'Juliana Ferreira',
    email: 'juliana.ferreira@empresa.com',
    phone: '(11) 22222-2222',
    roles: ['Gestor'],
    teams: ['RH'],
    status: 'Inativo',
    lastLogin: '25/03/2026 08:19',
    documentsCount: 23,
  },
];

export const mockTeams: Team[] = [
  {
    id: 1,
    name: 'TI',
    description: 'Time de Tecnologia da Informação',
    color: '#0073ea',
    members: [1, 7],
    membersCount: 2,
    leader: 'João Silva',
    createdAt: '2024-01-15',
    status: 'Ativo',
  },
  {
    id: 2,
    name: 'Financeiro',
    description: 'Time de Finanças e Contabilidade',
    color: '#00d2d2',
    members: [2, 6],
    membersCount: 2,
    leader: 'Maria Santos',
    createdAt: '2024-01-10',
    status: 'Ativo',
  },
  {
    id: 3,
    name: 'RH',
    description: 'Time de Recursos Humanos',
    color: '#ff6b6b',
    members: [3, 8],
    membersCount: 2,
    leader: 'Pedro Costa',
    createdAt: '2024-01-20',
    status: 'Ativo',
  },
  {
    id: 4,
    name: 'Marketing',
    description: 'Time de Marketing e Comunicação',
    color: '#a855f7',
    members: [4],
    membersCount: 1,
    leader: 'Ana Oliveira',
    createdAt: '2024-02-01',
    status: 'Ativo',
  },
  {
    id: 5,
    name: 'Jurídico',
    description: 'Time Jurídico e Compliance',
    color: '#f59e0b',
    members: [5],
    membersCount: 1,
    leader: 'Carlos Mendes',
    createdAt: '2024-02-05',
    status: 'Ativo',
  },
  {
    id: 6,
    name: 'Operações',
    description: 'Time de Operações e Logística',
    color: '#10b981',
    members: [],
    membersCount: 0,
    leader: 'Sem líder',
    createdAt: '2024-02-10',
    status: 'Ativo',
  },
  {
    id: 7,
    name: 'Vendas',
    description: 'Time Comercial e Vendas',
    color: '#ef4444',
    members: [],
    membersCount: 0,
    leader: 'Sem líder',
    createdAt: '2024-02-15',
    status: 'Ativo',
  },
  {
    id: 8,
    name: 'Suporte',
    description: 'Time de Suporte ao Cliente',
    color: '#3b82f6',
    members: [],
    membersCount: 0,
    leader: 'Sem líder',
    createdAt: '2024-02-20',
    status: 'Inativo',
  },
];

export const mockRoles: Role[] = [
  // Perfis Built-in (Padrão do Sistema)
  {
    id: 1,
    name: 'Administrador',
    description: 'Acesso total ao sistema',
    permissions: {
      uploadDocuments: true,
      mergeDocuments: true,
      chatWithDocuments: true,
      extractData: true,
      createTasks: true,
      approveTasks: true,
      exportData: true,
      viewHistory: true,
      manageUsers: true,
      manageTeams: true,
      manageRoles: true,
      documentTypes: true,
      questions: true,
      questionnaires: true,
      prompts: true,
      ferramentas: true,
      fluxoFerramentas: true,
      workflows: true,
    },
    usersCount: 3,
    createdAt: '2024-01-01',
    isBuiltIn: true,
  },
  {
    id: 2,
    name: 'Analista',
    description: 'Acesso a dashboards e análise de documentos',
    permissions: {
      uploadDocuments: true,
      mergeDocuments: false,
      chatWithDocuments: false,
      extractData: true,
      createTasks: false,
      approveTasks: false,
      exportData: false,
      viewHistory: false,
      manageUsers: false,
      manageTeams: false,
      manageRoles: false,
      documentTypes: false,
      questions: false,
      questionnaires: false,
      prompts: false,
      ferramentas: false,
      fluxoFerramentas: false,
      workflows: true,
    },
    usersCount: 5,
    createdAt: '2024-01-01',
    isBuiltIn: true,
  },
  // Perfis Customizados
  {
    id: 3,
    name: 'Gestor de Prompt',
    description: 'Gestão de prompts e ferramentas de IA',
    permissions: {
      uploadDocuments: true,
      mergeDocuments: false,
      chatWithDocuments: true,
      extractData: true,
      createTasks: false,
      approveTasks: false,
      exportData: true,
      viewHistory: true,
      manageUsers: false,
      manageTeams: false,
      manageRoles: false,
      documentTypes: false,
      questions: true,
      questionnaires: true,
      prompts: true,
      ferramentas: true,
      fluxoFerramentas: true,
      workflows: false,
    },
    usersCount: 2,
    createdAt: '2024-02-15',
    isBuiltIn: false,
  },
  {
    id: 4,
    name: 'Revisor de Etapas',
    description: 'Revisão e aprovação de etapas de workflow',
    permissions: {
      uploadDocuments: false,
      mergeDocuments: false,
      chatWithDocuments: false,
      extractData: true,
      createTasks: true,
      approveTasks: true,
      exportData: false,
      viewHistory: true,
      manageUsers: false,
      manageTeams: false,
      manageRoles: false,
      documentTypes: false,
      questions: false,
      questionnaires: false,
      prompts: false,
      ferramentas: false,
      fluxoFerramentas: false,
      workflows: true,
    },
    usersCount: 4,
    createdAt: '2024-03-01',
    isBuiltIn: false,
  },
];

export interface Permission {
  key: string;
  name: string;
  description?: string;
  category?: string;
}

export const availablePermissions: Permission[] = [
  // Gestão de Sistema
  { key: 'manageUsers', name: 'Gestão de Usuários', description: 'Acesso à tela de gestão de usuários', category: 'Sistema' },
  { key: 'manageTeams', name: 'Gestão de Times', description: 'Gerenciar times e suas configurações', category: 'Sistema' },
  { key: 'manageRoles', name: 'Gestão de Perfis', description: 'Criar e editar perfis de usuário', category: 'Sistema' },
  
  // Documentos
  { key: 'uploadDocuments', name: 'Upload de Documentos', description: 'Enviar novos documentos para o sistema', category: 'Documentos' },
  { key: 'mergeDocuments', name: 'Unir Documentos', description: 'Combinar múltiplos documentos', category: 'Documentos' },
  { key: 'chatWithDocuments', name: 'Chat com Documentos', description: 'Interagir via chat com documentos', category: 'Documentos' },
  { key: 'extractData', name: 'Tela de análise', description: 'Extrair informações dos documentos', category: 'Documentos' },
  { key: 'exportData', name: 'Exportar Dados', description: 'Exportar dados e relatórios', category: 'Documentos' },
  
  // Configurações
  { key: 'documentTypes', name: 'Tipos', description: 'Gerenciar tipos de documentos', category: 'Configurações' },
  { key: 'questions', name: 'Perguntas', description: 'Criar e editar perguntas', category: 'Configurações' },
  { key: 'questionnaires', name: 'Questionários', description: 'Gerenciar questionários', category: 'Configurações' },
  { key: 'prompts', name: 'Prompts', description: 'Gerenciar prompts de IA do sistema', category: 'Configurações' },
  { key: 'ferramentas', name: 'Ferramentas', description: 'Gerenciar ferramentas do sistema', category: 'Configurações' },
  { key: 'fluxoFerramentas', name: 'Fluxo de Ferramentas', description: 'Configurar fluxos de ferramentas', category: 'Configurações' },
  { key: 'workflows', name: 'Workflows', description: 'Gerenciar workflows do sistema', category: 'Configurações' },
  
  // Tarefas e Aprovações
  { key: 'createTasks', name: 'Criar Tarefas', description: 'Criar novas tarefas no sistema', category: 'Tarefas' },
  { key: 'approveTasks', name: 'Aprovar Tarefas', description: 'Aprovar ou rejeitar tarefas', category: 'Tarefas' },
  { key: 'viewHistory', name: 'Visualizar Histórico', description: 'Acessar histórico de atividades', category: 'Tarefas' }
];