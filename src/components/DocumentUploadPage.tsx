import React, { useState, useEffect } from 'react';
import { 
  Upload,
  Menu,
  Check,
  AlertCircle,
  X,
  FileText,
  File,
  Image,
  ArrowLeft,
  Workflow
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { DocumentsSidebar } from './DocumentsSidebar';
import { useNavigate } from 'react-router';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  description?: string;
  selectedTeams?: number[];
}

// Team interface removed as teams section is now hidden

interface WorkflowItem {
  id: number;
  name: string;
  associatedTeams: number[];
  status: 'Ativo' | 'Inativo';
}

export function DocumentUploadPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedWorkflows, setSelectedWorkflows] = useState<number[]>([]);
  const [availableWorkflows, setAvailableWorkflows] = useState<WorkflowItem[]>([]);
  const [documentosEmLote, setDocumentosEmLote] = useState(false);

  // Teams data removed as teams section is now hidden

  // Mock workflows data - workflows the user is associated with
  const userWorkflows: WorkflowItem[] = [
    { id: 1, name: 'Aprovação de Contratos', associatedTeams: [1, 2], status: 'Ativo' },
    { id: 2, name: 'Análise Financeira', associatedTeams: [1], status: 'Ativo' },
    { id: 3, name: 'Revisão Jurídica', associatedTeams: [2], status: 'Ativo' },
    { id: 4, name: 'Onboarding de Funcionários', associatedTeams: [3], status: 'Ativo' },
    { id: 5, name: 'Avaliação de Performance', associatedTeams: [3], status: 'Ativo' },
    { id: 6, name: 'Aprovação de Campanhas', associatedTeams: [4], status: 'Ativo' },
    { id: 7, name: 'Análise de ROI', associatedTeams: [4, 1], status: 'Ativo' },
    { id: 8, name: 'Deploy de Aplicações', associatedTeams: [6], status: 'Ativo' },
  ];

  // Set available workflows to user workflows on mount
  useEffect(() => {
    setAvailableWorkflows(userWorkflows.filter(workflow => workflow.status === 'Ativo'));
  }, []);

  // Get file type icon
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'pdf':
        return <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
      case 'xls':
      case 'xlsx':
        return <File className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
      case 'ppt':
      case 'pptx':
        return <File className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />;
      case 'zip':
      case 'rar':
        return <File className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return <Image className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />;
      default:
        return <File className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />;
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

  // Team selection functions removed as teams section is now hidden

  // Handle workflow selection
  const handleWorkflowSelect = (workflowId: number) => {
    setSelectedWorkflows(prev => [...prev, workflowId]);
  };

  const handleWorkflowRemove = (workflowId: number) => {
    setSelectedWorkflows(prev => prev.filter(id => id !== workflowId));
  };

  const handleSelectAllWorkflows = () => {
    setSelectedWorkflows(availableWorkflows.map(workflow => workflow.id));
  };

  const handleClearAllWorkflows = () => {
    setSelectedWorkflows([]);
  };

  // Teams filtering removed as teams section is now hidden

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadFile[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading' as const,
      description: description
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
    setSelectedWorkflows([]);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadFiles.length === 0) {
      toast.error('Selecione pelo menos um arquivo para enviar.');
      return;
    }

    if (selectedWorkflows.length === 0) {
      toast.error('Selecione pelo menos um workflow para processar o documento.');
      return;
    }

    const pendingFiles = uploadFiles.filter(file => file.status === 'uploading');
    if (pendingFiles.length > 0) {
      toast.error('Aguarde o upload dos arquivos terminar.');
      return;
    }

    toast.success('Todos os documentos foram enviados com sucesso!');
    setTimeout(() => {
      navigate('/documentos/workflow');
    }, 1500);
  };

  // Navigate back to board
  const handleBackToDocuments = () => {
    navigate('/documentos/workflow');
  };

  return (
    <div className="relative h-full overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-muted md:hidden"
              >
                <Menu className="w-5 h-5 text-foreground" />
              </Button>
              
              <Button
                variant="outline"
                onClick={handleBackToDocuments}
                className="flex items-center space-x-2 border-border hover:bg-muted"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar para Board</span>
                <span className="sm:hidden">Voltar</span>
              </Button>
              
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Novo Documento</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Faça upload de novos documentos para análise</p>
              </div>
            </div>
          </div>

          {/* Upload Form */}
          <Card className="bg-card rounded-lg border border-border shadow-sm">
            <CardHeader className="px-[21px] pt-[21px] pb-[0px]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg md:text-xl text-foreground">Carregar Documento</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-5 md:space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* 1. Upload Dropzone */}
                <div className="space-y-2 sm:space-y-3">
                  {/* Checkbox documentos em lote - acima do dropzone, alinhado à esquerda */}
                  <label
                    htmlFor="documentos-em-lote"
                    className="flex items-center gap-2 cursor-pointer select-none w-fit"
                  >
                    <Checkbox
                      id="documentos-em-lote"
                      checked={documentosEmLote}
                      onCheckedChange={(val) => setDocumentosEmLote(Boolean(val))}
                    />
                    <span className="text-sm woopi-ai-text-secondary">Documentos em lote</span>
                  </label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center transition-all cursor-pointer ${
                      dragActive 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-border bg-muted hover:bg-accent'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <Upload className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3 ${
                      dragActive ? 'text-blue-500' : 'text-muted-foreground'
                    }`} />
                    <h3 className="text-sm sm:text-base md:text-lg text-foreground mb-1 sm:mb-2 font-medium">
                      {dragActive ? 'Solte os arquivos aqui' : 'Arraste e solte arquivos aqui'}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      ou clique para selecionar arquivos
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="border-border text-muted-foreground hover:text-foreground h-9 sm:h-10 md:h-auto text-sm"
                    >
                      Selecionar Arquivos
                    </Button>
                    
                    <input
                      id="file-input"
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
                  <Label htmlFor="description" className="text-sm font-medium text-foreground">
                    Descrição
                  </Label>
                  <Input
                    id="description"
                    placeholder="Adicione uma descrição para o documento..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-9 sm:h-10 md:h-12 border-border text-sm"
                  />
                </div>

                {/* 3. Upload Progress Section */}
                {uploadFiles.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-medium text-foreground">
                        Arquivos Selecionados ({uploadFiles.length})
                      </h3>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={clearAllFiles}
                        className="text-red-600 hover:text-red-700 h-8 sm:h-9"
                      >
                        Limpar Todos
                      </Button>
                    </div>

                    <div className="border border-border rounded-lg max-h-40 sm:max-h-48 overflow-y-auto">
                      <div className="space-y-1 p-2">
                        {uploadFiles.map((uploadFile) => (
                          <div key={uploadFile.id} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border border-border rounded-md bg-muted">
                            <div className="flex-shrink-0">
                              {getFileIcon(uploadFile.file.name)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {uploadFile.file.name}
                                </p>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {formatFileSize(uploadFile.file.size)}
                                </span>
                              </div>
                              
                              {/* Teams reference removed */}
                              
                              {uploadFile.status === 'uploading' && (
                                <div className="space-y-1">
                                  <Progress value={uploadFile.progress} className="h-1 sm:h-2" />
                                  <p className="text-xs text-muted-foreground">
                                    {Math.round(uploadFile.progress)}% - Enviando...
                                  </p>
                                </div>
                              )}
                              
                              {uploadFile.status === 'success' && (
                                <div className="flex items-center space-x-1">
                                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                  <span className="text-xs text-green-600">Upload concluído</span>
                                </div>
                              )}
                              
                              {uploadFile.status === 'error' && (
                                <div className="flex items-center space-x-1">
                                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                                  <span className="text-xs text-red-600">Erro no upload</span>
                                </div>
                              )}
                            </div>
                            
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(uploadFile.id)}
                              className="p-1 h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground hover:text-red-600"
                            >
                              <X className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. TEAMS SELECTION - HIDDEN */}
                {/* Teams selection section is now hidden as requested */}

                {/* 4. WORKFLOWS SELECTION */}
                <div className={`bg-orange-50 dark:bg-orange-900/10 border-2 rounded-lg p-3 sm:p-4 md:p-5 space-y-3 ${selectedWorkflows.length === 0 ? 'border-red-300 dark:border-red-800' : 'border-orange-200 dark:border-orange-800'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Workflow className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                      <Label className="text-sm sm:text-base font-semibold text-foreground">
                        Associar a Workflows
                      </Label>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-xs">
                      {selectedWorkflows.length} selecionados
                    </Badge>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Selecione pelo menos um workflow para processar o documento.
                  </p>
                  
                  {selectedWorkflows.length === 0 && (
                    <p className="text-xs mt-1 text-[#9f9b9b]">
                      * Campo obrigatório
                    </p>
                  )}

                  {availableWorkflows.length > 0 ? (
                    <div className="space-y-3">
                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleSelectAllWorkflows}
                          className="text-xs sm:text-sm border-border hover:bg-muted h-8 sm:h-9"
                        >
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Selecionar Todos
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleClearAllWorkflows}
                          className="text-xs sm:text-sm border-border hover:bg-muted h-8 sm:h-9"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Limpar Seleção
                        </Button>
                      </div>

                      {/* Workflows List */}
                      <div className="border-2 border-border rounded-lg bg-card shadow-sm">
                        <div className="max-h-32 sm:max-h-40 md:max-h-48 overflow-y-auto p-2">
                          <div className="space-y-1">
                            {availableWorkflows.map((workflow) => (
                              <div key={workflow.id} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 hover:bg-muted rounded-md transition-colors">
                                <Checkbox
                                  id={`workflow-${workflow.id}`}
                                  checked={selectedWorkflows.includes(workflow.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      handleWorkflowSelect(workflow.id);
                                    } else {
                                      handleWorkflowRemove(workflow.id);
                                    }
                                  }}
                                  className="h-4 w-4"
                                />
                                <label 
                                  htmlFor={`workflow-${workflow.id}`} 
                                  className="text-sm cursor-pointer select-none text-foreground flex-1 font-medium"
                                >
                                  {workflow.name}
                                </label>
                                <Badge variant="outline" className="text-xs px-2 py-0 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                                  Disponível
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Selected Workflows Display */}
                      {selectedWorkflows.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-foreground">
                            Workflows Selecionados:
                          </Label>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {selectedWorkflows.map(workflowId => {
                              const workflow = availableWorkflows.find(w => w.id === workflowId);
                              return workflow ? (
                                <Badge
                                  key={workflow.id}
                                  variant="default"
                                  className="bg-orange-600 text-white px-2 py-1 text-xs hover:bg-orange-700"
                                >
                                  <Workflow className="w-3 h-3 mr-1" />
                                  <span className="truncate max-w-24 sm:max-w-none">{workflow.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleWorkflowRemove(workflow.id)}
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
                  ) : (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        Você não está associado a nenhum workflow ativo no momento.
                      </p>
                    </div>
                  )}
                </div>

                {/* 6. Submit Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-border">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleBackToDocuments}
                    className="h-10 sm:h-auto px-4 sm:px-6 order-2 sm:order-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="woopi-ai-button-primary h-10 sm:h-auto px-4 sm:px-6 order-1 sm:order-2"
                    disabled={uploadFiles.length === 0 || isUploading}
                  >
                    {isUploading ? 'Enviando...' : 'Enviar Documento'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>


        </div>
      </ScrollArea>

      {/* DocumentsSidebar */}
      <DocumentsSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
}