import { NextResponse } from 'next/server';

export async function GET() {
  // Check if this is an admin request (reusing middleware logic)
  // Note: In production, this should have additional security layers
  
  const envVarKeys = [
    'GEMINI_API_KEY',
    'GOOGLE_API_KEY', 
    'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'ADMIN_CODE'
  ];

  const loadedVars: string[] = [];
  const missing: string[] = [];

  envVarKeys.forEach(key => {
    if (process.env[key]) {
      loadedVars.push(key);
    } else {
      missing.push(key);
    }
  });

  return NextResponse.json({
    ok: true,
    loadedVars,
    missing,
    totalLoaded: loadedVars.length,
    totalMissing: missing.length
  });
}