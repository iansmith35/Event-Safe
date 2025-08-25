import { NextRequest, NextResponse } from 'next/server';
import { getUserSessions, isAdminEmail } from '@/lib/adminSession';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Check if admin session cookie exists
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    
    if (!sessionCookie) {
      return NextResponse.json({
        ok: false,
        error: 'Not authenticated'
      }, { status: 401 });
    }

    // Get the current user from Firebase Auth (would need Firebase Admin SDK in real implementation)
    // For now, we'll extract the user info from request or session
    // In a real implementation, you'd verify the Firebase token
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({
        ok: false,
        error: 'No authorization header'
      }, { status: 401 });
    }

    // TODO: In a real implementation, verify Firebase ID token here
    // For now, we'll assume the request includes user info
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('userEmail');

    if (!userId || !userEmail) {
      return NextResponse.json({
        ok: false,
        error: 'Missing user information'
      }, { status: 400 });
    }

    // Check if the user is authorized admin
    if (!isAdminEmail(userEmail)) {
      return NextResponse.json({
        ok: false,
        error: 'Not authorized for admin access'
      }, { status: 403 });
    }

    // Get all sessions for this user
    const sessions = await getUserSessions(userId);
    const currentSessionId = sessionCookie.value;

    return NextResponse.json({
      ok: true,
      sessions: sessions.map(session => ({
        id: session.id,
        deviceInfo: session.deviceInfo,
        createdAt: session.createdAt.toISOString(),
        lastSeenAt: session.lastSeenAt.toISOString(),
        ipHash: session.ipHash,
        isCurrent: session.id === currentSessionId
      })),
      currentSessionId
    });

  } catch (error) {
    console.error('Admin sessions list API error:', error);
    return NextResponse.json({
      ok: false,
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
}