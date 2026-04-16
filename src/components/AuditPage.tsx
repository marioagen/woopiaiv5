import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { 
  Search, 
  History, 
  User, 
  Users,
  Clock, 
  FileText,
  ShieldUser,
  Filter,
  Workflow,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  BarChart3,
  Activity,
  ChevronRight,
  Layers,
  ArrowUpDown,
  ChevronDown,
  Wrench,
  Settings2
} from 'lucide-react';
import { Separator } from './ui/separator';

// ============================================================
// TYPES
// ============================================================
interface HistoryEntry {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details: string;
  stage?: string;
}

interface WorkflowAssociation {
  workflow: string;
  workflowStage: string;
  history: HistoryEntry[];
}

interface DocumentData {
  name: string;
  workflows: WorkflowAssociation[];
}

// ============================================================
// MOCK DATA - Documentos e históricos (multi-esteira)
// ============================================================
const allDocumentsHistory: Record<string, DocumentData> = {
  '8021': {
    name: 'Nota Fiscal #8021',
    workflows: [{
      workflow: 'Processamento de Notas Fiscais',
      workflowStage: 'Verificação Financeira',
      history: [
        { id: '1', user: 'Ana Costa', action: 'Upload', timestamp: '2024-02-11 09:15:23', details: 'Documento carregado no sistema', stage: 'Recebimento' },
        { id: '2', user: 'Ana Costa', action: 'Atribuir', timestamp: '2024-02-11 09:16:10', details: 'Documento atribuído para Carlos Silva', stage: 'Recebimento' },
        { id: '3', user: 'Carlos Silva', action: 'Perguntar ao documento', timestamp: '2024-02-11 10:22:45', details: 'Pergunta: "Qual o valor total da nota fiscal?"', stage: 'Recebimento' },
        { id: '4', user: 'Carlos Silva', action: 'Editar resposta', timestamp: '2024-02-11 10:35:18', details: 'Campo "Valor Total" alterado de "R$ 4.500,00" para "R$ 4.967,89"', stage: 'Recebimento' },
        { id: '5', user: 'Pedro Oliveira', action: 'Avançar', timestamp: '2024-02-11 11:20:05', details: 'Documento avançado para "Verificação Financeira"', stage: 'Recebimento' },
        { id: '6', user: 'Ana Costa', action: 'Anonimizar', timestamp: '2024-02-11 11:45:30', details: 'Documento anonimizado com tipo "Mascaramento parcial" e prompt "LGPD — dados pessoais sensíveis"', stage: 'Verificação Financeira' }
      ]
    }]
  },
  '8022': {
    name: 'Nota Fiscal #8022',
    workflows: [{
      workflow: 'Processamento de Notas Fiscais',
      workflowStage: 'Aprovação de Pagamento',
      history: [
        { id: '1', user: 'Maria Santos', action: 'Upload', timestamp: '2024-02-10 14:30:12', details: 'Documento carregado no sistema', stage: 'Recebimento' },
        { id: '2', user: 'Maria Santos', action: 'Atribuir', timestamp: '2024-02-10 14:32:05', details: 'Documento atribuído para João Silva', stage: 'Recebimento' },
        { id: '3', user: 'João Silva', action: 'Perguntar ao documento', timestamp: '2024-02-10 15:10:33', details: 'Pergunta: "Quem é o fornecedor?"', stage: 'Verificação Financeira' },
        { id: '4', user: 'João Silva', action: 'Avançar', timestamp: '2024-02-10 15:45:20', details: 'Documento avançado para "Aprovação de Pagamento"', stage: 'Verificação Financeira' },
        { id: '5', user: 'Ricardo Torres', action: 'Reprovar', timestamp: '2024-02-10 16:20:15', details: 'Documento reprovado: "Dados do fornecedor inconsistentes"', stage: 'Aprovação de Pagamento' }
      ]
    }]
  },
  '5673': {
    name: 'Nota Fiscal #5673',
    workflows: [{
      workflow: 'Processamento de Notas Fiscais',
      workflowStage: 'Pagos e Conciliados',
      history: [
        { id: '1', user: 'Roberto Lima', action: 'Upload', timestamp: '2024-02-09 08:00:00', details: 'Documento carregado no sistema', stage: 'Recebimento' },
        { id: '2', user: 'Roberto Lima', action: 'Atribuir', timestamp: '2024-02-09 08:05:30', details: 'Documento atribuído para Ana Costa', stage: 'Recebimento' },
        { id: '3', user: 'Ana Costa', action: 'Editar resposta', timestamp: '2024-02-09 09:12:45', details: 'Campo "CNPJ" alterado', stage: 'Verificação Financeira' },
        { id: '4', user: 'Ana Costa', action: 'Avançar', timestamp: '2024-02-09 09:15:00', details: 'Documento avançado para "Pagos e Conciliados"', stage: 'Verificação Financeira' },
        { id: '5', user: 'Pedro Oliveira', action: 'Finalizar', timestamp: '2024-02-09 10:30:22', details: 'Documento finalizado com sucesso', stage: 'Pagos e Conciliados' }
      ]
    }]
  },
  '2345': {
    name: 'Boleto #2345',
    workflows: [{
      workflow: 'Análise Jurídica de Contratos',
      workflowStage: 'Protocolo',
      history: [
        { id: '1', user: 'João Ferreira', action: 'Upload', timestamp: '2024-02-08 11:20:00', details: 'Documento carregado no sistema', stage: 'Protocolo' },
        { id: '2', user: 'João Ferreira', action: 'Deletar', timestamp: '2024-02-08 11:25:15', details: 'Documento deletado: "Upload duplicado"', stage: 'Protocolo' }
      ]
    }]
  },
  'HR001': {
    name: 'Contrato João Silva',
    workflows: [
      {
        workflow: 'Gestão de Documentos RH',
        workflowStage: 'Validação Documentos',
        history: [
          { id: '1', user: 'Fernanda Alves', action: 'Upload', timestamp: '2024-02-12 08:30:00', details: 'Documento carregado no sistema', stage: 'Triagem Inicial' },
          { id: '2', user: 'Fernanda Alves', action: 'Atribuir', timestamp: '2024-02-12 08:35:00', details: 'Documento atribuído para Luciana Melo', stage: 'Triagem Inicial' },
          { id: '3', user: 'Luciana Melo', action: 'Avançar', timestamp: '2024-02-12 10:15:00', details: 'Documento avançado para "Validação Documentos"', stage: 'Triagem Inicial' },
          { id: '4', user: 'Luciana Melo', action: 'Perguntar ao documento', timestamp: '2024-02-12 10:45:00', details: 'Pergunta: "Qual a data de admissão?"', stage: 'Validação Documentos' }
        ]
      },
      {
        workflow: 'Análise Jurídica de Contratos',
        workflowStage: 'Análise Jurídica',
        history: [
          { id: '1', user: 'João Ferreira', action: 'Upload', timestamp: '2024-02-12 11:00:00', details: 'Documento encaminhado para análise jurídica', stage: 'Protocolo' },
          { id: '2', user: 'Dra. Mariana Costa', action: 'Avançar', timestamp: '2024-02-12 14:30:00', details: 'Documento avançado para "Análise Jurídica"', stage: 'Protocolo' },
          { id: '3', user: 'Dra. Mariana Costa', action: 'Perguntar ao documento', timestamp: '2024-02-12 15:00:00', details: 'Pergunta: "Existem cláusulas de não-competição?"', stage: 'Análise Jurídica' }
        ]
      }
    ]
  },
  'HR002': {
    name: 'Atestado Médico #102',
    workflows: [{
      workflow: 'Gestão de Documentos RH',
      workflowStage: 'Aprovação Gestor',
      history: [
        { id: '1', user: 'Carlos Mendes', action: 'Upload', timestamp: '2024-02-11 07:45:00', details: 'Documento carregado no sistema', stage: 'Triagem Inicial' },
        { id: '2', user: 'Fernanda Alves', action: 'Avançar', timestamp: '2024-02-11 09:00:00', details: 'Documento avançado para "Validação Documentos"', stage: 'Triagem Inicial' },
        { id: '3', user: 'Luciana Melo', action: 'Editar resposta', timestamp: '2024-02-11 11:30:00', details: 'Campo "CID" preenchido', stage: 'Validação Documentos' },
        { id: '4', user: 'Luciana Melo', action: 'Avançar', timestamp: '2024-02-11 11:35:00', details: 'Documento avançado para "Aprovação Gestor"', stage: 'Validação Documentos' },
        { id: '5', user: 'Ricardo Torres', action: 'Perguntar ao documento', timestamp: '2024-02-11 14:20:00', details: 'Pergunta: "Quantos dias de afastamento?"', stage: 'Aprovação Gestor' }
      ]
    }]
  },
  'JUR001': {
    name: 'Contrato Fornecedor TechCorp',
    workflows: [
      {
        workflow: 'Análise Jurídica de Contratos',
        workflowStage: 'Análise Jurídica',
        history: [
          { id: '1', user: 'João Ferreira', action: 'Upload', timestamp: '2024-02-10 09:00:00', details: 'Documento carregado no sistema', stage: 'Protocolo' },
          { id: '2', user: 'João Ferreira', action: 'Atribuir', timestamp: '2024-02-10 09:05:00', details: 'Documento atribuído para Dra. Mariana Costa', stage: 'Protocolo' },
          { id: '3', user: 'Dra. Mariana Costa', action: 'Avançar', timestamp: '2024-02-10 10:30:00', details: 'Documento avançado para "Análise Jurídica"', stage: 'Protocolo' },
          { id: '4', user: 'Dra. Mariana Costa', action: 'Perguntar ao documento', timestamp: '2024-02-10 14:00:00', details: 'Pergunta: "Existem cláusulas de rescisão antecipada?"', stage: 'Análise Jurídica' },
          { id: '5', user: 'Dra. Mariana Costa', action: 'Editar resposta', timestamp: '2024-02-10 15:30:00', details: 'Campo "Cláusulas de Risco" atualizado com 3 itens', stage: 'Análise Jurídica' },
          { id: '6', user: 'Dra. Mariana Costa', action: 'Anonimizar', timestamp: '2024-02-10 16:05:00', details: 'Documento anonimizado com tipo "Dados fictícios" e prompt "Jurídico — partes e contratos" na esteira "Análise Jurídica de Contratos"', stage: 'Análise Jurídica' }
        ]
      },
      {
        workflow: 'Processamento de Notas Fiscais',
        workflowStage: 'Recebimento',
        history: [
          { id: '1', user: 'Ana Costa', action: 'Upload', timestamp: '2024-02-11 08:00:00', details: 'Contrato vinculado para verificação de valores', stage: 'Recebimento' },
          { id: '2', user: 'Ana Costa', action: 'Perguntar ao documento', timestamp: '2024-02-11 08:30:00', details: 'Pergunta: "Qual o valor mensal do contrato?"', stage: 'Recebimento' },
          { id: '3', user: 'Carlos Silva', action: 'Editar resposta', timestamp: '2024-02-11 09:15:00', details: 'Campo "Valor Contratual" atualizado para "R$ 25.000,00/mês"', stage: 'Recebimento' }
        ]
      }
    ]
  },
  'AUDIT-01': {
    name: 'Relatório de Auditoria Interna #2024',
    workflows: [{
      workflow: 'Análise Jurídica de Contratos',
      workflowStage: 'Aprovado',
      history: [
        { id: '1', user: 'Dra. Mariana Costa', action: 'Upload', timestamp: '2024-02-13 08:00:00', details: 'Documento carregado no sistema para análise interna', stage: 'Protocolo' },
        { id: '2', user: 'Dra. Mariana Costa', action: 'Atribuir', timestamp: '2024-02-13 08:10:00', details: 'Documento atribuído para Dr. Paulo Santos', stage: 'Protocolo' },
        { id: '3', user: 'Ana Costa', action: 'Reprovar', timestamp: '2024-02-13 10:00:00', details: 'Documento reprovado: "Valores divergentes com relatório anterior"', stage: 'Análise Jurídica' },
        { id: '4', user: 'Dra. Mariana Costa', action: 'Reprovar', timestamp: '2024-02-13 11:30:00', details: 'Documento reprovado: "Assinatura do responsável ausente"', stage: 'Análise Jurídica' },
        { id: '5', user: 'Ana Costa', action: 'Deletar', timestamp: '2024-02-13 14:00:00', details: 'Documento deletado: "Versão desatualizada substituída por revisão"', stage: 'Protocolo' },
        { id: '6', user: 'Dra. Mariana Costa', action: 'Deletar', timestamp: '2024-02-13 14:30:00', details: 'Documento deletado: "Duplicata identificada"', stage: 'Protocolo' },
      ]
    }]
  },
  'AUDIT-02': {
    name: 'Declaração de Conformidade #77',
    workflows: [{
      workflow: 'Processamento de Notas Fiscais',
      workflowStage: 'Pagos e Conciliados',
      history: [
        { id: '1', user: 'Dra. Mariana Costa', action: 'Upload', timestamp: '2024-02-14 09:00:00', details: 'Declaração de conformidade carregada para validação financeira', stage: 'Recebimento' },
        { id: '2', user: 'Dra. Mariana Costa', action: 'Atribuir', timestamp: '2024-02-14 09:15:00', details: 'Documento atribuído para Ana Costa', stage: 'Recebimento' },
        { id: '3', user: 'Ana Costa', action: 'Finalizar', timestamp: '2024-02-14 16:00:00', details: 'Declaração finalizada após conferência de valores e assinaturas', stage: 'Pagos e Conciliados' },
        { id: '4', user: 'Dra. Mariana Costa', action: 'Finalizar', timestamp: '2024-02-14 16:45:00', details: 'Processo encerrado com parecer jurídico favorável', stage: 'Pagos e Conciliados' },
      ]
    }]
  },
  'JUR002': {
    name: 'Aditivo Contratual #45',
    workflows: [
      {
        workflow: 'Análise Jurídica de Contratos',
        workflowStage: 'Aprovado',
        history: [
          { id: '1', user: 'João Ferreira', action: 'Upload', timestamp: '2024-02-07 08:00:00', details: 'Documento carregado no sistema', stage: 'Protocolo' },
          { id: '2', user: 'Dra. Mariana Costa', action: 'Avançar', timestamp: '2024-02-07 10:00:00', details: 'Documento avançado para "Análise Jurídica"', stage: 'Protocolo' },
          { id: '3', user: 'Dra. Mariana Costa', action: 'Avançar', timestamp: '2024-02-07 16:00:00', details: 'Documento avançado para "Elaboração Parecer"', stage: 'Análise Jurídica' },
          { id: '4', user: 'Dr. Paulo Santos', action: 'Avançar', timestamp: '2024-02-08 09:00:00', details: 'Parecer aprovado, documento avançado para "Aprovado"', stage: 'Elaboração Parecer' },
          { id: '5', user: 'Dr. Paulo Santos', action: 'Finalizar', timestamp: '2024-02-08 09:05:00', details: 'Documento finalizado com parecer favorável', stage: 'Aprovado' }
        ]
      },
      {
        workflow: 'Gestão de Documentos RH',
        workflowStage: 'Processados',
        history: [
          { id: '1', user: 'Fernanda Alves', action: 'Upload', timestamp: '2024-02-08 10:00:00', details: 'Aditivo encaminhado para arquivamento no RH', stage: 'Triagem Inicial' },
          { id: '2', user: 'Fernanda Alves', action: 'Avançar', timestamp: '2024-02-08 10:15:00', details: 'Documento avançado para "Processados"', stage: 'Triagem Inicial' },
          { id: '3', user: 'Luciana Melo', action: 'Finalizar', timestamp: '2024-02-08 11:00:00', details: 'Aditivo arquivado no dossiê do colaborador', stage: 'Processados' }
        ]
      }
    ]
  }
};

