import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAdminEmail, verifyPasscode, setAdminRole } from '@/lib/adminSession';

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

    // Set admin session cookie
    const response = NextResponse.json({
      ok: true,
      redirect: '/admin'
    });

    response.cookies.set('admin_session', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error) {
    console.error('Admin login API error:', error);
    return NextResponse.json({
      ok: false,
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
}