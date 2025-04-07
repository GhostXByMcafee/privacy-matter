'use client';

import { useIntl } from 'react-intl';

export function useTranslation() {
  const intl = useIntl();
  
  const t = (key: string, defaultMessage?: string): string => {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`[i18n] Translating: ${key}`);
      }
      
      return intl.formatMessage({ id: key, defaultMessage: defaultMessage || key });
    } catch (error) {
      console.warn(`[i18n] Error translating "${key}":`, error);
      return defaultMessage || key;
    }
  };
  
  return { t };
}