'use client';

import { IntlProvider } from 'react-intl';
import { ReactNode, memo, useMemo } from 'react';

interface IntlClientProviderProps {
  locale: string;
  messages: Record<string, any>;
  children: ReactNode;
}

function flattenMessages(nestedMessages: any, prefix = '') {
  return Object.keys(nestedMessages).reduce((acc, key) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    if (
      typeof nestedMessages[key] === 'object' && 
      nestedMessages[key] !== null
    ) {
      Object.assign(acc, flattenMessages(nestedMessages[key], prefixedKey));
    } else {
      acc[prefixedKey] = nestedMessages[key];
    }
    return acc;
  }, {} as Record<string, string>);
}

function IntlClientProvider({ 
  children, 
  locale, 
  messages 
}: IntlClientProviderProps) {
  const validLocales = ['en', 'es', 'pt'] as const;
  const safeLocale = validLocales.includes(locale as any) ? locale : 'en';
  
  const flattenedMessages = useMemo(() => {
    if (!messages) return {};
    return flattenMessages(messages);
  }, [messages]);
  
  if (process.env.NODE_ENV !== 'production') {
    const randomKeys = Object.keys(flattenedMessages).sort(() => 0.5 - Math.random()).slice(0, 5);
  }
  
  return (
    <IntlProvider 
      locale={safeLocale} 
      messages={flattenedMessages} 
      defaultLocale="en"
      onError={(err) => {
        if (err.code !== 'MISSING_TRANSLATION') {
          console.warn(`Internationalization error:`, err);
        }
      }}
    >
      {children}
    </IntlProvider>
  );
}

export default memo(IntlClientProvider); 