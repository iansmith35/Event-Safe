import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { log } from '@/lib/log';

// UK Demo venues with real coordinates
const demoVenues = [
  { name: 'Bristol Events Hub', lat: 51.4545, lng: -2.5879, active: true, city: 'Bristol' },
  { name: 'London Central Venue', lat: 51.5074, lng: -0.1278, active: true, city: 'London' },
  { name: 'Manchester Arena District', lat: 53.4808, lng: -2.2426, active: true, city: 'Manchester' },
  { name: 'Leeds Cultural Quarter', lat: 53.8008, lng: -1.5491, active: true, city: 'Leeds' },
  { name: 'Birmingham City Center', lat: 52.4862, lng: -1.8904, active: true, city: 'Birmingham' },
  { name: 'Cardiff Bay Events', lat: 51.4816, lng: -3.1791, active: true, city: 'Cardiff' },
  { name: 'Newcastle Riverside', lat: 54.9783, lng: -1.6178, active: true, city: 'Newcastle' },
  { name: 'Brighton Seafront', lat: 50.8225, lng: -0.1372, active: true, city: 'Brighton' }
];

// Demo events linked to venues
const demoEvents = [
  { title: 'Tech Meetup Bristol', venueIndex: 0, status: 'upcoming', date: '2024-12-20T19:00:00Z' },
  { title: 'London Startup Night', venueIndex: 1, status: 'upcoming', date: '2024-12-22T18:30:00Z' },
  { title: 'Manchester Music Festival', venueIndex: 2, status: 'upcoming', date: '2024-12-25T20:00:00Z' },
  { title: 'Leeds Art Exhibition', venueIndex: 3, status: 'upcoming', date: '2024-12-27T16:00:00Z' },
  { title: 'Birmingham Food Fair', venueIndex: 4, status: 'upcoming', date: '2024-12-30T12:00:00Z' },
  { title: 'Cardiff New Year Gala', venueIndex: 5, status: 'upcoming', date: '2024-12-31T21:00:00Z' },
  { title: 'Newcastle Comedy Night', venueIndex: 6, status: 'upcoming', date: '2025-01-03T19:30:00Z' },
  { title: 'Brighton Beach Party', venueIndex: 7, status: 'upcoming', date: '2025-01-05T15:00:00Z' },
  { title: 'London Fashion Week', venueIndex: 1, status: 'upcoming', date: '2025-01-10T14:00:00Z' },
  { title: 'Manchester Tech Conference', venueIndex: 2, status: 'upcoming', date: '2025-01-15T09:00:00Z' },
  { title: 'Bristol Wine Tasting', venueIndex: 0, status: 'upcoming', date: '2025-01-18T18:00:00Z' },
  { title: 'Birmingham Business Expo', venueIndex: 4, status: 'upcoming', date: '2025-01-22T10:00:00Z' }
];

export async function POST() {
  try {
    await log('admin_seed_demo_start', {});

    // Clear existing demo data (optional - comment out if you want to keep existing data)
    // This is a simplified approach - in production you might want more sophisticated cleanup

    // Add venues
    const venueIds: string[] = [];
    for (const venue of demoVenues) {
      const docRef = await addDoc(collection(db, 'venues'), {
        ...venue,
        createdAt: serverTimestamp(),
        isDemo: true
      });
      venueIds.push(docRef.id);
    }

    // Add events linked to venues
    for (const event of demoEvents) {
      const venue = demoVenues[event.venueIndex];
      await addDoc(collection(db, 'events'), {
        title: event.title,
        status: event.status,
        date: event.date,
        lat: venue.lat + (Math.random() - 0.5) * 0.01, // Small random offset for visual variety
        lng: venue.lng + (Math.random() - 0.5) * 0.01,
        venueId: venueIds[event.venueIndex],
        venueName: venue.name,
        city: venue.city,
        createdAt: serverTimestamp(),
        isDemo: true
      });
    }

    await log('admin_seed_demo_complete', { 
      venuesAdded: demoVenues.length, 
      eventsAdded: demoEvents.length 
    });

    return NextResponse.json({ 
      ok: true, 
      message: `Successfully seeded ${demoVenues.length} venues and ${demoEvents.length} events`,
      venuesAdded: demoVenues.length,
      eventsAdded: demoEvents.length
    });

  } catch (error) {
    console.error('Demo seed error:', error);
    await log('admin_seed_demo_error', { error: String(error) });
    
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to seed demo data',
      detail: String(error)
    }, { status: 500 });
  }
}