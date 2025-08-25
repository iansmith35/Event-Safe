import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { log } from '@/lib/log';

// UK Cities data to seed
const UK_CITIES = [
  { id: 'london', name: 'London', lat: 51.5074, lng: -0.1278 },
  { id: 'manchester', name: 'Manchester', lat: 53.4808, lng: -2.2426 },
  { id: 'birmingham', name: 'Birmingham', lat: 52.4862, lng: -1.8904 },
  { id: 'leeds', name: 'Leeds', lat: 53.8008, lng: -1.5491 },
  { id: 'liverpool', name: 'Liverpool', lat: 53.4084, lng: -2.9916 },
  { id: 'glasgow', name: 'Glasgow', lat: 55.8642, lng: -4.2518 },
  { id: 'edinburgh', name: 'Edinburgh', lat: 55.9533, lng: -3.1883 },
  { id: 'bristol', name: 'Bristol', lat: 51.4545, lng: -2.5879 },
  { id: 'cardiff', name: 'Cardiff', lat: 51.4816, lng: -3.1791 },
  { id: 'belfast', name: 'Belfast', lat: 54.5973, lng: -5.9301 },
  { id: 'newcastle', name: 'Newcastle', lat: 54.9783, lng: -1.6178 },
  { id: 'nottingham', name: 'Nottingham', lat: 52.9548, lng: -1.1581 },
  { id: 'sheffield', name: 'Sheffield', lat: 53.3811, lng: -1.4701 }
];

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication using existing pattern from seed-config
    const cookieCode = request.cookies.get('admin_session')?.value;
    
    if (cookieCode !== '1') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    await log('admin_seed_cities_start', {});

    // Seed UK cities as prospects
    const seededCities = [];
    
    for (const city of UK_CITIES) {
      const venueRef = doc(db, 'venues', city.id);
      await setDoc(venueRef, {
        name: city.name,
        lat: city.lat,
        lng: city.lng,
        status: 'prospect',
        interestCount: 0,
        lastNotifiedLevel: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        seededBy: 'admin'
      });
      
      seededCities.push(city);
    }

    await log('admin_seed_cities_complete', {
      seededCount: seededCities.length,
      cities: seededCities.map(c => c.name)
    });

    return NextResponse.json({
      ok: true,
      message: 'UK cities seeded successfully',
      seededCount: seededCities.length,
      cities: seededCities
    });

  } catch (error) {
    console.error('Cities seed error:', error);
    await log('admin_seed_cities_error', { error: String(error) });
    
    return NextResponse.json({
      ok: false,
      error: 'Failed to seed cities',
      detail: String(error)
    }, { status: 500 });
  }
}