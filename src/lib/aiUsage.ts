/**
 * AI Usage Limiting System
 * Tracks and enforces daily AI usage limits for guests
 */

import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { db } from './firebase';
import { Limits, DEFAULT_LIMITS } from '@/types/config';

interface UsageRecord {
  count: number;
  date: string; // YYYYMMDD
  lastUsed: Date;
}

/**
 * Get current usage limits configuration
 */
export async function getUsageLimits(): Promise<Limits> {
  try {
    const limitsDoc = await getDoc(doc(db, 'config', 'limits'));
    if (limitsDoc.exists()) {
      return limitsDoc.data() as Limits;
    }
    return DEFAULT_LIMITS;
  } catch (error) {
    console.error('Failed to fetch usage limits:', error);
    return DEFAULT_LIMITS;
  }
}

/**
 * Get today's date string in YYYYMMDD format
 */
function getTodayString(): string {
  return new Date().toISOString().split('T')[0].replace(/-/g, '');
}

/**
 * Check if user has exceeded AI daily limit
 */
export async function checkAIUsageLimit(userId: string): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  try {
    const limits = await getUsageLimits();
    const todayString = getTodayString();
    
    const usageDoc = await getDoc(doc(db, 'ai_usage', `${userId}_${todayString}`));
    
    let currentUsage = 0;
    if (usageDoc.exists()) {
      const data = usageDoc.data() as UsageRecord;
      currentUsage = data.count || 0;
    }

    const remaining = Math.max(0, limits.aiGuestDailyMessages - currentUsage);
    const allowed = remaining > 0;

    return {
      allowed,
      remaining,
      limit: limits.aiGuestDailyMessages
    };

  } catch (error) {
    console.error('Failed to check AI usage limit:', error);
    // On error, allow usage but log the issue
    return {
      allowed: true,
      remaining: DEFAULT_LIMITS.aiGuestDailyMessages,
      limit: DEFAULT_LIMITS.aiGuestDailyMessages
    };
  }
}

/**
 * Increment AI usage for a user
 */
export async function incrementAIUsage(userId: string): Promise<void> {
  try {
    const todayString = getTodayString();
    const usageDocRef = doc(db, 'ai_usage', `${userId}_${todayString}`);
    
    const usageDoc = await getDoc(usageDocRef);
    
    if (usageDoc.exists()) {
      // Update existing record
      await updateDoc(usageDocRef, {
        count: increment(1),
        lastUsed: serverTimestamp()
      });
    } else {
      // Create new record for today
      await setDoc(usageDocRef, {
        userId,
        count: 1,
        date: todayString,
        lastUsed: serverTimestamp(),
        createdAt: serverTimestamp()
      });
    }

  } catch (error) {
    console.error('Failed to increment AI usage:', error);
    // Don't throw - we don't want to block AI usage due to logging failures
  }
}

/**
 * Get user's AI usage stats for today
 */
export async function getAIUsageStats(userId: string): Promise<{ used: number; limit: number; remaining: number }> {
  try {
    const limits = await getUsageLimits();
    const todayString = getTodayString();
    
    const usageDoc = await getDoc(doc(db, 'ai_usage', `${userId}_${todayString}`));
    
    let used = 0;
    if (usageDoc.exists()) {
      const data = usageDoc.data() as UsageRecord;
      used = data.count || 0;
    }

    return {
      used,
      limit: limits.aiGuestDailyMessages,
      remaining: Math.max(0, limits.aiGuestDailyMessages - used)
    };

  } catch (error) {
    console.error('Failed to get AI usage stats:', error);
    return {
      used: 0,
      limit: DEFAULT_LIMITS.aiGuestDailyMessages,
      remaining: DEFAULT_LIMITS.aiGuestDailyMessages
    };
  }
}

/**
 * AI usage limit error response
 */
export function createAILimitResponse(remaining: number, limit: number) {
  return Response.json(
    { 
      ok: false, 
      code: 'LIMIT',
      error: 'Daily AI usage limit exceeded',
      details: {
        remaining,
        limit,
        resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
      }
    },
    { status: 429 }
  );
}