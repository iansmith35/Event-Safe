/**
 * Feature gating utilities for EventSafe
 */

import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Features, AdminFlags, EntityStatus, DEFAULT_FEATURES, DEFAULT_ADMIN_FLAGS } from '@/types/config';

// Cache for features to avoid repeated Firestore calls
let featuresCache: { data: Features; timestamp: number } | null = null;
let adminCache: { data: AdminFlags; timestamp: number } | null = null;
const CACHE_TTL = 30000; // 30 seconds

/**
 * Get current features configuration from Firestore
 */
export async function getFeatures(): Promise<Features> {
  // Return cached data if still valid
  if (featuresCache && Date.now() - featuresCache.timestamp < CACHE_TTL) {
    return featuresCache.data;
  }

  try {
    const docRef = doc(db, 'config', 'features');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const features = docSnap.data() as Features;
      featuresCache = { data: features, timestamp: Date.now() };
      return features;
    } else {
      // Return defaults if document doesn't exist
      featuresCache = { data: DEFAULT_FEATURES, timestamp: Date.now() };
      return DEFAULT_FEATURES;
    }
  } catch (error) {
    console.error('Failed to fetch features:', error);
    // Return defaults on error
    return DEFAULT_FEATURES;
  }
}

/**
 * Get current admin flags from Firestore
 */
export async function getAdminFlags(): Promise<AdminFlags> {
  // Return cached data if still valid
  if (adminCache && Date.now() - adminCache.timestamp < CACHE_TTL) {
    return adminCache.data;
  }

  try {
    const docRef = doc(db, 'config', 'admin');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const adminFlags = docSnap.data() as AdminFlags;
      adminCache = { data: adminFlags, timestamp: Date.now() };
      return adminFlags;
    } else {
      // Return defaults if document doesn't exist
      adminCache = { data: DEFAULT_ADMIN_FLAGS, timestamp: Date.now() };
      return DEFAULT_ADMIN_FLAGS;
    }
  } catch (error) {
    console.error('Failed to fetch admin flags:', error);
    // Return defaults on error
    return DEFAULT_ADMIN_FLAGS;
  }
}

/**
 * Clear feature cache (call when features are updated)
 */
export function clearFeatureCache(): void {
  featuresCache = null;
  adminCache = null;
}

/**
 * Assert a feature is enabled, throw error if disabled
 */
export async function assertFeature(name: keyof Features): Promise<void> {
  const features = await getFeatures();
  const adminFlags = await getAdminFlags();
  
  if (adminFlags.globalReadOnly) {
    throw new Error('GLOBAL_READ_ONLY');
  }
  
  if (!features[name]) {
    throw new Error(`FEATURE_DISABLED:${name}`);
  }
}

/**
 * Check if a feature is enabled
 */
export async function isFeatureEnabled(name: keyof Features): Promise<boolean> {
  try {
    const features = await getFeatures();
    const adminFlags = await getAdminFlags();
    
    if (adminFlags.globalReadOnly) {
      return false;
    }
    
    return features[name];
  } catch {
    return false;
  }
}

/**
 * Assert an entity (user/venue) is not suspended
 */
export function assertEntityEnabled(entity: { status?: EntityStatus }): void {
  if (entity.status?.suspended) {
    throw new Error('ENTITY_SUSPENDED');
  }
}

/**
 * Check if an entity is suspended
 */
export function isEntitySuspended(entity: { status?: EntityStatus }): boolean {
  return entity.status?.suspended || false;
}

/**
 * Create a 503 Service Unavailable response for disabled features
 */
export function createFeatureDisabledResponse(feature: string) {
  return new Response(
    JSON.stringify({
      ok: false,
      error: 'FEATURE_DISABLED',
      message: `${feature} is currently disabled`,
      code: 503
    }),
    {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Create a 403 Forbidden response for suspended entities
 */
export function createEntitySuspendedResponse() {
  return new Response(
    JSON.stringify({
      ok: false,
      error: 'ENTITY_SUSPENDED',
      message: 'Account is suspended. Contact support for assistance.',
      code: 403
    }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}