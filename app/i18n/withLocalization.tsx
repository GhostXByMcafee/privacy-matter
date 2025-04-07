'use client';

import React from 'react';
import { useTranslation } from './useTranslation';

export interface WithTranslation {
  t: (key: string, defaultMessage?: string) => string;
}

type ComponentWithTranslation<P> = React.ComponentType<P & WithTranslation>;

export function withLocalization<P>(Component: ComponentWithTranslation<P>) {
  const WrappedComponent = (props: P) => {
    const { t } = useTranslation();
    return <Component t={t} {...props} />;
  };
  
  WrappedComponent.displayName = `withLocalization(${Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
} 