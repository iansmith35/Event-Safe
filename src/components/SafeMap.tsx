'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getFlags } from '@/lib/flags';
import { Card, CardContent } from '@/components/ui/card';
import { Map, MapPin } from 'lucide-react';

// Dynamically import the map component to prevent SSR issues
const UkHeatmap = dynamic(() => import('@/components/UkHeatmap'), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] w-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
      <div className="text-center text-slate-400">
        <Map className="w-8 h-8 mx-auto mb-2 animate-pulse" />
        <p className="text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

interface SafeMapProps {
  className?: string;
}

export default function SafeMap({ className }: SafeMapProps) {
  const [mapEnabled, setMapEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFlags = async () => {
      try {
        const flags = await getFlags();
        setMapEnabled(flags.homepageMap);
      } catch (error) {
        console.error('Failed to load map flags:', error);
        setMapEnabled(false);
      } finally {
        setLoading(false);
      }
    };

    checkFlags();
  }, []);

  if (loading) {
    return (
      <div className={className}>
        <div className="h-[360px] w-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <Map className="w-8 h-8 mx-auto mb-2 animate-pulse" />
            <p className="text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!mapEnabled) {
    return (
      <div className={className}>
        <Card className="h-[360px] w-full rounded-xl overflow-hidden bg-slate-900 border-slate-700">
          <CardContent className="h-full flex items-center justify-center p-8">
            <div className="text-center text-slate-400 max-w-md">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-slate-500" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">Map Coming Soon</h3>
              <p className="text-sm text-slate-500">
                The interactive map will appear here when enabled. 
                We're preparing something amazing for you!
              </p>
              <div className="mt-4 text-xs text-slate-600">
                Map will appear here when enabled
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Only load Google Maps API when map is enabled
  return (
    <div className={className}>
      <UkHeatmap />
    </div>
  );
}