// ============================================================
// MOCK DATA - Esteiras (Workflows)
// ============================================================
interface WorkflowAuditData {
  id: string;
  name: string;
  team: string;
  stages: string[];
  createdAt: string;
  createdBy: string;
}

const workflowsAuditData: WorkflowAuditData[] = [
  {
    id: 'wf-financeiro',
    name: 'Processamento de Notas Fiscais',
    team: 'Time Financeiro',
    stages: ['Recebimento', 'Verificação Financeira', 'Aprovação de Pagamento', 'Pagos e Conciliados'],
    createdAt: '2024-01-15 10:00:00',
    createdBy: 'Admin Sistema'
  },
  {
    id: 'wf-rh',
    name: 'Gestão de Documentos RH',
    team: 'Time RH',
    stages: ['Triagem Inicial', 'Validação Documentos', 'Aprovação Gestor', 'Processados'],
    createdAt: '2024-01-20 14:00:00',
    createdBy: 'Admin Sistema'
  },
  {
    id: 'wf-juridico',
    name: 'Análise Jurídica de Contratos',
    team: 'Time Jurídico',
    stages: ['Protocolo', 'Análise Jurídica', 'Elaboração Parecer', 'Aprovado'],
    createdAt: '2024-01-25 09:00:00',
    createdBy: 'Admin Sistema'
  }
];

