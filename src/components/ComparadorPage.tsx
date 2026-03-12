import React, { useState, useRef, useCallback } from 'react';
import {
  FileDiff,
  Upload,
  X,
  FileText,
  Trash2,
  Eye,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { toast } from 'sonner@2.0.3';

// Types
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface ComparisonRecord {
  id: string;
  documentA: string;
  documentB: string;
  dateCompared: string;
  status: 'concluido' | 'em_andamento' | 'erro';
  differencesFound: number;
  similarity: number;
}

// Mock data for previously compared documents
const mockComparisons: ComparisonRecord[] = [
  {
    id: 'comp-001',
    documentA: 'Contrato_Fornecedor_V1.pdf',
    documentB: 'Contrato_Fornecedor_V2.pdf',
    dateCompared: '2026-02-19T14:30:00',
    status: 'concluido',
    differencesFound: 12,
    similarity: 87,
  },
  {
    id: 'comp-002',
    documentA: 'Politica_Privacidade_2025.pdf',
    documentB: 'Politica_Privacidade_2026.pdf',
    dateCompared: '2026-02-18T09:15:00',
    status: 'concluido',
    differencesFound: 34,
    similarity: 72,
  },
  {
    id: 'comp-003',
    documentA: 'NDA_ClienteX_Draft.pdf',
    documentB: 'NDA_ClienteX_Final.pdf',
    dateCompared: '2026-02-17T16:45:00',
    status: 'concluido',
    differencesFound: 5,
    similarity: 95,
  },
  {
    id: 'comp-004',
    documentA: 'Relatorio_Financeiro_Q3.pdf',
    documentB: 'Relatorio_Financeiro_Q4.pdf',
    dateCompared: '2026-02-16T11:00:00',
    status: 'em_andamento',
    differencesFound: 0,
    similarity: 0,
  },
  {
    id: 'comp-005',
    documentA: 'SLA_Servico_Antigo.pdf',
    documentB: 'SLA_Servico_Novo.pdf',
    dateCompared: '2026-02-15T08:20:00',
    status: 'erro',
    differencesFound: 0,
    similarity: 0,
  },
  {
    id: 'comp-006',
    documentA: 'Contrato_Locacao_Original.pdf',
    documentB: 'Contrato_Locacao_Aditivo.pdf',
    dateCompared: '2026-02-14T10:30:00',
    status: 'concluido',
    differencesFound: 18,
    similarity: 81,
  },
];

// Dropzone component - PDF only
function DropZone({
  label,
  version,
  file,
  onFileSelect,
  onFileRemove,
  isAnalyzing,
}: {
  label: string;
  version: string;
  file: UploadedFile | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  isAnalyzing: boolean;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validatePdf = (file: File): boolean => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Apenas arquivos PDF são aceitos');
      return false;
    }
    return true;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && validatePdf(droppedFile)) {
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validatePdf(selectedFile)) {
      onFileSelect(selectedFile);
    }
    // Reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="flex-1 min-w-0">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleInputChange}
        disabled={isAnalyzing}
      />
      <div
        onClick={() => !file && !isAnalyzing && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative rounded-xl border-2 border-dashed transition-all duration-300
          ${file
            ? 'border-[#0073ea] bg-[#0073ea]/5'
            : isDragOver
              ? 'border-[#0073ea] bg-[#0073ea]/10 scale-[1.02]'
              : 'border-[#0073ea]/30 bg-[#0073ea]/[0.03] hover:border-[#0073ea]/60 hover:bg-[#0073ea]/[0.06]'
          }
          ${!file && !isAnalyzing ? 'cursor-pointer' : ''}
          min-h-[220px] flex flex-col items-center justify-center p-6
        `}
      >
        {file ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="w-12 h-12 rounded-xl bg-card border-2 border-[#0073ea]/20 flex items-center justify-center shadow-sm">
              <span className="text-[#0073ea] text-lg">{version}</span>
            </div>
            <div className="text-center">
              <p className="text-[#0073ea] truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatFileSize(file.size)}</p>
              <div className="flex items-center gap-1 justify-center mt-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs text-emerald-600">Pronto para comparar</span>
              </div>
            </div>
            {!isAnalyzing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileRemove();
                }}
                className="text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 mt-1"
              >
                <X className="w-4 h-4 mr-1" />
                Remover
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-card border-2 border-[#0073ea]/20 flex items-center justify-center shadow-sm">
              <span className="text-[#0073ea] text-lg">{version}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0073ea]/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-[#0073ea]/60" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Arraste ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground/50 mt-0.5">
                Somente arquivos PDF
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Delete confirmation dialog
function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  comparisonName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  comparisonName: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            Excluir Comparação
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a comparação <strong>"{comparisonName}"</strong>? 
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main page component
export function ComparadorPage() {
  const navigate = useNavigate();
  const [fileA, setFileA] = useState<UploadedFile | null>(null);
  const [fileB, setFileB] = useState<UploadedFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [comparisons, setComparisons] = useState<ComparisonRecord[]>(mockComparisons);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [comparisonToDelete, setComparisonToDelete] = useState<ComparisonRecord | null>(null);

  const handleFileSelect = (slot: 'A' | 'B') => (file: File) => {
    const uploaded: UploadedFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
    };
    if (slot === 'A') setFileA(uploaded);
    else setFileB(uploaded);
  };

  const handleAnalyze = () => {
    if (!fileA || !fileB) {
      toast.error('Selecione dois documentos PDF para comparar');
      return;
    }
    // Navigate to analysis page with file info
    navigate('/documentos/comparador/analise', {
      state: {
        fileA: { name: fileA.name, size: fileA.size },
        fileB: { name: fileB.name, size: fileB.size },
      }
    });
  };

  const handleViewResult = (comparison: ComparisonRecord) => {
    navigate('/documentos/comparador/analise', {
      state: {
        fileA: { name: comparison.documentA, size: 0 },
        fileB: { name: comparison.documentB, size: 0 },
        fromHistory: true,
        comparisonId: comparison.id,
      }
    });
  };

  const handleDeleteClick = (comparison: ComparisonRecord) => {
    setComparisonToDelete(comparison);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (comparisonToDelete) {
      setComparisons((prev) => prev.filter((c) => c.id !== comparisonToDelete.id));
      toast.success('Comparação excluída com sucesso');
      setDeleteDialogOpen(false);
      setComparisonToDelete(null);
    }
  };

  const handleReset = () => {
    setFileA(null);
    setFileB(null);
    setIsAnalyzing(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredComparisons = comparisons
    .filter((c) => {
      const matchesSearch =
        searchQuery === '' ||
        c.documentA.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.documentB.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.dateCompared).getTime();
      const dateB = new Date(b.dateCompared).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const getStatusBadge = (status: ComparisonRecord['status']) => {
    switch (status) {
      case 'concluido':
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Concluído
          </Badge>
        );
      case 'em_andamento':
        return (
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Em andamento
          </Badge>
        );
      case 'erro':
        return (
          <Badge className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            Erro
          </Badge>
        );
    }
  };

  const bothFilesReady = fileA !== null && fileB !== null;

  return (
    <TooltipProvider>
      <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl woopi-ai-text-primary flex items-center gap-2">
              <FileDiff className="w-6 h-6 text-[#0073ea]" />
              Comparador
            </h1>
            
          </div>
        </div>

        {/* Upload Area */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl text-[#0073ea] italic">Compare o conteúdo dos documentos</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Revisão e Análise Inteligente de Documentos
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <DropZone
                label="Documento Original"
                version="V1"
                file={fileA}
                onFileSelect={handleFileSelect('A')}
                onFileRemove={() => setFileA(null)}
                isAnalyzing={isAnalyzing}
              />
              <DropZone
                label="Documento Revisado"
                version="V2"
                file={fileB}
                onFileSelect={handleFileSelect('B')}
                onFileRemove={() => setFileB(null)}
                isAnalyzing={isAnalyzing}
              />
            </div>

            <div className="flex items-center justify-center gap-3">
              {(fileA || fileB) && !isAnalyzing && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Limpar
                </Button>
              )}
              <Button
                onClick={handleAnalyze}
                disabled={!bothFilesReady || isAnalyzing}
                className={`
                  px-8 py-2.5 rounded-full gap-2 shadow-md transition-all duration-300
                  ${bothFilesReady
                    ? 'bg-[#0073ea] hover:bg-[#0060c2] text-white cursor-pointer'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }
                `}
              >
                <FileDiff className="w-4 h-4" />
                Analisar Diferenças
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comparisons History */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              Comparações Anteriores
              <Badge variant="outline" className="ml-1">
                {filteredComparisons.length}
              </Badge>
            </h3>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome do documento..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 w-full sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[140px]">
                  <Filter className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="em_andamento">Em andamento</SelectItem>
                  <SelectItem value="erro">Erro</SelectItem>
                </SelectContent>
              </Select>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-2.5"
                    onClick={() =>
                      setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
                    }
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {sortOrder === 'desc' ? 'Mais recentes primeiro' : 'Mais antigos primeiro'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <Card className="border shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[30%]">Documento A (V1)</TableHead>
                    <TableHead className="w-[30%]">Documento B (V2)</TableHead>
                    <TableHead className="w-[15%]">Data</TableHead>
                    <TableHead className="w-[10%]">Status</TableHead>
                    <TableHead className="w-[8%] text-center">Similaridade</TableHead>
                    <TableHead className="w-[7%] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComparisons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <FileDiff className="w-8 h-8" />
                          <p className="text-sm">Nenhuma comparação encontrada</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredComparisons.map((comparison) => (
                      <TableRow
                        key={comparison.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#0073ea] flex-shrink-0" />
                            <span className="text-sm truncate max-w-[250px]">
                              {comparison.documentA}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#0073ea] flex-shrink-0" />
                            <span className="text-sm truncate max-w-[250px]">
                              {comparison.documentB}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(comparison.dateCompared)}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(comparison.status)}</TableCell>
                        <TableCell className="text-center">
                          {comparison.status === 'concluido' ? (
                            <Badge
                              variant="outline"
                              className={`
                                ${comparison.similarity >= 90
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                                  : comparison.similarity >= 70
                                    ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                                    : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                                }
                              `}
                            >
                              {comparison.similarity}%
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-[#2d3354]"
                                  onClick={() => handleViewResult(comparison)}
                                  disabled={comparison.status !== 'concluido'}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Visualizar resultado</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                                  onClick={() => handleDeleteClick(comparison)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Excluir comparação</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* Modals */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setComparisonToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          comparisonName={
            comparisonToDelete
              ? `${comparisonToDelete.documentA} vs ${comparisonToDelete.documentB}`
              : ''
          }
        />
      </div>
    </TooltipProvider>
  );
}
// End of ComparadorPage