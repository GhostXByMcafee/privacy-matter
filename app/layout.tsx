import { Inter } from 'next/font/google';
import './globals.css';
import IntlClientProvider from './providers/IntlClientProvider';
import messages from './i18n/messages';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Privacy Matters',
  description: 'Secure communication platform',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default function RootLayout({ children, params: { locale = 'en' } }: RootLayoutProps) {
  return (
    <html lang={locale}>
      <body className={`${inter.className} bg-zinc-950 text-white`}>
        <IntlClientProvider locale={locale} messages={messages[locale as keyof typeof messages]}>
          {children}
        </IntlClientProvider>
      </body>
    </html>
  );
}
