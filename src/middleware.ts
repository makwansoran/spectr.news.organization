import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyEditorSession, EDITOR_COOKIE_NAME } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith('/admin')) {
    return NextResponse.next();
  }
  // Allow /admin/login without editor session
  if (path === '/admin/login') {
    return NextResponse.next();
  }

  const cookieValue = request.cookies.get(EDITOR_COOKIE_NAME)?.value;
  if (await verifyEditorSession(cookieValue)) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/admin/login', request.url);
  loginUrl.searchParams.set('from', path);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
