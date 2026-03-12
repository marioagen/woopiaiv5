import { useNavigate, useLocation } from 'react-router';
import { routeConfig } from '../config/routes';

interface UseNavigationReturn {
  currentPage: string;
  navigate: (page: string) => void;
  getPageFromPath: (pathname: string) => string;
}

export function useNavigation(): UseNavigationReturn {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageFromPath = (pathname: string): string => {
    // Find route that matches the pathname
    const route = Object.entries(routeConfig).find(([_, config]) => {
      if (config.path === pathname) return true;
      if (config.dynamicPath && pathname.match(config.dynamicPath)) return true;
      return false;
    });

    let pageKey = route ? route[0] : 'documentos';
    
    // Map user management routes to the main usuarios section
    if (pageKey === 'usuarios-novo' || pageKey === 'usuarios-editar' ||
        pageKey === 'times-novo' || pageKey === 'times-editar' ||
        pageKey === 'perfis-novo' || pageKey === 'perfis-editar') {
      pageKey = 'usuarios';
    }
    
    // Map questionnaire routes to the main questionarios section
    if (pageKey === 'questionarios-new' || pageKey === 'questionarios-edit') {
      pageKey = 'questionarios';
    }
    
    // Map prompts routes to the main prompts section
    if (pageKey === 'prompts-importar' || pageKey === 'prompts-novo' || pageKey === 'prompts-editar') {
      pageKey = 'prompts';
    }
    
    // Map ferramentas routes to the main ferramentas section
    if (pageKey === 'ferramentas-novo') {
      pageKey = 'ferramentas';
    }

    // Map API templates routes to the main api-templates section
    if (pageKey === 'api-templates-novo' || pageKey === 'api-templates-editar') {
      pageKey = 'api-templates';
    }

    // Map comparador analysis route to comparador section
    if (pageKey === 'comparador-analise') {
      pageKey = 'comparador';
    }

    // Map all workflow-related routes to their respective sections
    if (pageKey === 'workflow' || 
        pageKey === 'documentos-workflow' || 
        pageKey === 'workflow-criar' || 
        pageKey === 'documentos-workflow-criar' || 
        pageKey === 'workflow-editor' || 
        pageKey === 'documentos-workflow-editor') {
      pageKey = 'workflow';
    }
    
    // Map workflow management routes to workflow-gestao
    if (pageKey === 'workflow-gerenciar' ||
        pageKey === 'documentos-workflow-gerenciar') {
      pageKey = 'workflow-editor';
    }
    
    // Map workflow gestao routes (including all sub-pages) to workflow-gestao
    if (pageKey === 'workflow-gestao' || 
        pageKey === 'documentos-workflow-gestao' ||
        pageKey === 'workflow-gestao-novo' ||
        pageKey === 'documentos-workflow-gestao-novo' ||
        pageKey === 'workflow-gestao-editar' ||
        pageKey === 'documentos-workflow-gestao-editar' ||
        pageKey === 'workflow-versoes' ||
        pageKey === 'workflow-versoes-nova' ||
        pageKey === 'workflow-versoes-detalhe' ||
        pageKey === 'workflow-versoes-comparar' ||
        pageKey === 'workflow-versionamento-ajuda') {
      pageKey = 'workflow-gestao';
    }

    return pageKey;
  };

  const handleNavigate = (page: string) => {
    const route = routeConfig[page];
    if (route) {
      navigate(route.path);
    } else if (page === 'workflow') {
      // Default workflow navigation goes to the main workflow page
      navigate('/workflow');
    } else {
      navigate('/documentos');
    }
  };

  const currentPage = getPageFromPath(location.pathname);

  return {
    currentPage,
    navigate: handleNavigate,
    getPageFromPath,
  };
}