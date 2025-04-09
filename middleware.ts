import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const supportedLocales = ['en', 'es', 'pt'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth-token');
  
  const pathnameHasLocale = supportedLocales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathname === '/') {
    const url = new URL(`/en`, request.url);
    return NextResponse.rewrite(url);
  }
  
  if (!pathnameHasLocale && !pathname.startsWith('/admin') && 
      !pathname.startsWith('/_next') && !pathname.includes('.') && 
      !pathname.startsWith('/api')) {
    const url = new URL(`/en${pathname}`, request.url);
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin') {
      if (authToken) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }

    if (pathname === '/admin/login') {
      if (authToken) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }


    if (!authToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/:path*',
    '/admin/:path*'
  ]
}; 