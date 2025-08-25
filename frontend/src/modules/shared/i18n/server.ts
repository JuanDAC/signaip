import { fallbackLng, languages } from './settings';

// Función para cargar traducciones en el servidor
// Statically import all possible translation files to avoid dynamic import issues

// Import root-level translations
import en from './en.json';
import es from './es.json';

// Import namespace translations (e.g., routes)
import routes_en from './routes/en.json';
import routes_es from './routes/es.json';

// Add more namespaces here as needed

const TRANSLATION_MAP: Record<string, Record<string, any>> = {
  '': {
    en,
    es,
  },
  routes: {
    en: routes_en,
    es: routes_es,
  },
  // Add more namespaces here as needed
};

export async function getServerTranslations(locale: string, namespace: string = '') {
  // Validar que el locale sea soportado
  if (!languages.includes(locale)) {
    locale = fallbackLng;
  }

  // Buscar las traducciones en el mapa estático
  const ns = namespace || '';
  const translationsForNamespace = TRANSLATION_MAP[ns];
  if (translationsForNamespace && translationsForNamespace[locale]) {
    return translationsForNamespace[locale];
  }

  // Fallback al idioma por defecto si no se encuentra la traducción
  if (translationsForNamespace && translationsForNamespace[fallbackLng]) {
    return translationsForNamespace[fallbackLng];
  }

  // Fallback vacío si no se encuentra nada
  return {};
}

// Función para obtener el locale de los parámetros de la URL
export function getLocaleFromParams(params: Promise<{ lang: string }> | { lang: string }): string {
  // Si es una Promise (Next.js     15+), retornar el fallback
  // El locale real se obtendrá en el componente con await
  if (params && typeof params === 'object' && 'then' in params) {
    return fallbackLng;
  }
  
  // Si es un objeto directo (Next.js 13-14)
  const { lang } = params as { lang: string };
  return languages.includes(lang) ? lang : fallbackLng;
}

// Función para validar locale
export function isValidLocale(locale: string): boolean {
  return languages.includes(locale);
}

export async function serverTranslation(locale: string, route: string = '') {
  const messages = await getServerTranslations(locale, route);
  const t = (key: string, namespace: string = '') => {
    const params =[...namespace.split('.'), ...key.split('.')].filter(Boolean);
    const value = params.reduce((acc, param) => acc[param], messages) as string;
    if (!value) {
      throw new Error(`Translation not found for ${key} in ${namespace}`);
    }
    return value;
  }
  return {t, messages};
}

