import React, { memo } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Users,
  Building,
  X,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Team } from './mockData';

interface TeamsTabProps {
  teams: Team[];
  teamSearch: string;
  setTeamSearch: (search: string) => void;
  teamSortField: string | null;
  teamSortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  onEdit: (team: Team) => void;
  onDelete: (teamId: number) => void;
  onCreateNew: () => void;
}

function getSortIcon(field: string, sortField: string | null, sortDirection: 'asc' | 'desc') {
  if (sortField !== field) {
    return <ChevronsUpDown className="w-4 h-4" />;
  }
  return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
}

export const TeamsTab = memo<TeamsTabProps>(({ 
  teams, 
  teamSearch, 
  setTeamSearch, 
  teamSortField, 
  teamSortDirection, 
  onSort, 
  onEdit, 
  onDelete, 
  onCreateNew 
}) => {
  const clearSearch = () => setTeamSearch('');

  // Delete Confirmation Component
  const DeleteConfirmationDialog = ({ team, children }: { team: Team; children: React.ReactNode }) => (
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
            Você está prestes a deletar<br />um time do sistema
          </AlertDialogTitle>
          <AlertDialogDescription className="text-woopi-ai-gray">
            Esta ação não poderá ser desfeita.<br />
            Tem certeza que deseja<br />
            remover o time <strong>{team.name}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="text-woopi-ai-blue hover:text-woopi-ai-dark-blue">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => onDelete(team.id)}
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
              <Building className="w-5 h-5" />
              Times
            </CardTitle>
            <CardDescription>
              Gerencie os times do sistema
            </CardDescription>
          </div>
          <Button onClick={onCreateNew} className="woopi-ai-button-primary">
            <Plus className="w-4 h-4 mr-2" />
            Novo Time
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-woopi-ai-gray w-4 h-4" />
            <Input
              placeholder="Buscar times por nome ou descrição..."
              value={teamSearch}
              onChange={(e) => setTeamSearch(e.target.value)}
              className="pl-10 pr-10 border border-border rounded-md bg-card focus:border-woopi-ai-blue focus:ring-woopi-ai-blue"
            />
            {teamSearch && (
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
              Times ({teams.length})
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
                      {getSortIcon('id', teamSortField, teamSortDirection)}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-woopi-ai-gray font-medium cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => onSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Time
                      {getSortIcon('name', teamSortField, teamSortDirection)}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-woopi-ai-gray font-medium cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => onSort('membersCount')}
                  >
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Membros
                      {getSortIcon('membersCount', teamSortField, teamSortDirection)}
                    </div>
                  </TableHead>
                  <TableHead className="text-woopi-ai-gray font-medium text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{team.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{team.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-woopi-ai-gray" />
                        <span className="text-sm text-woopi-ai-gray">{team.membersCount}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => onEdit(team)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar</p>
                          </TooltipContent>
                        </Tooltip>
                        <DeleteConfirmationDialog team={team}>
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

TeamsTab.displayName = 'TeamsTab';