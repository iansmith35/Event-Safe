
import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect root path to the UK site for the demo
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/uk', request.url));
  }
  
  // Allow all other paths to be public for the demo
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
