/**
 * System status utility for admin/ops monitoring
 */

export async function getStatus() {
  return {
    ai: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
    maps: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    firebase: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    buildTime: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'local',
    now: new Date().toISOString()
  };
}