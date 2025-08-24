/**
 * Court case system and premium features for EventSafe
 */

import { db } from '@/lib/firebase';
import { doc, addDoc, collection, serverTimestamp, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { log } from '@/lib/log';

export interface CourtCase {
  id?: string;
  guestId: string;
  hostId?: string;
  venueId?: string;
  eventId?: string;
  title: string;
  description: string;
  category: 'financial_dispute' | 'safety_incident' | 'contract_breach' | 'other';
  status: 'pending_payment' | 'open' | 'investigation' | 'resolved' | 'closed';
  feesPaid: boolean;
  evidence: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolution?: string;
}

/**
 * Create a new court case (requires payment)
 * @param caseData - The case data
 * @param paymentSessionId - Stripe payment session ID (when implemented)
 */
export async function createCourtCase(
  caseData: Omit<CourtCase, 'id' | 'createdAt' | 'updatedAt' | 'feesPaid' | 'status'>,
  paymentSessionId?: string
): Promise<string> {
  try {
    const newCase: Omit<CourtCase, 'id'> = {
      ...caseData,
      status: paymentSessionId ? 'open' : 'pending_payment',
      feesPaid: !!paymentSessionId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const caseRef = await addDoc(collection(db, 'court_cases'), {
      ...newCase,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    await log('court_case_created', {
      caseId: caseRef.id,
      guestId: caseData.guestId,
      category: caseData.category,
      paymentSessionId: paymentSessionId || null
    });

    return caseRef.id;

  } catch (error) {
    console.error('Failed to create court case:', error);
    await log('court_case_creation_error', { error: String(error) });
    throw error;
  }
}

/**
 * Get cases for a specific guest
 */
export async function getGuestCourtCases(guestId: string): Promise<CourtCase[]> {
  try {
    const casesQuery = query(
      collection(db, 'court_cases'),
      where('guestId', '==', guestId)
    );
    
    const snapshot = await getDocs(casesQuery);
    const cases: CourtCase[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      cases.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        resolvedAt: data.resolvedAt?.toDate()
      } as CourtCase);
    });

    return cases.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  } catch (error) {
    console.error('Failed to get guest court cases:', error);
    return [];
  }
}

/**
 * Update case status (admin function)
 */
export async function updateCourtCaseStatus(
  caseId: string, 
  status: CourtCase['status'],
  resolution?: string,
  adminId?: string
): Promise<boolean> {
  try {
    const caseRef = doc(db, 'court_cases', caseId);
    const updateData: any = {
      status,
      updatedAt: serverTimestamp()
    };

    if (resolution) {
      updateData.resolution = resolution;
    }

    if (status === 'resolved' || status === 'closed') {
      updateData.resolvedAt = serverTimestamp();
    }

    await updateDoc(caseRef, updateData);

    await log('court_case_status_update', {
      caseId,
      newStatus: status,
      adminId: adminId || 'system',
      resolution: resolution || null
    });

    return true;

  } catch (error) {
    console.error('Failed to update court case status:', error);
    await log('court_case_status_update_error', { caseId, error: String(error) });
    return false;
  }
}

/**
 * Premium Features Checking System
 */

export interface PremiumFeatureCheck {
  allowed: boolean;
  requiresMembership: boolean;
  requiresFeatureFlag: boolean;
  membershipActive?: boolean;
  featureEnabled?: boolean;
  reason?: string;
}

/**
 * Check if guest-to-guest QR scanning is allowed
 */
export async function checkGuestToGuestScan(
  guestId: string,
  features?: { guestToGuestScan: boolean }
): Promise<PremiumFeatureCheck> {
  try {
    // Check feature flag
    if (features && !features.guestToGuestScan) {
      return {
        allowed: false,
        requiresMembership: true,
        requiresFeatureFlag: true,
        featureEnabled: false,
        reason: 'Guest-to-guest scanning is currently disabled'
      };
    }

    // Check membership status (would need to get from user doc)
    // For now, return a mock response
    return {
      allowed: true,
      requiresMembership: true,
      requiresFeatureFlag: true,
      membershipActive: true,
      featureEnabled: true
    };

  } catch (error) {
    console.error('Failed to check guest-to-guest scan permission:', error);
    return {
      allowed: false,
      requiresMembership: true,
      requiresFeatureFlag: true,
      reason: 'Unable to verify permissions'
    };
  }
}

/**
 * Check if staff seats feature is allowed
 */
export async function checkStaffSeats(venueId: string): Promise<PremiumFeatureCheck> {
  try {
    // Check feature flag and venue subscription
    // For now, return a mock response
    return {
      allowed: true,
      requiresMembership: false,
      requiresFeatureFlag: true,
      featureEnabled: true
    };

  } catch (error) {
    console.error('Failed to check staff seats permission:', error);
    return {
      allowed: false,
      requiresMembership: false,
      requiresFeatureFlag: true,
      reason: 'Unable to verify permissions'
    };
  }
}

/**
 * Create a court case payment session (mock implementation)
 */
export async function createCourtCasePayment(caseData: {
  title: string;
  guestId: string;
  amount: number; // In GBP
}): Promise<{
  checkoutUrl: string;
  sessionId: string;
}> {
  // Mock implementation - in reality would create Stripe checkout session
  const mockSessionId = `cs_court_case_${Date.now()}`;
  const mockCheckoutUrl = `https://checkout.stripe.com/c/pay/${mockSessionId}`;

  await log('court_case_payment_created', {
    guestId: caseData.guestId,
    title: caseData.title,
    amount: caseData.amount,
    mockSessionId
  });

  return {
    checkoutUrl: mockCheckoutUrl,
    sessionId: mockSessionId
  };
}

/**
 * Process court case payment completion (webhook handler)
 */
export async function processCourtCasePayment(sessionId: string, caseId?: string): Promise<boolean> {
  try {
    if (caseId) {
      // Update the case to mark payment as complete
      await updateCourtCaseStatus(caseId, 'open');
      
      const caseRef = doc(db, 'court_cases', caseId);
      await updateDoc(caseRef, {
        feesPaid: true,
        paymentSessionId: sessionId,
        updatedAt: serverTimestamp()
      });
    }

    await log('court_case_payment_completed', {
      sessionId,
      caseId: caseId || null
    });

    return true;

  } catch (error) {
    console.error('Failed to process court case payment:', error);
    await log('court_case_payment_error', { sessionId, error: String(error) });
    return false;
  }
}