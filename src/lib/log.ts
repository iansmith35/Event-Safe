/**
 * Centralized logging utility with Firestore integration
 */

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function log(event: string, data: Record<string, any> = {}) {
  try {
    // Write to Firestore system_logs collection
    await addDoc(collection(db, 'system_logs'), {
      event,
      data,
      ts: serverTimestamp()
    });
    
    // Also log to console as fallback
    console.log(`[${event}]`, data);
  } catch (e) {
    // If Firestore fails, at least log to console
    console.error('logfail', e);
    console.log(`[${event}] (firestore failed)`, data);
  }
}