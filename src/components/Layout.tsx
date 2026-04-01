import React, { useState, useEffect } from 'react';
import { 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Globe,
  Check,
  User,
  Home,
  BarChart3,
  Users2,
  FileText,
  ClipboardList,
  Palette,
  Workflow,
  Database,
  PocketKnife,
  Zap,
  Braces,
  ShieldUser,
  FileDiff,
  Moon,
  Sun,
  Bell,
  Bot,
  Plug,
  Kanban,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// Logo assets
import woopiLogoLight from 'figma:asset/d0e110e88aea65bfb09073174b18b4e3597f0769.png';
import woopiLogoDark from 'figma:asset/4a827bcd6fba2a68b95dda353e5dbc1a88ba0e45.png';
import woopiIcon from 'figma:asset/6c8f0e3b72bb316726e1242a6642fceb52c5f6b5.png';

// Logo icon for collapsed sidebar
const LogoIcon = () => (
  <div className="w-10 h-10 bg-woopi-ai-blue rounded-lg flex items-center justify-center">
    <svg
      className="w-5 h-5"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 18 18"
    >
      <path
        d="M11.25 2.8125V6.1875C11.25 6.43614 11.3488 6.67487 11.5246 6.85041C11.7004 7.02594 11.9391 7.125 12.1875 7.125H15.5625"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45833"
      />
      <path
        d="M13.5 15.1875H4.5C4.00272 15.1875 3.52581 14.9901 3.17417 14.6384C2.82254 14.2868 2.625 13.8099 2.625 13.3125V4.6875C2.625 4.19022 2.82254 3.71331 3.17417 3.36168C3.52581 3.00004 4.00272 2.8125 4.5 2.8125H11.25L15.375 6.9375V13.3125C15.375 13.8099 15.1775 14.2868 14.8258 14.6384C14.4742 14.9901 13.9973 15.1875 13.5 15.1875Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45833"
      />
      <path
        d="M7.29167 6.5625H5.83333"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45833"
      />
      <path
        d="M11.6667 9.47917H5.83333"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45833"
      />
      <path
        d="M11.6667 12.3958H5.83333"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45833"
      />
    </svg>
  </div>
);

// Custom colored icons to match Icons8 style
const ColoredUsersIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <Users2 className="w-full h-full text-orange-500" />
  </div>
);

const ColoredDocumentIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <FileText className="w-full h-full text-blue-500" />
  </div>
);

const ColoredQuestionnaireIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <ClipboardList className="w-full h-full text-violet-500" />
  </div>
);

const ColoredStyleGuideIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <Palette className="w-full h-full text-pink-500" />
  </div>
);

const ColoredWorkflowIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <Kanban className="w-full h-full text-indigo-500" />
  </div>
);

const ColoredWorkflowEditIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <Workflow className="w-full h-full text-teal-500" />
  </div>
);

const ColoredWorkflowGestaoIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <Workflow className="w-full h-full text-cyan-500" />
  </div>
);

const ColoredExtractionIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <Database className="w-full h-full text-emerald-500" />
  </div>
);

const ColoredTemplateIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <PocketKnife className="w-full h-full text-violet-500" />
  </div>
);

const ColoredAPIIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <Zap className="w-full h-full text-violet-500" />
  </div>
);

const ColoredAuditIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <ShieldUser className="w-full h-full text-red-500" />
  </div>
);

const ColoredComparadorIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <FileDiff className="w-full h-full text-sky-500" />
  </div>
);

const ColoredPromptsIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <Braces className="w-full h-full text-violet-500" />
  </div>
);

const ColoredHomeIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <Home className="w-full h-full text-blue-500" />
  </div>
);

const ColoredDashboardIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <BarChart3 className="w-full h-full text-green-500" />
  </div>
);

const ColoredAgentesIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <Bot className="w-full h-full text-violet-500" />
  </div>
);

