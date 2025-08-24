import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Clear admin session cookie
  const response = NextResponse.redirect(new URL('/', request.url));
  
  response.cookies.delete('admin_session');
  
  return response;
}

export async function POST(request: NextRequest) {
  // Clear admin session cookie
  const response = NextResponse.redirect(new URL('/', request.url));
  
  response.cookies.delete('admin_session');
  
  return response;
}