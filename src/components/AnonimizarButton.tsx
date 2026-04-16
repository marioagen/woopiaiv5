import React, { useState } from 'react';
import { ShieldCheck, Loader2, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export const ANONYMIZATION_TYPES = [
  { value: 'mascaramento_total', label: 'Mascaramento total' },
  { value: 'mascaramento_parcial', label: 'Mascaramento parcial' },
  { value: 'substituir_iniciais', label: 'Substituir com iniciais' },
  { value: 'dados_ficticios', label: 'Dados fictícios' },
  { value: 'referencias_relativas', label: 'Referências relativas' },
];

export const PROMPTS = [
  { value: 'padrao', label: 'Padrão — anonimização geral' },
  { value: 'lgpd', label: 'LGPD — dados pessoais sensíveis' },
  { value: 'financeiro', label: 'Financeiro — valores e contas' },
  { value: 'juridico', label: 'Jurídico — partes e contratos' },
  { value: 'medico', label: 'Médico — dados de saúde' },
];

export interface AnonymizationResult {
  type: string;
  prompt: string;
  downloadUrl: string;
}

interface AnonimizarButtonProps {
  /** Called after successful anonymization. When provided, download is offered
   *  via toast action instead of triggering automatically. */
  onAnonymized?: (result: AnonymizationResult) => void;
  /** 're-anonymize' variant shows a secondary-style button for subsequent runs */
  variant?: 'initial' | 're-anonymize';
}

export function AnonimizarButton({ onAnonymized, variant = 'initial' }: AnonimizarButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');

  const handleButtonClick = () => {
    if (isProcessing) return;
    setSelectedType('');
    setSelectedPrompt('');
    setModalOpen(true);
  };

  const handleConfirm = () => {
    setModalOpen(false);
    setIsProcessing(true);

    const toastId = toast.loading('Anonimizando documento...', {
      duration: Infinity,
    });

    setTimeout(() => {
      const fakeContent = 'Documento anonimizado - conteúdo simulado';
      const blob = new Blob([fakeContent], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);

      const result: AnonymizationResult = {
        type: selectedType,
        prompt: selectedPrompt,
        downloadUrl,
      };

      if (onAnonymized) {
        // In-page preview mode: offer download via toast action
        toast.success('Documento anonimizado com sucesso!', {
          id: toastId,
          duration: 5000,
          action: {
            label: 'Baixar PDF',
            onClick: () => {
              const a = document.createElement('a');
              a.href = downloadUrl;
              a.download = 'documento_anonimizado.pdf';
              a.click();
            },
          },
        });
        onAnonymized(result);
      } else {
        // Legacy mode: auto-download
        toast.success('Documento anonimizado com sucesso! Iniciando download...', {
          id: toastId,
          duration: 4000,
          action: {
            label: 'Baixar novamente',
            onClick: () => {
              const a = document.createElement('a');
              a.href = downloadUrl;
              a.download = 'documento_anonimizado.pdf';
              a.click();
            },
          },
        });

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'documento_anonimizado.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
      }

      setIsProcessing(false);
    }, 2200);
  };

  const isReAnonymize = variant === 're-anonymize';

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleButtonClick}
        disabled={isProcessing}
        className={`flex items-center gap-2 whitespace-nowrap ${
          isProcessing
            ? 'border-amber-400 text-amber-600 dark:border-amber-500 dark:text-amber-400 cursor-not-allowed opacity-80'
            : isReAnonymize
            ? 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800'
            : 'border-[#0073ea] text-[#0073ea] hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:border-[#0073ea] dark:text-[#4d9ef5]'
        }`}
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isReAnonymize ? (
          <RefreshCw className="w-4 h-4" />
        ) : (
          <ShieldCheck className="w-4 h-4" />
        )}
        {isProcessing
          ? 'Processando...'
          : isReAnonymize
          ? 'Re-anonimizar'
          : 'Anonimizar documento'}
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-xl border border-border/60 shadow-xl">
          {/* Header */}
          <DialogHeader className="px-6 pt-8 pb-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#0073ea]/10 flex items-center justify-center mt-0.5">
                <ShieldCheck className="w-5 h-5 text-[#0073ea]" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base font-semibold text-foreground leading-tight">
                  {isReAnonymize ? 'Re-anonimizar Documento' : 'Anonimizar Documento'}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-0.5 leading-snug">
                  {isReAnonymize
                    ? 'Configure novas opções para gerar uma nova versão anonimizada'
                    : 'Configure as opções de anonimização e selecione um prompt'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="px-6 py-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Tipo de Anonimização{' '}
                <span className="text-muted-foreground font-normal">(Opcional)</span>
              </Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full h-10 text-sm">
                  <SelectValue placeholder="Selecione um tipo de anonimização..." />
                </SelectTrigger>
                <SelectContent>
                  {ANONYMIZATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Prompt{' '}
                <span className="text-muted-foreground font-normal">(Opcional)</span>
              </Label>
              <Select value={selectedPrompt} onValueChange={setSelectedPrompt}>
                <SelectTrigger className="w-full h-10 text-sm">
                  <SelectValue placeholder="Selecione um prompt..." />
                </SelectTrigger>
                <SelectContent>
                  {PROMPTS.map((prompt) => (
                    <SelectItem key={prompt.value} value={prompt.value}>
                      {prompt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pt-2 pb-6 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleConfirm}
              className="bg-[#0073ea] hover:bg-[#0060c7] text-white text-sm font-medium px-5 h-9"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              {isReAnonymize ? 'Confirmar Re-anonimização' : 'Confirmar Anonimização'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
