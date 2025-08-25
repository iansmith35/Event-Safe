import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  doc, 
  collection, 
  runTransaction,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { log } from '@/lib/log';
import { sendInterestNotification } from '@/lib/notifications';
import { createHash } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { venueId } = body;

    if (!venueId || typeof venueId !== 'string') {
      return NextResponse.json({
        ok: false,
        error: 'Invalid venueId'
      }, { status: 400 });
    }

    // Get client IP for light deduplication
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0] : 'unknown';
    const ipHash = createHash('sha256').update(clientIp).digest('hex');

    // Use transaction to ensure consistency
    const result = await runTransaction(db, async (transaction) => {
      const venueRef = doc(db, 'venues', venueId);
      const venueDoc = await transaction.get(venueRef);
      
      if (!venueDoc.exists()) {
        throw new Error('Venue not found');
      }
      
      const venueData = venueDoc.data();
      const currentCount = venueData.interestCount || 0;
      const newCount = currentCount + 1;
      
      // Add interest record
      const interestRef = doc(collection(db, 'venue_interest'));
      transaction.set(interestRef, {
        venueId,
        city: venueData.name,
        createdAt: serverTimestamp(),
        ipHash
      });
      
      // Increment venue interest count
      transaction.update(venueRef, {
        interestCount: increment(1)
      });
      
      // Check if we've crossed notification thresholds
      const thresholds = [10, 25, 50];
      const previousLevel = venueData.lastNotifiedLevel || 0;
      const crossedThreshold = thresholds.find(threshold => 
        currentCount < threshold && newCount >= threshold && threshold > previousLevel
      );
      
      if (crossedThreshold && venueData.ownerEmail) {
        // Update last notified level
        transaction.update(venueRef, {
          lastNotifiedLevel: crossedThreshold
        });
        
        // Log the threshold crossing event
        await log('venue_interest_threshold_crossed', {
          venueId,
          venueName: venueData.name,
          threshold: crossedThreshold,
          newCount,
          ownerEmail: venueData.ownerEmail
        });
        
        // Queue email notification (async, don't block the response)
        setImmediate(async () => {
          try {
            await sendInterestNotification({
              venueId,
              venueName: venueData.name,
              ownerEmail: venueData.ownerEmail,
              interestCount: newCount,
              threshold: crossedThreshold
            });
          } catch (error) {
            console.error('Failed to send notification:', error);
          }
        });
      }
      
      return { newCount, crossedThreshold };
    });

    await log('venue_interest_registered', { 
      venueId, 
      newCount: result.newCount,
      ipHash: ipHash.substring(0, 8) // Log partial hash for debugging
    });

    return NextResponse.json({
      ok: true,
      newCount: result.newCount,
      message: 'Interest registered successfully'
    });

  } catch (error) {
    console.error('Failed to register interest:', error);
    await log('venue_interest_error', { error: String(error) });
    
    return NextResponse.json({
      ok: false,
      error: 'Failed to register interest'
    }, { status: 500 });
  }
}