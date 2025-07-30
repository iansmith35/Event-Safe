import { type NextRequest, NextResponse } from 'next/server';

// Define public routes that do not require authentication
const publicRoutes = ['/', '/uk', '/login', '/signup', '/host-signup', '/legal'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the requested path is a public route
  const isPublicRoute = publicRoutes.some(publicPath => {
    if (publicPath.endsWith('/**')) {
      return path.startsWith(publicPath.slice(0, -3));
    }
    return path === publicPath;
  });

  // If it's a public route, allow access
  if (isPublicRoute) {
    // Specifically redirect the root to /uk for this demo
    if (path === '/') {
        return NextResponse.redirect(new URL('/uk', request.url));
    }
    return NextResponse.next();
  }

  // For this demo, we assume all other routes are protected (e.g., /dashboard)
  // If a user tries to access a protected route without being "logged in",
  // we would typically check for a session token here.
  // As we don't have a real session token, we'll simulate the redirect logic.
  // In a real app, you would have a function like `isUserAuthenticated(request)`.

  const isAuthenticated = false; // This would be replaced with real auth check

  if (!isAuthenticated && path.startsWith('/dashboard')) {
    // Redirect them to the login page, preserving any search params
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect_url', path);
    return NextResponse.redirect(loginUrl);
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