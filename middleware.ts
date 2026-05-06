import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from './lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/admin/login') {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      const user = await verifyToken(token);
      if (user) return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
