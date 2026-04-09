import React, { memo } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Users,
  X,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { User } from './mockData';

interface UsersTabProps {
  users: User[];
  userSearch: string;
  setUserSearch: (search: string) => void;
  userSortField: string | null;
  userSortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
  onCreateNew: () => void;
  onBadgeClick: (text: string) => void;
}

function getSortIcon(field: string, sortField: string | null, sortDirection: 'asc' | 'desc') {
  if (sortField !== field) {
    return <ChevronsUpDown className="w-4 h-4" />;
  }
  return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
}

function getRoleColor() {
  return 'woopi-ai-badge-primary';
}

export const UsersTab = memo<UsersTabProps>(({ 
  users, 
  userSearch, 
  setUserSearch, 
  userSortField, 
  userSortDirection, 
  onSort, 
  onEdit, 
  onDelete, 
  onCreateNew,
  onBadgeClick 
}) => {
  const clearSearch = () => setUserSearch('');

  // Delete Confirmation Component
  const DeleteConfirmationDialog = ({ user, children }: { user: User; children: React.ReactNode }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md mx-4">
        <AlertDialogHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <AlertDialogTitle className="text-woopi-ai-dark-gray">
            Você está prestes a deletar<br />um usuário do sistema
          </AlertDialogTitle>
          <AlertDialogDescription className="text-woopi-ai-gray">
            Esta ação não poderá ser desfeita.<br />
            Tem certeza que deseja<br />
            remover <strong>{user.name}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="text-woopi-ai-blue hover:text-woopi-ai-dark-blue">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => onDelete(user.id)}
            className="woopi-ai-button-primary"
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Usuários
            </CardTitle>
            <CardDescription>
              Gerencie os usuários do sistema
            </CardDescription>
          </div>
          <Button onClick={onCreateNew} className="woopi-ai-button-primary">
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray w-4 h-4" />
            <Input
              placeholder="Buscar usuários por nome, email, perfil ou time..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="pl-10 pr-10 border border-border rounded-md bg-card focus:border-woopi-ai-blue focus:ring-woopi-ai-blue"
            />
            {userSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray hover:text-woopi-ai-dark-gray transition-colors"
                title="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-woopi-ai-dark-gray">
              Usuários ({users.length})
            </h3>
          </div>
          
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead 
                    className="text-woopi-ai-gray font-medium cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => onSort('id')}
                  >
                    <div className="flex items-center gap-1">
                      ID
                      {getSortIcon('id', userSortField, userSortDirection)}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-woopi-ai-gray font-medium cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => onSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Usuário
                      {getSortIcon('name', userSortField, userSortDirection)}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-woopi-ai-gray font-medium cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => onSort('roles')}
                  >
                    <div className="flex items-center gap-1">
                      Perfil
                      {getSortIcon('roles', userSortField, userSortDirection)}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-woopi-ai-gray font-medium cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => onSort('teams')}
                  >
                    <div className="flex items-center gap-1">
                      Times
                      {getSortIcon('teams', userSortField, userSortDirection)}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-woopi-ai-gray font-medium cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => onSort('lastLogin')}
                  >
                    <div className="flex items-center gap-1">
                      Último acesso
                      {getSortIcon('lastLogin', userSortField, userSortDirection)}
                    </div>
                  </TableHead>
                  <TableHead className="text-woopi-ai-gray font-medium text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {user.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-woopi-ai-blue text-white">
                            {user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-woopi-ai-gray">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <Badge 
                            key={role} 
                            variant="secondary" 
                            className={`${getRoleColor()} text-xs cursor-pointer`}
                            onClick={() => onBadgeClick(role)}
                          >
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.teams.map((team) => (
                          <Badge 
                            key={team} 
                            variant="outline" 
                            className="text-xs cursor-pointer"
                            onClick={() => onBadgeClick(team)}
                          >
                            {team}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-woopi-ai-gray whitespace-nowrap">
                        {user.lastLogin ?? 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onEdit(user)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar</p>
                          </TooltipContent>
                        </Tooltip>
                        <DeleteConfirmationDialog user={user}>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DeleteConfirmationDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

UsersTab.displayName = 'UsersTab';