'use client';

import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useRouter, usePathname } from 'next/navigation';
import { getLocalizedRoute } from '../i18n/routes';

interface LanguageSelectorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dropdown' | 'buttons';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  size = 'md',
  variant = 'dropdown'
}) => {
  const { locale, locales } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs sm:text-sm px-2 py-1';
      case 'lg':
        return 'text-base sm:text-lg px-3 sm:px-4 py-2 sm:py-3';
      default:
        return 'text-sm sm:text-base px-2 sm:px-3 py-1.5 sm:py-2';
    }
  };

  const getLanguageName = (code: string) => {
    switch (code) {
      case 'en':
        return 'English';
      case 'es':
        return 'Español';
      default:
        return code.toUpperCase();
    }
  };

  const getLanguageFlag = (code: string) => {
    switch (code) {
      case 'en':
        return '🇺🇸';
      case 'es':
        return '🇪🇸';
      default:
        return '🌐';
    }
  };

  // Función para cambiar idioma navegando a la nueva URL
  const handleLanguageChange = (newLocale: string) => {
    // Obtener la ruta actual sin el locale
    const pathParts = pathname.split('/').slice(2); // Remover el locale
    const section = pathParts[0];
    const action = pathParts[1];
    
    // Usar la función centralizada para obtener la ruta localizada
    const newUrl = getLocalizedRoute(newLocale, section, action);
    
    // Navegar a la nueva ruta localizada
    router.push(newUrl);
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 ${className}`}>
        {locales.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border transition-colors ${
              locale === lang
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
            } ${getSizeClasses()}`}
          >
            <span className="text-base sm:text-lg">{getLanguageFlag(lang)}</span>
            <span className="hidden sm:inline">{getLanguageName(lang)}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className={`text-gray-500 appearance-none bg-white border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 pr-6 sm:pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${getSizeClasses()}`}
      >
        {locales.map((lang) => (
          <option key={lang} value={lang}>
            {getLanguageFlag(lang)} {getLanguageName(lang)}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-1 sm:pr-2 pointer-events-none">
        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};
