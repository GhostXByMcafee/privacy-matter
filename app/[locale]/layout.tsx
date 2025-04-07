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

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale || 'en';
  return getMetadata(locale);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = await Promise.resolve(params.locale || 'en');
  const validLocale = SUPPORTED_LOCALES.includes(locale) ? locale : 'en';
  
  const localeMessages = messages[validLocale as keyof typeof messages] || messages.en;
  
  return (
    <html lang={validLocale} className={montserrat.variable}>
      <body className="font-sans">
        <IntlClientProvider locale={validLocale} messages={localeMessages}>
          {children}
        </IntlClientProvider>
      </body>
    </html>
  );
} 