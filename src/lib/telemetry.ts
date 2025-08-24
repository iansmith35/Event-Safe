/**
 * Enhanced telemetry utility for admin monitoring with detailed environment status
 */

export async function getTelemetry() {
  return {
    aiKey: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
    googleKey: !!process.env.GOOGLE_API_KEY,
    mapsKey: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    firebaseConfigured: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    commit: process.env.GITHUB_SHA || process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    time: new Date().toISOString(),
  };
}