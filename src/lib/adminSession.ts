import { cookies } from 'next/headers';
import { db } from '@/lib/firebase';
import { doc, setDoc, collection, getDocs, deleteDoc, query, where, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';

/**
 * Admin session data structure
 */
export interface AdminSession {
  id: string;
  uid: string;
  createdAt: Date;
  lastSeenAt: Date;
  deviceInfo: string;
  ipHash: string;
}

/**
 * Device info for session tracking
 */
export interface DeviceInfo {
  userAgent: string;
  platform?: string;
}

/**
 * Check if the given email matches the admin email
 */
export function isAdminEmail(email?: string): boolean {
  if (!email) return false;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}

/**
 * Verify if the provided passcode matches the admin passcode
 */
export function verifyPasscode(code: string): boolean {
  const adminPasscode = process.env.ADMIN_PASSCODE || process.env.ADMIN_CODE;
  if (!adminPasscode) return false;
  return code === adminPasscode;
}

/**
 * Set admin role on user document in Firestore
 */
export async function setAdminRole(uid: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { role: 'admin' }, { merge: true });
  } catch (error) {
    console.error('Failed to set admin role:', error);
    throw error;
  }
}

/**
 * Generate a random session ID
 */
function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Set admin session cookie with session ID
 */
export async function setAdminCookie(sessionId?: string): Promise<void> {
  const cookieStore = await cookies();
  const cookieValue = sessionId || generateSessionId();
  cookieStore.set('admin_session', cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear admin session cookie
 */
export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

/**
 * Get current session ID from cookie
 */
export async function getCurrentSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value || null;
}

/**
 * Hash IP address for privacy
 */
function hashIP(ip?: string): string {
  if (!ip) return 'unknown';
  // Simple hash - in production you'd want a proper crypto hash
  return Buffer.from(ip).toString('base64').slice(0, 8);
}

/**
 * Register a new admin session
 */
export async function registerSession(params: {
  uid: string;
  deviceInfo: DeviceInfo;
  ipAddress?: string;
}): Promise<string> {
  const sessionId = generateSessionId();
  
  try {
    const sessionRef = doc(db, 'admin_sessions', sessionId);
    await setDoc(sessionRef, {
      uid: params.uid,
      createdAt: serverTimestamp(),
      lastSeenAt: serverTimestamp(),
      deviceInfo: `${params.deviceInfo.userAgent} (${params.deviceInfo.platform || 'unknown'})`,
      ipHash: hashIP(params.ipAddress)
    });
    
    return sessionId;
  } catch (error) {
    console.error('Failed to register admin session:', error);
    throw error;
  }
}

/**
 * Touch session to update last seen time
 */
export async function touchSession(sessionId: string): Promise<boolean> {
  try {
    const sessionRef = doc(db, 'admin_sessions', sessionId);
    await updateDoc(sessionRef, {
      lastSeenAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Failed to touch session:', error);
    return false;
  }
}

/**
 * Get all active sessions for a user
 */
export async function getUserSessions(uid: string): Promise<AdminSession[]> {
  try {
    const sessionsRef = collection(db, 'admin_sessions');
    const q = query(sessionsRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    
    const sessions: AdminSession[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sessions.push({
        id: doc.id,
        uid: data.uid,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastSeenAt: data.lastSeenAt?.toDate() || new Date(),
        deviceInfo: data.deviceInfo || 'Unknown device',
        ipHash: data.ipHash || 'unknown'
      });
    });
    
    // Sort by last seen, most recent first
    return sessions.sort((a, b) => b.lastSeenAt.getTime() - a.lastSeenAt.getTime());
  } catch (error) {
    console.error('Failed to get user sessions:', error);
    return [];
  }
}

/**
 * Revoke other sessions for a user (keeping the specified session)
 */
export async function revokeOtherSessions(uid: string, keepSessionId?: string): Promise<number> {
  try {
    const sessionsRef = collection(db, 'admin_sessions');
    const q = query(sessionsRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    
    let revokedCount = 0;
    const deletePromises: Promise<void>[] = [];
    
    querySnapshot.forEach((docSnapshot) => {
      if (keepSessionId && docSnapshot.id === keepSessionId) {
        return; // Skip the session we want to keep
      }
      
      deletePromises.push(deleteDoc(docSnapshot.ref));
      revokedCount++;
    });
    
    await Promise.all(deletePromises);
    return revokedCount;
  } catch (error) {
    console.error('Failed to revoke sessions:', error);
    throw error;
  }
}

/**
 * Revoke all sessions for a user
 */
export async function revokeAllSessions(uid: string): Promise<number> {
  return revokeOtherSessions(uid);
}

/**
 * Verify if a session exists and is valid
 */
export async function verifySession(sessionId: string, uid: string): Promise<boolean> {
  try {
    const sessionRef = doc(db, 'admin_sessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (!sessionSnap.exists()) {
      return false;
    }
    
    const sessionData = sessionSnap.data();
    return sessionData.uid === uid;
  } catch (error) {
    console.error('Failed to verify session:', error);
    return false;
  }
}