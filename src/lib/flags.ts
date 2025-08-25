/**
 * Feature flags (kill switches) for EventSafe
 */

import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export type Flags = {
  homepageMap: boolean;
  aiRebecca: boolean;
  demoMode: boolean;
};

// Default flag values
const DEFAULT_FLAGS: Flags = {
  homepageMap: false,
  aiRebecca: false,
  demoMode: true,
};

// Cache for flags to avoid repeated Firestore calls
let flagsCache: { data: Flags; timestamp: number } | null = null;
const CACHE_TTL = 30000; // 30 seconds

/**
 * Get current flags from Firestore admin/settings doc
 */
export async function getFlags(): Promise<Flags> {
  // Return cached data if still valid
  if (flagsCache && Date.now() - flagsCache.timestamp < CACHE_TTL) {
    return flagsCache.data;
  }

  try {
    const docRef = doc(db, 'admin', 'settings');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const flags: Flags = {
        homepageMap: data.homepageMap ?? DEFAULT_FLAGS.homepageMap,
        aiRebecca: data.aiRebecca ?? DEFAULT_FLAGS.aiRebecca,
        demoMode: data.demoMode ?? DEFAULT_FLAGS.demoMode,
      };
      flagsCache = { data: flags, timestamp: Date.now() };
      return flags;
    } else {
      // Return defaults if document doesn't exist
      flagsCache = { data: DEFAULT_FLAGS, timestamp: Date.now() };
      return DEFAULT_FLAGS;
    }
  } catch (error) {
    console.error('Failed to fetch flags:', error);
    // Return defaults on error
    return DEFAULT_FLAGS;
  }
}

/**
 * Clear flags cache (call when flags are updated)
 */
export function clearFlagsCache(): void {
  flagsCache = null;
}