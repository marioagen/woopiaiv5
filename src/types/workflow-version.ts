// Types for Workflow Versioning System - Phase 1 MVP

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  metadata: Record<string, any>;
}

export interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
  position?: { x: number; y: number };
}

export interface WorkflowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface ChangelogEntry {
  summary: string; // Required
  detailedChanges: string; // Markdown format
  breakingChanges: boolean;
  breakingChangesDescription?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: 'created' | 'edited' | 'published' | 'deprecated' | 'archived' | 'accessed' | 'cloned';
  details: string;
  ipAddress?: string;
  userAgent?: string;
  before?: any;
  after?: any;
  metadata?: Record<string, any>;
}

export interface WorkflowVersion {
  // Identification
  id: string;
  workflowId: string;
  versionNumber: string; // "1.0.0", "1.1.0", "2.0.0"
  versionName?: string;
  
  // Status and Lifecycle
  status: 'draft' | 'published' | 'deprecated' | 'archived';
  lifecycle: {
    createdAt: Date;
    createdBy: User;
    publishedAt?: Date;
    publishedBy?: User;
    deprecatedAt?: Date;
    deprecatedBy?: User;
    archivedAt?: Date;
    archivedBy?: User;
  };
  
  // Documentation (Required for Phase 1)
  documentation: {
    changelog: ChangelogEntry;
    businessJustification?: string;
    technicalNotes?: string;
  };
  
  // Audit Trail
  audit: {
    trail: AuditEvent[];
    relatedTickets?: string[];
    impactAnalysis?: {
      affectedDocuments: number;
      affectedUsers: number;
      affectedTeams: string[];
    };
  };
  
  // Technical Definition
  definition: WorkflowDefinition;
  hash: string; // MD5/SHA256 hash for integrity
  
  // Metadata
  tags: string[];
  category: string;
  department: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  currentVersionId: string; // ID of the published version
  versions: WorkflowVersion[];
  createdAt: Date;
  createdBy: User;
  updatedAt: Date;
  teams: string[];
  users: string[];
  status: 'Ativo' | 'Inativo';
}

// Helper type for version comparison
export interface VersionComparison {
  versionA: WorkflowVersion;
  versionB: WorkflowVersion;
  differences: {
    nodesAdded: WorkflowNode[];
    nodesRemoved: WorkflowNode[];
    nodesModified: {
      node: WorkflowNode;
      changes: string[];
    }[];
    connectionsAdded: WorkflowConnection[];
    connectionsRemoved: WorkflowConnection[];
  };
}

// Utility functions
export function generateVersionNumber(
  currentVersion: string,
  changeType: 'major' | 'minor' | 'patch'
): string {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  switch (changeType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return currentVersion;
  }
}

export function generateHash(data: any): string {
  // Simple hash function for MVP (in production, use crypto library)
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export function createAuditEvent(
  userId: string,
  userName: string,
  action: AuditEvent['action'],
  details: string,
  metadata?: Record<string, any>
): AuditEvent {
  return {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    userId,
    userName,
    action,
    details,
    metadata
  };
}
