import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['en', 'es', 'pt'];
const defaultLocale = 'en';

const protectedRoutes = [
  '/resources',
  '/tools',
  '/legal-help',
  '/contact',
  '/admin',
  '/dashboard'
];

function getLocale(request: NextRequest) {
  const headers = {
    'accept-language': request.headers.get('accept-language') || '',
  };
  
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

function shouldHandleLocale(pathname: string) {
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/static')
  ) {
    return false;
  }
  
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (!shouldHandleLocale(pathname)) {
    return NextResponse.next();
  }
  
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) return NextResponse.next();

  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const headerLocale = request.headers.get('accept-language')?.split(',')[0].split('-')[0];
  
  let locale = cookieLocale || headerLocale || defaultLocale;
  if (!locales.includes(locale)) locale = defaultLocale;

  if (locale === defaultLocale) {
    return NextResponse.next();
  }
  
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 