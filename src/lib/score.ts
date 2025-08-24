/**
 * Venue Scoring System
 * Calculates and manages venue safety/reliability scores
 */

import { doc, getDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface VenueScoreData {
  score: number;
  scoreUpdatedAt: Date;
  breakdown?: {
    base: number;
    eventsCompleted: number;
    refundPenalty: number;
    disputePenalty: number;
    safetyPenalty: number;
    bonuses: number;
  };
}

export interface ScoreFactors {
  eventsCompleted: number;
  refunds: number;
  disputes: number;
  safetyIncidents: number;
  positiveReviews: number;
  verificationLevel: number; // 0-3 (basic to premium verified)
}

/**
 * Calculate venue score based on activity and reputation factors
 * 
 * Base score: 750/1000
 * + Events completed: +10 points each (up to +100)
 * + Positive reviews: +5 points each (up to +50)  
 * + Verification level: +25 points per level (up to +75)
 * - Refunds: -20 points each
 * - Disputes: -50 points each
 * - Safety incidents: -100 points each
 * 
 * Final score clamped between 0-1000
 */
export function calculateVenueScore(factors: ScoreFactors): VenueScoreData {
  const base = 750;
  
  // Positive factors (with caps to prevent gaming)
  const eventsBonus = Math.min(factors.eventsCompleted * 10, 100);
  const reviewsBonus = Math.min(factors.positiveReviews * 5, 50);
  const verificationBonus = Math.min(factors.verificationLevel * 25, 75);
  
  // Negative factors (no caps - serious issues should hurt score significantly)
  const refundPenalty = factors.refunds * 20;
  const disputePenalty = factors.disputes * 50;
  const safetyPenalty = factors.safetyIncidents * 100;
  
  const bonuses = eventsBonus + reviewsBonus + verificationBonus;
  const penalties = refundPenalty + disputePenalty + safetyPenalty;
  
  const rawScore = base + bonuses - penalties;
  const score = Math.max(0, Math.min(1000, rawScore));
  
  return {
    score,
    scoreUpdatedAt: new Date(),
    breakdown: {
      base,
      eventsCompleted: eventsBonus,
      refundPenalty: -refundPenalty,
      disputePenalty: -disputePenalty,
      safetyPenalty: -safetyPenalty,
      bonuses
    }
  };
}

/**
 * Gather score factors for a venue from Firestore
 */
export async function gatherVenueFactors(venueId: string): Promise<ScoreFactors> {
  try {
    // Get venue document for basic info
    const venueDoc = await getDoc(doc(db, 'venues', venueId));
    const venueData = venueDoc.data();
    
    // Count events completed by this venue
    const eventsQuery = query(
      collection(db, 'events'),
      where('venueId', '==', venueId),
      where('status', '==', 'completed')
    );
    const eventsSnapshot = await getDocs(eventsQuery);
    const eventsCompleted = eventsSnapshot.size;
    
    // Count refunds (simplified - would need proper refunds collection)
    const refundsQuery = query(
      collection(db, 'orders'),
      where('venueId', '==', venueId),
      where('status', '==', 'refunded')
    );
    const refundsSnapshot = await getDocs(refundsQuery);
    const refunds = refundsSnapshot.size;
    
    // Count disputes (simplified - would need proper disputes collection)
    const disputesQuery = query(
      collection(db, 'system_logs'),
      where('event', '==', 'venue_dispute'),
      where('data.venueId', '==', venueId)
    );
    const disputesSnapshot = await getDocs(disputesQuery);
    const disputes = disputesSnapshot.size;
    
    // Count safety incidents
    const safetyQuery = query(
      collection(db, 'system_logs'),
      where('event', '==', 'safety_incident'),
      where('data.venueId', '==', venueId)
    );
    const safetySnapshot = await getDocs(safetyQuery);
    const safetyIncidents = safetySnapshot.size;
    
    // Get positive reviews count (simplified)
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('venueId', '==', venueId),
      where('rating', '>=', 4)
    );
    const reviewsSnapshot = await getDocs(reviewsQuery);
    const positiveReviews = reviewsSnapshot.size;
    
    // Get verification level from venue data
    const verificationLevel = venueData?.verificationLevel || 0;
    
    return {
      eventsCompleted,
      refunds,
      disputes,
      safetyIncidents,
      positiveReviews,
      verificationLevel
    };
  } catch (error) {
    console.error('Failed to gather venue factors:', error);
    return {
      eventsCompleted: 0,
      refunds: 0,
      disputes: 0,
      safetyIncidents: 0,
      positiveReviews: 0,
      verificationLevel: 0
    };
  }
}

/**
 * Compute and update venue score in Firestore
 */
export async function computeVenueScore(venueId: string): Promise<VenueScoreData> {
  const factors = await gatherVenueFactors(venueId);
  const scoreData = calculateVenueScore(factors);
  
  try {
    // Update venue document with new score
    await updateDoc(doc(db, 'venues', venueId), {
      score: scoreData.score,
      scoreUpdatedAt: serverTimestamp(),
      scoreBreakdown: scoreData.breakdown
    });
    
    // Log the score update
    await updateDoc(doc(db, 'system_logs', `score_update_${venueId}_${Date.now()}`), {
      event: 'venue_score_updated',
      venueId,
      data: {
        newScore: scoreData.score,
        factors,
        breakdown: scoreData.breakdown
      },
      ts: serverTimestamp()
    });
    
    return scoreData;
  } catch (error) {
    console.error('Failed to update venue score:', error);
    throw error;
  }
}

/**
 * Get venue score display text with color coding
 */
export function getScoreDisplay(score: number): { text: string; color: string; level: string } {
  if (score >= 900) {
    return { text: `${score}/1000`, color: 'text-green-600', level: 'Excellent' };
  } else if (score >= 800) {
    return { text: `${score}/1000`, color: 'text-green-500', level: 'Very Good' };
  } else if (score >= 700) {
    return { text: `${score}/1000`, color: 'text-yellow-600', level: 'Good' };
  } else if (score >= 600) {
    return { text: `${score}/1000`, color: 'text-orange-600', level: 'Fair' };
  } else if (score >= 500) {
    return { text: `${score}/1000`, color: 'text-red-600', level: 'Poor' };
  } else {
    return { text: `${score}/1000`, color: 'text-red-700', level: 'Very Poor' };
  }
}