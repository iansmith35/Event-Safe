import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // For this prototype, we are primarily concerned with feature testing.
  // The main routing rule is to redirect the root path to the UK homepage.
  // All other routes are allowed to be accessed directly to facilitate easy testing
  // of different components and pages (e.g., /dashboard, /login, etc.).
  // A robust authentication check would be re-implemented here before production.

  if (path === '/') {
      return NextResponse.redirect(new URL('/uk', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
