# Event-Safe

This is a Next.js application for event safety management, built with Firebase and AI-powered features.

## Getting Started

To get started, take a look at src/app/page.tsx.

## Operations & Administration

### Admin Dashboard

Access the admin dashboard at `/admin` with the admin code. The admin code can be set via:
- Environment variable: `ADMIN_CODE` (defaults to `2338`)
- HTTP header: `x-admin-code: 2338`
- Cookie: `x-admin-code=2338` (set automatically via query parameter)
- Temporary query parameter: `?admin=2338` (sets a cookie for 24 hours)

The admin dashboard shows:
- Live system status (AI, Maps, Firebase connectivity)
- Build information and deployment details
- Service diagnostic tests
- Recent system logs from Firestore

### Health Monitoring

The application provides a health check endpoint at `/api/health` that returns JSON with:
```json
{
  "ok": true,
  "ai": true,
  "maps": true, 
  "firebase": true,
  "buildTime": "abc123",
  "now": "2024-01-01T00:00:00.000Z"
}
```

This endpoint can be used for:
- Uptime monitoring (recommend GCP Uptime Checks)
- Load balancer health checks
- Service discovery and status verification

### Logging

System events are logged to:
- Firestore collection: `system_logs` 
- Console output (fallback)
- Google Cloud Logging (in production)

Logs include structured data with timestamps and event details for debugging and monitoring.

### Google Cloud Platform Setup

For production monitoring:

1. **Uptime Checks**: Create a GCP Uptime Check for `GET /api/health`
2. **Logging**: View logs in GCP Console > Logging
3. **Error Reporting**: Automatic error reporting for exceptions
4. **Monitoring**: Set up alerts based on health check failures

### Environment Variables

Required for full functionality:
```env
# AI Services
GEMINI_API_KEY=your_gemini_key
# or GOOGLE_API_KEY=your_google_key

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key

# Firebase
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Admin Access
ADMIN_CODE=2338
```
