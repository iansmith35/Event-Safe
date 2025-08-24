import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Admin route protection
  if (path.startsWith('/admin')) {
    const adminCode = process.env.ADMIN_CODE || '2338';
    const headerCode = request.headers.get('x-admin-code');
    const cookieCode = request.cookies.get('x-admin-code')?.value;
    const queryCode = request.nextUrl.searchParams.get('admin');
    
    // Set cookie if query param provided
    if (queryCode === adminCode) {
      const response = NextResponse.next();
      response.cookies.set('x-admin-code', adminCode, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 // 24 hours
      });
      return response;
    }
    
    // Check authentication
    if (headerCode !== adminCode && cookieCode !== adminCode) {
      return new NextResponse('Unauthorized', { status: 401 });
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
