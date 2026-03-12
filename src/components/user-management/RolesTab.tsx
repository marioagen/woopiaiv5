import React, { memo } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Users,
  ShieldUser,
  X,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Copy,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Badge } from '../ui/badge';
import { Role } from './mockData';

interface RolesTabProps {
  roles: Role[];
  roleSearch: string;
  setRoleSearch: (search: string) => void;
  roleSortField: string | null;
  roleSortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  onEdit: (role: Role) => void;
  onDelete: (roleId: number) => void;
  onCreateNew: () => void;
}

function getSortIcon(field: string, sortField: string | null, sortDirection: 'asc' | 'desc') {
  if (sortField !== field) {
    return <ChevronsUpDown className="w-4 h-4" />;
  }
  return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
}

export const RolesTab = memo<RolesTabProps>(({ 
  roles, 
  roleSearch, 
  setRoleSearch, 
  roleSortField, 
  roleSortDirection, 
  onSort, 
  onEdit, 
  onDelete, 
  onCreateNew 
}) => {
  const clearSearch = () => setRoleSearch('');

  // Delete Confirmation Component
  const DeleteConfirmationDialog = ({ role, children }: { role: Role; children: React.ReactNode }) => (
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
            Você está prestes a deletar<br />um perfil do sistema
          </AlertDialogTitle>
          <AlertDialogDescription className="text-woopi-ai-gray">
            Esta ação não poderá ser desfeita.<br />
            Tem certeza que deseja<br />
            remover o perfil <strong>{role.name}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="text-woopi-ai-blue hover:text-woopi-ai-dark-blue">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => onDelete(role.id)}
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
              <ShieldUser className="w-5 h-5" />
              Perfis e Permissões
            </CardTitle>
            <CardDescription>
              Gerencie os perfis e permissões do sistema
            </CardDescription>
          </div>
          <Button onClick={onCreateNew} className="woopi-ai-button-primary">
            <Plus className="w-4 h-4 mr-2" />
            Novo Perfil
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray w-4 h-4" />
            <Input
              placeholder="Buscar perfis por nome..."
              value={roleSearch}
              onChange={(e) => setRoleSearch(e.target.value)}
              className="pl-10 pr-10 border border-border rounded-md bg-card focus:border-woopi-ai-blue focus:ring-woopi-ai-blue"
            />
            {roleSearch && (
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
              Perfis ({roles.length})
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
                      {getSortIcon('id', roleSortField, roleSortDirection)}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-woopi-ai-gray font-medium cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => onSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Perfil
                      {getSortIcon('name', roleSortField, roleSortDirection)}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-woopi-ai-gray font-medium cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => onSort('usersCount')}
                  >
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Usuários
                      {getSortIcon('usersCount', roleSortField, roleSortDirection)}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-woopi-ai-gray font-medium cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => onSort('permissions')}
                  >
                    <div className="flex items-center gap-1">
                      Permissões
                      {getSortIcon('permissions', roleSortField, roleSortDirection)}
                    </div>
                  </TableHead>
                  <TableHead className="text-woopi-ai-gray font-medium text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => {
                  const permissionCount = Object.values(role.permissions).filter(Boolean).length;
                  const totalPermissions = Object.keys(role.permissions).length;
                  
                  return (
                    <TableRow key={role.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{role.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{role.name}</div>
                          {role.isBuiltIn && (
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-xs">
                              Padrão
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-woopi-ai-gray" />
                          <span className="text-sm text-woopi-ai-gray">{role.usersCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-woopi-ai-gray">
                          {permissionCount} de {totalPermissions}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {role.isBuiltIn ? (
                          <div className="flex items-center justify-end">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => onEdit(role)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Clonar</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => onEdit(role)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Editar</p>
                              </TooltipContent>
                            </Tooltip>
                            <DeleteConfirmationDialog role={role}>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </DeleteConfirmationDialog>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

RolesTab.displayName = 'RolesTab';