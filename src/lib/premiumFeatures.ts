/**
 * Premium Features Helper
 * Handles premium feature access control and membership checks
 */

import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { isFeatureEnabled } from './featureGate';
import { UserMembership, VenuePlan } from '@/types/config';

interface User {
  id: string;
  membership?: UserMembership;
  role?: 'guest' | 'host' | 'venue';
}

interface Venue {
  id: string;
  plan?: VenuePlan;
}

/**
 * Check if a user has active membership
 */
export function hasActiveMembership(user: User): boolean {
  if (!user.membership) return false;
  
  const { active, currentPeriodEnd } = user.membership;
  if (!active) return false;
  
  // Check if membership hasn't expired
  if (currentPeriodEnd && new Date() > currentPeriodEnd) {
    return false;
  }
  
  return true;
}

/**
 * Check if a venue has active plan
 */
export function hasActivePlan(venue: Venue): boolean {
  if (!venue.plan) return false;
  
  const { active, currentPeriodEnd } = venue.plan;
  if (!active) return false;
  
  // Check if plan hasn't expired
  if (currentPeriodEnd && new Date() > currentPeriodEnd) {
    return false;
  }
  
  return true;
}

/**
 * Check if guest-to-guest QR scanning is allowed
 * Requires: guestToGuestScan feature enabled AND active membership
 */
export async function canUseGuestToGuestQR(user: User): Promise<{ allowed: boolean; reason?: string }> {
  // Check if feature is enabled globally
  if (!(await isFeatureEnabled('guestToGuestScan'))) {
    return { allowed: false, reason: 'Feature is currently disabled' };
  }
  
  // Check if user has active membership
  if (!hasActiveMembership(user)) {
    return { allowed: false, reason: 'Active membership required' };
  }
  
  return { allowed: true };
}

/**
 * Check if court case feature is allowed
 * Requires: court feature enabled
 */
export async function canUseCourt(): Promise<{ allowed: boolean; reason?: string }> {
  if (!(await isFeatureEnabled('court'))) {
    return { allowed: false, reason: 'Court feature is currently disabled' };
  }
  
  return { allowed: true };
}

/**
 * Check if staff seats management is allowed
 * Requires: staffSeats feature enabled AND venue has active plan
 */
export async function canManageStaffSeats(venue: Venue): Promise<{ allowed: boolean; reason?: string }> {
  // Check if feature is enabled globally
  if (!(await isFeatureEnabled('staffSeats'))) {
    return { allowed: false, reason: 'Staff seats feature is currently disabled' };
  }
  
  // Check if venue has active plan
  if (!hasActivePlan(venue)) {
    return { allowed: false, reason: 'Active venue plan required' };
  }
  
  return { allowed: true };
}

/**
 * Get user membership status from Firestore
 */
export async function getUserMembershipStatus(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;
    
    const userData = userDoc.data();
    return {
      id: userId,
      membership: userData.membership,
      role: userData.role
    };
  } catch (error) {
    console.error('Failed to get user membership status:', error);
    return null;
  }
}

/**
 * Get venue plan status from Firestore
 */
export async function getVenuePlanStatus(venueId: string): Promise<Venue | null> {
  try {
    const venueDoc = await getDoc(doc(db, 'venues', venueId));
    if (!venueDoc.exists()) return null;
    
    const venueData = venueDoc.data();
    return {
      id: venueId,
      plan: venueData.plan
    };
  } catch (error) {
    console.error('Failed to get venue plan status:', error);
    return null;
  }
}

/**
 * Create premium feature response for disabled/unavailable features
 */
export function createPremiumFeatureResponse(reason: string, feature: string) {
  return Response.json(
    {
      ok: false,
      error: 'Premium feature not available',
      code: 'PREMIUM_REQUIRED',
      feature,
      reason
    },
    { status: 403 }
  );
}

/**
 * Premium feature gate for API endpoints
 */
export async function withPremiumFeature<T>(
  checkFunction: () => Promise<{ allowed: boolean; reason?: string }>,
  feature: string,
  handler: () => Promise<T>
): Promise<T | Response> {
  const check = await checkFunction();
  
  if (!check.allowed) {
    return createPremiumFeatureResponse(check.reason || 'Access denied', feature);
  }
  
  return handler();
}