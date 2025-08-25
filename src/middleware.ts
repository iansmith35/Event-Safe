import { NextResponse, NextRequest } from "next/server";

export const config = { matcher: ["/admin/:path*", "/"] };

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Root redirect to UK homepage
  if (path === '/') {
    return NextResponse.redirect(new URL('/uk', req.url));
  }

  // Admin route protection - exclude login page
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const cookie = req.cookies.get("admin_ok")?.value;
    if (!cookie) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
