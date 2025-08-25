import { fallbackLng, languages } from './settings';
import { loadRouteConfig, getLocalizedRoute as getLocalizedRouteFromConfig, getNavigationMenu as getNavigationMenuFromConfig } from './routes/index';

// Configuración de rutas por idioma (mantener para compatibilidad)
export const routeConfig = {
  en: {
    sections: {
      'dashboard': 'dashboard',
      'trademark-registration': 'trademark-registration',
      'reports': 'reports'
    },
    actions: {
      'overview': 'overview',
      'create': 'create',
      'edit': 'edit',
      'generate': 'generate',
      'view': 'view',
      'export': 'export'
    }
  },
  es: {
    sections: {
      'dashboard': 'dashboard',
      'registro-de-marca': 'registro-de-marca',
      'reportes': 'reportes'
    },
    actions: {
      'vista-general': 'vista-general',
      'crear': 'crear',
      'editar': 'editar',
      'generar': 'generar',
      'ver': 'ver',
      'exportar': 'exportar'
    }
  }
} as const;

// Función para obtener la ruta localizada (nueva implementación)
export async function getLocalizedRouteAsync(
  targetLang: string, 
  currentSection: string, 
  currentAction?: string
): Promise<string> {
  // Usar la nueva implementación basada en archivos JSON
  const currentLang = fallbackLng; // Por defecto, pero se puede pasar como parámetro
  
  try {
    return await getLocalizedRouteFromConfig(targetLang, currentLang, currentSection, currentAction);
  } catch (error) {
    console.error('Error getting localized route:', error);
    // Fallback a la implementación anterior
    return getLocalizedRouteSync(targetLang, currentSection, currentAction);
  }
}

// Función para obtener la ruta localizada (implementación anterior - mantener para compatibilidad)
export function getLocalizedRouteSync(
  targetLang: string, 
  currentSection: string, 
  currentAction?: string
): string {
  const config = routeConfig[targetLang as keyof typeof routeConfig];
  if (!config) return `/${targetLang}`;

  // Mapear sección
  let newSection = currentSection;
  if (targetLang === 'en' && currentSection === 'registro-de-marca') {
    newSection = 'trademark-registration';
  } else if (targetLang === 'es' && currentSection === 'trademark-registration') {
    newSection = 'registro-de-marca';
  } else if (targetLang === 'en' && currentSection === 'reportes') {
    newSection = 'reports';
  } else if (targetLang === 'es' && currentSection === 'reports') {
    newSection = 'reportes';
  }

  // Mapear acción
  let newAction = currentAction;
  if (currentAction) {
    if (targetLang === 'en' && currentAction === 'crear') {
      newAction = 'create';
    } else if (targetLang === 'es' && currentAction === 'create') {
      newAction = 'crear';
    } else if (targetLang === 'en' && currentAction === 'vista-general') {
      newAction = 'overview';
    } else if (targetLang === 'es' && currentAction === 'overview') {
      newAction = 'vista-general';
    }
  }

  // Construir URL
  let url = `/${targetLang}/${newSection}`;
  if (newAction) {
    url += `/${newAction}`;
  }

  return url;
}

// Función para validar si una ruta es válida para un idioma específico
export function isValidRouteForLangSync(
  lang: string,
  section: string,
  action?: string
): boolean {
  const config = routeConfig[lang as keyof typeof routeConfig];
  if (!config) return false;

  // Validar sección
  const validSections = Object.values(config.sections);
  if (!validSections.includes(section as keyof typeof config.sections)) return false;

  // Validar acción si existe
  if (action) {
    const validActions = Object.values(config.actions);
    if (!validActions.includes(action as keyof typeof config.actions)) return false;
  }

  return true;
}

// Función para obtener todas las rutas válidas
export async function getAllValidRoutesAsync(): Promise<Array<{ lang: string; section: string; action?: string }>> {
  const routes: Array<{ lang: string; section: string; action?: string }> = [];
  
  for (const lang of languages) {
    try {
      const config = await loadRouteConfig(lang);
      
      Object.entries(config.sections).forEach(([, section]) => {
        // Rutas sin acción
        routes.push({ lang, section: section.path });
        
        // Rutas con acción
        Object.entries(section.actions).forEach(([, action]) => {
          routes.push({ lang, section: section.path, action: action.path });
        });
      });
    } catch (error) {
      console.error(`Error loading routes for ${lang}:`, error);
    }
  }
  
  return routes;
}

// Función para obtener todas las rutas válidas (implementación anterior - mantener para compatibilidad)
export function getAllValidRoutesSync(): Array<{ lang: string; section: string; action?: string }> {
  const routes: Array<{ lang: string; section: string; action?: string }> = [];
  
  Object.entries(routeConfig).forEach(([lang, config]) => {
    // Rutas sin acción
    Object.values(config.sections).forEach(section => {
      routes.push({ lang, section });
    });
    
    // Rutas con acción
    Object.values(config.actions).forEach(action => {
      Object.values(config.sections).forEach(section => {
        routes.push({ lang, section, action });
      });
    });
  });
  
  return routes;
}

// Función para obtener el menú de navegación (nueva implementación)
export async function getNavigationMenuAsync(locale: string) {
  try {
    return await getNavigationMenuFromConfig(locale);
  } catch (error) {
    console.error('Error getting navigation menu:', error);
    // Fallback a implementación estática
    return getNavigationMenuSync(locale);
  }
}

// Función para obtener el menú de navegación (implementación estática - mantener para compatibilidad)
export function getNavigationMenuSync(locale: string) {
  const config = routeConfig[locale as keyof typeof routeConfig];
  if (!config) return [];

  return Object.entries(config.sections).map(([key, section]) => ({
    key,
    path: section,
    title: section,
    description: section,
    icon: '📄',
    actions: Object.entries(config.actions).map(([, action]) => ({
      key: action,
      path: action,
      title: action,
      description: action,
    })),
  }));
}

// Exportar funciones principales (mantener compatibilidad)
export const getLocalizedRoute = getLocalizedRouteSync;
export const isValidRouteForLang = isValidRouteForLangSync;
export const getAllValidRoutes = getAllValidRoutesSync;
export const getNavigationMenu = getNavigationMenuAsync;