const ColoredConnectoresIcon = ({ className }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center`}>
    <Plug className="w-full h-full text-violet-500" />
  </div>
);

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  route?: string;
}

interface NavigationGroup {
  type: 'group';
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  children: NavigationItem[];
}

type NavEntry = NavigationItem | NavigationGroup;

interface Language {
  code: string;
  name: string;
  flagClass: string;
  abbreviation: string;
}

interface Tenant {
  id: string;
  name: string;
  initials: string;
  email: string;
  description?: string;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('PT');
  const [selectedTenant, setSelectedTenant] = useState('main');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ ferramentas: true });
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDark, toggleDark } = useDarkMode();

  // Update favicon dynamically
  useEffect(() => {
    const updateFavicon = () => {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = woopiIcon;
      link.type = 'image/png';
    };
    updateFavicon();
  }, []);

  const languages: Language[] = [
    {
      code: 'pt-BR',
      name: 'Português',
      flagClass: 'flag-brazil',
      abbreviation: 'PT'
    },
    {
      code: 'en-US',
      name: 'English',
      flagClass: 'flag-usa',
      abbreviation: 'EN'
    },
    {
      code: 'es-ES',
      name: 'Español',
      flagClass: 'flag-spain',
      abbreviation: 'ES'
    }
  ];

  const tenants: Tenant[] = [
    {
      id: 'main',
      name: 'Tenant name',
      initials: 'OP',
      email: 'admin@organizacao.com.br',
      description: 'Tenant principal do sistema'
    },
    {
      id: 'branch-sp',
      name: 'Filial São Paulo',
      initials: 'SP',
      email: 'sp@filiais.com.br',
      description: 'Unidade de São Paulo'
    },
    {
      id: 'branch-rj',
      name: 'Filial Rio de Janeiro',
      initials: 'RJ',
      email: 'rj@filiais.com.br',
      description: 'Unidade do Rio de Janeiro'
    },
    {
      id: 'branch-mg',
      name: 'Filial Minas Gerais',
      initials: 'MG',
      email: 'mg@filiais.com.br',
      description: 'Unidade de Minas Gerais'
    }
  ];

  const navEntries: NavEntry[] = [
    { 
      name: 'Home', 
      href: 'home', 
      icon: ColoredHomeIcon, 
      description: 'Página inicial do sistema',
      route: '/home'
    },
    { 
      name: 'Gestão de Usuários', 
      href: 'usuarios', 
      icon: ColoredUsersIcon, 
      description: 'Gerenciar usuários, times e perfis',
      route: '/gestaodeusuarios'
    },
    { 
      name: 'Esteiras de Processamento', 
      href: 'workflow', 
      icon: ColoredWorkflowIcon, 
      description: 'Visualizar fluxo de processamento por equipes',
      route: '/documentos/workflow'
    },
    { 
      name: 'Gestão de Esteiras', 
      href: 'workflow-gestao', 
      icon: ColoredWorkflowGestaoIcon, 
      description: 'Gestão avançada de workflows',
      route: '/documentos/workflow/gestao'
    },
    {
      type: 'group',
      name: 'Ferramentas',
      href: 'ferramentas',
      icon: ColoredTemplateIcon,
      description: 'Ferramentas e integrações do sistema',
      children: [
        { 
          name: 'Agentes', 
          href: 'prompts', 
          icon: ColoredAgentesIcon, 
          description: 'Gerenciar agentes de IA do sistema',
          route: '/prompts'
        },
        { 
          name: 'Conectores', 
          href: 'ferramentas', 
          icon: ColoredConnectoresIcon, 
          description: 'Gerenciar conectores e integrações',
          route: '/ferramentas'
        },
        { 
          name: 'Templates de API', 
          href: 'api-templates', 
          icon: ColoredAPIIcon, 
          description: 'Gerenciar templates de API do sistema',
          route: '/templates/api'
        },
        { 
          name: 'Questionários', 
          href: 'questionarios', 
          icon: ColoredQuestionnaireIcon, 
          description: 'Gerenciar questionários do sistema',
          route: '/questionarios'
        },
      ]
    },
    { 
      name: 'Painel de Consumo', 
      href: 'dashboard',
      icon: ColoredDashboardIcon, 
      description: 'Painel de consumo e bilhetagem',
      route: '/dashboard'
    },
    { 
      name: 'Análise de Extração', 
      href: 'extraction', 
      icon: ColoredExtractionIcon, 
      description: 'Análise avançada com extração de dados',
      route: '/documentos/8021/extrair'
    },
    { 
      name: 'Auditoria', 
      href: 'auditoria', 
      icon: ColoredAuditIcon, 
      description: 'Histórico de alterações e auditoria de documentos',
      route: '/auditoria'
    },
    { 
      name: 'Comparador', 
      href: 'comparador', 
      icon: ColoredComparadorIcon, 
      description: 'Comparar documentos e versões',
      route: '/documentos/comparador'
    },
    { 
      name: 'Style Guide', 
      href: 'styleguide', 
      icon: ColoredStyleGuideIcon, 
      description: 'Guia de componentes e design system',
      route: '/styleguide'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language.abbreviation);
    console.log(`Language changed to: ${language.name} (${language.code})`);
  };

  const handleTenantChange = (tenant: Tenant) => {
    setSelectedTenant(tenant.id);
    console.log(`Tenant changed to: ${tenant.name} (${tenant.id})`);
  };

  const currentTenant = tenants.find(tenant => tenant.id === selectedTenant) || tenants[0];

  const NavigationButton = ({ item, isChild = false }: { item: NavigationItem; isChild?: boolean }) => {
    const Icon = item.icon;
    const isActive = currentPage === item.href;
    
    const handleClick = () => {
      if (item.route) {
        navigate(item.route);
      } else {
        onNavigate(item.href);
      }
    };
    
    const buttonElement = (
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center gap-3 rounded-lg 
          transition-all duration-200 group relative
          ${sidebarExpanded
            ? isChild ? 'px-3 py-2 justify-start' : 'px-3 py-3 justify-start'
            : 'px-3 py-2 justify-center'
          } 
          ${isActive 
            ? 'bg-woopi-ai-light-blue text-woopi-ai-blue shadow-sm' 
            : 'text-woopi-ai-gray hover:bg-woopi-ai-light-gray hover:text-woopi-ai-dark-gray'
          }
        `}
      >
        <Icon className="w-5 h-5 flex-shrink-0 transition-all duration-200" />
        {sidebarExpanded && (
          <span className={`font-medium truncate ${isChild ? 'text-xs' : 'text-sm'}`}>
            {item.name}
          </span>
        )}
        {!sidebarExpanded && isActive && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-woopi-ai-blue rounded-l-full" />
        )}
      </button>
    );

    if (!sidebarExpanded) {
      return (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
          <TooltipContent side="right" className="ml-3">
            <p className="font-medium text-sm">{item.name}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return buttonElement;
  };

  const GroupButton = ({ group }: { group: NavigationGroup }) => {
    const Icon = group.icon;
    const isExpanded = expandedGroups[group.href] ?? false;
    const hasActiveChild = group.children.some(c => currentPage === c.href);

    const handleGroupClick = () => {
      if (!sidebarExpanded) {
        setSidebarExpanded(true);
        setExpandedGroups(prev => ({ ...prev, [group.href]: true }));
      } else {
        setExpandedGroups(prev => ({ ...prev, [group.href]: !prev[group.href] }));
      }
    };

    const groupTrigger = (
      <button
        onClick={handleGroupClick}
        className={`
          w-full flex items-center gap-3 rounded-lg 
          transition-all duration-200 relative
          ${sidebarExpanded ? 'px-3 py-3 justify-start' : 'px-3 py-2 justify-center'}
          ${hasActiveChild
            ? 'bg-woopi-ai-light-blue text-woopi-ai-blue shadow-sm'
            : 'text-woopi-ai-gray hover:bg-woopi-ai-light-gray hover:text-woopi-ai-dark-gray'
          }
        `}
      >
        <Icon className="w-5 h-5 flex-shrink-0 transition-all duration-200" />
        {sidebarExpanded && (
          <>
            <span className="text-sm font-medium truncate flex-1 text-left">{group.name}</span>
            <ChevronDown
              className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </>
        )}
        {!sidebarExpanded && hasActiveChild && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-woopi-ai-blue rounded-l-full" />
        )}
      </button>
    );

    return (
      <div>
        {!sidebarExpanded ? (
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>{groupTrigger}</TooltipTrigger>
            <TooltipContent side="right" className="ml-3">
              <p className="font-medium text-sm">{group.name}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          groupTrigger
        )}

        {/* Sub-items only visible when sidebar is expanded AND group is open */}
        {sidebarExpanded && isExpanded && (
          <div className="mt-1 ml-3 pl-3 border-l border-woopi-ai-border space-y-0.5">
            {group.children.map(child => (
              <NavigationButton key={child.href} item={child} isChild />
            ))}
          </div>
        )}
      </div>
    );
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <TooltipProvider>
      <div className="h-screen flex bg-background">
        {/* Sidebar */}
        <aside 
          className={`
            ${sidebarExpanded ? 'w-80' : 'w-20'} 
            transition-all duration-300 ease-in-out
            bg-sidebar border-r border-woopi-ai-border 
            flex flex-col relative z-10
          `}
        >
          {/* Logo Section */}
          <div className={`
            h-16 flex items-center border-b border-woopi-ai-border
            ${sidebarExpanded ? 'px-4' : 'px-2 justify-center'}
          `}>
            {sidebarExpanded ? (
              <div className="flex items-center">
                <img 
                  src={isDark ? woopiLogoDark : woopiLogoLight}
                  alt="WOOPI AI" 
                  style={{ height: '34px' }}
                  className="object-contain"
                />
              </div>
            ) : (
              <LogoIcon />
            )}
          </div>

          {/* Sidebar Toggle */}
          <div className={`
            p-4 border-b border-woopi-ai-border
            ${!sidebarExpanded ? 'px-3' : ''}
          `}>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className={`
                    ${sidebarExpanded ? 'w-full justify-center' : 'w-full h-10'}
                    transition-all duration-200
                    bg-transparent text-woopi-ai-gray hover:bg-muted hover:text-woopi-ai-dark-gray
                    dark:text-[#9196b0] dark:hover:bg-[#2d3354] dark:hover:text-[#d5d8e0]
                    focus-visible:ring-1 focus-visible:ring-offset-0
                  `}
                >
                  {sidebarExpanded ? (
                    <ChevronLeft className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={sidebarExpanded ? "top" : "right"} className={!sidebarExpanded ? "ml-3" : ""}>
                <p>{sidebarExpanded ? 'Recolher menu' : 'Expandir menu'}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Navigation */}
          <nav className={`
            flex-1 py-6 space-y-1 overflow-y-auto
            ${sidebarExpanded ? 'px-4' : 'px-3'}
          `}>
            {navEntries.map((entry) =>
              'type' in entry && entry.type === 'group' ? (
                <GroupButton key={entry.href} group={entry as NavigationGroup} />
              ) : (
                <NavigationButton key={(entry as NavigationItem).href} item={entry as NavigationItem} />
              )
            )}
          </nav>

          {/* Future submenu overlay preparation */}
          <div className="submenu-overlay-placeholder" style={{ display: 'none' }}>
            {/* Prepared for future submenu overlays */}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-sidebar border-b border-woopi-ai-border flex items-center justify-between px-6 z-10 dark:bg-[#1a1b2e]">
            {/* Left side - Tenant Selector */}
            <div className="flex items-center">
              <div className="relative">
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div>
                            <Badge
                              variant="outline"
                              className="cursor-pointer border-woopi-ai-border text-woopi-ai-dark-gray hover:bg-woopi-ai-light-gray transition-colors dark:border-[#393e5c] dark:text-[#d5d8e0] dark:hover:bg-[#2d3354]"
                            >
                              {currentTenant.name}
                            </Badge>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-80 bg-popover border-woopi-ai-border dark:bg-[#292f4c] dark:border-[#393e5c]">
                          <DropdownMenuLabel className="text-woopi-ai-dark-gray dark:text-[#d5d8e0]">
                            Selecionar Organização
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="dark:bg-[#393e5c]" />
                          {tenants.map((tenant) => (
                            <DropdownMenuItem
                              key={tenant.id}
                              onClick={() => handleTenantChange(tenant)}
                              className="flex items-start gap-3 cursor-pointer py-3 px-3 hover:bg-woopi-ai-light-gray dark:hover:bg-[#2d3354] dark:focus:bg-[#2d3354]"
                            >
                              {/* Radio button visual indicator */}
                              <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-woopi-ai-border mt-0.5 flex-shrink-0 dark:border-[#393e5c]">
                                {selectedTenant === tenant.id && (
                                  <div className="w-2 h-2 rounded-full bg-woopi-ai-blue" />
                                )}
                              </div>

                              {/* Tenant avatar */}
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-woopi-ai-blue text-white text-xs font-medium flex-shrink-0">
                                {tenant.initials}
                              </div>

                              {/* Tenant info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-woopi-ai-dark-gray dark:text-[#d5d8e0] truncate">
                                    {tenant.name}
                                  </span>
                                  {selectedTenant === tenant.id && (
                                    <Check className="w-4 h-4 text-woopi-ai-blue flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-woopi-ai-gray dark:text-[#9196b0] truncate">
                                  {tenant.email}
                                </p>
                                {tenant.description && (
                                  <p className="text-xs text-woopi-ai-gray/80 dark:text-[#7a7f9d] truncate mt-1">
                                    {tenant.description}
                                  </p>
                                )}
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>tenant ativo</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative bg-transparent text-woopi-ai-gray hover:text-woopi-ai-dark-gray hover:bg-muted dark:text-[#9196b0] dark:hover:text-[#d5d8e0] dark:hover:bg-[#2d3354]">
                    <Globe className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 bg-popover border-woopi-ai-border dark:bg-[#292f4c] dark:border-[#393e5c]">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => handleLanguageChange(language)}
                      className="flex items-center justify-between cursor-pointer py-3 dark:hover:bg-[#2d3354] dark:focus:bg-[#2d3354]"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flag-icon ${language.flagClass}`}></div>
                        <span className="text-sm font-medium text-woopi-ai-dark-gray dark:text-[#d5d8e0]">{language.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium dark:text-[#9196b0]">
                        {language.abbreviation}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Dark Mode Toggle */}
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleDark}
                    className="relative w-9 h-9 p-0 bg-transparent text-woopi-ai-gray hover:text-woopi-ai-dark-gray hover:bg-muted dark:text-[#9196b0] dark:hover:text-[#d5d8e0] dark:hover:bg-[#2d3354]"
                    aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
                  >
                    {isDark ? (
                      <Sun className="w-5 h-5 text-woopi-ai-warning transition-all duration-300" />
                    ) : (
                      <Moon className="w-5 h-5 transition-all duration-300" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{isDark ? 'Modo claro' : 'Modo escuro'}</p>
                </TooltipContent>
              </Tooltip>

              {/* Notifications Bell */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative w-9 h-9 p-0 bg-transparent text-woopi-ai-gray hover:text-woopi-ai-dark-gray hover:bg-muted dark:text-[#9196b0] dark:hover:text-[#d5d8e0] dark:hover:bg-[#2d3354]"
                    aria-label="Notificações"
                  >
                    <Bell className="w-5 h-5 transition-all duration-300" />
                    {/* Notification badge */}
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#0073ea] rounded-full border-2 border-sidebar dark:border-[#1a1b2e]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-popover border-woopi-ai-border dark:bg-[#292f4c] dark:border-[#393e5c]">
                  <DropdownMenuLabel className="text-woopi-ai-dark-gray dark:text-[#d5d8e0] flex items-center justify-between">
                    <span>Notificações</span>
                    <Badge variant="outline" className="text-xs border-[#0073ea] text-[#0073ea] dark:border-[#4d9ef5] dark:text-[#4d9ef5]">3 novas</Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-[#393e5c]" />
                  <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer py-3 px-3 dark:hover:bg-[#2d3354] dark:focus:bg-[#2d3354]">
                    <span className="text-sm font-medium text-woopi-ai-dark-gray dark:text-[#d5d8e0]">Documento anonimizado</span>
                    <span className="text-xs text-woopi-ai-gray dark:text-[#9196b0]">O documento #4521 foi anonimizado com sucesso e está pronto para download.</span>
                    <span className="text-xs text-[#0073ea] dark:text-[#4d9ef5] mt-0.5">Há 2 minutos</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer py-3 px-3 dark:hover:bg-[#2d3354] dark:focus:bg-[#2d3354]">
                    <span className="text-sm font-medium text-woopi-ai-dark-gray dark:text-[#d5d8e0]">Processamento concluído</span>
                    <span className="text-xs text-woopi-ai-gray dark:text-[#9196b0]">A esteira "Contratos Q1" finalizou o processamento de 12 documentos.</span>
                    <span className="text-xs text-[#0073ea] dark:text-[#4d9ef5] mt-0.5">Há 15 minutos</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer py-3 px-3 dark:hover:bg-[#2d3354] dark:focus:bg-[#2d3354]">
                    <span className="text-sm font-medium text-woopi-ai-dark-gray dark:text-[#d5d8e0]">Novo questionário atribuído</span>
                    <span className="text-xs text-woopi-ai-gray dark:text-[#9196b0]">Você foi atribuído ao questionário "Compliance 2026".</span>
                    <span className="text-xs text-[#0073ea] dark:text-[#4d9ef5] mt-0.5">Há 1 hora</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="dark:bg-[#393e5c]" />
                  <DropdownMenuItem className="justify-center cursor-pointer text-[#0073ea] dark:text-[#4d9ef5] dark:hover:bg-[#2d3354] dark:focus:bg-[#2d3354]">
                    <span className="text-sm font-medium">Ver todas as notificações</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 bg-transparent text-woopi-ai-dark-gray hover:bg-muted dark:text-[#d5d8e0] dark:hover:bg-[#2d3354]">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-woopi-ai-blue text-white">JS</AvatarFallback>
                    </Avatar>
                    <span className="dark:text-[#d5d8e0]">João Silva</span>
                    <ChevronDown className="w-4 h-4 text-woopi-ai-gray dark:text-[#9196b0]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover border-woopi-ai-border dark:bg-[#292f4c] dark:border-[#393e5c]">
                  <DropdownMenuItem
                    onClick={() => navigate('/perfil')}
                    className="cursor-pointer text-woopi-ai-dark-gray dark:text-[#d5d8e0] dark:hover:bg-[#2d3354] dark:focus:bg-[#2d3354]"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Minha Conta
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="dark:bg-[#393e5c]" />
                  <DropdownMenuItem
                    className="text-woopi-ai-error cursor-pointer dark:hover:bg-[#2d3354] dark:focus:bg-[#2d3354]"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}