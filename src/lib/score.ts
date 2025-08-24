/**
 * Venue scoring system for EventSafe
 */

import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

export interface VenueScoreComponents {
  baseScore: number;
  eventsCompleted: number;
  refunds: number;
  disputes: number;
  safetyIncidents: number;
  totalScore: number;
}

export interface VenueScoreWeights {
  eventsCompleted: number;
  refunds: number;
  disputes: number;
  safetyIncidents: number;
}

// Default scoring weights
export const DEFAULT_SCORE_WEIGHTS: VenueScoreWeights = {
  eventsCompleted: 10,  // +10 per completed event
  refunds: -20,         // -20 per refund
  disputes: -50,        // -50 per dispute
  safetyIncidents: -100 // -100 per safety incident
};

/**
 * Compute venue score based on historical data
 * @param venueId - The venue ID to compute score for
 * @param weights - Optional custom scoring weights
 * @returns Score components and final score (0-1000)
 */
export async function computeVenueScore(
  venueId: string,
  weights: VenueScoreWeights = DEFAULT_SCORE_WEIGHTS
): Promise<VenueScoreComponents> {
  try {
    // Base score starts at 750
    const baseScore = 750;
    
    // Count completed events for this venue
    const eventsQuery = query(
      collection(db, 'events'),
      where('venueId', '==', venueId),
      where('status', '==', 'completed')
    );
    const eventsSnapshot = await getDocs(eventsQuery);
    const eventsCompleted = eventsSnapshot.size;
    
    // Count refunds
    const refundsQuery = query(
      collection(db, 'refunds'),
      where('venueId', '==', venueId)
    );
    const refundsSnapshot = await getDocs(refundsQuery);
    const refunds = refundsSnapshot.size;
    
    // Count disputes
    const disputesQuery = query(
      collection(db, 'disputes'),
      where('venueId', '==', venueId)
    );
    const disputesSnapshot = await getDocs(disputesQuery);
    const disputes = disputesSnapshot.size;
    
    // Count safety incidents
    const incidentsQuery = query(
      collection(db, 'safety_incidents'),
      where('venueId', '==', venueId)
    );
    const incidentsSnapshot = await getDocs(incidentsQuery);
    const safetyIncidents = incidentsSnapshot.size;
    
    // Calculate total score with weights
    const totalScore = Math.max(0, Math.min(1000, 
      baseScore +
      (eventsCompleted * weights.eventsCompleted) +
      (refunds * weights.refunds) +
      (disputes * weights.disputes) +
      (safetyIncidents * weights.safetyIncidents)
    ));
    
    return {
      baseScore,
      eventsCompleted,
      refunds,
      disputes,
      safetyIncidents,
      totalScore: Math.round(totalScore)
    };
    
  } catch (error) {
    console.error('Error computing venue score:', error);
    
    // Return default score on error
    return {
      baseScore: 750,
      eventsCompleted: 0,
      refunds: 0,
      disputes: 0,
      safetyIncidents: 0,
      totalScore: 750
    };
  }
}

/**
 * Update venue score in Firestore
 * @param venueId - The venue ID to update
 * @param scoreComponents - The computed score components
 */
export async function updateVenueScore(
  venueId: string,
  scoreComponents: VenueScoreComponents
): Promise<void> {
  try {
    const venueRef = doc(db, 'venues', venueId);
    await updateDoc(venueRef, {
      score: scoreComponents.totalScore,
      scoreComponents,
      scoreUpdatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating venue score:', error);
    throw error;
  }
}

/**
 * Recompute and update score for a single venue
 * @param venueId - The venue ID to recompute
 * @returns The updated score components
 */
export async function recomputeVenueScore(venueId: string): Promise<VenueScoreComponents> {
  const scoreComponents = await computeVenueScore(venueId);
  await updateVenueScore(venueId, scoreComponents);
  return scoreComponents;
}

/**
 * Recompute scores for all venues
 * @returns Array of updated venue scores with their IDs
 */
export async function recomputeAllVenueScores(): Promise<Array<{ venueId: string; score: VenueScoreComponents }>> {
  try {
    // Get all venues
    const venuesQuery = query(collection(db, 'venues'));
    const venuesSnapshot = await getDocs(venuesQuery);
    
    const results: Array<{ venueId: string; score: VenueScoreComponents }> = [];
    
    // Process venues in batches to avoid overwhelming Firestore
    const batchSize = 10;
    const venues = venuesSnapshot.docs;
    
    for (let i = 0; i < venues.length; i += batchSize) {
      const batch = venues.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (venueDoc) => {
        const venueId = venueDoc.id;
        try {
          const scoreComponents = await recomputeVenueScore(venueId);
          return { venueId, score: scoreComponents };
        } catch (error) {
          console.error(`Error recomputing score for venue ${venueId}:`, error);
          // Return default score for failed venues
          return {
            venueId,
            score: {
              baseScore: 750,
              eventsCompleted: 0,
              refunds: 0,
              disputes: 0,
              safetyIncidents: 0,
              totalScore: 750
            }
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Small delay between batches to be respectful to Firestore
      if (i + batchSize < venues.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return results;
    
  } catch (error) {
    console.error('Error recomputing all venue scores:', error);
    throw error;
  }
}

/**
 * Get venue score as a formatted string for display
 * @param score - The venue score (0-1000)
 * @returns Formatted score string with rating
 */
export function formatVenueScore(score: number): string {
  if (score >= 900) return `${score}/1000 (Excellent)`;
  if (score >= 800) return `${score}/1000 (Very Good)`;
  if (score >= 700) return `${score}/1000 (Good)`;
  if (score >= 600) return `${score}/1000 (Fair)`;
  return `${score}/1000 (Needs Improvement)`;
}

/**
 * Get venue score color class for UI styling
 * @param score - The venue score (0-1000)
 * @returns CSS color class
 */
export function getVenueScoreColorClass(score: number): string {
  if (score >= 900) return 'text-green-600';
  if (score >= 800) return 'text-blue-600';
  if (score >= 700) return 'text-yellow-600';
  if (score >= 600) return 'text-orange-600';
  return 'text-red-600';
}