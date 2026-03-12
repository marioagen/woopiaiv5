import React, { useState } from 'react';
import { 
  Upload,
  Check,
  AlertCircle,
  X,
  FileText,
  File,
  Image,
  Search,
  Building
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  description?: string;
  selectedTeams?: number[];
}

interface Team {
  id: number;
  name: string;
  membersCount: number;
}

interface DocumentUploadModalProps {
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DocumentUploadModal({ 
  trigger, 
  isOpen: controlledIsOpen, 
  onOpenChange: controlledOnOpenChange 
}: DocumentUploadModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [teamSearchTerm, setTeamSearchTerm] = useState('');

  // Use controlled or internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const onOpenChange = controlledOnOpenChange || setInternalIsOpen;

  // Mock teams data
  const teams: Team[] = [
    { id: 1, name: 'Financeiro', membersCount: 8 },
    { id: 2, name: 'Jurídico', membersCount: 5 },
    { id: 3, name: 'RH', membersCount: 6 },
    { id: 4, name: 'Marketing', membersCount: 12 },
    { id: 5, name: 'Gestão Administrativa', membersCount: 4 },
    { id: 6, name: 'Desenvolvimento', membersCount: 3 },
    { id: 7, name: 'Design', membersCount: 4 },
    { id: 8, name: 'Vendas', membersCount: 7 },
    { id: 9, name: 'Suporte', membersCount: 5 },
    { id: 10, name: 'Operações', membersCount: 6 }
  ];

  // Get file type icon
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-600" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'xls':
      case 'xlsx':
        return <File className="w-4 h-4 text-green-600" />;
      case 'ppt':
      case 'pptx':
        return <File className="w-4 h-4 text-orange-600" />;
      case 'zip':
      case 'rar':
        return <File className="w-4 h-4 text-purple-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return <Image className="w-4 h-4 text-pink-600" />;
      default:
        return <File className="w-4 h-4 text-muted-foreground" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle team selection
  const handleTeamSelect = (teamId: number) => {
    setSelectedTeams(prev => [...prev, teamId]);
  };

  const handleTeamRemove = (teamId: number) => {
    setSelectedTeams(prev => prev.filter(id => id !== teamId));
  };

  const handleSelectAllTeams = () => {
    setSelectedTeams(teams.map(team => team.id));
  };

  const handleClearAllTeams = () => {
    setSelectedTeams([]);
  };

  // Filter teams based on search term
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(teamSearchTerm.toLowerCase())
  );

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadFile[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading' as const,
      description: description,
      selectedTeams: [...selectedTeams]
    }));

    setUploadFiles(prev => [...prev, ...newFiles]);
    simulateUpload(newFiles);
  };

  // Simulate file upload with progress
  const simulateUpload = (files: UploadFile[]) => {
    setIsUploading(true);

    files.forEach(uploadFile => {
      const interval = setInterval(() => {
        setUploadFiles(prev => prev.map(file => {
          if (file.id === uploadFile.id) {
            const newProgress = Math.min(file.progress + Math.random() * 30, 100);
            const newStatus = newProgress === 100 ? 'success' : 'uploading';
            
            if (newProgress === 100) {
              clearInterval(interval);
              setTimeout(() => {
                setIsUploading(false);
                toast.success(`Arquivo "${uploadFile.file.name}" enviado com sucesso!`);
              }, 500);
            }
            
            return {
              ...file,
              progress: newProgress,
              status: newStatus
            };
          }
          return file;
        }));
      }, 200);
    });
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  // Remove file from upload list
  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // Clear all files
  const clearAllFiles = () => {
    setUploadFiles([]);
    setDescription('');
    setSelectedTeams([]);
    setTeamSearchTerm('');
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadFiles.length === 0) {
      toast.error('Selecione pelo menos um arquivo para enviar.');
      return;
    }

    const pendingFiles = uploadFiles.filter(file => file.status === 'uploading');
    if (pendingFiles.length > 0) {
      toast.error('Aguarde o upload dos arquivos terminar.');
      return;
    }

    toast.success('Todos os documentos foram enviados com sucesso!');
    clearAllFiles();
    onOpenChange(false);
  };

  const modalContent = (
    <DialogContent className="sm:max-w-2xl h-[600px] max-h-[90vh] p-0 gap-0 overflow-hidden">
      {/* Modal Container with Fixed Height */}
      <div className="flex flex-col h-full">
        {/* Fixed Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-border">
          <DialogHeader>
            <DialogTitle className="text-xl text-foreground">Novo Documento</DialogTitle>
          </DialogHeader>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-4">
            {/* 1. Upload Dropzone */}
            <div className="space-y-2">
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-border bg-muted hover:bg-accent'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('modal-file-input')?.click()}
              >
                <Upload className={`w-8 h-8 mx-auto mb-2 ${
                  dragActive ? 'text-blue-500' : 'text-muted-foreground'
                }`} />
                <h3 className="text-sm font-medium text-foreground mb-1">
                  Arraste e solte arquivos aqui
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  ou clique para selecionar arquivos
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="border-border text-muted-foreground hover:text-foreground"
                >
                  Selecionar Arquivos
                </Button>
                
                <input
                  id="modal-file-input"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.jpg,.jpeg,.png,.gif,.svg"
                />
              </div>
            </div>

            {/* 2. Description Field */}
            <div className="space-y-2">
              <Label htmlFor="modal-description" className="text-sm font-medium text-foreground">
                Descrição
              </Label>
              <Input
                id="modal-description"
                placeholder="Adicione uma descrição para o documento..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-border"
              />
            </div>

            {/* 3. Upload Progress Section */}
            {uploadFiles.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    Arquivos Selecionados ({uploadFiles.length})
                  </h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={clearAllFiles}
                    className="text-red-600 hover:text-red-700 text-xs px-2 h-7"
                  >
                    Limpar
                  </Button>
                </div>

                <div className="border border-border rounded-lg max-h-32 overflow-y-auto">
                  <div className="space-y-1 p-2">
                    {uploadFiles.map((uploadFile) => (
                      <div key={uploadFile.id} className="flex items-center space-x-2 p-2 border border-border rounded-md bg-muted">
                        <div className="flex-shrink-0">
                          {getFileIcon(uploadFile.file.name)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-foreground truncate">
                              {uploadFile.file.name}
                            </p>
                            <span className="text-xs text-muted-foreground ml-2">
                              {formatFileSize(uploadFile.file.size)}
                            </span>
                          </div>
                          
                          {uploadFile.status === 'uploading' && (
                            <div className="space-y-1">
                              <Progress value={uploadFile.progress} className="h-1" />
                              <p className="text-xs text-muted-foreground">
                                {Math.round(uploadFile.progress)}%
                              </p>
                            </div>
                          )}
                          
                          {uploadFile.status === 'success' && (
                            <div className="flex items-center space-x-1">
                              <Check className="w-3 h-3 text-green-600" />
                              <span className="text-xs text-green-600">Concluído</span>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(uploadFile.id)}
                          className="p-1 h-6 w-6 text-muted-foreground hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. TEAMS SELECTION */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  <Label className="text-sm font-semibold text-foreground">
                    Associar a Times (Opcional)
                  </Label>
                </div>
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs">
                  {selectedTeams.length} selecionados
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Selecione um ou mais times para associar ao documento.
              </p>
              
              <div className="space-y-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar times..."
                    value={teamSearchTerm}
                    onChange={(e) => setTeamSearchTerm(e.target.value)}
                    className="pl-10 h-9 border-border bg-card text-sm"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllTeams}
                    className="text-xs border-border hover:bg-muted h-8 px-3 flex-1"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Selecionar Todos
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearAllTeams}
                    className="text-xs border-border hover:bg-muted h-8 px-3 flex-1"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Limpar Seleção
                  </Button>
                </div>

                {/* Teams List with Fixed Height and Scroll */}
                <div className="border border-border rounded-lg bg-card max-h-24 overflow-y-auto">
                  <div className="p-2">
                    {filteredTeams.length > 0 ? (
                      <div className="space-y-1">
                        {filteredTeams.map((team) => (
                          <div key={team.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-sm transition-colors">
                            <Checkbox
                              id={`modal-team-${team.id}`}
                              checked={selectedTeams.includes(team.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleTeamSelect(team.id);
                                } else {
                                  handleTeamRemove(team.id);
                                }
                              }}
                              className="h-4 w-4"
                            />
                            <label 
                              htmlFor={`modal-team-${team.id}`} 
                              className="text-xs cursor-pointer select-none text-foreground flex-1 font-medium"
                            >
                              {team.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-3">
                        Nenhum time encontrado
                      </p>
                    )}
                  </div>
                </div>

                {/* Selected Teams Display */}
                {selectedTeams.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground">
                      Times Selecionados:
                    </Label>
                    <div className="flex flex-wrap gap-1">
                      {selectedTeams.map(teamId => {
                        const team = teams.find(t => t.id === teamId);
                        return team ? (
                          <Badge
                            key={team.id}
                            variant="default"
                            className="bg-blue-600 text-white px-2 py-0 text-xs"
                          >
                            <Building className="w-3 h-3 mr-1" />
                            {team.name}
                            <button
                              type="button"
                              onClick={() => handleTeamRemove(team.id)}
                              className="ml-1 hover:text-red-200"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Fixed Footer */}
        <div className="flex-shrink-0 border-t border-border px-6 py-4 bg-card">
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                clearAllFiles();
                onOpenChange(false);
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmit}
              className="woopi-ai-button-primary"
              disabled={uploadFiles.length === 0 || isUploading}
            >
              {isUploading ? 'Enviando...' : 'Enviar Documento'}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );

  if (trigger) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        {modalContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {modalContent}
    </Dialog>
  );
}