import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save, Search, X, Plus, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useUserManagement } from './useUserManagement';
import { toast } from 'sonner@2.0.3';

export function TeamFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const {
    users,
    teams,
    availableRoles,
    createTeam,
    updateTeam,
    createUser
  } = useUserManagement();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    selectedMembers: [] as number[],
    selectedRoles: [] as string[]
  });

  // UI state
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  
  // New user form state
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    selectedRoles: [] as string[]
  });
  const [showPassword, setShowPassword] = useState(false);
  const [newUserRoleSearchTerm, setNewUserRoleSearchTerm] = useState('');

  // Load team data if editing
  useEffect(() => {
    if (isEditing && id) {
      const team = teams.find(t => t.id === parseInt(id));
      if (team) {
        setFormData({
          name: team.name,
          selectedMembers: team.members || [],
          selectedRoles: team.roles || []
        });
      }
    }
  }, [id, isEditing, teams]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Nome do time é obrigatório');
      return;
    }

    if (isEditing) {
      updateTeam(parseInt(id!), {
        name: formData.name,
        members: formData.selectedMembers,
        membersCount: formData.selectedMembers.length,
        roles: formData.selectedRoles
      });
      toast.success('Time atualizado com sucesso');
    } else {
      createTeam({
        name: formData.name,
        description: `Time ${formData.name}`,
        color: '#0073ea',
        members: formData.selectedMembers,
        membersCount: formData.selectedMembers.length,
        leader: formData.selectedMembers.length > 0 
          ? users.find(u => u.id === formData.selectedMembers[0])?.name || 'Sem líder'
          : 'Sem líder',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'Ativo',
        roles: formData.selectedRoles
      });
      toast.success('Time criado com sucesso');
    }

    navigate('/gestaodeusuarios?tab=teams');
  };

  const handleCancel = () => {
    navigate('/gestaodeusuarios?tab=teams');
  };

  // Member handlers
  const handleMemberSelect = (userId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedMembers: [...prev.selectedMembers, userId]
    }));
  };

  const handleMemberRemove = (userId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedMembers: prev.selectedMembers.filter(id => id !== userId)
    }));
  };

  const handleSelectAllMembers = () => {
    setFormData(prev => ({
      ...prev,
      selectedMembers: users.map(user => user.id)
    }));
  };

  const handleClearAllMembers = () => {
    setFormData(prev => ({
      ...prev,
      selectedMembers: []
    }));
  };

  // Get selected users for display
  const selectedUsers = users.filter(user => formData.selectedMembers.includes(user.id));

  // Role handlers for team
  const handleRoleSelect = (roleName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedRoles: [...prev.selectedRoles, roleName]
    }));
  };

  const handleRoleRemove = (roleName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.filter(r => r !== roleName)
    }));
  };

  const handleSelectAllRoles = () => {
    setFormData(prev => ({
      ...prev,
      selectedRoles: availableRoles
    }));
  };

  const handleClearAllRoles = () => {
    setFormData(prev => ({
      ...prev,
      selectedRoles: []
    }));
  };

  // New user handlers
  const handleCreateNewUser = () => {
    if (!newUserData.name || !newUserData.email || newUserData.selectedRoles.length === 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (!newUserData.password || !newUserData.confirmPassword) {
      toast.error('Senha é obrigatória');
      return;
    }

    if (newUserData.password !== newUserData.confirmPassword) {
      toast.error('As senhas não conferem');
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email.toLowerCase() === newUserData.email.toLowerCase())) {
      toast.error('Já existe um usuário com este email');
      return;
    }

    const newUser = createUser({
      name: newUserData.name,
      email: newUserData.email,
      phone: '',
      roles: newUserData.selectedRoles,
      teams: [formData.name || 'Novo Time'], // Add to current team
      status: 'Ativo',
      lastLogin: 'Nunca',
      documentsCount: 0
    });

    // Add the new user to the team members
    setFormData(prev => ({
      ...prev,
      selectedMembers: [...prev.selectedMembers, newUser.id]
    }));

    // Reset form
    setNewUserData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      selectedRoles: []
    });
    setShowAddUserForm(false);
    setNewUserRoleSearchTerm('');
    
    toast.success('Usuário criado e adicionado ao time com sucesso');
  };

  const handleCancelNewUser = () => {
    setNewUserData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      selectedRoles: []
    });
    setShowAddUserForm(false);
    setNewUserRoleSearchTerm('');
  };

  // New user role handlers
  const handleNewUserRoleSelect = (roleName: string) => {
    setNewUserData(prev => ({
      ...prev,
      selectedRoles: [...prev.selectedRoles, roleName]
    }));
  };

  const handleNewUserRoleRemove = (roleName: string) => {
    setNewUserData(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.filter(r => r !== roleName)
    }));
  };

  const handleSelectAllNewUserRoles = () => {
    setNewUserData(prev => ({
      ...prev,
      selectedRoles: availableRoles
    }));
  };

  const handleClearAllNewUserRoles = () => {
    setNewUserData(prev => ({
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
            {isEditing ? 'Editar Time' : 'Novo Time'}
          </h1>
          <p className="woopi-ai-text-secondary">
            {isEditing 
              ? 'Atualize as informações do time selecionado'
              : 'Crie um novo time para o sistema'}
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
            {isEditing ? 'Salvar Alterações' : 'Criar Time'}
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className="w-full">
        <Card className="woopi-ai-card">
          <CardHeader>
            <CardTitle className="woopi-ai-text-primary">Informações do Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nome do Time */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Time *</Label>
              <Input
                id="name"
                placeholder="Nome do time"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="border border-woopi-ai-border"
              />
            </div>

            {/* Perfis */}
            <div className="space-y-2">
              <Label>Perfis</Label>
              <div className="border rounded-md p-4 bg-muted">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Perfis Selecionados ({formData.selectedRoles.length})</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllRoles}
                      className="text-xs"
                    >
                      Selecionar Todos
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearAllRoles}
                      className="text-xs"
                    >
                      Limpar Seleção
                    </Button>
                  </div>
                </div>
                
                {formData.selectedRoles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 max-h-[140px] overflow-y-auto">
                    {formData.selectedRoles.map((role) => (
                      <Badge key={role} variant="secondary" className="woopi-ai-badge-primary">
                        {role}
                        <button
                          type="button"
                          className="ml-1 text-xs"
                          onClick={() => handleRoleRemove(role)}
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
                      !formData.selectedRoles.includes(role)
                    )
                    .map((role) => (
                      <div
                        key={role}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                        onClick={() => handleRoleSelect(role)}
                      >
                        <Checkbox
                          checked={false}
                          onChange={() => handleRoleSelect(role)}
                        />
                        <span className="text-sm">{role}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Membros */}
            <div className="space-y-2">
              <Label>Membros do Time</Label>
              <div className="border rounded-md p-4 bg-muted">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Membros Selecionados ({formData.selectedMembers.length})</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllMembers}
                      className="text-xs"
                    >
                      Selecionar Todos
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearAllMembers}
                      className="text-xs"
                    >
                      Limpar Seleção
                    </Button>
                  </div>
                </div>
                
                {selectedUsers.length > 0 && (
                  <div className="space-y-2 mb-3 max-h-[280px] overflow-y-auto">
                    {selectedUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-2 bg-card rounded border">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-woopi-ai-blue text-white">
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{user.name}</div>
                            <div className="text-xs text-woopi-ai-gray">{user.email}</div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMemberRemove(user.id)}
                          className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray w-4 h-4" />
                  <Input
                    placeholder="Buscar membros..."
                    value={memberSearchTerm}
                    onChange={(e) => setMemberSearchTerm(e.target.value)}
                    className="pl-10 h-8 bg-card"
                  />
                </div>
                
                <div className="min-h-[400px] max-h-[400px] overflow-y-auto space-y-1">
                  {users
                    .filter(user => 
                      (user.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
                       user.email.toLowerCase().includes(memberSearchTerm.toLowerCase())) &&
                      !formData.selectedMembers.includes(user.id)
                    )
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 p-2 hover:bg-accent rounded cursor-pointer"
                        onClick={() => handleMemberSelect(user.id)}
                      >
                        <Checkbox
                          checked={false}
                          onChange={() => handleMemberSelect(user.id)}
                        />
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-woopi-ai-blue text-white">
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-woopi-ai-gray">{user.email}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {user.roles.slice(0, 2).map((role, index) => (
                              <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                                {role}
                              </Badge>
                            ))}
                            {user.roles.length > 2 && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                +{user.roles.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                
                {/* Add User Button */}
                <div className="mt-4 pt-4 border-t border-woopi-ai-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddUserForm(!showAddUserForm)}
                    className="w-full"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {showAddUserForm ? 'Cancelar Adição de Usuário' : 'Adicionar Novo Usuário'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add User Form */}
        {showAddUserForm && (
          <Card className="woopi-ai-card mt-6">
            <CardHeader>
              <CardTitle className="woopi-ai-text-primary">Adicionar Novo Usuário ao Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newUserName">Nome *</Label>
                  <Input
                    id="newUserName"
                    placeholder="Nome do usuário"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                    className="border border-woopi-ai-border"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newUserEmail">Email *</Label>
                  <Input
                    id="newUserEmail"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                    className="border border-woopi-ai-border"
                  />
                </div>
              </div>
              
              {/* Senhas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newUserPassword">Senha *</Label>
                  <div className="relative">
                    <Input
                      id="newUserPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite a senha"
                      value={newUserData.password}
                      onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
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
                  <Label htmlFor="newUserConfirmPassword">Confirmar Senha *</Label>
                  <div className="relative">
                    <Input
                      id="newUserConfirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirme a senha"
                      value={newUserData.confirmPassword}
                      onChange={(e) => setNewUserData({...newUserData, confirmPassword: e.target.value})}
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



              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-woopi-ai-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelNewUser}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleCreateNewUser}
                  className="woopi-ai-button-primary"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Criar e Adicionar ao Time
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}