import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { enTranslations } from '../translations/en';
import { esTranslations } from '../translations/es';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const translations = {
  en: enTranslations,
  es: esTranslations
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  t: key => key,
  toggleLanguage: () => {},
  setLanguage: () => {}
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Check for saved language preference or default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'es' ? 'es' : 'en') as Language;
  });
  
  // Save language preference whenever it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'es' : 'en');
  };
  
  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let translation: any = translations[language];
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        // Fallback to key if translation not found
        return key;
      }
    }
    
    return translation;
  };
  
  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
