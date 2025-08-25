'use client';

import { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '@/lib/maps';

interface HeatmapProps {
  className?: string;
}

interface Venue {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'eventsafe' | 'prospect';
  interestCount: number;
}

export default function UkHeatmap({ className = "h-[360px] w-full rounded-xl overflow-hidden bg-slate-900" }: HeatmapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch venues data from API
  const fetchVenues = async () => {
    try {
      const response = await fetch('/api/map/venues');
      const data = await response.json();
      if (data.ok && data.venues) {
        setVenues(data.venues);
      } else {
        console.warn('Failed to fetch venues:', data.error);
        setError('Failed to load venue data');
      }
    } catch (err) {
      console.error('Error fetching venues:', err);
      setError('Failed to load venue data');
    }
  };

  // Register interest for a venue
  const registerInterest = async (venueId: string) => {
    if (isRegistering) return;
    
    setIsRegistering(true);
    try {
      const response = await fetch('/api/map/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venueId })
      });
      
      const data = await response.json();
      if (data.ok) {
        // Update venue count locally
        setVenues(prevVenues => 
          prevVenues.map(v => 
            v.id === venueId 
              ? { ...v, interestCount: data.newCount }
              : v
          )
        );
        
        // Update selected venue if it's the same one
        setVenues(prevVenues => 
          prevVenues.map(v => 
            v.id === venueId 
              ? { ...v, interestCount: data.newCount }
              : v
          )
        );
        
        // Show success message (simple alert for now)
        alert("Thanks! We've noted your interest.");
      } else {
        alert('Failed to register interest. Please try again.');
      }
    } catch (err) {
      console.error('Error registering interest:', err);
      alert('Failed to register interest. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  // Load and initialize the map
  useEffect(() => {
    fetchVenues();
  }, []);
  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      if (!mapRef.current || venues.length === 0) return;

      try {
        const google = await loadGoogleMaps();
        
        if (!google || !google.maps?.visualization?.HeatmapLayer) {
          if (mounted) {
            setError('Map temporarily unavailable');
            console.warn('Google Maps or visualization library not available');
          }
          return;
        }

        // Create map with dark theme and disabled UI
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 53.8, lng: -1.5 }, // UK center
          zoom: 5,
          disableDefaultUI: true,
          styles: [
            {
              "featureType": "all",
              "elementType": "geometry.fill",
              "stylers": [{ "color": "#0f172a" }]
            },
            {
              "featureType": "water",
              "elementType": "geometry.fill",
              "stylers": [{ "color": "#1e293b" }]
            },
            {
              "featureType": "landscape",
              "elementType": "geometry.fill",
              "stylers": [{ "color": "#0f172a" }]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry.stroke",
              "stylers": [{ "color": "#334155" }, { "weight": 0.5 }]
            },
            {
              "featureType": "administrative.country",
              "elementType": "geometry.stroke",
              "stylers": [{ "color": "#475569" }, { "weight": 1 }]
            },
            {
              "featureType": "all",
              "elementType": "labels",
              "stylers": [{ "visibility": "off" }]
            }
          ]
        });

        // Create heatmap data from venues
        const heatmapData = venues.map(venue => ({
          location: new google.maps.LatLng(venue.lat, venue.lng),
          weight: venue.status === 'eventsafe' ? 2 : 1 // EventSafe glows more
        }));

        // Create heatmap layer
        const heatmap = new google.maps.visualization.HeatmapLayer({
          data: heatmapData,
          map: map
        });

        // Configure heatmap appearance for glowing effect
        heatmap.set('radius', 25);
        heatmap.set('dissipating', true);
        heatmap.set('gradient', [
          'rgba(59, 130, 246, 0)',    // transparent blue
          'rgba(59, 130, 246, 0.6)',  // blue
          'rgba(147, 51, 234, 0.8)',  // purple
          'rgba(236, 72, 153, 1)',    // pink
          'rgba(248, 113, 113, 1)'    // red
        ]);

        heatmapRef.current = heatmap;

        // Create InfoWindow
        const infoWindow = new google.maps.InfoWindow({
          disableAutoPan: false,
          maxWidth: 300
        });
        infoWindowRef.current = infoWindow;

        // Create clickable markers for each venue
        const markers: google.maps.Marker[] = [];
        venues.forEach(venue => {
          const marker = new google.maps.Marker({
            position: { lat: venue.lat, lng: venue.lng },
            map: map,
            title: venue.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: 'transparent',
              fillOpacity: 0,
              strokeColor: 'transparent',
              strokeWeight: 0
            }
          });

          marker.addListener('click', () => {
            const content = `
              <div class="p-4 min-w-[250px]">
                <h3 class="font-semibold text-lg mb-2">${venue.name}</h3>
                <div class="mb-3">
                  <p class="text-sm ${venue.status === 'eventsafe' ? 'text-green-600' : 'text-amber-600'}">
                    ${venue.status === 'eventsafe' ? 'EventSafe verified ✅' : 'Not yet on EventSafe'}
                  </p>
                  <p class="text-sm text-gray-600 mt-1">
                    Interested guests: ${venue.interestCount}
                  </p>
                </div>
                ${venue.status === 'prospect' ? `
                  <button 
                    onclick="window.registerInterest('${venue.id}')" 
                    class="w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors ${isRegistering ? 'opacity-50 cursor-not-allowed' : ''}"
                    ${isRegistering ? 'disabled' : ''}
                  >
                    ${isRegistering ? 'Registering...' : 'Register interest here'}
                  </button>
                ` : `
                  <button class="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Learn more / View events
                  </button>
                `}
              </div>
            `;
            
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
          });

          markers.push(marker);
        });
        
        markersRef.current = markers;

        // Make registerInterest available globally for the InfoWindow
        (window as Record<string, unknown>).registerInterest = registerInterest;

        // Animate by periodically shuffling weights for subtle glow effect
        const animateHeatmap = () => {
          if (!mounted || !heatmapRef.current) return;

          const time = Date.now() * 0.001;
          const animatedData = venues.map((venue, index) => ({
            location: new google.maps.LatLng(venue.lat, venue.lng),
            weight: (venue.status === 'eventsafe' ? 2 : 1) + 
                   Math.sin(time + index) * 0.3 + 
                   Math.cos(time * 0.5 + index * 0.5) * 0.2
          }));

          heatmapRef.current!.setData(animatedData);
        };

        // Start animation with 2-second interval
        intervalRef.current = setInterval(animateHeatmap, 2000);

        if (mounted) {
          setIsLoaded(true);
          setError(null);
        }

      } catch (err) {
        console.error('Failed to initialize UK heatmap:', err);
        if (mounted) {
          setError('Map temporarily unavailable');
        }
      }
    };

    initializeMap();

    return () => {
      mounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker.setMap(null));
      }
      // Clean up global function
      if (typeof window !== 'undefined') {
        delete (window as Record<string, unknown>).registerInterest;
      }
    };
  }, [venues, isRegistering, registerInterest]);

  // Fallback component when map is unavailable
  if (error) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6">
            <h4 className="font-semibold text-slate-200 mb-2">Map temporarily unavailable</h4>
            <p className="text-sm text-slate-400">
              {error}
            </p>
            {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
              <p className="text-xs text-slate-500 mt-2">
                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not configured
              </p>
            )}
            {venues.length === 0 && error.includes('venue') && (
              <p className="text-xs text-slate-500 mt-2">
                Unable to load venue data from server
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <div className="text-center p-4">
            <div className="animate-pulse text-slate-300 mb-2">
              {venues.length === 0 ? 'Loading venues...' : 'Loading UK heatmap...'}
            </div>
            <div className="text-xs text-slate-500">
              {venues.length === 0 
                ? 'Fetching venue data from server' 
                : 'Preparing interactive map with glowing points'
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}