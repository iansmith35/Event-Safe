import { cookies } from 'next/headers';
import { db } from '@/lib/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';

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
  const adminPasscode = process.env.ADMIN_PASSCODE;
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
 * Set admin session cookie
 */
export async function setAdminCookie(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set('admin_session', '1', {
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
  const cookieStore = cookies();
  cookieStore.delete('admin_session');
}