// ============================================================
// MOCK DATA - Ações de sistema (ferramentas e esteiras)
// ============================================================
interface SystemAuditEntry {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details: string;
  resourceType: 'ferramenta' | 'esteira';
  resourceName: string;
}

const systemAuditEntries: SystemAuditEntry[] = [
  { id: 'sys-001', user: 'João Silva', action: 'Criar ferramenta', timestamp: '2024-02-12 16:30:00', details: 'Criou a ferramenta "Extrator de CNPJ"', resourceType: 'ferramenta', resourceName: 'Extrator de CNPJ' },
  { id: 'sys-002', user: 'João Silva', action: 'Editar ferramenta', timestamp: '2024-02-12 17:15:00', details: 'Editou a ferramenta "Extrator de CNPJ" — alterou prompt de instrução', resourceType: 'ferramenta', resourceName: 'Extrator de CNPJ' },
  { id: 'sys-003', user: 'Ana Costa', action: 'Criar ferramenta', timestamp: '2024-02-11 10:00:00', details: 'Criou a ferramenta "Classificador de Documentos"', resourceType: 'ferramenta', resourceName: 'Classificador de Documentos' },
  { id: 'sys-004', user: 'Ana Costa', action: 'Editar ferramenta', timestamp: '2024-02-11 14:20:00', details: 'Editou a ferramenta "Classificador de Documentos" — adicionou novo tipo de documento', resourceType: 'ferramenta', resourceName: 'Classificador de Documentos' },
  { id: 'sys-005', user: 'Carlos Silva', action: 'Excluir ferramenta', timestamp: '2024-02-10 11:45:00', details: 'Excluiu a ferramenta "Validador de CPF v1" — substituída por versão atualizada', resourceType: 'ferramenta', resourceName: 'Validador de CPF v1' },
  { id: 'sys-006', user: 'Pedro Oliveira', action: 'Criar ferramenta', timestamp: '2024-02-09 09:30:00', details: 'Criou a ferramenta "Resumo Automático de Contratos"', resourceType: 'ferramenta', resourceName: 'Resumo Automático de Contratos' },
  { id: 'sys-007', user: 'Maria Santos', action: 'Editar ferramenta', timestamp: '2024-02-08 16:00:00', details: 'Editou a ferramenta "Resumo Automático de Contratos" — ajustou parâmetros de temperatura', resourceType: 'ferramenta', resourceName: 'Resumo Automático de Contratos' },
  { id: 'sys-008', user: 'Fernanda Alves', action: 'Criar ferramenta', timestamp: '2024-02-07 08:45:00', details: 'Criou a ferramenta "Extrator de Dados RH"', resourceType: 'ferramenta', resourceName: 'Extrator de Dados RH' },
  { id: 'sys-009', user: 'Roberto Lima', action: 'Excluir ferramenta', timestamp: '2024-02-06 15:30:00', details: 'Excluiu a ferramenta "Parser de XML Legado" — funcionalidade descontinuada', resourceType: 'ferramenta', resourceName: 'Parser de XML Legado' },
  { id: 'sys-010', user: 'João Silva', action: 'Criar esteira', timestamp: '2024-02-12 08:00:00', details: 'Criou a esteira "Onboarding de Fornecedores" com 5 etapas', resourceType: 'esteira', resourceName: 'Onboarding de Fornecedores' },
  { id: 'sys-011', user: 'João Silva', action: 'Editar esteira', timestamp: '2024-02-12 10:30:00', details: 'Editou a esteira "Onboarding de Fornecedores" — adicionou etapa "Validação Fiscal"', resourceType: 'esteira', resourceName: 'Onboarding de Fornecedores' },
  { id: 'sys-012', user: 'Ana Costa', action: 'Editar esteira', timestamp: '2024-02-11 11:00:00', details: 'Editou a esteira "Processamento de Notas Fiscais" — renomeou etapa "Conferência" para "Verificação Financeira"', resourceType: 'esteira', resourceName: 'Processamento de Notas Fiscais' },
  { id: 'sys-013', user: 'Dra. Mariana Costa', action: 'Criar esteira', timestamp: '2024-02-10 08:30:00', details: 'Criou a esteira "Revisão de Contratos Internacionais" com 4 etapas', resourceType: 'esteira', resourceName: 'Revisão de Contratos Internacionais' },
  { id: 'sys-014', user: 'Fernanda Alves', action: 'Editar esteira', timestamp: '2024-02-09 14:00:00', details: 'Editou a esteira "Gestão de Documentos RH" — reordenou etapas de aprovação', resourceType: 'esteira', resourceName: 'Gestão de Documentos RH' },
  { id: 'sys-015', user: 'Ricardo Torres', action: 'Excluir esteira', timestamp: '2024-02-08 17:00:00', details: 'Excluiu a esteira "Fluxo Temporário de Auditoria" — processo finalizado', resourceType: 'esteira', resourceName: 'Fluxo Temporário de Auditoria' },
  { id: 'sys-016', user: 'Carlos Mendes', action: 'Criar esteira', timestamp: '2024-02-07 10:00:00', details: 'Criou a esteira "Admissão de Colaboradores" com 6 etapas', resourceType: 'esteira', resourceName: 'Admissão de Colaboradores' },
  { id: 'sys-017', user: 'Pedro Oliveira', action: 'Editar esteira', timestamp: '2024-02-06 16:45:00', details: 'Editou a esteira "Processamento de Notas Fiscais" — adicionou campo obrigatório na etapa de Recebimento', resourceType: 'esteira', resourceName: 'Processamento de Notas Fiscais' },
  { id: 'sys-018', user: 'Luciana Melo', action: 'Criar ferramenta', timestamp: '2024-02-05 09:15:00', details: 'Criou a ferramenta "Validador de Atestados Médicos"', resourceType: 'ferramenta', resourceName: 'Validador de Atestados Médicos' },
  { id: 'sys-019', user: 'Dr. Paulo Santos', action: 'Editar esteira', timestamp: '2024-02-04 14:30:00', details: 'Editou a esteira "Análise Jurídica de Contratos" — adicionou etapa "Parecer Técnico"', resourceType: 'esteira', resourceName: 'Análise Jurídica de Contratos' },
  { id: 'sys-020', user: 'João Ferreira', action: 'Excluir ferramenta', timestamp: '2024-02-03 11:00:00', details: 'Excluiu a ferramenta "Gerador de Minutas v2" — migrada para nova versão', resourceType: 'ferramenta', resourceName: 'Gerador de Minutas v2' },
  { id: 'sys-021', user: 'Ana Costa', action: 'Excluir ferramenta', timestamp: '2024-02-14 10:00:00', details: 'Excluiu a ferramenta "Extrator de Dados Legado" — substituída pela versão 3.0', resourceType: 'ferramenta', resourceName: 'Extrator de Dados Legado' },
  { id: 'sys-022', user: 'Ana Costa', action: 'Criar esteira', timestamp: '2024-02-14 11:00:00', details: 'Criou a esteira "Conciliação Bancária Automática" com 4 etapas', resourceType: 'esteira', resourceName: 'Conciliação Bancária Automática' },
  { id: 'sys-023', user: 'Ana Costa', action: 'Excluir esteira', timestamp: '2024-02-14 17:30:00', details: 'Excluiu a esteira "Fluxo de Testes Financeiros" — processo piloto encerrado', resourceType: 'esteira', resourceName: 'Fluxo de Testes Financeiros' },
  { id: 'sys-024', user: 'Dra. Mariana Costa', action: 'Criar ferramenta', timestamp: '2024-02-15 09:00:00', details: 'Criou a ferramenta "Analisador de Risco Contratual"', resourceType: 'ferramenta', resourceName: 'Analisador de Risco Contratual' },
  { id: 'sys-025', user: 'Dra. Mariana Costa', action: 'Editar ferramenta', timestamp: '2024-02-15 10:30:00', details: 'Editou a ferramenta "Analisador de Risco Contratual" — adicionou cláusulas de rescisão ao modelo', resourceType: 'ferramenta', resourceName: 'Analisador de Risco Contratual' },
  { id: 'sys-026', user: 'Dra. Mariana Costa', action: 'Excluir ferramenta', timestamp: '2024-02-15 14:00:00', details: 'Excluiu a ferramenta "Parser de Contratos v1" — descontinuada após migração', resourceType: 'ferramenta', resourceName: 'Parser de Contratos v1' },
  { id: 'sys-027', user: 'Dra. Mariana Costa', action: 'Editar esteira', timestamp: '2024-02-15 15:30:00', details: 'Editou a esteira "Análise Jurídica de Contratos" — inseriu etapa de revisão obrigatória', resourceType: 'esteira', resourceName: 'Análise Jurídica de Contratos' },
  { id: 'sys-028', user: 'Dra. Mariana Costa', action: 'Excluir esteira', timestamp: '2024-02-15 17:00:00', details: 'Excluiu a esteira "Análise Jurídica Simplificada" — processo descontinuado por mudança regulatória', resourceType: 'esteira', resourceName: 'Análise Jurídica Simplificada' },
];

