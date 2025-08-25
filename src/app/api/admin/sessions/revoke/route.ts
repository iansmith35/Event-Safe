import { NextRequest, NextResponse } from 'next/server';
import { revokeOtherSessions, revokeAllSessions, isAdminEmail } from '@/lib/adminSession';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
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

    const { keepSessionId, userId, userEmail, revokeAll = false } = await request.json();

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

    let revokedCount: number;
    
    if (revokeAll) {
      // Revoke all sessions including current
      revokedCount = await revokeAllSessions(userId);
      
      // Clear the current session cookie
      const response = NextResponse.json({
        ok: true,
        revokedCount,
        message: `Signed out from ${revokedCount} session(s)`
      });
      
      response.cookies.delete('admin_session');
      return response;
    } else {
      // Keep current session, revoke others
      const currentSessionId = keepSessionId || sessionCookie.value;
      revokedCount = await revokeOtherSessions(userId, currentSessionId);
    }

    return NextResponse.json({
      ok: true,
      revokedCount,
      message: `Signed out from ${revokedCount} other session(s)`
    });

  } catch (error) {
    console.error('Admin sessions revoke API error:', error);
    return NextResponse.json({
      ok: false,
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
}