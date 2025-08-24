/**
 * AI usage tracking and limits system for EventSafe
 */

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { DEFAULT_LIMITS } from '@/types/config';

export interface AIUsage {
  date: string; // YYYYMMDD format
  messageCount: number;
  lastUpdated: Date;
}

/**
 * Get today's date string in YYYYMMDD format
 */
function getTodayString(): string {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}

/**
 * Get current AI limits from configuration
 */
async function getAILimits(): Promise<{ aiGuestDailyMessages: number }> {
  try {
    const limitsRef = doc(db, 'config', 'limits');
    const limitsSnap = await getDoc(limitsRef);
    
    if (limitsSnap.exists()) {
      return limitsSnap.data() as { aiGuestDailyMessages: number };
    } else {
      return DEFAULT_LIMITS;
    }
  } catch (error) {
    console.error('Failed to fetch AI limits:', error);
    return DEFAULT_LIMITS;
  }
}

/**
 * Get current usage for a guest on a specific date
 */
export async function getGuestAIUsage(guestId: string, date?: string): Promise<AIUsage> {
  const dateStr = date || getTodayString();
  const usageDocId = `${guestId}_${dateStr}`;
  
  try {
    const usageRef = doc(db, 'ai_usage', usageDocId);
    const usageSnap = await getDoc(usageRef);
    
    if (usageSnap.exists()) {
      const data = usageSnap.data();
      return {
        date: dateStr,
        messageCount: data.messageCount || 0,
        lastUpdated: data.lastUpdated?.toDate() || new Date()
      };
    } else {
      return {
        date: dateStr,
        messageCount: 0,
        lastUpdated: new Date()
      };
    }
  } catch (error) {
    console.error('Failed to get AI usage:', error);
    return {
      date: dateStr,
      messageCount: 0,
      lastUpdated: new Date()
    };
  }
}

/**
 * Check if a guest has exceeded their AI usage limit for today
 */
export async function checkAIUsageLimit(guestId: string): Promise<{
  allowed: boolean;
  currentUsage: number;
  dailyLimit: number;
  remainingMessages: number;
}> {
  const [currentUsage, limits] = await Promise.all([
    getGuestAIUsage(guestId),
    getAILimits()
  ]);

  const allowed = currentUsage.messageCount < limits.aiGuestDailyMessages;
  const remainingMessages = Math.max(0, limits.aiGuestDailyMessages - currentUsage.messageCount);

  return {
    allowed,
    currentUsage: currentUsage.messageCount,
    dailyLimit: limits.aiGuestDailyMessages,
    remainingMessages
  };
}

/**
 * Increment AI usage for a guest (call this when processing an AI request)
 */
export async function incrementAIUsage(guestId: string): Promise<{
  success: boolean;
  newCount: number;
  limitExceeded: boolean;
}> {
  const dateStr = getTodayString();
  const usageDocId = `${guestId}_${dateStr}`;
  
  try {
    // First check if we're at the limit
    const limitCheck = await checkAIUsageLimit(guestId);
    
    if (!limitCheck.allowed) {
      return {
        success: false,
        newCount: limitCheck.currentUsage,
        limitExceeded: true
      };
    }

    // Increment usage
    const usageRef = doc(db, 'ai_usage', usageDocId);
    
    // Use Firestore's atomic increment
    await setDoc(usageRef, {
      guestId,
      date: dateStr,
      messageCount: increment(1),
      lastUpdated: serverTimestamp()
    }, { merge: true });

    // Get the new count
    const updatedUsage = await getGuestAIUsage(guestId);

    return {
      success: true,
      newCount: updatedUsage.messageCount,
      limitExceeded: updatedUsage.messageCount >= limitCheck.dailyLimit
    };

  } catch (error) {
    console.error('Failed to increment AI usage:', error);
    return {
      success: false,
      newCount: 0,
      limitExceeded: false
    };
  }
}

/**
 * Reset usage for a guest (admin function)
 */
export async function resetGuestAIUsage(guestId: string, date?: string): Promise<boolean> {
  const dateStr = date || getTodayString();
  const usageDocId = `${guestId}_${dateStr}`;
  
  try {
    const usageRef = doc(db, 'ai_usage', usageDocId);
    await setDoc(usageRef, {
      guestId,
      date: dateStr,
      messageCount: 0,
      lastUpdated: serverTimestamp(),
      resetBy: 'admin'
    });
    
    return true;
  } catch (error) {
    console.error('Failed to reset AI usage:', error);
    return false;
  }
}

/**
 * Get usage statistics for a guest over the last N days
 */
export async function getGuestAIUsageHistory(guestId: string, days: number = 7): Promise<AIUsage[]> {
  const history: AIUsage[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    
    try {
      const usage = await getGuestAIUsage(guestId, dateStr);
      history.push(usage);
    } catch (error) {
      console.error(`Failed to get usage for ${dateStr}:`, error);
      history.push({
        date: dateStr,
        messageCount: 0,
        lastUpdated: new Date()
      });
    }
  }
  
  return history.reverse(); // Return oldest first
}

/**
 * Get aggregate AI usage stats (admin function)
 */
export async function getAIUsageStats(): Promise<{
  totalMessages: number;
  activeUsers: number;
  averageDaily: number;
}> {
  // This is a simplified version - in a real implementation,
  // you'd want to use Firestore aggregation queries or store pre-computed stats
  
  return {
    totalMessages: 0, // Would be computed from ai_usage collection
    activeUsers: 0,   // Would be computed from unique guests in ai_usage
    averageDaily: 0   // Would be computed from usage patterns
  };
}