import React, { useEffect, useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router';

interface DocumentsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentsSidebar({ isOpen, onClose }: DocumentsSidebarProps) {
  const navigate = useNavigate();
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default to expanded width

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  // Detect main sidebar width by checking its current width
  useEffect(() => {
    if (isOpen) {
      const mainSidebar = document.querySelector('aside');
      if (mainSidebar) {
        const observer = new ResizeObserver((entries) => {
          for (const entry of entries) {
            setSidebarWidth(entry.contentRect.width);
          }
        });
        
        observer.observe(mainSidebar);
        
        // Initial width detection
        setSidebarWidth(mainSidebar.offsetWidth);
        
        return () => observer.disconnect();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - positioned to exclude main sidebar and topbar */}
      <div 
        className="fixed top-16 bottom-0 right-0 bg-black/60 z-40"
        style={{ left: `${sidebarWidth}px` }}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="absolute left-0 top-0 bottom-0 w-[261px] bg-white shadow-lg z-50 overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Main content */}
        <div className="p-5">
          {/* Documentos section - Updated with new navigation structure */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#323743]">Documentos</h3>
              <ChevronRight className="w-3 h-3 text-gray-400 rotate-90" />
            </div>
            
            <div className="ml-3 space-y-3">
              <button 
                className="flex items-center space-x-3 w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                onClick={() => handleNavigation('/documentos/carregar')}
              >
                <div className="w-[19px] h-[19px] bg-center bg-cover bg-no-repeat" 
                     style={{backgroundImage: "url('https://img.icons8.com/fluency/48/upload-to-cloud.png')"}} />
                <span className="text-[13px] text-[#323743]">Carregar</span>
              </button>
              
              <button 
                className="flex items-center space-x-3 w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                onClick={() => handleNavigation('/documentos')}
              >
                <div className="w-[19px] h-5 bg-center bg-cover bg-no-repeat" 
                     style={{backgroundImage: "url('https://img.icons8.com/color/48/property.png')"}} />
                <span className="text-[13px] text-[#323743]">Lista</span>
              </button>
              
              <button 
                className="flex items-center space-x-3 w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                onClick={() => handleNavigation('/documentos/8021/extrair')}
              >
                <div className="w-[19px] h-5 bg-center bg-cover bg-no-repeat" 
                     style={{backgroundImage: "url('https://img.icons8.com/color/48/data-extraction.png')"}} />
                <span className="text-[13px] text-[#323743]">Análise de Extração</span>
              </button>
            </div>
          </div>

          {/* Navigation section - Updated with direct links to main menu items */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-[#323743]">Navegação</h3>
              <ChevronRight className="w-3 h-3 text-gray-400 rotate-90" />
            </div>
            
            <div className="ml-3 space-y-3">
              <button 
                className="flex items-center space-x-3 w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                onClick={() => handleNavigation('/tipos')}
              >
                <div className="w-5 h-5 bg-center bg-cover bg-no-repeat" 
                     style={{backgroundImage: "url('https://img.icons8.com/color/48/folder-invoices.png')"}} />
                <span className="text-[14px] text-[#323743]">Tipos</span>
              </button>
              
              <button 
                className="flex items-center space-x-3 w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                onClick={() => handleNavigation('/perguntas')}
              >
                <div className="w-[19px] h-[19px] bg-center bg-cover bg-no-repeat" 
                     style={{backgroundImage: "url('https://img.icons8.com/color/48/ask-question.png')"}} />
                <span className="text-[13px] text-[#323743]">Perguntas</span>
              </button>
              
              <button 
                className="flex items-center space-x-3 w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                onClick={() => handleNavigation('/questionarios')}
              >
                <div className="w-[19px] h-[19px] bg-center bg-cover bg-no-repeat" 
                     style={{backgroundImage: "url('https://img.icons8.com/color/48/survey.png')"}} />
                <span className="text-[13px] text-[#323743]">Questionários</span>
              </button>
              
              {/* API Templates - Escondido do menu, mas página mantida para uso futuro */}
              {/* <button 
                className="flex items-center space-x-3 w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                onClick={() => handleNavigation('/templates/api')}
              >
                <div className="w-[19px] h-[19px] bg-center bg-cover bg-no-repeat" 
                     style={{backgroundImage: "url('https://img.icons8.com/color/48/api-settings.png')"}} />
                <span className="text-[13px] text-[#323743]">API Templates</span>
              </button> */}
            </div>
          </div>

          {/* Future submenu placeholder - Prepared for future additions */}
          <div className="submenu-placeholder" style={{ display: 'none' }}>
            {/* Reserved space for future submenu items */}
          </div>
        </div>
      </div>
    </>
  );
}