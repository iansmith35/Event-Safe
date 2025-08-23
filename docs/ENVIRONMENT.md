# Environment Variables Setup

This document explains how to configure environment variables for the Event Safe application when deploying with Firebase App Hosting.

## Variable Types

### Server-only Variables
These variables are only accessible on the server side and should be set in Firebase Console:

- `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) - Google AI API key for server-side AI functionality
- `STRIPE_SECRET_KEY` - Stripe secret key for payment processing
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret

**Important**: Set these in Firebase Console as **underscored** variables (e.g., `_GEMINI_API_KEY`) and they will be mapped in `apphosting.yaml`.

### Public/Browser Variables  
These variables are exposed to the browser and must be prefixed with `NEXT_PUBLIC_`:

- `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase client API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase app ID
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` - Firebase measurement ID (optional)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

**Important**: Also set these in Firebase Console using **underscored** names (e.g., `_NEXT_PUBLIC_FIREBASE_API_KEY`).

## How to Set Variables

1. Go to Firebase Console → Your Project → App Hosting
2. Navigate to "Backend" → "Variables" 
3. Add each variable with the underscored name (e.g., `_GEMINI_API_KEY`)
4. The `apphosting.yaml` file maps these to the proper environment variable names

## Important Notes

- **Next.js only exposes variables that start with `NEXT_PUBLIC_` to the browser**
- Server-only variables (without `NEXT_PUBLIC_` prefix) remain secure on the server
- All variables must be set in Firebase Console, even the public ones, for App Hosting to work properly
- The `apphosting.yaml` file handles the mapping from console variables to environment variables