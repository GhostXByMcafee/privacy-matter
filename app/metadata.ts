import type { Metadata } from 'next';

type LocaleMetadata = {
  title: string;
  description: string;
  keywords: string;
};

export const baseMetadata: Record<string, LocaleMetadata> = {
  en: {
    title: 'Privacy Matters - Protecting Your Digital Privacy',
    description: 'Foundation dedicated to protecting digital privacy and helping people affected by government surveillance',
    keywords: 'digital privacy, digital rights, online security, government surveillance'
  },
  es: {
    title: 'Privacy Matters - Protegiendo Tu Privacidad Digital',
    description: 'Fundación dedicada a proteger la privacidad digital y ayudar a personas afectadas por la vigilancia gubernamental',
    keywords: 'privacidad digital, derechos digitales, seguridad en línea, vigilancia gubernamental'
  },
  pt: {
    title: 'Privacy Matters - Protegendo Sua Privacidade Digital',
    description: 'Fundação dedicada a proteger a privacidade digital e ajudar pessoas afetadas pela vigilância governamental',
    keywords: 'privacidade digital, direitos digitais, segurança online, vigilância governamental'
  }
};

export function getMetadata(locale: string = 'en'): LocaleMetadata {
  const validLocales = ['en', 'es', 'pt'] as const;
  type ValidLocale = typeof validLocales[number];
  
  const safeLocale = validLocales.includes(locale as ValidLocale) 
    ? locale as ValidLocale 
    : 'en';
  
  return baseMetadata[safeLocale];
} 