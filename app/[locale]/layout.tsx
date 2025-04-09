import '../globals.css';
import { Montserrat } from 'next/font/google';
import type { Metadata } from 'next';
import { getMetadata } from '../metadata';
import IntlClientProvider from '../providers/IntlClientProvider';
import messages from '../i18n/messages';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const SUPPORTED_LOCALES = ['en', 'es', 'pt'];

function getMessages(locale: string) {
  const validLocales = ['en', 'es', 'pt'] as const;
  type ValidLocale = typeof validLocales[number];
  
  const safeLocale = validLocales.includes(locale as ValidLocale) 
    ? locale as ValidLocale 
    : 'en';
  
  return messages[safeLocale] || messages.en;
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = (await Promise.resolve(params)).locale || 'en';
  
  return {
    title: messages[locale as keyof typeof messages].privacy.hero.title,
    description: messages[locale as keyof typeof messages].privacy.hero.subtitle,
  };
}

export default async function LocaleLayout({ 
  children, 
  params,
}: LocaleLayoutProps) {
  const locale = (await Promise.resolve(params)).locale || 'en';
  
  return (
    <IntlClientProvider locale={locale} messages={messages[locale as keyof typeof messages]}>
      {children}
    </IntlClientProvider>
  );
} 