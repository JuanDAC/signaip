import { useLanguage } from '../contexts/LanguageContext';

export const useTranslation = (namespace?: string) => {
  const { t, currentLocale, locales, isHydrated } = useLanguage();

  const translate = (key: string, params?: Record<string, string | number>): string => {
    
    let translation = t(key, namespace);
    
    console.log(translation);
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, String(params[param]));
      });
    }
    
    return translation;
  };

  return {
    t: translate,
    locale: currentLocale,
    locales,
    isHydrated,
    isRTL: currentLocale === 'ar',
  };
};

// Hook específico para traducciones comunes
export const useCommonTranslation = () => useTranslation('common');

// Hook específico para traducciones de navegación
export const useNavigationTranslation = () => useTranslation('navigation');

// Hook específico para traducciones del header
export const useHeaderTranslation = () => useTranslation('header');

// Hook específico para traducciones de la sidebar
export const useSidebarTranslation = () => useTranslation('sidebar');

// Hook específico para traducciones de marcas
export const useBrandsTranslation = () => useTranslation('brands');

// Hook específico para traducciones del stepper
export const useStepperTranslation = () => useTranslation('stepper');

// Hook específico para traducciones de la página principal
export const useHomepageTranslation = () => useTranslation('homepage');
