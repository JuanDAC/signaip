'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export const locales = ['en', 'es'];
export const defaultLocale = 'es';

interface LanguageContextType {
  currentLocale: string;
  setLocale: (locale: string) => void;
  locales: string[];
  t: (key: string, namespace?: string) => string;
  isHydrated: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  initialLocale: string; // Requerido - viene de la URL
  initialMessages: Record<string, Record<string, string>>; // Requerido - viene del servidor
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  initialLocale,
  initialMessages
}) => {
  const [currentLocale, setCurrentLocale] = useState<string>(initialLocale);
  const [messages] = useState<Record<string, Record<string, string>>>(initialMessages);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    // Marcar como hidratado después del primer render
    setIsHydrated(true);
  }, []);

  const setLocale = (locale: string) => {
    if (locales.includes(locale)) {
      setCurrentLocale(locale);
      // Aquí podrías cargar mensajes del nuevo idioma si es necesario
      // Pero por ahora mantenemos los mensajes iniciales del servidor
    }
  };

  const t = (key: string, namespace: string = ''): string => {
    try {
      const namespaceParts = namespace.split('.');
      const keyParts = key.split('.');
  
      const path = [...namespaceParts, ...keyParts].filter(Boolean);
  
      const result = path.reduce((acc, curr) => acc[curr], messages);
  
      return (result as unknown as string) || key;
  
    } catch {  
      return key;
    }
  };

  const value: LanguageContextType = {
    currentLocale,
    setLocale,
    locales,
    t,
    isHydrated,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
