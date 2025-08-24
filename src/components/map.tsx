"use client";

import { useEffect, useRef, useState } from 'react';

interface MapProps {
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; title?: string }>;
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

export default function Map({ 
  className = "w-full h-96", 
  center = { lat: 54.5, lng: -2 }, // UK center
  zoom = 6,
  markers = []
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setError('Google Maps API key not configured');
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
    script.onerror = () => setError('Failed to load Google Maps');
    
    document.head.appendChild(script);

    return () => {
      // Clean up script if component unmounts
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || typeof window === 'undefined' || !window.google) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            "featureType": "all",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#1a1a2e"}]
          },
          {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#16213e"}]
          },
          {
            "featureType": "landscape",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#0f172a"}]
          }
        ]
      });

      setIsLoaded(true);

      // Add markers with glow effect
      markers.forEach(marker => {
        const mapMarker = new window.google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map,
          title: marker.title,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#3b82f6',
            fillOpacity: 0.8,
            strokeColor: '#60a5fa',
            strokeWeight: 2
          }
        });

        // Add glow effect with multiple circles
        new window.google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 16,
            fillColor: '#3b82f6',
            fillOpacity: 0.3,
            strokeWeight: 0
          }
        });
      });

    } catch (err) {
      setError('Failed to initialize map');
      console.error('Map initialization error:', err);
    }
  };

  if (error) {
    return (
      <div className={`${className} bg-muted rounded-lg border flex items-center justify-center`}>
        <div className="p-4 text-center">
          <h4 className="font-semibold text-foreground">Map unavailable</h4>
          <p className="text-sm text-muted-foreground">Missing Google Maps API key</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} bg-muted rounded-lg border overflow-hidden relative`}>
      <div ref={mapRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="p-4 text-center">
            <h4 className="font-semibold">Loading map...</h4>
          </div>
        </div>
      )}
    </div>
  );
}