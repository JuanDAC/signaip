import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { languages, fallbackLng } from './src/modules/shared/i18n/settings';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar si la ruta ya tiene un idioma
  const pathnameHasLocale = languages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirigir desde la raíz al idioma por defecto
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${fallbackLng}`, request.url));
  }

  // Redirigir rutas sin idioma al idioma por defecto
  // Mantener la estructura [section]/[action] si existe
  return NextResponse.redirect(new URL(`/${fallbackLng}${pathname}`, request.url));
}

export const config = {
  // Skip all internal paths (_next), API routes, static assets, and image optimization
  matcher: [
    '/((?!_next|api|favicon.ico|logo.webp|.*\\.(?:jpg|jpeg|gif|png|webp|svg|ico)$).*)',
  ],
};
