import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Video, Book, FileText } from 'lucide-react';
import { Button } from './ui/button';

export function HomePage() {
  const navigate = useNavigate();
  const [showWhatsAppTooltip, setShowWhatsAppTooltip] = useState(false);

  useEffect(() => {
    // Mostrar tooltip após 1 segundo
    const timer = setTimeout(() => {
      setShowWhatsAppTooltip(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4 pt-8">
            <h1 className="text-4xl text-foreground">
              Bem-vindo ao Woopi AI!
            </h1>
            <p className="text-lg text-muted-foreground">
              Sua jornada para automatizar e otimizar processos com inteligência artificial começa agora.
            </p>
          </div>

          {/* Subscription Card */}
          <div className="bg-card rounded-lg border border-border p-8 text-center shadow-sm">
            <p className="text-muted-foreground mb-2">
              Você adquiriu o
            </p>
            <h2 className="text-3xl text-[#0073ea] mb-2">
              QA-SUBSCRIPTION
            </h2>
            <p className="text-muted-foreground">
              Agradecemos por escolher a nossa plataforma!
            </p>
          </div>

          {/* Quick Start Section */}
          <div className="space-y-6">
            <h2 className="text-2xl text-foreground text-center">
              Trilha de Iniciação Rápida
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 - Conheça a Plataforma */}
              <div 
                className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow animate-fadeInUp"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                    <Video className="w-8 h-8 text-[#0073ea]" />
                  </div>
                  <h3 className="text-xl text-foreground">
                    Conheça a Plataforma
                  </h3>
                  <p className="text-muted-foreground">
                    Assista a um tour guiado de 5 minutos sobre as principais funcionalidades.
                  </p>
                  <Button 
                    variant="link" 
                    className="text-[#0073ea] p-0 h-auto"
                    onClick={() => {
                      // TODO: Add video link
                      console.log('Ver vídeo clicked');
                    }}
                  >
                    Ver vídeo →
                  </Button>
                </div>
              </div>

              {/* Card 2 - Seu Primeiro Workflow */}
              <div 
                className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow animate-fadeInUp"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                    <Book className="w-8 h-8 text-[#0073ea]" />
                  </div>
                  <h3 className="text-xl text-foreground">
                    Seu Primeiro Workflow
                  </h3>
                  <p className="text-muted-foreground">
                    Siga nosso guia passo-a-passo para criar sua primeira automação em minutos.
                  </p>
                  <Button 
                    variant="link" 
                    className="text-[#0073ea] p-0 h-auto"
                    onClick={() => {
                      // TODO: Add guide link
                      console.log('Iniciar guia clicked');
                    }}
                  >
                    Iniciar guia →
                  </Button>
                </div>
              </div>

              {/* Card 3 - Explore a Documentação */}
              <div 
                className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow animate-fadeInUp"
                style={{ animationDelay: '0.3s' }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-[#0073ea]" />
                  </div>
                  <h3 className="text-xl text-foreground">
                    Explore a Documentação
                  </h3>
                  <p className="text-muted-foreground">
                    Consulte nossa documentação completa para explorar todo o potencial do WOOPI AI.
                  </p>
                  <Button 
                    variant="link" 
                    className="text-[#0073ea] p-0 h-auto"
                    onClick={() => {
                      // TODO: Add docs link
                      console.log('Acessar docs clicked');
                    }}
                  >
                    Acessar docs →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-5 right-10 z-50 animate-fadeInScale" style={{ animationDelay: '0.5s' }}>
        <div className="relative group">
          {/* Tooltip */}
          <div 
            className={`absolute bottom-full right-0 mb-2 whitespace-nowrap transition-all duration-300 ${
              showWhatsAppTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <div className="bg-card text-foreground px-4 py-2 rounded-lg text-sm font-normal shadow-md border border-border">
              Fale com o suporte
              <div className="absolute top-full right-5 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-card"></div>
            </div>
          </div>

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/+5511918020002"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Fale com o suporte via WhatsApp"
          >
            <svg
              className="w-7 h-7 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}