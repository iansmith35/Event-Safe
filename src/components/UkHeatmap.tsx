'use client';

import { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '@/lib/maps';

interface HeatmapProps {
  className?: string;
}

// Demo UK locations for the heatmap with glowing effect
const demoUkLocations = [
  { lat: 51.4545, lng: -2.5879, title: 'Bristol' },
  { lat: 51.5074, lng: -0.1278, title: 'London' },
  { lat: 53.4808, lng: -2.2426, title: 'Manchester' },
  { lat: 55.8642, lng: -4.2518, title: 'Glasgow' },
  { lat: 53.8008, lng: -1.5491, title: 'Leeds' },
  { lat: 51.4816, lng: -3.1791, title: 'Cardiff' },
  { lat: 54.5973, lng: -5.9301, title: 'Belfast' },
];

export default function UkHeatmap({ className = "h-[360px] w-full rounded-xl overflow-hidden bg-slate-900" }: HeatmapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load and initialize the map
  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      if (!mapRef.current) return;

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

        // Create initial heatmap data points
        const initialHeatmapData = demoUkLocations.map((location, index) => ({
          location: new google.maps.LatLng(location.lat, location.lng),
          weight: 0.5 + (index * 0.1) // Vary initial weights
        }));

        // Create heatmap layer
        const heatmap = new google.maps.visualization.HeatmapLayer({
          data: initialHeatmapData,
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

        // Animate by periodically shuffling weights for subtle glow effect
        const animateHeatmap = () => {
          if (!mounted || !heatmapRef.current) return;

          const time = Date.now() * 0.001;
          const animatedData = demoUkLocations.map((location, index) => ({
            location: new google.maps.LatLng(location.lat, location.lng),
            weight: 0.5 + Math.sin(time + index) * 0.3 + Math.cos(time * 0.5 + index * 0.5) * 0.2
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
    };
  }, []);

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
            <div className="animate-pulse text-slate-300 mb-2">Loading UK heatmap...</div>
            <div className="text-xs text-slate-500">Preparing interactive map with glowing points</div>
          </div>
        </div>
      )}
    </div>
  );
}