// Google Maps loader utility with robust error handling and fallback
export async function loadGoogleMaps(): Promise<typeof google | null> {
  // Return existing instance if already loaded
  if (typeof window !== 'undefined' && window.google?.maps) {
    return window.google;
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured');
    return null;
  }

  // Check if script is already loading
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
  if (existingScript) {
    // Wait for existing script to load
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkInterval);
          resolve(window.google);
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(null);
      }, 10000);
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization`;
    script.async = true;
    script.defer = true;
    
    const timeout = setTimeout(() => {
      console.error('Google Maps API loading timeout');
      resolve(null);
    }, 10000);
    
    script.onload = () => {
      clearTimeout(timeout);
      if (window.google?.maps) {
        resolve(window.google);
      } else {
        console.error('Google Maps API loaded but window.google.maps is not available');
        resolve(null);
      }
    };
    
    script.onerror = (error) => {
      clearTimeout(timeout);
      console.error('Failed to load Google Maps API:', error);
      resolve(null);
    };
    
    document.head.appendChild(script);
  });
}

// TypeScript declarations for Google Maps types
declare global {
  interface Window {
    google: typeof google;
  }
}