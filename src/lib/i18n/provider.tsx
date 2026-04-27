'use client';
import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { translations } from './translations';
import { useAppStore, type Language } from '../store';

const I18nContext = createContext<{
  t: (key: string) => string;
  language: Language;
  setLanguage: (l: Language) => void;
}>({
  t: (k) => k,
  language: 'en',
  setLanguage: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations[language];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        // Fallback to English
        let fallback: unknown = translations.en;
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = (fallback as Record<string, unknown>)[fk];
          } else return key;
        }
        return typeof fallback === 'string' ? fallback : key;
      }
    }
    return typeof value === 'string' ? value : key;
  }, [language]);

  const value = useMemo(() => ({ t, language, setLanguage }), [t, language, setLanguage]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
