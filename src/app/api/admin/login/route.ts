import { NextRequest, NextResponse } from 'next/server';
import { isAdminEmail, verifyPasscode, setAdminRole, registerSession } from '@/lib/adminSession';

/**
 * Extract platform information from user agent string
 */
function getPlatformFromUserAgent(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'Tablet';
  } else if (ua.includes('mac')) {
    return 'macOS';
  } else if (ua.includes('windows')) {
    return 'Windows';
  } else if (ua.includes('linux')) {
    return 'Linux';
  } else {
    return 'Unknown';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { passcode, userEmail, userId } = await request.json();

    // Validate required fields
    if (!passcode || !userEmail || !userId) {
      return NextResponse.json({
        ok: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Check if email is authorized admin email
    if (!isAdminEmail(userEmail)) {
      return NextResponse.json({
        ok: false,
        error: 'This account is not authorized for admin access'
      }, { status: 403 });
    }

    // Verify passcode
    if (!verifyPasscode(passcode)) {
      return NextResponse.json({
        ok: false,
        error: 'Invalid passcode'
      }, { status: 401 });
    }

    // Set admin role in Firestore
    try {
      await setAdminRole(userId);
    } catch (error) {
      console.error('Failed to set admin role:', error);
      return NextResponse.json({
        ok: false,
        error: 'Failed to update user role'
      }, { status: 500 });
    }

    // Create session record and set admin session cookie
    try {
      // Extract device info from headers
      const userAgent = request.headers.get('user-agent') || 'Unknown';
      const forwardedFor = request.headers.get('x-forwarded-for');
      const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : 
                       request.headers.get('x-real-ip') || 
                       'unknown';

      // Register new session
      const sessionId = await registerSession({
        uid: userId,
        deviceInfo: {
          userAgent,
          platform: getPlatformFromUserAgent(userAgent)
        },
        ipAddress
      });

      // Set session cookie
      const response = NextResponse.json({
        ok: true,
        redirect: '/admin'
      });

      response.cookies.set('admin_session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    } catch (error) {
      console.error('Failed to create admin session:', error);
      return NextResponse.json({
        ok: false,
        error: 'Failed to create session'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Admin login API error:', error);
    return NextResponse.json({
      ok: false,
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
}