// ============================================================
// HELPER - Shared action badge styles
// ============================================================
const getActionBadgeClass = (action: string) => {
  switch (action) {
    case 'Upload': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
    case 'Atribuir': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300';
    case 'Avançar': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
    case 'Editar resposta': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300';
    case 'Reprovar': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
    case 'Finalizar': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
    case 'Deletar': return 'bg-gray-100 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300';
    case 'Perguntar ao documento': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300';
    case 'Criar ferramenta': return 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300';
    case 'Editar ferramenta': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
    case 'Excluir ferramenta': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300';
    case 'Criar esteira': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300';
    case 'Editar esteira': return 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300';
    case 'Excluir esteira': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300';
    case 'Anonimizar': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300';
  }
};

// Helper to get total history count across all workflows for a document
const getTotalHistoryCount = (doc: DocumentData) => {
  return doc.workflows.reduce((sum, wf) => sum + wf.history.length, 0);
};

// Helper to determine if a document is finalized (all workflows have a "Finalizar" action)
const getDocumentStatus = (doc: DocumentData): 'Finalizado' | 'Ativo' => {
  if (doc.workflows.length === 0) return 'Ativo';
  const allFinalized = doc.workflows.every(wf =>
    wf.history.some(h => h.action === 'Finalizar')
  );
  return allFinalized ? 'Finalizado' : 'Ativo';
};

