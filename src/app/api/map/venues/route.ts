import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { log } from '@/lib/log';

export async function GET() {
  try {
    // Fetch all venues from Firestore
    const venuesSnapshot = await getDocs(collection(db, 'venues'));
    
    const venues = venuesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        lat: data.lat,
        lng: data.lng,
        status: data.status, // 'eventsafe' | 'prospect'
        interestCount: data.interestCount || 0
      };
    });

    await log('map_venues_fetched', { count: venues.length });

    // Set caching headers as specified
    const response = NextResponse.json({
      ok: true,
      venues
    });

    // Cache for 5 minutes with stale-while-revalidate for 10 minutes
    response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    
    return response;

  } catch (error) {
    console.error('Failed to fetch venues:', error);
    await log('map_venues_error', { error: String(error) });
    
    return NextResponse.json({
      ok: false,
      error: 'Failed to fetch venues',
      venues: []
    }, { status: 500 });
  }
}