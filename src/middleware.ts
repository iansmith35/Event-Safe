
import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow all paths to be public for the demo
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
