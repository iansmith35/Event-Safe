'use client';

import { useEffect, useRef, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface HeatmapProps {
  className?: string;
}

interface Event {
  id: string;
  lat: number;
  lng: number;
  status: 'upcoming' | 'past';
  title?: string;
  date?: string;
}

interface Venue {
  id: string;
  lat: number;
  lng: number;
  active: boolean;
  name?: string;
}

declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        LatLng: any;
        Marker: any;
        Size: any;
        visualization?: {
          HeatmapLayer: any;
        };
      };
    };
  }
}

export default function UkHeatmap({ className = "h-[420px] md:h-[520px] rounded-2xl overflow-hidden" }: HeatmapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);

  // Load events and venues from Firestore
  useEffect(() => {
    const eventsQuery = query(
      collection(db, 'events'),
      where('status', '==', 'upcoming')
    );
    
    const venuesQuery = query(
      collection(db, 'venues'),
      where('active', '==', true)
    );

    const unsubEvents = onSnapshot(eventsQuery, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Event));
      setEvents(eventsData);
    });

    const unsubVenues = onSnapshot(venuesQuery, (snapshot) => {
      const venuesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Venue));
      setVenues(venuesData);
    });

    return () => {
      unsubEvents();
      unsubVenues();
    };
  }, []);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setError('Google Maps API key not configured. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to environment variables.');
      return;
    }

    // Check if Google Maps is already loaded
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    script.onerror = () => {
      if (apiKey) {
        setError('Failed to load Google Maps. Check your API key restrictions and ensure billing is enabled.');
      }
    };
    
    document.head.appendChild(script);

    return () => {
      // Clean up script if component unmounts
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Re-initialize map when data changes
  useEffect(() => {
    if (isLoaded) {
      initializeMap();
    }
  }, [events, venues, isLoaded]);

  const initializeMap = () => {
    if (!mapRef.current || typeof window === 'undefined' || !window.google) return;

    try {
      // UK center coordinates
      const ukCenter = { lat: 54.5, lng: -2 };
      
      const map = new window.google.maps.Map(mapRef.current, {
        center: ukCenter,
        zoom: 6,
        styles: [
          {
            "featureType": "all",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#1a1a2e"}]
          },
          {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#0c4a6e"}]
          },
          {
            "featureType": "landscape",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#27272a"}]
          },
          {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#52525b"}]
          },
          {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#a1a1aa"}]
          }
        ]
      });

      // Create heatmap data points
      const heatmapData: Array<{ location: any; weight: number }> = [];
      
      // Add events (higher weight for upcoming events)
      events.forEach(event => {
        if (event.lat && event.lng) {
          heatmapData.push({
            location: new window.google.maps.LatLng(event.lat, event.lng),
            weight: 3 // Higher weight for events
          });
        }
      });

      // Add venues (lower weight)
      venues.forEach(venue => {
        if (venue.lat && venue.lng) {
          heatmapData.push({
            location: new window.google.maps.LatLng(venue.lat, venue.lng),
            weight: 1
          });
        }
      });

      // Create heatmap layer if we have data
      if (heatmapData.length > 0 && window.google.maps.visualization) {
        const heatmap = new window.google.maps.visualization.HeatmapLayer({
          data: heatmapData,
          map: map,
        });

        // Configure heatmap appearance
        heatmap.setOptions({
          radius: 50,
          opacity: 0.8,
          gradient: [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
          ]
        });
      } else {
        // Fallback to markers if no heatmap visualization available
        [...events, ...venues].forEach((item, index) => {
          if (item.lat && item.lng) {
            new window.google.maps.Marker({
              position: { lat: item.lat, lng: item.lng },
              map: map,
              title: 'title' in item ? item.title : ('name' in item ? item.name : `Location ${index + 1}`),
              icon: {
                url: 'events' in item ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMTAiIGZpbGw9IiMxMDk0M2UiLz4KPC9zdmc+' : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMTAiIGZpbGw9IiNlZjQ0NDQiLz4KPC9zdmc+',
                scaledSize: new window.google.maps.Size(20, 20)
              }
            });
          }
        });
      }

      setIsLoaded(true);
    } catch (error) {
      setError(`Map initialization failed: ${error}`);
    }
  };

  if (error) {
    return (
      <div className={`${className} bg-muted rounded-2xl border flex items-center justify-center`}>
        <div className="p-6 text-center max-w-md">
          <h4 className="font-semibold text-destructive mb-2">Map Unavailable</h4>
          <p className="text-sm text-muted-foreground">{error}</p>
          {error.includes('API key') && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                💡 <strong>Hint:</strong> Add your domain to HTTP referrer restrictions and enable billing in Google Cloud Console.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} bg-muted rounded-2xl border overflow-hidden relative`}>
      <div ref={mapRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="p-4 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <h4 className="font-semibold">Loading UK heatmap...</h4>
            <p className="text-sm text-muted-foreground">
              Events: {events.length} | Venues: {venues.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}