import { Workflow, WorkflowVersion, generateHash, createAuditEvent } from '../types/workflow-version';

// Mock current user
export const mockCurrentUser = {
  id: 'user_1',
  name: 'João Silva',
  email: 'joao.silva@empresa.com'
};

// Mock workflows with versions
export const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Aprovação de Contratos',
    description: 'Workflow para análise e aprovação de contratos jurídicos',
    currentVersionId: '1_v2',
    versions: [
      {
        id: '1_v1',
        workflowId: '1',
        versionNumber: '1.0.0',
        versionName: 'Versão Inicial',
        status: 'deprecated',
        lifecycle: {
          createdAt: new Date('2024-01-10'),
          createdBy: mockCurrentUser,
          publishedAt: new Date('2024-01-15'),
          publishedBy: mockCurrentUser,
          deprecatedAt: new Date('2024-02-01'),
          deprecatedBy: mockCurrentUser
        },
        documentation: {
          changelog: {
            summary: 'Versão inicial do workflow de aprovação de contratos',
            detailedChanges: '# Versão 1.0.0\n\n## Funcionalidades\n- Análise jurídica automática\n- Aprovação financeira\n- Notificações por email',
            breakingChanges: false
          },
          businessJustification: 'Automatização do processo manual de aprovação de contratos',
          technicalNotes: 'Utiliza OCR para extração de dados e IA para análise de cláusulas'
        },
        audit: {
          trail: [
            createAuditEvent(mockCurrentUser.id, mockCurrentUser.name, 'created', 'Versão inicial criada'),
            createAuditEvent(mockCurrentUser.id, mockCurrentUser.name, 'published', 'Versão publicada para produção'),
            createAuditEvent(mockCurrentUser.id, mockCurrentUser.name, 'deprecated', 'Versão substituída pela v2.0.0')
          ],
          impactAnalysis: {
            affectedDocuments: 0,
            affectedUsers: 0,
            affectedTeams: []
          }
        },
        definition: {
          nodes: [
            {
              id: 'node_1',
              type: 'ocr',
              name: 'Extração de Texto',
              config: { language: 'pt', dpi: 300 }
            },
            {
              id: 'node_2',
              type: 'validation',
              name: 'Análise Jurídica',
              config: { rules: ['clause_check', 'compliance'] }
            },
            {
              id: 'node_3',
              type: 'approval',
              name: 'Aprovação Financeira',
              config: { approvers: ['Gerente Financeiro'] }
            }
          ],
          connections: [
            { id: 'conn_1', sourceNodeId: 'node_1', targetNodeId: 'node_2' },
            { id: 'conn_2', sourceNodeId: 'node_2', targetNodeId: 'node_3' }
          ],
          metadata: {}
        },
        hash: '',
        tags: ['contratos', 'jurídico', 'aprovação'],
        category: 'Jurídico',
        department: 'Legal'
      },
      {
        id: '1_v2',
        workflowId: '1',
        versionNumber: '2.0.0',
        versionName: 'Análise Aprimorada',
        status: 'published',
        lifecycle: {
          createdAt: new Date('2024-01-25'),
          createdBy: mockCurrentUser,
          publishedAt: new Date('2024-02-01'),
          publishedBy: mockCurrentUser
        },
        documentation: {
          changelog: {
            summary: 'Adicionada análise de risco e validação de dados sensíveis',
            detailedChanges: '# Versão 2.0.0\n\n## Mudanças\n- ✨ Nova etapa de análise de risco\n- ✨ Anonimização de dados sensíveis\n- 🔧 Melhorias na extração OCR\n- 📝 Logs detalhados de auditoria',
            breakingChanges: true,
            breakingChangesDescription: 'Adicionada etapa obrigatória de análise de risco que pode impactar documentos em processamento'
          },
          businessJustification: 'Necessidade de conformidade com LGPD e redução de riscos contratuais',
          technicalNotes: 'Integração com motor de análise de risco AI. Performance otimizada com cache.'
        },
        audit: {
          trail: [
            createAuditEvent(mockCurrentUser.id, mockCurrentUser.name, 'created', 'Nova versão criada com base na v1.0.0'),
            createAuditEvent(mockCurrentUser.id, mockCurrentUser.name, 'edited', 'Adicionados nós de análise de risco e anonimização'),
            createAuditEvent(mockCurrentUser.id, mockCurrentUser.name, 'published', 'Versão publicada após validação')
          ],
          relatedTickets: ['TICKET-123', 'TICKET-145'],
          impactAnalysis: {
            affectedDocuments: 245,
            affectedUsers: 12,
            affectedTeams: ['Jurídico', 'Financeiro']
          }
        },
        definition: {
          nodes: [
            {
              id: 'node_1',
              type: 'ocr',
              name: 'Extração de Texto',
              config: { language: 'pt-BR', dpi: 600, enhanceQuality: true }
            },
            {
              id: 'node_2',
              type: 'anonymization',
              name: 'Anonimização',
              config: { techniques: ['redaction', 'masking'], entities: ['CPF', 'CNPJ', 'Email'] }
            },
            {
              id: 'node_3',
              type: 'risk_analysis',
              name: 'Análise de Risco',
              config: { model: 'ai_risk_v2', threshold: 0.7 }
            },
            {
              id: 'node_4',
              type: 'validation',
              name: 'Análise Jurídica',
              config: { rules: ['clause_check', 'compliance', 'lgpd'] }
            },
            {
              id: 'node_5',
              type: 'approval',
              name: 'Aprovação Financeira',
              config: { approvers: ['Gerente Financeiro', 'Diretor'] }
            }
          ],
          connections: [
            { id: 'conn_1', sourceNodeId: 'node_1', targetNodeId: 'node_2' },
            { id: 'conn_2', sourceNodeId: 'node_2', targetNodeId: 'node_3' },
            { id: 'conn_3', sourceNodeId: 'node_3', targetNodeId: 'node_4' },
            { id: 'conn_4', sourceNodeId: 'node_4', targetNodeId: 'node_5' }
          ],
          metadata: { version: '2.0.0', lastModified: new Date('2024-02-01') }
        },
        hash: '',
        tags: ['contratos', 'jurídico', 'aprovação', 'lgpd', 'risco'],
        category: 'Jurídico',
        department: 'Legal'
      },
      {
        id: '1_v3',
        workflowId: '1',
        versionNumber: '2.1.0',
        status: 'draft',
        lifecycle: {
          createdAt: new Date('2024-10-25'),
          createdBy: mockCurrentUser
        },
        documentation: {
          changelog: {
            summary: 'Otimizações de performance e nova integração com sistema ERP',
            detailedChanges: '# Versão 2.1.0\n\n## Em desenvolvimento\n- 🚀 Otimização do processamento OCR\n- 🔗 Integração com ERP corporativo\n- 📊 Dashboard de métricas em tempo real',
            breakingChanges: false
          }
        },
        audit: {
          trail: [
            createAuditEvent(mockCurrentUser.id, mockCurrentUser.name, 'created', 'Nova versão em draft baseada na v2.0.0'),
            createAuditEvent(mockCurrentUser.id, mockCurrentUser.name, 'edited', 'Adicionada integração com ERP')
          ]
        },
        definition: {
          nodes: [
            {
              id: 'node_1',
              type: 'ocr',
              name: 'Extração de Texto',
              config: { language: 'pt-BR', dpi: 600, enhanceQuality: true, cacheEnabled: true }
            },
            {
              id: 'node_2',
              type: 'anonymization',
              name: 'Anonimização',
              config: { techniques: ['redaction', 'masking'], entities: ['CPF', 'CNPJ', 'Email'] }
            },
            {
              id: 'node_3',
              type: 'risk_analysis',
              name: 'Análise de Risco',
              config: { model: 'ai_risk_v2', threshold: 0.7 }
            },
            {
              id: 'node_4',
              type: 'validation',
              name: 'Análise Jurídica',
              config: { rules: ['clause_check', 'compliance', 'lgpd'] }
            },
            {
              id: 'node_5',
              type: 'erp_integration',
              name: 'Integração ERP',
              config: { system: 'SAP', endpoint: '/api/contracts', method: 'POST' }
            },
            {
              id: 'node_6',
              type: 'approval',
              name: 'Aprovação Financeira',
              config: { approvers: ['Gerente Financeiro', 'Diretor'] }
            }
          ],
          connections: [
            { id: 'conn_1', sourceNodeId: 'node_1', targetNodeId: 'node_2' },
            { id: 'conn_2', sourceNodeId: 'node_2', targetNodeId: 'node_3' },
            { id: 'conn_3', sourceNodeId: 'node_3', targetNodeId: 'node_4' },
            { id: 'conn_4', sourceNodeId: 'node_4', targetNodeId: 'node_5' },
            { id: 'conn_5', sourceNodeId: 'node_5', targetNodeId: 'node_6' }
          ],
          metadata: { version: '2.1.0', lastModified: new Date('2024-10-25') }
        },
        hash: '',
        tags: ['contratos', 'jurídico', 'aprovação', 'lgpd', 'risco', 'erp'],
        category: 'Jurídico',
        department: 'Legal'
      }
    ],
    createdAt: new Date('2024-01-10'),
    createdBy: mockCurrentUser,
    updatedAt: new Date('2024-10-25'),
    teams: ['Jurídico', 'Financeiro'],
    users: ['João Silva', 'Maria Santos', 'Pedro Costa'],
    status: 'Ativo'
  },
  {
    id: '2',
    name: 'Análise de Documentos Fiscais',
    description: 'Processamento automatizado de notas fiscais',
    currentVersionId: '2_v1',
    versions: [
      {
        id: '2_v1',
        workflowId: '2',
        versionNumber: '1.0.0',
        status: 'published',
        lifecycle: {
          createdAt: new Date('2024-01-05'),
          createdBy: mockCurrentUser,
          publishedAt: new Date('2024-01-10'),
          publishedBy: mockCurrentUser
        },
        documentation: {
          changelog: {
            summary: 'Workflow inicial para análise de NF-e',
            detailedChanges: '# Versão 1.0.0\n\n## Funcionalidades\n- Extração automática de dados fiscais\n- Validação contra SEFAZ\n- Categorização automática',
            breakingChanges: false
          },
          businessJustification: 'Reduzir tempo de processamento manual de notas fiscais de 2 horas para 5 minutos'
        },
        audit: {
          trail: [
            createAuditEvent(mockCurrentUser.id, mockCurrentUser.name, 'created', 'Versão inicial criada'),
            createAuditEvent(mockCurrentUser.id, mockCurrentUser.name, 'published', 'Workflow ativado em produção')
          ],
          impactAnalysis: {
            affectedDocuments: 0,
            affectedUsers: 0,
            affectedTeams: []
          }
        },
        definition: {
          nodes: [
            {
              id: 'node_1',
              type: 'ocr',
              name: 'Leitura de NF-e',
              config: { documentType: 'nfe', extractXML: true }
            },
            {
              id: 'node_2',
              type: 'validation',
              name: 'Validação SEFAZ',
              config: { checkDigitalSignature: true, validateWithSefaz: true }
            },
            {
              id: 'node_3',
              type: 'extraction',
              name: 'Extração de Dados',
              config: { fields: ['valor', 'cnpj', 'data', 'items'] }
            }
          ],
          connections: [
            { id: 'conn_1', sourceNodeId: 'node_1', targetNodeId: 'node_2' },
            { id: 'conn_2', sourceNodeId: 'node_2', targetNodeId: 'node_3' }
          ],
          metadata: {}
        },
        hash: '',
        tags: ['fiscal', 'nfe', 'contabilidade'],
        category: 'Fiscal',
        department: 'Financeiro'
      }
    ],
    createdAt: new Date('2024-01-05'),
    createdBy: mockCurrentUser,
    updatedAt: new Date('2024-01-10'),
    teams: ['Financeiro', 'Contabilidade'],
    users: ['Ana Maria', 'Carlos Oliveira'],
    status: 'Ativo'
  },
  {
    id: '3',
    name: 'Revisão de Políticas Internas',
    description: 'Workflow para revisão e atualização de políticas internas',
    currentVersionId: '3_v1',
    versions: [
      {
        id: '3_v1',
        workflowId: '3',
        versionNumber: '1.0.0',
        status: 'published',
        lifecycle: {
          createdAt: new Date('2024-02-01'),
          createdBy: mockCurrentUser,
          publishedAt: new Date('2024-02-01'),
          publishedBy: mockCurrentUser
        },
        documentation: {
          changelog: {
            summary: 'Versão inicial do workflow de revisão de políticas',
            detailedChanges: '# Versão 1.0.0\n\n## Funcionalidades\n- Análise de políticas existentes\n- Identificação de atualizações necessárias\n- Aprovação por RH e Jurídico',
            breakingChanges: false
          },
          businessJustification: 'Garantir que todas as políticas internas estejam atualizadas e em conformidade'
        },
        audit: {
          trail: [
            createAuditEvent(mockCurrentUser.id, mockCurrentUser.name, 'created', 'Workflow de políticas criado'),
            createAuditEvent(mockCurrentUser.id, mockCurrentUser.name, 'published', 'Workflow publicado')
          ],
          impactAnalysis: {
            affectedDocuments: 0,
            affectedUsers: 0,
            affectedTeams: []
          }
        },
        definition: {
          nodes: [
            {
              id: 'node_1',
              type: 'document_review',
              name: 'Revisão Inicial',
              config: { reviewers: ['RH'] }
            },
            {
              id: 'node_2',
              type: 'legal_check',
              name: 'Verificação Jurídica',
              config: { department: 'Jurídico' }
            },
            {
              id: 'node_3',
              type: 'approval',
              name: 'Aprovação Final',
              config: { approvers: ['Diretor RH', 'Gerente Jurídico'] }
            }
          ],
          connections: [
            { id: 'conn_1', sourceNodeId: 'node_1', targetNodeId: 'node_2' },
            { id: 'conn_2', sourceNodeId: 'node_2', targetNodeId: 'node_3' }
          ],
          metadata: {}
        },
        hash: '',
        tags: ['políticas', 'rh', 'compliance', 'jurídico'],
        category: 'RH',
        department: 'Recursos Humanos'
      }
    ],
    createdAt: new Date('2024-02-01'),
    createdBy: mockCurrentUser,
    updatedAt: new Date('2024-02-01'),
    teams: ['RH', 'Jurídico'],
    users: ['Fernanda Lima', 'Roberto Mendes'],
    status: 'Inativo'
  },
  {
    id: '4',
    name: 'Processamento de Relatórios',
    description: 'Workflow automatizado para geração de relatórios',
    currentVersionId: '4_v1',
    versions: [
      {
        id: '4_v1',
        workflowId: '4',
        versionNumber: '1.0.0',
        status: 'published',
        lifecycle: {
          createdAt: new Date('2024-01-20'),
          createdBy: mockCurrentUser,
          publishedAt: new Date('2024-01-20'),
          publishedBy: mockCurrentUser
        },
        documentation: {
          changelog: {
            summary: 'Sistema automatizado de coleta e processamento de relatórios',
            detailedChanges: '# Versão 1.0.0\n\n## Funcionalidades\n- Coleta automática de dados\n- Processamento e análise\n- Geração de relatórios formatados',
            breakingChanges: false
          },
          businessJustification: 'Automatizar o processo manual de criação de relatórios, economizando 10 horas por semana'
        },
        audit: {
          trail: [
            createAuditEvent(mockCurrentUser.id, mockCurrentUser.name, 'created', 'Workflow de relatórios criado'),
            createAuditEvent(mockCurrentUser.id, mockCurrentUser.name, 'published', 'Sistema de relatórios ativado')
          ],
          impactAnalysis: {
            affectedDocuments: 156,
            affectedUsers: 8,
            affectedTeams: ['Marketing', 'Desenvolvimento']
          }
        },
        definition: {
          nodes: [
            {
              id: 'node_1',
              type: 'data_collection',
              name: 'Coleta de Dados',
              config: { sources: ['database', 'api', 'spreadsheet'] }
            },
            {
              id: 'node_2',
              type: 'data_processing',
              name: 'Processamento',
              config: { operations: ['aggregate', 'filter', 'transform'] }
            },
            {
              id: 'node_3',
              type: 'report_generation',
              name: 'Geração de Relatório',
              config: { format: 'PDF', template: 'corporate' }
            }
          ],
          connections: [
            { id: 'conn_1', sourceNodeId: 'node_1', targetNodeId: 'node_2' },
            { id: 'conn_2', sourceNodeId: 'node_2', targetNodeId: 'node_3' }
          ],
          metadata: {}
        },
        hash: '',
        tags: ['relatórios', 'automação', 'analytics'],
        category: 'Relatórios',
        department: 'Marketing'
      }
    ],
    createdAt: new Date('2024-01-20'),
    createdBy: mockCurrentUser,
    updatedAt: new Date('2024-01-21'),
    teams: ['Marketing', 'Desenvolvimento'],
    users: ['Juliana Ferreira', 'Eduardo Santos', 'Marina Costa'],
    status: 'Ativo'
  },
  {
    id: '5',
    name: 'Validação de Certificados',
    description: 'Workflow para validação de certificados e documentos profissionais',
    currentVersionId: '5_v1',
    versions: [
      {
        id: '5_v1',
        workflowId: '5',
        versionNumber: '1.0.0',
        status: 'published',
        lifecycle: {
          createdAt: new Date('2024-01-25'),
          createdBy: mockCurrentUser,
          publishedAt: new Date('2024-01-25'),
          publishedBy: mockCurrentUser
        },
        documentation: {
          changelog: {
            summary: 'Sistema de validação automática de certificados profissionais',
            detailedChanges: '# Versão 1.0.0\n\n## Funcionalidades\n- Verificação de autenticidade de certificados\n- Validação de dados com órgãos emissores\n- Registro no sistema de RH',
            breakingChanges: false
          },
          businessJustification: 'Garantir conformidade com regulamentações e validar qualificações profissionais'
        },
        audit: {
          trail: [
            createAuditEvent(mockCurrentUser.id, mockCurrentUser.name, 'created', 'Workflow de certificados criado'),
            createAuditEvent(mockCurrentUser.id, mockCurrentUser.name, 'published', 'Sistema de validação ativado')
          ],
          impactAnalysis: {
            affectedDocuments: 45,
            affectedUsers: 3,
            affectedTeams: ['RH', 'Qualidade']
          }
        },
        definition: {
          nodes: [
            {
              id: 'node_1',
              type: 'ocr',
              name: 'Extração de Dados',
              config: { documentType: 'certificate', language: 'pt-BR' }
            },
            {
              id: 'node_2',
              type: 'validation',
              name: 'Verificação de Autenticidade',
              config: { checkDigitalSignature: true, verifyIssuer: true }
            },
            {
              id: 'node_3',
              type: 'storage',
              name: 'Registro no Sistema',
              config: { database: 'hr_system', table: 'certificates' }
            }
          ],
          connections: [
            { id: 'conn_1', sourceNodeId: 'node_1', targetNodeId: 'node_2' },
            { id: 'conn_2', sourceNodeId: 'node_2', targetNodeId: 'node_3' }
          ],
          metadata: {}
        },
        hash: '',
        tags: ['certificados', 'validação', 'rh', 'compliance'],
        category: 'RH',
        department: 'Recursos Humanos'
      }
    ],
    createdAt: new Date('2024-01-25'),
    createdBy: mockCurrentUser,
    updatedAt: new Date('2024-01-22'),
    teams: ['RH', 'Qualidade'],
    users: ['Luciana Oliveira'],
    status: 'Ativo'
  }
];

// Generate hashes for all versions
mockWorkflows.forEach(workflow => {
  workflow.versions.forEach(version => {
    version.hash = generateHash(version.definition);
  });
});

export function getWorkflowById(id: string): Workflow | undefined {
  return mockWorkflows.find(w => w.id === id);
}

export function getVersionById(workflowId: string, versionId: string): WorkflowVersion | undefined {
  const workflow = getWorkflowById(workflowId);
  return workflow?.versions.find(v => v.id === versionId);
}

export function getCurrentVersion(workflowId: string): WorkflowVersion | undefined {
  const workflow = getWorkflowById(workflowId);
  if (!workflow) return undefined;
  return workflow.versions.find(v => v.id === workflow.currentVersionId);
}

export function getDraftVersions(workflowId: string): WorkflowVersion[] {
  const workflow = getWorkflowById(workflowId);
  if (!workflow) return [];
  return workflow.versions.filter(v => v.status === 'draft');
}

export function getPublishedVersions(workflowId: string): WorkflowVersion[] {
  const workflow = getWorkflowById(workflowId);
  if (!workflow) return [];
  return workflow.versions.filter(v => v.status === 'published' || v.status === 'deprecated');
}
