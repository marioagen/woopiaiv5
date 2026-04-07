import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, UserCheck, Search, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';

const ASSIGNEE_USERS = [
  { value: 'ana-silva', name: 'Ana Silva', role: 'Analista', initials: 'AS', color: 'bg-[#0073ea]' },
  { value: 'carlos-mendes', name: 'Carlos Mendes', role: 'Supervisor', initials: 'CM', color: 'bg-[#0073ea]' },
  { value: 'juliana-costa', name: 'Juliana Costa', role: 'Revisora', initials: 'JC', color: 'bg-[#0073ea]' },
  { value: 'roberto-alves', name: 'Roberto Alves', role: 'Gerente', initials: 'RA', color: 'bg-[#0073ea]' },
  { value: 'fernanda-lima', name: 'Fernanda Lima', role: 'Analista', initials: 'FL', color: 'bg-[#0073ea]' },
];

export function WorkflowBulkAtribuirPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedKeys = [], returnTo = '/documentos/workflow' } = (location.state as any) || {};

  const [selectedResponsavel, setSelectedResponsavel] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const handleCancel = () => {
    navigate(returnTo);
  };

  const handleConfirm = () => {
    if (!selectedResponsavel) {
      toast.error('Por favor, selecione um responsável.');
      return;
    }
    const userName = ASSIGNEE_USERS.find((u) => u.value === selectedResponsavel)?.name ?? selectedResponsavel;
    toast.success(`${selectedKeys.length} documento(s) atribuído(s) para: ${userName}`);
    navigate(returnTo);
  };

  const filteredUsers = ASSIGNEE_USERS.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={handleCancel} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="woopi-ai-text-primary text-xl font-bold">Atribuir Responsável</h1>
          <p className="woopi-ai-text-secondary text-sm">
            Selecione o usuário responsável pelos documentos selecionados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
          <Button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700 text-white border-0">
            <UserCheck className="w-4 h-4 mr-2" />
            Confirmar Atribuição
          </Button>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="woopi-ai-card">
          <CardHeader>
            <CardTitle className="text-base">Selecionar Responsável</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Responsável <span className="text-red-500">*</span>
              </Label>
              <div className="border border-gray-200 dark:border-[#393e5c] rounded-lg overflow-hidden bg-white dark:bg-[#1f2132]">
                <div className="relative border-b border-gray-100 dark:border-[#393e5c]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Buscar usuário..."
                    className="w-full h-9 pl-9 pr-3 text-sm bg-gray-50 dark:bg-[#1a1b2e] text-gray-800 dark:text-[#d5d8e0] placeholder-gray-400 dark:placeholder-[#6b7280] focus:outline-none"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto dark:bg-[#1a1b2e]">
                  {filteredUsers.map((user) => {
                    const isSelected = selectedResponsavel === user.value;
                    return (
                      <button
                        key={user.value}
                        type="button"
                        onClick={() => setSelectedResponsavel(isSelected ? '' : user.value)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-[#2d3354]'}`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${user.color}`}>
                          {user.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isSelected ? 'text-[#0073ea] dark:text-[#4a9ff5]' : 'text-gray-800 dark:text-[#d5d8e0]'}`}>{user.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.role}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#0073ea] dark:text-[#4a9ff5] flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              {selectedResponsavel && (
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Atribuído a:</span>
                  <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-500/30 rounded-full px-2.5 py-0.5">
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                      {ASSIGNEE_USERS.find((u) => u.value === selectedResponsavel)?.name}
                    </span>
                    <button type="button" onClick={() => setSelectedResponsavel('')} className="text-blue-400 hover:text-blue-600 ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="woopi-ai-card">
          <CardContent className="pt-6">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Documentos afetados</p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">
                <Badge className="bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300 mr-2">
                  {selectedKeys.length}
                </Badge>
                documento(s) serão atribuídos ao responsável selecionado.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
