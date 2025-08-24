/**
 * Venue Score Recompute API
 * Allows admins to recompute venue scores
 */

import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { log } from '@/lib/log';
import { computeVenueScore } from '@/lib/score';

export async function POST(request: NextRequest) {
  try {
    // Admin authentication is handled by middleware
    const body = await request.json().catch(() => ({}));
    const { venueId } = body;

    let venueIds: string[] = [];
    let processed = 0;
    let errors = 0;

    if (venueId) {
      // Recompute specific venue
      venueIds = [venueId];
    } else {
      // Recompute all venues
      try {
        const venuesQuery = query(collection(db, 'venues'), limit(100)); // Limit to prevent timeout
        const venuesSnapshot = await getDocs(venuesQuery);
        venueIds = venuesSnapshot.docs.map(doc => doc.id);
      } catch (error) {
        console.error('Failed to fetch venues:', error);
        return NextResponse.json(
          { ok: false, error: 'Failed to fetch venues' },
          { status: 500 }
        );
      }
    }

    // Log the start of recomputation
    await log('admin_score_recompute_start', {
      venueCount: venueIds.length,
      specificVenue: venueId || null,
      adminIP: request.headers.get('x-forwarded-for') || 'unknown'
    });

    // Process venues (in batches to avoid timeouts)
    const batchSize = 10;
    for (let i = 0; i < venueIds.length; i += batchSize) {
      const batch = venueIds.slice(i, i + batchSize);
      
      await Promise.allSettled(
        batch.map(async (id) => {
          try {
            await computeVenueScore(id);
            processed++;
          } catch (error) {
            console.error(`Failed to compute score for venue ${id}:`, error);
            errors++;
          }
        })
      );
    }

    // Log completion
    await log('admin_score_recompute_complete', {
      venueCount: venueIds.length,
      processed,
      errors,
      specificVenue: venueId || null
    });

    return NextResponse.json({ 
      ok: true, 
      message: `Score recomputation complete`,
      details: {
        totalVenues: venueIds.length,
        processed,
        errors
      }
    });

  } catch (error) {
    console.error('Failed to recompute venue scores:', error);
    
    // Log the error
    await log('admin_score_recompute_error', {
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}