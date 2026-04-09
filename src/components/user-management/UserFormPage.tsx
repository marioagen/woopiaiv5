import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Search,
  X,
  Plus
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';

import { useUserManagement } from './useUserManagement';
import { toast } from 'sonner@2.0.3';

export function UserFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const {
    users,
    availableTeams,
    availableRoles,
    createUser,
    updateUser,
    createTeam
  } = useUserManagement();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    selectedTeams: [] as string[]
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [teamSearchTerm, setTeamSearchTerm] = useState('');
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [showCreateTeamForm, setShowCreateTeamForm] = useState(false);
  const [newTeamData, setNewTeamData] = useState({
    name: '',
    selectedRoles: [] as string[]
  });

  // Load user data if editing
  useEffect(() => {
    if (isEditing && id) {
      const user = users.find(u => u.id === parseInt(id));
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          password: '',
          confirmPassword: '',
          selectedTeams: user.teams
        });
      }
    }
  }, [id, isEditing, users]);

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (!isEditing && (!formData.password || !formData.confirmPassword)) {
      toast.error('Senha é obrigatória para novos usuários');
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('As senhas não conferem');
      return;
    }

    if (isEditing) {
      updateUser(parseInt(id!), {
        name: formData.name,
        email: formData.email,
        roles: [], // User roles will be managed through team association
        teams: formData.selectedTeams
      });
      toast.success('Usuário atualizado com sucesso');
    } else {
      createUser({
        name: formData.name,
        email: formData.email,
        phone: '',
        roles: [], // User roles will be managed through team association
        teams: formData.selectedTeams,
        status: 'Ativo',
        lastLogin: null,
        documentsCount: 0
      });
      toast.success('Usuário criado com sucesso');
    }

    navigate('/gestaodeusuarios');
  };

  const handleCancel = () => {
    navigate('/gestaodeusuarios');
  };



  // Team handlers
  const handleTeamSelect = (teamName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTeams: [...prev.selectedTeams, teamName]
    }));
  };

  const handleTeamRemove = (teamName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTeams: prev.selectedTeams.filter(t => t !== teamName)
    }));
  };

  const handleSelectAllTeams = () => {
    setFormData(prev => ({
      ...prev,
      selectedTeams: availableTeams
    }));
  };

  const handleClearAllTeams = () => {
    setFormData(prev => ({
      ...prev,
      selectedTeams: []
    }));
  };

  const handleCreateNewTeam = () => {
    if (!newTeamData.name.trim()) {
      toast.error('Nome do time é obrigatório');
      return;
    }

    if (availableTeams.some(team => team.toLowerCase() === newTeamData.name.toLowerCase())) {
      toast.error('Já existe um time com este nome');
      return;
    }

    createTeam({
      name: newTeamData.name.trim(),
      description: `Time ${newTeamData.name.trim()}`,
      color: '#0073ea',
      members: [],
      membersCount: 0,
      leader: 'Sem líder',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Ativo',
      roles: newTeamData.selectedRoles
    });
    
    setFormData(prev => ({
      ...prev,
      selectedTeams: [...prev.selectedTeams, newTeamData.name.trim()]
    }));

    setShowCreateTeamForm(false);
    setNewTeamData({
      name: '',
      selectedRoles: []
    });
    setRoleSearchTerm('');
    toast.success('Time criado com sucesso');
  };

  const handleCancelNewTeam = () => {
    setShowCreateTeamForm(false);
    setNewTeamData({
      name: '',
      selectedRoles: []
    });
    setRoleSearchTerm('');
  };

  // New team role handlers
  const handleNewTeamRoleSelect = (roleName: string) => {
    setNewTeamData(prev => ({
      ...prev,
      selectedRoles: [...prev.selectedRoles, roleName]
    }));
  };

  const handleNewTeamRoleRemove = (roleName: string) => {
    setNewTeamData(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.filter(r => r !== roleName)
    }));
  };

  const handleSelectAllNewTeamRoles = () => {
    setNewTeamData(prev => ({
      ...prev,
      selectedRoles: availableRoles
    }));
  };

  const handleClearAllNewTeamRoles = () => {
    setNewTeamData(prev => ({
      ...prev,
      selectedRoles: []
    }));
  };

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
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </h1>
          <p className="woopi-ai-text-secondary">
            {isEditing 
              ? 'Atualize as informações do usuário selecionado'
              : 'Crie um novo usuário para o sistema'}
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
            {isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className="w-full">
        <Card className="woopi-ai-card">
          <CardHeader>
            <CardTitle className="woopi-ai-text-primary">Informações do Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  placeholder="Nome do usuário"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="border border-woopi-ai-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="border border-woopi-ai-border"
                />
              </div>
            </div>
            
            {/* Senhas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  {isEditing ? 'Nova Senha (opcional)' : 'Senha *'}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isEditing ? 'Deixe em branco para manter a atual' : 'Digite a senha'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="border border-woopi-ai-border"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray hover:text-woopi-ai-dark-gray"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {isEditing ? 'Confirmar Nova Senha' : 'Confirmar Senha *'}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirme a senha"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="border border-woopi-ai-border"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray hover:text-woopi-ai-dark-gray"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Times */}
            <div className="space-y-2">
              <Label>Times</Label>
              <div className="border rounded-md p-4 bg-muted">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Times Selecionados ({formData.selectedTeams.length})</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllTeams}
                      className="text-xs"
                    >
                      Selecionar Todos
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearAllTeams}
                      className="text-xs"
                    >
                      Limpar Seleção
                    </Button>
                  </div>
                </div>
                
                {formData.selectedTeams.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 max-h-[140px] overflow-y-auto">
                    {formData.selectedTeams.map((team) => (
                      <Badge key={team} variant="outline">
                        {team}
                        <button
                          type="button"
                          className="ml-1 text-xs"
                          onClick={() => handleTeamRemove(team)}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray w-4 h-4" />
                  <Input
                    placeholder="Buscar times..."
                    value={teamSearchTerm}
                    onChange={(e) => setTeamSearchTerm(e.target.value)}
                    className="pl-10 h-8 bg-card"
                  />
                </div>
                
                <div className="min-h-[200px] max-h-[200px] overflow-y-auto space-y-1">
                  {availableTeams
                    .filter(team => 
                      team.toLowerCase().includes(teamSearchTerm.toLowerCase()) &&
                      !formData.selectedTeams.includes(team)
                    )
                    .map((team) => (
                      <div
                        key={team}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                        onClick={() => handleTeamSelect(team)}
                      >
                        <Checkbox
                          checked={false}
                          onChange={() => handleTeamSelect(team)}
                        />
                        <span className="text-sm">{team}</span>
                      </div>
                    ))}
                </div>
                
                <div className="mt-3 pt-3 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateTeamForm(!showCreateTeamForm)}
                    className="text-xs"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {showCreateTeamForm ? 'Cancelar' : 'Criar Novo Time'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Team Form */}
      {showCreateTeamForm && (
        <Card className="woopi-ai-card mt-6">
          <CardHeader>
            <CardTitle className="woopi-ai-text-primary">Criar Novo Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nome do Time */}
            <div className="space-y-2">
              <Label htmlFor="newTeamName">Nome do Time *</Label>
              <Input
                id="newTeamName"
                placeholder="Nome do novo time"
                value={newTeamData.name}
                onChange={(e) => setNewTeamData({...newTeamData, name: e.target.value})}
                className="border border-woopi-ai-border"
              />
            </div>

            {/* Perfis */}
            <div className="space-y-2">
              <Label>Perfis</Label>
              <div className="border rounded-md p-4 bg-muted">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Perfis Selecionados ({newTeamData.selectedRoles.length})</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllNewTeamRoles}
                      className="text-xs"
                    >
                      Selecionar Todos
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearAllNewTeamRoles}
                      className="text-xs"
                    >
                      Limpar Seleção
                    </Button>
                  </div>
                </div>
                
                {newTeamData.selectedRoles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 max-h-[140px] overflow-y-auto">
                    {newTeamData.selectedRoles.map((role) => (
                      <Badge key={role} variant="secondary" className="woopi-ai-badge-primary">
                        {role}
                        <button
                          type="button"
                          className="ml-1 text-xs"
                          onClick={() => handleNewTeamRoleRemove(role)}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray w-4 h-4" />
                  <Input
                    placeholder="Buscar perfis..."
                    value={roleSearchTerm}
                    onChange={(e) => setRoleSearchTerm(e.target.value)}
                    className="pl-10 h-8 bg-card"
                  />
                </div>
                
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {availableRoles
                    .filter(role => 
                      role.toLowerCase().includes(roleSearchTerm.toLowerCase()) &&
                      !newTeamData.selectedRoles.includes(role)
                    )
                    .map((role) => (
                      <div
                        key={role}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                        onClick={() => handleNewTeamRoleSelect(role)}
                      >
                        <Checkbox
                          checked={false}
                          onChange={() => handleNewTeamRoleSelect(role)}
                        />
                        <span className="text-sm">{role}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t border-woopi-ai-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelNewTeam}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleCreateNewTeam}
                className="woopi-ai-button-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Time
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}