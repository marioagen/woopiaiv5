import React from 'react';
import { 
  FileText, 
  Upload, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Download,
  MessageSquare,
  Database
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

export function Dashboard() {
  const stats = [
    {
      title: 'Total de Documentos',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'bg-monday-blue',
    },
    {
      title: 'Uploads Hoje',
      value: '23',
      change: '+5%',
      trend: 'up',
      icon: Upload,
      color: 'bg-monday-success',
    },
    {
      title: 'Usuários Ativos',
      value: '89',
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'bg-monday-purple',
    },
    {
      title: 'Tarefas Pendentes',
      value: '15',
      change: '-23%',
      trend: 'down',
      icon: Clock,
      color: 'bg-monday-warning',
    },
  ];

  const recentDocuments = [
    {
      id: 1,
      name: 'Contrato_Cliente_ABC.pdf',
      type: 'Contrato',
      uploadedBy: 'João Silva',
      uploadedAt: '2 horas atrás',
      status: 'Processado',
      actions: 3,
    },
    {
      id: 2,
      name: 'Relatório_Financeiro_Q4.pdf',
      type: 'Relatório',
      uploadedBy: 'Maria Santos',
      uploadedAt: '4 horas atrás',
      status: 'Em análise',
      actions: 1,
    },
    {
      id: 3,
      name: 'Manual_Procedimentos.pdf',
      type: 'Manual',
      uploadedBy: 'Pedro Costa',
      uploadedAt: '1 dia atrás',
      status: 'Aprovado',
      actions: 5,
    },
  ];

  const pendingTasks = [
    {
      id: 1,
      title: 'Aprovação de Contrato XYZ',
      assignedTo: 'Ana Maria',
      dueDate: 'Hoje',
      priority: 'Alta',
      stage: 'Revisão Legal',
    },
    {
      id: 2,
      title: 'Extração de Dados - Relatório Q4',
      assignedTo: 'Carlos Oliveira',
      dueDate: 'Amanhã',
      priority: 'Média',
      stage: 'Processamento',
    },
    {
      id: 3,
      title: 'Merge de Documentos Fiscais',
      assignedTo: 'Lucia Fernandes',
      dueDate: '2 dias',
      priority: 'Baixa',
      stage: 'Preparação',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta':
        return 'bg-monday-error text-white';
      case 'Média':
        return 'bg-monday-warning text-white';
      case 'Baixa':
        return 'bg-monday-success text-white';
      default:
        return 'bg-monday-gray text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processado':
        return 'bg-monday-success text-white';
      case 'Aprovado':
        return 'bg-monday-blue text-white';
      case 'Em análise':
        return 'bg-monday-warning text-white';
      default:
        return 'bg-monday-gray text-white';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold monday-text-primary">Dashboard</h1>
        <p className="monday-text-secondary">Visão geral das atividades e documentos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="monday-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium monday-text-secondary">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold monday-text-primary">
                  {stat.value}
                </div>
                <div className="flex items-center space-x-1 text-xs monday-text-secondary">
                  <TrendingUp className={`w-3 h-3 ${stat.trend === 'up' ? 'text-monday-success' : 'text-monday-error'}`} />
                  <span className={stat.trend === 'up' ? 'text-monday-success' : 'text-monday-error'}>
                    {stat.change}
                  </span>
                  <span>vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="monday-card">
        <CardHeader>
          <CardTitle className="monday-text-primary">Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 monday-button-primary">
              <Upload className="w-6 h-6" />
              <span>Upload PDF</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <MessageSquare className="w-6 h-6" />
              <span>Chat com Doc</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Database className="w-6 h-6" />
              <span>Extrair Dados</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Download className="w-6 h-6" />
              <span>Merge PDFs</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <Card className="monday-card">
          <CardHeader>
            <CardTitle className="monday-text-primary">Documentos Recentes</CardTitle>
            <CardDescription>
              Últimos documentos processados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center space-x-4 p-3 rounded-lg monday-bg-light">
                  <div className="p-2 bg-monday-blue rounded-lg">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium monday-text-primary truncate">
                      {doc.name}
                    </p>
                    <div className="flex items-center space-x-2 text-sm monday-text-secondary">
                      <span>{doc.uploadedBy}</span>
                      <span>•</span>
                      <span>{doc.uploadedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                    <Badge variant="outline">
                      {doc.actions} ações
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="ghost" className="w-full">
                Ver todos os documentos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="monday-card">
          <CardHeader>
            <CardTitle className="monday-text-primary">Tarefas Pendentes</CardTitle>
            <CardDescription>
              Tarefas que precisam da sua atenção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-4 p-3 rounded-lg monday-bg-light">
                  <div className="p-2 bg-monday-warning rounded-lg">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium monday-text-primary">
                      {task.title}
                    </p>
                    <div className="flex items-center space-x-2 text-sm monday-text-secondary">
                      <span>{task.assignedTo}</span>
                      <span>•</span>
                      <span>{task.stage}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <span className="text-sm monday-text-secondary">
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="ghost" className="w-full">
                Ver todas as tarefas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress */}
      <Card className="monday-card">
        <CardHeader>
          <CardTitle className="monday-text-primary">Uso do Sistema</CardTitle>
          <CardDescription>
            Estatísticas de uso mensal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm monday-text-secondary">Armazenamento</span>
                <span className="text-sm monday-text-primary">68%</span>
              </div>
              <Progress value={68} className="h-2" />
              <p className="text-xs monday-text-secondary">6.8 GB de 10 GB</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm monday-text-secondary">Processamento</span>
                <span className="text-sm monday-text-primary">45%</span>
              </div>
              <Progress value={45} className="h-2" />
              <p className="text-xs monday-text-secondary">450 de 1000 docs/mês</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm monday-text-secondary">API Calls</span>
                <span className="text-sm monday-text-primary">32%</span>
              </div>
              <Progress value={32} className="h-2" />
              <p className="text-xs monday-text-secondary">3.2K de 10K calls/mês</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}