/**
 * Feature Gate Middleware
 * Provides feature flag checking and entity status validation
 */

import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Features, EntityStatus, DEFAULT_FEATURES } from '@/types/config';

// Cache for feature flags to avoid repeated Firestore calls
let featuresCache: Features | null = null;
let featuresCacheTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

/**
 * Get current feature configuration from Firestore (with caching)
 */
export async function getFeatures(): Promise<Features> {
  const now = Date.now();
  
  // Return cached features if still valid
  if (featuresCache && now - featuresCacheTime < CACHE_TTL) {
    return featuresCache;
  }

  try {
    const configDoc = await getDoc(doc(db, 'config', 'features'));
    if (configDoc.exists()) {
      featuresCache = configDoc.data() as Features;
    } else {
      featuresCache = DEFAULT_FEATURES;
    }
    featuresCacheTime = now;
    return featuresCache;
  } catch (error) {
    console.error('Failed to fetch features config:', error);
    return DEFAULT_FEATURES;
  }
}

/**
 * Clear the features cache (call when features are updated)
 */
export function clearFeaturesCache(): void {
  featuresCache = null;
  featuresCacheTime = 0;
}

/**
 * Check if a feature is enabled
 */
export async function isFeatureEnabled(feature: keyof Features): Promise<boolean> {
  const features = await getFeatures();
  return features[feature];
}

/**
 * Assert that a feature is enabled, throw error if not
 */
export async function assertFeature(feature: keyof Features): Promise<void> {
  const enabled = await isFeatureEnabled(feature);
  if (!enabled) {
    throw new Error(`Feature '${feature}' is currently disabled`, { 
      cause: { code: 'FEATURE_DISABLED', feature } 
    });
  }
}

/**
 * Check if an entity (user or venue) is suspended
 */
export function isEntitySuspended(entity: { status?: EntityStatus }): boolean {
  return entity.status?.suspended === true;
}

/**
 * Assert that an entity is not suspended
 */
export function assertEntityEnabled(entity: { status?: EntityStatus }): void {
  if (isEntitySuspended(entity)) {
    throw new Error('Account is suspended', { 
      cause: { code: 'ENTITY_SUSPENDED', notes: entity.status?.notes } 
    });
  }
}

/**
 * Create a feature-gated response for disabled features
 */
export function createFeatureDisabledResponse(feature: string) {
  return Response.json(
    { 
      ok: false, 
      error: 'Feature disabled',
      code: 'FEATURE_DISABLED',
      feature 
    },
    { status: 503 }
  );
}

/**
 * Create a suspended entity response
 */
export function createEntitySuspendedResponse(notes?: string) {
  return Response.json(
    { 
      ok: false, 
      error: 'Account suspended',
      code: 'ENTITY_SUSPENDED',
      notes 
    },
    { status: 403 }
  );
}