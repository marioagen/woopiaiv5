import React, { useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

export function AnonimizarButton() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const toastId = toast.loading('Anonimizando documento e preparando download...', {
      duration: Infinity,
    });

    // Simula processamento de anonimização + geração do arquivo
    setTimeout(() => {
      // Simula criação de blob para download
      const fakeContent = 'Documento anonimizado - conteúdo simulado';
      const blob = new Blob([fakeContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      toast.success('Documento anonimizado com sucesso! Iniciando download...', {
        id: toastId,
        duration: 4000,
        action: {
          label: 'Baixar novamente',
          onClick: () => {
            const a = document.createElement('a');
            a.href = url;
            a.download = 'documento_anonimizado.pdf';
            a.click();
          },
        },
      });

      // Dispara download automaticamente
      const a = document.createElement('a');
      a.href = url;
      a.download = 'documento_anonimizado.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isProcessing}
      className={`flex items-center gap-2 whitespace-nowrap ${
        isProcessing
          ? 'border-amber-400 text-amber-600 dark:border-amber-500 dark:text-amber-400 cursor-not-allowed opacity-80'
          : 'border-[#0073ea] text-[#0073ea] hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:border-[#0073ea] dark:text-[#4d9ef5]'
      }`}
    >
      {isProcessing ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ShieldCheck className="w-4 h-4" />
      )}
      {isProcessing ? 'Processando...' : 'Anonimizar documento'}
    </Button>
  );
}
