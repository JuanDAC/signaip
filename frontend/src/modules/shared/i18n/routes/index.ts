import { fallbackLng, languages } from '../settings';

// Tipos para la configuración de rutas
export interface RouteAction {
  path: string;
  title: string;
  description: string;
}

export interface RouteSection {
  path: string;
  title: string;
  description: string;
  icon: string;
  actions: Record<string, RouteAction>;
}

export interface RouteConfig {
  sections: Record<string, RouteSection>;
}

// Función para cargar la configuración de rutas de un idioma
export async function loadRouteConfig(locale: string): Promise<RouteConfig> {
  try {
    // Validar que el locale sea soportado
    if (!languages.includes(locale)) {
      locale = fallbackLng;
    }

    // Cargar la configuración del locale
    const config = await import(`./${locale}.json`);
    return config.default;
  } catch (error) {
    console.error(`Error loading route config for ${locale}:`, error);

    // Fallback al idioma por defecto
    try {
      const fallbackConfig = await import(`./${fallbackLng}.json`);
      return fallbackConfig.default;
    } catch (fallbackError) {
      console.error('Error loading fallback route config:', fallbackError);
      return { sections: {} };
    }
  }
}

// Función para obtener la configuración de rutas del servidor
export async function getServerRouteConfig(locale: string): Promise<RouteConfig> {
  return loadRouteConfig(locale);
}

// Función para obtener la configuración de rutas del cliente
export async function getClientRouteConfig(locale: string): Promise<RouteConfig> {
  return loadRouteConfig(locale);
}

// Función para obtener todas las secciones de un idioma
export async function getSections(locale: string): Promise<RouteSection[]> {
  const config = await loadRouteConfig(locale);
  return Object.values(config.sections);
}

// Función para obtener una sección específica
export async function getSection(locale: string, sectionKey: string): Promise<RouteSection | null> {
  const config = await loadRouteConfig(locale);
  return config.sections[sectionKey] || null;
}

// Función para obtener las acciones de una sección
export async function getSectionActions(locale: string, sectionKey: string): Promise<RouteAction[]> {
  const section = await getSection(locale, sectionKey);
  return section ? Object.values(section.actions) : [];
}

// Función para obtener una acción específica
export async function getAction(locale: string, sectionKey: string, actionKey: string): Promise<RouteAction | null> {
  const section = await getSection(locale, sectionKey);
  return section?.actions[actionKey] || null;
}

// Función para validar si una ruta es válida
export async function isValidRoute(locale: string, sectionKey: string, actionKey?: string): Promise<boolean> {
  const section = await getSection(locale, sectionKey);
  if (!section) return false;

  if (actionKey) {
    return !!section.actions[actionKey];
  }

  return true;
}

// Función para obtener la ruta localizada
export async function getLocalizedRoute(
  targetLocale: string,
  currentLocale: string,
  currentSection: string,
  currentAction?: string
): Promise<string> {
  const targetConfig = await loadRouteConfig(targetLocale);
  const currentConfig = await loadRouteConfig(currentLocale);

  // Encontrar la sección actual en la configuración del idioma actual
  const currentSectionConfig = Object.entries(currentConfig.sections).find(
    ([_, section]) => section.path === currentSection
  );

  if (!currentSectionConfig) {
    return `/${targetLocale}`;
  }

  const [currentSectionKey] = currentSectionConfig;

  // Encontrar la sección correspondiente en el idioma objetivo
  const targetSection = targetConfig.sections[currentSectionKey];
  if (!targetSection) {
    return `/${targetLocale}`;
  }

  // Construir la URL base
  let url = `/${targetLocale}/${targetSection.path}`;

  // Agregar la acción si existe
  if (currentAction) {
    const currentActionConfig = Object.entries(currentSectionConfig[1].actions).find(
      ([_, action]) => action.path === currentAction
    );

    if (currentActionConfig) {
      const [currentActionKey] = currentActionConfig;
      const targetAction = targetSection.actions[currentActionKey];
      if (targetAction) {
        url += `/${targetAction.path}`;
      }
    }
  }

  return url;
}

// Función para obtener el menú de navegación
export async function getNavigationMenu(locale: string): Promise<Array<{
  key: string;
  path: string;
  title: string;
  description: string;
  icon: string;
  actions?: Array<{
    key: string;
    path: string;
    title: string;
    description: string;
  }>;
}>> {
  const config = await loadRouteConfig(locale);
  
  return Object.entries(config.sections).map(([key, section]) => ({
    key,
    path: section.path,
    title: section.title,
    description: section.description,
    icon: section.icon,
    actions: Object.entries(section.actions).map(([actionKey, action]) => ({
      key: actionKey,
      path: action.path,
      title: action.title,
      description: action.description,
    })),
  }));
}
