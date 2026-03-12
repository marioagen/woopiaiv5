import { useState, useMemo, useCallback } from 'react';
import { User, Team, Role, mockUsers, mockTeams, mockRoles, availablePermissions } from './mockData';
import { toast } from 'sonner@2.0.3';

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [roles, setRoles] = useState<Role[]>(mockRoles);

  // Search states
  const [userSearch, setUserSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');

  // Sorting states
  const [userSortField, setUserSortField] = useState<string | null>(null);
  const [userSortDirection, setUserSortDirection] = useState<'asc' | 'desc'>('asc');
  const [teamSortField, setTeamSortField] = useState<string | null>(null);
  const [teamSortDirection, setTeamSortDirection] = useState<'asc' | 'desc'>('asc');
  const [roleSortField, setRoleSortField] = useState<string | null>(null);
  const [roleSortDirection, setRoleSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isCreateTeamSubModalOpen, setIsCreateTeamSubModalOpen] = useState(false);

  // Editing states
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Form states
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    selectedRoles: [] as string[],
    selectedTeams: [] as string[]
  });

  const [teamFormData, setTeamFormData] = useState({
    name: '',
    selectedMembers: [] as number[]
  });

  const [roleFormData, setRoleFormData] = useState({
    name: '',
    selectedPermissions: [] as string[]
  });

  // Search terms for modals
  const [teamSearchTerm, setTeamSearchTerm] = useState('');
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [permissionSearchTerm, setPermissionSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shouldShowTeamsField, setShouldShowTeamsField] = useState(true);
  const [newTeamName, setNewTeamName] = useState('');

  // Sort handlers
  const handleUserSort = useCallback((field: string) => {
    if (userSortField === field) {
      setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortField(field);
      setUserSortDirection('asc');
    }
  }, [userSortField, userSortDirection]);

  const handleTeamSort = useCallback((field: string) => {
    if (teamSortField === field) {
      setTeamSortDirection(teamSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setTeamSortField(field);
      setTeamSortDirection('asc');
    }
  }, [teamSortField, teamSortDirection]);

  const handleRoleSort = useCallback((field: string) => {
    if (roleSortField === field) {
      setRoleSortDirection(roleSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setRoleSortField(field);
      setRoleSortDirection('asc');
    }
  }, [roleSortField, roleSortDirection]);

  // Filtered and sorted data
  const sortedAndFilteredUsers = useMemo(() => {
    return users
      .filter(user => 
        user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.roles.some(role => role.toLowerCase().includes(userSearch.toLowerCase())) ||
        user.teams.some(team => team.toLowerCase().includes(userSearch.toLowerCase()))
      )
      .sort((a, b) => {
        if (!userSortField) return 0;
        
        let aValue: any = a[userSortField as keyof User];
        let bValue: any = b[userSortField as keyof User];
        
        if (userSortField === 'roles') {
          aValue = a.roles.join(', ');
          bValue = b.roles.join(', ');
        }
        
        if (userSortField === 'teams') {
          aValue = a.teams.join(', ');
          bValue = b.teams.join(', ');
        }
        
        if (userSortField === 'id') {
          aValue = Number(aValue);
          bValue = Number(bValue);
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) return userSortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return userSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [users, userSearch, userSortField, userSortDirection]);

  const sortedAndFilteredTeams = useMemo(() => {
    return teams
      .filter(team => 
        team.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
        team.description.toLowerCase().includes(teamSearch.toLowerCase())
      )
      .sort((a, b) => {
        if (!teamSortField) return 0;
        
        let aValue: any = a[teamSortField as keyof Team];
        let bValue: any = b[teamSortField as keyof Team];
        
        if (teamSortField === 'id' || teamSortField === 'membersCount') {
          aValue = Number(aValue);
          bValue = Number(bValue);
        }
        
        if (teamSortField === 'name') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) return teamSortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return teamSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [teams, teamSearch, teamSortField, teamSortDirection]);

  const sortedAndFilteredRoles = useMemo(() => {
    return roles
      .filter(role => 
        role.name.toLowerCase().includes(roleSearch.toLowerCase())
      )
      .sort((a, b) => {
        if (!roleSortField) return 0;
        
        let aValue: any = a[roleSortField as keyof Role];
        let bValue: any = b[roleSortField as keyof Role];
        
        if (roleSortField === 'id' || roleSortField === 'usersCount') {
          aValue = Number(aValue);
          bValue = Number(bValue);
        }
        
        if (roleSortField === 'name') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (roleSortField === 'permissions') {
          aValue = Object.values(a.permissions).filter(Boolean).length;
          bValue = Object.values(b.permissions).filter(Boolean).length;
        }
        
        if (aValue < bValue) return roleSortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return roleSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [roles, roleSearch, roleSortField, roleSortDirection]);

  // Available options
  const availableTeams = useMemo(() => teams.map(team => team.name), [teams]);
  const availableRoles = useMemo(() => roles.map(role => role.name), [roles]);

  // CRUD operations
  const createUser = useCallback((userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: users.length + 1,
    };
    setUsers(prev => [...prev, newUser]);
    toast.success('Usuário criado com sucesso');
  }, [users.length]);

  const updateUser = useCallback((userId: number, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    ));
    toast.success('Usuário atualizado com sucesso');
  }, []);

  const deleteUser = useCallback((userId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('Usuário excluído com sucesso');
    }
  }, []);

  const createTeam = useCallback((teamData: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...teamData,
      id: teams.length + 1,
    };
    setTeams(prev => [...prev, newTeam]);
    toast.success('Time criado com sucesso');
  }, [teams.length]);

  const updateTeam = useCallback((teamId: number, teamData: Partial<Team>) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId ? { ...team, ...teamData } : team
    ));
    toast.success('Time atualizado com sucesso');
  }, []);

  const deleteTeam = useCallback((teamId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este time?')) {
      setTeams(prev => prev.filter(team => team.id !== teamId));
      toast.success('Time excluído com sucesso');
    }
  }, []);

  const createRole = useCallback((roleData: Omit<Role, 'id'>) => {
    const newRole: Role = {
      ...roleData,
      id: roles.length + 1,
    };
    setRoles(prev => [...prev, newRole]);
    toast.success('Perfil criado com sucesso');
  }, [roles.length]);

  const updateRole = useCallback((roleId: number, roleData: Partial<Role>) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isBuiltIn) {
      toast.error('Perfis padrão do sistema não podem ser editados');
      return;
    }
    setRoles(prev => prev.map(role => 
      role.id === roleId ? { ...role, ...roleData } : role
    ));
    toast.success('Perfil atualizado com sucesso');
  }, [roles]);

  const deleteRole = useCallback((roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isBuiltIn) {
      toast.error('Perfis padrão do sistema não podem ser excluídos');
      return;
    }
    if (window.confirm('Tem certeza que deseja excluir este perfil?')) {
      setRoles(prev => prev.filter(role => role.id !== roleId));
      toast.success('Perfil excluído com sucesso');
    }
  }, [roles]);

  return {
    // Data
    users,
    teams,
    roles,
    sortedAndFilteredUsers,
    sortedAndFilteredTeams,
    sortedAndFilteredRoles,
    availableTeams,
    availableRoles,
    availablePermissions,
    
    // Search
    userSearch,
    setUserSearch,
    teamSearch,
    setTeamSearch,
    roleSearch,
    setRoleSearch,
    
    // Sorting
    userSortField,
    userSortDirection,
    teamSortField,
    teamSortDirection,
    roleSortField,
    roleSortDirection,
    handleUserSort,
    handleTeamSort,
    handleRoleSort,
    
    // Modal states
    isUserModalOpen,
    setIsUserModalOpen,
    isTeamModalOpen,
    setIsTeamModalOpen,
    isRoleModalOpen,
    setIsRoleModalOpen,
    isCreateTeamSubModalOpen,
    setIsCreateTeamSubModalOpen,
    
    // Editing states
    editingUser,
    setEditingUser,
    editingTeam,
    setEditingTeam,
    editingRole,
    setEditingRole,
    
    // Form states
    userFormData,
    setUserFormData,
    teamFormData,
    setTeamFormData,
    roleFormData,
    setRoleFormData,
    
    // Search terms
    teamSearchTerm,
    setTeamSearchTerm,
    roleSearchTerm,
    setRoleSearchTerm,
    memberSearchTerm,
    setMemberSearchTerm,
    permissionSearchTerm,
    setPermissionSearchTerm,
    showPassword,
    setShowPassword,
    shouldShowTeamsField,
    setShouldShowTeamsField,
    newTeamName,
    setNewTeamName,
    
    // CRUD operations
    createUser,
    updateUser,
    deleteUser,
    createTeam,
    updateTeam,
    deleteTeam,
    createRole,
    updateRole,
    deleteRole,
  };
}