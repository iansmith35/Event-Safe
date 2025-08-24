import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Admin route protection
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const adminSession = request.cookies.get('admin_session')?.value;
    
    // If no admin session cookie, redirect to admin login
    if (adminSession !== '1') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

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
  matcher: ['/admin/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
