/**
 * Environment validation with graceful degradation
 */

interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const OPTIONAL_ENV_VARS = [
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
  'GEMINI_API_KEY',
  'ADMIN_EMAIL',
  'ADMIN_PASSCODE',
];

/**
 * Validate environment variables and log warnings
 */
export function validateEnvironment(): EnvValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  REQUIRED_ENV_VARS.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Check optional variables and warn
  OPTIONAL_ENV_VARS.forEach(varName => {
    if (!process.env[varName]) {
      warnings.push(`Optional env var missing: ${varName}`);
    }
  });

  // Log warnings instead of throwing errors
  if (missing.length > 0) {
    console.warn('Missing required environment variables:', missing.join(', '));
  }
  
  warnings.forEach(warning => {
    console.warn(warning);
  });

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Check if Google Maps is properly configured
 */
export function isGoogleMapsConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
}

/**
 * Check if Firebase is properly configured
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}

/**
 * Initialize environment validation on app start
 */
export function initializeEnvironment(): void {
  if (typeof window === 'undefined') {
    // Server-side validation
    const result = validateEnvironment();
    
    if (!result.valid) {
      console.warn('App starting with missing environment variables. Some features may not work correctly.');
    }
  }
}