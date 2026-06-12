import React from 'react';
import { Loader2, Save } from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';

interface SubmitButtonProps extends React.ComponentProps<'button'> {
  isLoading?: boolean;
  loadingLabel?: string;
  icon?: React.ReactNode;
  className?: string;
  /** Mensagem exibida ao passar o mouse quando o botão está desabilitado (ex.: "Nenhuma alteração para salvar"). */
  disabledHint?: string;
  children: React.ReactNode;
}

export function SubmitButton({
  isLoading = false,
  loadingLabel,
  icon,
  className,
  disabledHint,
  children,
  disabled,
  ...props
}: SubmitButtonProps) {
  const resolvedLoadingLabel = loadingLabel ?? (
    typeof children === 'string'
      ? `${children.replace(/^(Salvar|Criar|Atualizar|Enviar)/, (m) => {
          const map: Record<string, string> = {
            Salvar: 'Salvando',
            Criar: 'Criando',
            Atualizar: 'Atualizando',
            Enviar: 'Enviando',
          };
          return map[m] ?? m;
        })}...`
      : 'Aguarde...'
  );

  const isBlocked = !isLoading && !!disabled;

  const button = (
    <Button
      className={cn('woopi-ai-button-primary transition-opacity', className)}
      disabled={isLoading || disabled}
      aria-disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {resolvedLoadingLabel}
        </>
      ) : (
        <>
          {icon ?? <Save className="w-4 h-4 mr-2" />}
          {children}
        </>
      )}
    </Button>
  );

  // Botão desabilitado tem pointer-events-none, então o tooltip nativo (title)
  // não aparece. Envolvemos em um wrapper que captura o hover e mostra a dica.
  if (isBlocked && disabledHint) {
    return (
      <span
        title={disabledHint}
        className="inline-flex cursor-not-allowed"
        tabIndex={-1}
      >
        {button}
      </span>
    );
  }

  return button;
}