// ============================================================
// TAB: Documentos
// ============================================================
function DocumentsAuditTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedWorkflowIndex, setSelectedWorkflowIndex] = useState<number | null>(null);
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [docHistorySortOrder, setDocHistorySortOrder] = useState<'newest' | 'oldest'>('newest');
  const [docHistorySearch, setDocHistorySearch] = useState('');

  const filteredDocuments = Object.entries(allDocumentsHistory).filter(([id, doc]) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesWorkflow = doc.workflows.some(
      wf => wf.workflow.toLowerCase().includes(searchLower) || wf.workflowStage.toLowerCase().includes(searchLower)
    );
    const matchesSearch = (
      id.toLowerCase().includes(searchLower) ||
      doc.name.toLowerCase().includes(searchLower) ||
      matchesWorkflow
    );
    const docStatus = getDocumentStatus(doc);
    const matchesStatus = statusFilter === 'all' || docStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedDoc = selectedDocument ? allDocumentsHistory[selectedDocument] : null;
  const hasMultipleWorkflows = selectedDoc ? selectedDoc.workflows.length > 1 : false;
  const selectedWorkflow = selectedDoc && selectedWorkflowIndex !== null
    ? selectedDoc.workflows[selectedWorkflowIndex]
    : null;

  const filteredHistory = useMemo(() => {
    if (!selectedWorkflow) return [];
    const searchLower = docHistorySearch.toLowerCase();
    const filtered = selectedWorkflow.history.filter(entry => {
      const matchesAction = actionFilter === 'all' || entry.action === actionFilter;
      const matchesSearch = !docHistorySearch ||
        entry.user.toLowerCase().includes(searchLower) ||
        entry.details.toLowerCase().includes(searchLower) ||
        entry.action.toLowerCase().includes(searchLower) ||
        (entry.stage && entry.stage.toLowerCase().includes(searchLower));
      return matchesAction && matchesSearch;
    });
    return filtered.sort((a, b) => {
      return docHistorySortOrder === 'newest'
        ? b.timestamp.localeCompare(a.timestamp)
        : a.timestamp.localeCompare(b.timestamp);
    });
  }, [selectedWorkflow, actionFilter, docHistorySearch, docHistorySortOrder]);

  const handleDocumentClick = (id: string) => {
    const doc = allDocumentsHistory[id];
    setSelectedDocument(id);
    setActionFilter('all');
    setDocHistorySearch('');
    setDocHistorySortOrder('newest');
    // If only one workflow, auto-select it
    if (doc.workflows.length === 1) {
      setSelectedWorkflowIndex(0);
    } else {
      setSelectedWorkflowIndex(null);
    }
  };

  const handleWorkflowSelect = (index: number) => {
    setSelectedWorkflowIndex(index);
    setActionFilter('all');
    setDocHistorySearch('');
    setDocHistorySortOrder('newest');
  };

  const handleBackToWorkflowSelection = () => {
    setSelectedWorkflowIndex(null);
    setActionFilter('all');
    setDocHistorySearch('');
    setDocHistorySortOrder('newest');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - search & list */}
      <div className="lg:col-span-1 lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-120px)]">
        <Card className="border border-woopi-ai-border h-full flex flex-col max-h-[inherit]">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="w-4 h-4" />
              Buscar Documento
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0 space-y-4">
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-woopi-ai-gray" />
              <Input
                type="text"
                placeholder="ID, nome do documento ou esteira..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border border-woopi-ai-border"
              />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Filter className="w-4 h-4 text-woopi-ai-gray flex-shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 text-sm border border-woopi-ai-border rounded-md px-2 py-1.5 bg-white dark:bg-[#292f4c] dark:text-[#d5d8e0]"
              >
                <option value="all">Todos os status</option>
                <option value="Ativo">Ativo</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>
            <Separator className="flex-shrink-0" />
            <div className="space-y-2 flex-1 overflow-y-auto">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map(([id, doc]) => {
                  const isMulti = doc.workflows.length > 1;
                  const docStatus = getDocumentStatus(doc);
                  return (
                    <button
                      key={id}
                      onClick={() => handleDocumentClick(id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedDocument === id
                          ? 'border-woopi-ai-blue bg-blue-50 dark:bg-blue-900/20'
                          : 'border-woopi-ai-border hover:bg-gray-50 dark:hover:bg-[#2d3354]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-woopi-ai-gray flex-shrink-0" />
                        <span className="font-medium text-sm text-woopi-ai-dark-gray truncate">
                          {doc.name}
                        </span>
                        <Badge className={`text-[10px] px-1.5 py-0 flex-shrink-0 ${
                          docStatus === 'Finalizado'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                        }`}>
                          {docStatus}
                        </Badge>
                        {isMulti && (
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] px-1.5 py-0 flex items-center gap-0.5 flex-shrink-0">
                            <Layers className="w-3 h-3" />
                            {doc.workflows.length}
                          </Badge>
                        )}
                      </div>
                      {/* Workflow badges */}
                      <div className="flex flex-col gap-1 mb-1.5">
                        {doc.workflows.map((wf, idx) => (
                          <div key={`${id}-wf-${idx}`} className="flex items-center gap-1.5">
                            <Workflow className="w-3.5 h-3.5 text-[#0073ea] flex-shrink-0" />
                            <span className="text-xs text-[#0073ea] font-medium truncate">
                              {wf.workflow}
                            </span>
                            <span className="text-gray-400 dark:text-[#7a7f9d] mx-0.5">&middot;</span>
                            <span className="text-xs text-gray-500 dark:text-[#9196b0] truncate">
                              {wf.workflowStage}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-woopi-ai-gray">
                        {getTotalHistoryCount(doc)} {getTotalHistoryCount(doc) === 1 ? 'alteração' : 'alterações'}
                        {isMulti && (
                          <span className="text-amber-600 ml-1">• {doc.workflows.length} esteiras</span>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-woopi-ai-gray text-sm">
                  Nenhum documento encontrado
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right column - workflow selector or history */}
      <div className="lg:col-span-2">
        {selectedDoc && hasMultipleWorkflows && selectedWorkflowIndex === null ? (
          /* ---- Workflow Selector (intermediate step) ---- */
          <Card className="border border-woopi-ai-border flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                Selecionar Esteira
              </CardTitle>
              <p className="text-sm text-woopi-ai-gray mt-1">
                Este documento participa de <span className="font-semibold text-woopi-ai-dark-gray">{selectedDoc.workflows.length} esteiras</span> diferentes. Selecione qual deseja visualizar.
              </p>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              {/* Document info card */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1f2132] rounded-lg border border-woopi-ai-border mb-5">
                <div className="w-10 h-10 rounded-lg bg-[#0073ea]/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-[#0073ea]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-woopi-ai-dark-gray">{selectedDoc.name}</h4>
                  <p className="text-xs text-woopi-ai-gray">
                    {getTotalHistoryCount(selectedDoc)} alterações no total
                  </p>
                </div>
              </div>

              {/* Workflow options */}
              <div className="space-y-3">
                {selectedDoc.workflows.map((wf, idx) => {
                  const finalized = wf.history.some(h => h.action === 'Finalizar');
                  const rejected = wf.history.some(h => h.action === 'Reprovar');
                  const lastAction = wf.history[wf.history.length - 1];
                  return (
                    <button
                      key={`wf-option-${idx}`}
                      onClick={() => handleWorkflowSelect(idx)}
                      className="w-full text-left p-4 rounded-xl border-2 border-woopi-ai-border hover:border-[#0073ea] hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0073ea]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0073ea]/20 transition-colors">
                          <Workflow className="w-5 h-5 text-[#0073ea]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-woopi-ai-dark-gray text-sm">
                              {wf.workflow}
                            </h4>
                            {finalized && (
                              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] px-1.5 py-0">
                                Finalizado
                              </Badge>
                            )}
                            {rejected && (
                              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-[10px] px-1.5 py-0">
                                Reprovado
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300 text-[10px] px-1.5 py-0 font-normal">
                              Etapa: {wf.workflowStage}
                            </Badge>
                            <span className="text-xs text-woopi-ai-gray">
                              {wf.history.length} {wf.history.length === 1 ? 'evento' : 'eventos'}
                            </span>
                          </div>
                          {lastAction && (
                            <div className="flex items-center gap-2 text-xs text-woopi-ai-gray">
                              <Clock className="w-3 h-3" />
                              <span>Última ação: {lastAction.action} por {lastAction.user}</span>
                              <span className="text-gray-300 dark:text-[#7a7f9d]">•</span>
                              <span>{lastAction.timestamp}</span>
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 dark:text-[#7a7f9d] group-hover:text-[#0073ea] transition-colors flex-shrink-0 mt-2" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : selectedDoc && selectedWorkflow ? (
          /* ---- History panel ---- */
          <Card className="border border-woopi-ai-border flex flex-col">
            <CardHeader className="flex-shrink-0 pb-3">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {hasMultipleWorkflows && (
                      <button
                        onClick={handleBackToWorkflowSelection}
                        className="flex items-center gap-1.5 text-xs text-[#0073ea] hover:text-[#005bb5] mb-2 transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Voltar para seleção de esteira
                      </button>
                    )}
                    <CardTitle className="text-lg flex items-center gap-2">
                      <History className="w-4 h-4" />
                      Histórico - {selectedDoc.name}
                      <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300 text-[10px] ml-1">{filteredHistory.length}</Badge>
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge className="bg-[#0073ea]/10 text-[#0073ea] text-xs px-2 py-0.5 font-normal flex items-center gap-1">
                        <Workflow className="w-3 h-3" />
                        {selectedWorkflow.workflow}
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300 text-xs px-2 py-0.5 font-normal">
                        {selectedWorkflow.workflowStage}
                      </Badge>
                      {hasMultipleWorkflows && (
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] px-1.5 py-0 flex items-center gap-0.5">
                          <Layers className="w-3 h-3" />
                          {selectedDoc.workflows.length} esteiras
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                    <button
                      onClick={() => setDocHistorySortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                      className="flex items-center gap-1.5 text-xs border border-woopi-ai-border rounded-md px-2.5 py-1.5 hover:bg-gray-50 dark:hover:bg-[#2d3354] transition-colors bg-white dark:bg-[#292f4c]"
                      title={docHistorySortOrder === 'newest' ? 'Mais recentes primeiro' : 'Mais antigos primeiro'}
                    >
                      <ArrowUpDown className="w-3.5 h-3.5 text-woopi-ai-gray" />
                      <span className="text-woopi-ai-gray">{docHistorySortOrder === 'newest' ? 'Mais recentes' : 'Mais antigos'}</span>
                    </button>
                    <div className="flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-woopi-ai-gray" />
                      <select
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                        className="text-xs border border-woopi-ai-border rounded-md px-2 py-1.5 bg-white dark:bg-[#292f4c] dark:text-[#d5d8e0]"
                      >
                        <option value="all">Todas as ações</option>
                        <option value="Upload">Upload</option>
                        <option value="Atribuir">Atribuir</option>
                        <option value="Avançar">Avançar</option>
                        <option value="Editar resposta">Editar resposta</option>
                        <option value="Reprovar">Reprovar</option>
                        <option value="Finalizar">Finalizar</option>
                        <option value="Deletar">Deletar</option>
                        <option value="Perguntar ao documento">Perguntar ao documento</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-woopi-ai-gray" />
                  <Input
                    type="text"
                    placeholder="Buscar por usuário, detalhes, ação, etapa..."
                    value={docHistorySearch}
                    onChange={(e) => setDocHistorySearch(e.target.value)}
                    className="pl-9 py-1.5 text-xs border border-woopi-ai-border h-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-3 flex-1 pr-2">
                {filteredHistory && filteredHistory.length > 0 ? (
                  filteredHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 border border-woopi-ai-border rounded-lg bg-white dark:bg-[#292f4c] hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-woopi-ai-blue/10 flex items-center justify-center">
                                <User className="w-4 h-4 text-woopi-ai-blue" />
                              </div>
                              <span className="font-semibold text-woopi-ai-dark-gray">{entry.user}</span>
                            </div>
                            <Badge className={`${getActionBadgeClass(entry.action)} hover:bg-opacity-100 text-xs px-2 py-1`}>
                              {entry.action}
                            </Badge>
                            {entry.stage && (
                              <span className="text-xs text-woopi-ai-gray flex items-center gap-1">
                                <Workflow className="w-3 h-3" />
                                {entry.stage}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-woopi-ai-gray mb-1">
                            {entry.details}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-woopi-ai-gray">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{entry.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-woopi-ai-gray text-sm">
                    Nenhuma alteração encontrada com o filtro selecionado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          /* ---- Empty state ---- */
          <Card className="border border-woopi-ai-border h-full flex flex-col">
            <CardContent className="py-16 flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center text-woopi-ai-gray">
                <History className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-sm">Selecione um documento para ver seu histórico</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ============================================================
// TAB: Esteiras
// ============================================================
function WorkflowAuditTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [wfEventSortOrder, setWfEventSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [wfEventSearch, setWfEventSearch] = useState('');
  const [visibleWfEventCount, setVisibleWfEventCount] = useState(10);

  // Aggregate data per workflow
  const workflowAggregated = useMemo(() => {
    return workflowsAuditData.map(wf => {
      // Collect docs that have this workflow as any of their associations
      const docsInWorkflow: { docId: string; docName: string; wfAssoc: WorkflowAssociation }[] = [];
      Object.entries(allDocumentsHistory).forEach(([docId, doc]) => {
        doc.workflows.forEach(wfAssoc => {
          if (wfAssoc.workflow === wf.name) {
            docsInWorkflow.push({ docId, docName: doc.name, wfAssoc });
          }
        });
      });

      const allEvents = docsInWorkflow.flatMap(({ docId, docName, wfAssoc }) =>
        wfAssoc.history.map(h => ({ ...h, docId, docName, docStage: wfAssoc.workflowStage }))
      ).sort((a, b) => b.timestamp.localeCompare(a.timestamp));

      const totalDocs = docsInWorkflow.length;
      const finalized = allEvents.filter(e => e.action === 'Finalizar').length;
      const rejected = allEvents.filter(e => e.action === 'Reprovar').length;
      const inProgress = totalDocs - finalized;

      // Stage distribution
      const stageDistribution: Record<string, number> = {};
      wf.stages.forEach(s => { stageDistribution[s] = 0; });
      docsInWorkflow.forEach(({ wfAssoc }) => {
        if (stageDistribution[wfAssoc.workflowStage] !== undefined) {
          stageDistribution[wfAssoc.workflowStage]++;
        }
      });

      return {
        ...wf,
        totalDocs,
        finalized,
        rejected,
        inProgress,
        stageDistribution,
        allEvents,
        totalEvents: allEvents.length
      };
    });
  }, []);

  const filteredWorkflows = workflowAggregated.filter(wf => {
    const searchLower = searchTerm.toLowerCase();
    return (
      wf.name.toLowerCase().includes(searchLower) ||
      wf.team.toLowerCase().includes(searchLower)
    );
  });

  const selectedWf = selectedWorkflow
    ? workflowAggregated.find(wf => wf.id === selectedWorkflow)
    : null;

  const filteredEvents = useMemo(() => {
    if (!selectedWf) return [];
    const searchLower = wfEventSearch.toLowerCase();
    const filtered = selectedWf.allEvents.filter(event => {
      const matchStage = stageFilter === 'all' || event.stage === stageFilter;
      const matchAction = actionFilter === 'all' || event.action === actionFilter;
      const matchesSearch = !wfEventSearch ||
        event.user.toLowerCase().includes(searchLower) ||
        event.details.toLowerCase().includes(searchLower) ||
        event.docName.toLowerCase().includes(searchLower) ||
        event.action.toLowerCase().includes(searchLower) ||
        (event.stage && event.stage.toLowerCase().includes(searchLower));
      return matchStage && matchAction && matchesSearch;
    });
    return filtered.sort((a, b) => {
      return wfEventSortOrder === 'newest'
        ? b.timestamp.localeCompare(a.timestamp)
        : a.timestamp.localeCompare(b.timestamp);
    });
  }, [selectedWf, stageFilter, actionFilter, wfEventSearch, wfEventSortOrder]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleWfEventCount(10);
  }, [stageFilter, actionFilter, wfEventSearch, wfEventSortOrder, selectedWorkflow]);

  const visibleEvents = filteredEvents.slice(0, visibleWfEventCount);
  const hasMoreEvents = filteredEvents.length > visibleWfEventCount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - workflow list */}
      <div className="lg:col-span-1 lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-120px)]">
        <Card className="border border-woopi-ai-border h-full flex flex-col max-h-[inherit]">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="w-4 h-4" />
              Buscar Esteira
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0 space-y-4">
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-woopi-ai-gray" />
              <Input
                type="text"
                placeholder="Nome da esteira ou time..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border border-woopi-ai-border"
              />
            </div>
            <Separator className="flex-shrink-0" />
            <div className="space-y-2 flex-1 overflow-y-auto">
              {filteredWorkflows.length > 0 ? (
                filteredWorkflows.map(wf => (
                  <button
                    key={wf.id}
                    onClick={() => { setSelectedWorkflow(wf.id); setStageFilter('all'); setActionFilter('all'); setWfEventSearch(''); setWfEventSortOrder('newest'); }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedWorkflow === wf.id
                        ? 'border-woopi-ai-blue bg-blue-50 dark:bg-blue-900/20'
                        : 'border-woopi-ai-border hover:bg-gray-50 dark:hover:bg-[#2d3354]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Workflow className="w-4 h-4 text-[#0073ea] flex-shrink-0" />
                      <span className="font-medium text-sm text-woopi-ai-dark-gray truncate">
                        {wf.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Users className="w-3.5 h-3.5 text-woopi-ai-gray flex-shrink-0" />
                      <span className="text-xs text-woopi-ai-gray truncate">
                        {wf.team}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-woopi-ai-gray">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {wf.totalDocs} docs
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {wf.finalized}
                      </span>
                      {wf.rejected > 0 && (
                        <span className="flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-red-500" />
                          {wf.rejected}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-blue-500" />
                        {wf.totalEvents} eventos
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-woopi-ai-gray text-sm">
                  Nenhuma esteira encontrada
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right column - workflow detail */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {selectedWf ? (
          <div className="contents">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-3 flex-shrink-0">
              <Card className="border border-woopi-ai-border">
                <CardContent className="p-4 flex flex-col items-center">
                  <FileText className="w-5 h-5 text-[#0073ea] mb-1" />
                  <span className="text-2xl font-bold text-woopi-ai-dark-gray">{selectedWf.totalDocs}</span>
                  <span className="text-xs text-woopi-ai-gray">Total Documentos</span>
                </CardContent>
              </Card>
              <Card className="border border-woopi-ai-border">
                <CardContent className="p-4 flex flex-col items-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-1" />
                  <span className="text-2xl font-bold text-emerald-600">{selectedWf.finalized}</span>
                  <span className="text-xs text-woopi-ai-gray">Finalizados</span>
                </CardContent>
              </Card>
              <Card className="border border-woopi-ai-border">
                <CardContent className="p-4 flex flex-col items-center">
                  <XCircle className="w-5 h-5 text-red-500 mb-1" />
                  <span className="text-2xl font-bold text-red-600">{selectedWf.rejected}</span>
                  <span className="text-xs text-woopi-ai-gray">Reprovados</span>
                </CardContent>
              </Card>
            </div>

            {/* Stage distribution */}
            <Card className="border border-woopi-ai-border flex-shrink-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#0073ea]" />
                  Distribuição por Etapa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1">
                  {selectedWf.stages.map((stage, idx) => {
                    const count = selectedWf.stageDistribution[stage] || 0;
                    const total = selectedWf.totalDocs || 1;
                    const pct = Math.max((count / total) * 100, count > 0 ? 8 : 2);
                    const isLast = idx === selectedWf.stages.length - 1;
                    return (
                      <div key={stage} className="contents">
                        <div className="flex-1 min-w-0">
                          <div
                            className={`h-8 rounded flex items-center justify-center text-xs font-medium transition-all ${
                              isLast
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                : count > 0
                                  ? 'bg-[#0073ea]/15 text-[#0073ea]'
                                  : 'bg-gray-100 text-gray-400 dark:bg-gray-700/40 dark:text-gray-300'
                            }`}
                            style={{ minWidth: `${pct}%` }}
                            title={`${stage}: ${count} documentos`}
                          >
                            {count}
                          </div>
                          <p className="text-[10px] text-woopi-ai-gray mt-1 truncate text-center" title={stage}>
                            {stage}
                          </p>
                        </div>
                        {idx < selectedWf.stages.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-gray-300 dark:text-[#7a7f9d] flex-shrink-0 mt-[-14px]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border border-woopi-ai-border flex-1 flex flex-col">
              <CardHeader className="flex-shrink-0 pb-3">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#0073ea]" />
                      Timeline Processual
                      <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300 text-[10px] ml-1">{filteredEvents.length} eventos</Badge>
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <button
                        onClick={() => setWfEventSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                        className="flex items-center gap-1.5 text-xs border border-woopi-ai-border rounded-md px-2.5 py-1.5 hover:bg-gray-50 dark:hover:bg-[#2d3354] transition-colors bg-white dark:bg-[#292f4c]"
                        title={wfEventSortOrder === 'newest' ? 'Mais recentes primeiro' : 'Mais antigos primeiro'}
                      >
                        <ArrowUpDown className="w-3.5 h-3.5 text-woopi-ai-gray" />
                        <span className="text-woopi-ai-gray">{wfEventSortOrder === 'newest' ? 'Mais recentes' : 'Mais antigos'}</span>
                      </button>
                      <div className="flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5 text-woopi-ai-gray" />
                        <select
                          value={stageFilter}
                          onChange={(e) => setStageFilter(e.target.value)}
                          className="text-xs border border-woopi-ai-border rounded-md px-2 py-1.5 bg-white dark:bg-[#292f4c] dark:text-[#d5d8e0]"
                        >
                          <option value="all">Todas as etapas</option>
                          {selectedWf.stages.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <select
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                        className="text-xs border border-woopi-ai-border rounded-md px-2 py-1.5 bg-white dark:bg-[#292f4c] dark:text-[#d5d8e0]"
                      >
                        <option value="all">Todas as ações</option>
                        <option value="Upload">Upload</option>
                        <option value="Atribuir">Atribuir</option>
                        <option value="Avançar">Avançar</option>
                        <option value="Editar resposta">Editar resposta</option>
                        <option value="Reprovar">Reprovar</option>
                        <option value="Finalizar">Finalizar</option>
                        <option value="Deletar">Deletar</option>
                        <option value="Perguntar ao documento">Perguntar ao documento</option>
                      </select>
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-woopi-ai-gray" />
                    <Input
                      type="text"
                      placeholder="Buscar por usuário, documento, detalhes, etapa..."
                      value={wfEventSearch}
                      onChange={(e) => setWfEventSearch(e.target.value)}
                      className="pl-9 py-1.5 text-xs border border-woopi-ai-border h-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2.5 flex-1 pr-2">
                  {filteredEvents.length > 0 ? (
                    <>
                      {visibleEvents.map((event, idx) => (
                        <div
                          key={`${event.docId}-${event.id}-${idx}`}
                          className="p-3 border border-woopi-ai-border rounded-lg bg-white dark:bg-[#292f4c] hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-woopi-ai-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <User className="w-3.5 h-3.5 text-woopi-ai-blue" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-semibold text-sm text-woopi-ai-dark-gray">{event.user}</span>
                                <Badge className={`${getActionBadgeClass(event.action)} text-[10px] px-1.5 py-0`}>
                                  {event.action}
                                </Badge>
                                <span className="text-[10px] text-gray-400 dark:text-[#7a7f9d]">&middot;</span>
                                <span className="text-xs text-[#0073ea] font-medium flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  {event.docName}
                                </span>
                              </div>
                              <p className="text-xs text-woopi-ai-gray mb-1 truncate">{event.details}</p>
                              <div className="flex items-center gap-3 text-[10px] text-woopi-ai-gray">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {event.timestamp}
                                </span>
                                {event.stage && (
                                  <span className="flex items-center gap-1">
                                    <Workflow className="w-3 h-3" />
                                    {event.stage}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {hasMoreEvents && (
                        <div className="flex flex-col items-center gap-1.5 pt-2 pb-1">
                          <span className="text-[10px] text-woopi-ai-gray">
                            Exibindo {visibleWfEventCount} de {filteredEvents.length} eventos
                          </span>
                          <button
                            onClick={() => setVisibleWfEventCount(prev => prev + 10)}
                            className="flex items-center gap-1.5 text-xs font-medium text-[#0073ea] hover:text-[#005bb5] border border-woopi-ai-border rounded-md px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors bg-white dark:bg-[#292f4c]"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                            Carregar mais
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-woopi-ai-gray text-sm">
                      Nenhum evento encontrado com os filtros selecionados
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border border-woopi-ai-border flex-1">
            <CardContent className="py-16 h-full flex items-center justify-center">
              <div className="flex flex-col items-center justify-center text-woopi-ai-gray">
                <Workflow className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-sm">Selecione uma esteira para ver a auditoria processual</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ============================================================
// TAB: Usuários
// ============================================================
const userTeamsMap: Record<string, string[]> = {
  'Ana Costa': ['Time Financeiro'],
  'Carlos Silva': ['Time Financeiro'],
  'Pedro Oliveira': ['Time Financeiro'],
  'Maria Santos': ['Time Financeiro'],
  'Roberto Lima': ['Time Financeiro'],
  'João Silva': ['Time Financeiro'],
  'Ricardo Torres': ['Time Financeiro', 'Time RH'],
  'João Ferreira': ['Time Jurídico'],
  'Dra. Mariana Costa': ['Time Jurídico'],
  'Dr. Paulo Santos': ['Time Jurídico'],
  'Fernanda Alves': ['Time RH'],
  'Luciana Melo': ['Time RH'],
  'Carlos Mendes': ['Time RH'],
};

function UsersAuditTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [eventSortOrder, setEventSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [eventSearch, setEventSearch] = useState('');

  // Aggregate user data from all documents + system actions
  const usersData = useMemo(() => {
    const userMap: Record<string, {
      name: string;
      teams: string[];
      events: {
        id: string;
        action: string;
        timestamp: string;
        details: string;
        docId: string;
        docName: string;
        workflow: string;
        stage?: string;
        resourceType?: 'ferramenta' | 'esteira';
        resourceName?: string;
      }[];
      workflows: Set<string>;
      actionCounts: Record<string, number>;
    }> = {};

    const ensureUser = (name: string) => {
      if (!userMap[name]) {
        userMap[name] = {
          name,
          teams: userTeamsMap[name] || ['Sem time'],
          events: [],
          workflows: new Set(),
          actionCounts: {}
        };
      }
      return userMap[name];
    };

    Object.entries(allDocumentsHistory).forEach(([docId, doc]) => {
      doc.workflows.forEach(wfAssoc => {
        wfAssoc.history.forEach(entry => {
          const u = ensureUser(entry.user);
          u.events.push({
            id: `${docId}-${wfAssoc.workflow}-${entry.id}`,
            action: entry.action,
            timestamp: entry.timestamp,
            details: entry.details,
            docId,
            docName: doc.name,
            workflow: wfAssoc.workflow,
            stage: entry.stage
          });
          u.workflows.add(wfAssoc.workflow);
          u.actionCounts[entry.action] = (u.actionCounts[entry.action] || 0) + 1;
        });
      });
    });

    systemAuditEntries.forEach(entry => {
      const u = ensureUser(entry.user);
      u.events.push({
        id: entry.id,
        action: entry.action,
        timestamp: entry.timestamp,
        details: entry.details,
        docId: '',
        docName: entry.resourceName,
        workflow: entry.resourceType === 'ferramenta' ? 'Ferramentas' : 'Esteiras',
        resourceType: entry.resourceType,
        resourceName: entry.resourceName
      });
      u.actionCounts[entry.action] = (u.actionCounts[entry.action] || 0) + 1;
    });

    Object.values(userMap).forEach(u => {
      u.events.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    });

    return Object.values(userMap).sort((a, b) => b.events.length - a.events.length);
  }, []);

  const allTeams = useMemo(() => {
    const teams = new Set<string>();
    usersData.forEach(u => u.teams.forEach(t => teams.add(t)));
    return Array.from(teams).sort();
  }, [usersData]);

  const filteredUsers = usersData.filter(u => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(searchLower);
    const matchesTeam = teamFilter === 'all' || u.teams.includes(teamFilter);
    return matchesSearch && matchesTeam;
  });

  const selectedUserData = selectedUser
    ? usersData.find(u => u.name === selectedUser)
    : null;

  const filteredEvents = useMemo(() => {
    if (!selectedUserData) return [];
    const searchLower = eventSearch.toLowerCase();
    const filtered = selectedUserData.events.filter(e => {
      const matchesAction = actionFilter === 'all' || e.action === actionFilter;
      const matchesSearch = !eventSearch || 
        e.docName.toLowerCase().includes(searchLower) ||
        e.details.toLowerCase().includes(searchLower) ||
        e.workflow.toLowerCase().includes(searchLower) ||
        e.action.toLowerCase().includes(searchLower) ||
        (e.stage && e.stage.toLowerCase().includes(searchLower));
      return matchesAction && matchesSearch;
    });
    return filtered.sort((a, b) => {
      return eventSortOrder === 'newest'
        ? b.timestamp.localeCompare(a.timestamp)
        : a.timestamp.localeCompare(b.timestamp);
    });
  }, [selectedUserData, actionFilter, eventSearch, eventSortOrder]);

  // Top 3 actions for a user
  const getTopActions = (actionCounts: Record<string, number>) => {
    return Object.entries(actionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - user list */}
      <div className="lg:col-span-1 lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-120px)]">
        <Card className="border border-woopi-ai-border h-full flex flex-col max-h-[inherit]">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="w-4 h-4" />
              Buscar Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0 space-y-4">
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-woopi-ai-gray" />
              <Input
                type="text"
                placeholder="Nome do usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border border-woopi-ai-border"
              />
            </div>
            <div className="relative flex-shrink-0">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-woopi-ai-gray" />
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-woopi-ai-border rounded-md bg-white dark:bg-[#292f4c] dark:text-[#d5d8e0] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0073ea]/30 focus:border-[#0073ea]"
              >
                <option value="all">Todos os times</option>
                {allTeams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
            <Separator className="flex-shrink-0" />
            <div className="space-y-2 flex-1 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(u => (
                  <button
                    key={u.name}
                    onClick={() => { setSelectedUser(u.name); setActionFilter('all'); setEventSearch(''); setEventSortOrder('newest'); }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedUser === u.name
                        ? 'border-woopi-ai-blue bg-blue-50 dark:bg-blue-900/20'
                        : 'border-woopi-ai-border hover:bg-gray-50 dark:hover:bg-[#2d3354]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-7 h-7 rounded-full bg-woopi-ai-blue/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-3.5 h-3.5 text-woopi-ai-blue" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm text-woopi-ai-dark-gray truncate block">
                          {u.name}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          {u.teams.map(team => (
                            <Badge key={team} className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-[10px] px-1.5 py-0 font-normal">
                              {team}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1.5 ml-9 flex-wrap">
                      {Array.from(u.workflows).map(wf => (
                        <Badge key={wf} className="bg-[#0073ea]/10 text-[#0073ea] text-[10px] px-1.5 py-0 font-normal">
                          {wf.length > 20 ? wf.substring(0, 20) + '...' : wf}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-woopi-ai-gray ml-9">
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {u.events.length} ações
                      </span>
                      <span className="flex items-center gap-1">
                        <Workflow className="w-3 h-3" />
                        {u.workflows.size} {u.workflows.size === 1 ? 'esteira' : 'esteiras'}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-woopi-ai-gray text-sm">
                  Nenhum usuário encontrado
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right column - user detail */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {selectedUserData ? (
          <div className="contents">
            {/* User summary */}
            <Card className="border border-woopi-ai-border flex-shrink-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-woopi-ai-blue/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-woopi-ai-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg text-woopi-ai-dark-gray">{selectedUserData.name}</h3>
                      {selectedUserData.teams.map(team => (
                        <Badge key={team} className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-xs px-2 py-0.5 font-normal">
                          {team}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {Array.from(selectedUserData.workflows).map(wf => (
                        <Badge key={wf} className="bg-[#0073ea]/10 text-[#0073ea] text-xs px-2 py-0.5 font-normal">
                          {wf}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-shrink-0">
              <Card className="border border-woopi-ai-border">
                <CardContent className="p-3 flex flex-col items-center">
                  <span className="text-2xl font-bold text-woopi-ai-dark-gray">{selectedUserData.events.length}</span>
                  <span className="text-xs text-woopi-ai-gray">Total de Ações</span>
                </CardContent>
              </Card>
              <Card className="border border-woopi-ai-border">
                <CardContent className="p-3 flex flex-col items-center">
                  <span className="text-2xl font-bold text-[#0073ea]">{selectedUserData.workflows.size}</span>
                  <span className="text-xs text-woopi-ai-gray">Esteiras</span>
                </CardContent>
              </Card>
              {getTopActions(selectedUserData.actionCounts).slice(0, 2).map(([action, count]) => (
                <Card key={action} className="border border-woopi-ai-border">
                  <CardContent className="p-3 flex flex-col items-center">
                    <span className="text-2xl font-bold text-woopi-ai-dark-gray">{count}</span>
                    <span className="text-xs text-woopi-ai-gray truncate max-w-full" title={action}>{action}</span>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Activity timeline */}
            <Card className="border border-woopi-ai-border flex-1 flex flex-col">
              <CardHeader className="flex-shrink-0 pb-3">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <History className="w-4 h-4 text-[#0073ea]" />
                      Histórico de Atividade
                      <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300 text-[10px] ml-1">{filteredEvents.length}</Badge>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEventSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                        className="flex items-center gap-1.5 text-xs border border-woopi-ai-border rounded-md px-2.5 py-1.5 hover:bg-gray-50 dark:hover:bg-[#2d3354] transition-colors bg-white dark:bg-[#292f4c]"
                        title={eventSortOrder === 'newest' ? 'Mais recentes primeiro' : 'Mais antigos primeiro'}
                      >
                        <ArrowUpDown className="w-3.5 h-3.5 text-woopi-ai-gray" />
                        <span className="text-woopi-ai-gray">{eventSortOrder === 'newest' ? 'Mais recentes' : 'Mais antigos'}</span>
                      </button>
                      <div className="flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5 text-woopi-ai-gray" />
                        <select
                          value={actionFilter}
                          onChange={(e) => setActionFilter(e.target.value)}
                          className="text-xs border border-woopi-ai-border rounded-md px-2 py-1.5 bg-white dark:bg-[#292f4c] dark:text-[#d5d8e0]"
                        >
                          <option value="all">Todas as ações</option>
                          {Object.keys(selectedUserData.actionCounts).map(a => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-woopi-ai-gray" />
                    <Input
                      type="text"
                      placeholder="Buscar por documento, detalhes, esteira, etapa..."
                      value={eventSearch}
                      onChange={(e) => setEventSearch(e.target.value)}
                      className="pl-9 py-1.5 text-xs border border-woopi-ai-border h-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2.5 flex-1 pr-2">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => {
                      const isSystem = !!event.resourceType;
                      const IconComp = isSystem
                        ? (event.resourceType === 'ferramenta' ? Wrench : Settings2)
                        : FileText;
                      const iconColor = isSystem
                        ? (event.resourceType === 'ferramenta' ? 'text-teal-600 dark:text-teal-400' : 'text-indigo-600 dark:text-indigo-400')
                        : 'text-woopi-ai-blue';
                      const iconBg = isSystem
                        ? (event.resourceType === 'ferramenta' ? 'bg-teal-100 dark:bg-teal-900/30' : 'bg-indigo-100 dark:bg-indigo-900/30')
                        : 'bg-woopi-ai-blue/10';
                      return (
                        <div
                          key={event.id}
                          className="p-3 border border-woopi-ai-border rounded-lg bg-white dark:bg-[#292f4c] hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-7 h-7 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <IconComp className={`w-3.5 h-3.5 ${iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-medium text-sm text-[#0073ea]">{event.docName}</span>
                                <Badge className={`${getActionBadgeClass(event.action)} text-[10px] px-1.5 py-0`}>
                                  {event.action}
                                </Badge>
                                {isSystem && (
                                  <Badge className="bg-gray-100 text-gray-500 dark:bg-gray-700/40 dark:text-gray-400 text-[10px] px-1.5 py-0 font-normal">
                                    {event.resourceType === 'ferramenta' ? 'Ferramenta' : 'Esteira'}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-woopi-ai-gray mb-1 truncate">{event.details}</p>
                              <div className="flex items-center gap-3 text-[10px] text-woopi-ai-gray">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {event.timestamp}
                                </span>
                                {!isSystem && (
                                  <span className="flex items-center gap-1">
                                    <Workflow className="w-3 h-3" />
                                    {event.workflow}
                                  </span>
                                )}
                                {event.stage && (
                                  <div className="contents">
                                    <span className="text-gray-300 dark:text-[#7a7f9d]">&middot;</span>
                                    <span>{event.stage}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-woopi-ai-gray text-sm">
                      Nenhuma atividade encontrada com o filtro selecionado
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border border-woopi-ai-border flex-1">
            <CardContent className="py-16 h-full flex items-center justify-center">
              <div className="flex flex-col items-center justify-center text-woopi-ai-gray">
                <Users className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-sm">Selecione um usuário para ver sua atividade</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MAIN: AuditPage
// ============================================================
export function AuditPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold woopi-ai-text-primary flex items-center gap-2">
            <ShieldUser className="w-6 h-6" />
            Auditoria
          </h1>
          <p className="woopi-ai-text-secondary text-sm md:text-base">
            Acompanhe o histórico completo de ações em documentos, esteiras e usuários
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="documentos">
        <TabsList className="mb-4">
          <TabsTrigger value="documentos" className="flex items-center gap-1.5 px-4">
            <FileText className="w-4 h-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="esteiras" className="flex items-center gap-1.5 px-4">
            <Workflow className="w-4 h-4" />
            Esteiras
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center gap-1.5 px-4">
            <Users className="w-4 h-4" />
            Usuários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documentos">
          <DocumentsAuditTab />
        </TabsContent>

        <TabsContent value="esteiras">
          <WorkflowAuditTab />
        </TabsContent>

        <TabsContent value="usuarios">
          <UsersAuditTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}