import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { 
  Users, 
  Building, 
  ShieldUser
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useUserManagement } from './user-management/useUserManagement';
import { UsersTab } from './user-management/UsersTab';
import { TeamsTab } from './user-management/TeamsTab';
import { RolesTab } from './user-management/RolesTab';

export function UserTeamRoleManagement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'users');
  
  const {
    // Data
    sortedAndFilteredUsers,
    sortedAndFilteredTeams,
    sortedAndFilteredRoles,
    
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
    
    // CRUD operations
    deleteUser,
    deleteTeam,
    deleteRole,
  } = useUserManagement();

  // Update tab from URL params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['users', 'teams', 'roles'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleBadgeClick = (badgeText: string) => {
    setUserSearch(badgeText);
  };

  // Navigation handlers
  const handleCreateUser = () => {
    navigate('/gestaodeusuarios/usuarios/novo');
  };

  const handleEditUser = (user: any) => {
    navigate(`/gestaodeusuarios/usuarios/editar/${user.id}`);
  };

  const handleCreateTeam = () => {
    navigate('/gestaodeusuarios/times/novo');
  };

  const handleEditTeam = (team: any) => {
    navigate(`/gestaodeusuarios/times/editar/${team.id}`);
  };

  const handleCreateRole = () => {
    navigate('/gestaodeusuarios/perfis/novo');
  };

  const handleEditRole = (role: any) => {
    navigate(`/gestaodeusuarios/perfis/editar/${role.id}`);
  };

  return (
    <div className="user-management-layout">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold woopi-ai-text-primary">
          Gestão de Usuários e Times
        </h1>
        <p className="woopi-ai-text-secondary text-sm md:text-base mt-1">
          Gerencie usuários, times, perfis e permissões do app
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Times
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <ShieldUser className="w-4 h-4" />
            Perfis e Permissões
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UsersTab
            users={sortedAndFilteredUsers}
            userSearch={userSearch}
            setUserSearch={setUserSearch}
            userSortField={userSortField}
            userSortDirection={userSortDirection}
            onSort={handleUserSort}
            onEdit={handleEditUser}
            onDelete={deleteUser}
            onCreateNew={handleCreateUser}
            onBadgeClick={handleBadgeClick}
          />
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <TeamsTab
            teams={sortedAndFilteredTeams}
            teamSearch={teamSearch}
            setTeamSearch={setTeamSearch}
            teamSortField={teamSortField}
            teamSortDirection={teamSortDirection}
            onSort={handleTeamSort}
            onEdit={handleEditTeam}
            onDelete={deleteTeam}
            onCreateNew={handleCreateTeam}
          />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <RolesTab
            roles={sortedAndFilteredRoles}
            roleSearch={roleSearch}
            setRoleSearch={setRoleSearch}
            roleSortField={roleSortField}
            roleSortDirection={roleSortDirection}
            onSort={handleRoleSort}
            onEdit={handleEditRole}
            onDelete={deleteRole}
            onCreateNew={handleCreateRole}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}