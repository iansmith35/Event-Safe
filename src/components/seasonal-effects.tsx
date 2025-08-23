"use client";

import { Fireworks } from 'fireworks-js';
import { useRef, useEffect, useState } from 'react';
import { getSeasonalTheme } from '@/ai/flows/get-seasonal-theme';

export default function SeasonalEffects({ theme: initialTheme }: { theme: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  // Fetch the actual seasonal theme on client side
  useEffect(() => {
    async function fetchTheme() {
      try {
        const { theme } = await getSeasonalTheme();
        setCurrentTheme(theme);
      } catch (error) {
        console.log('Using default theme due to error:', error);
        // Keep using the default theme if AI call fails
      }
    }
    
    if (initialTheme === 'default') {
      fetchTheme();
    }
  }, [initialTheme]);

  useEffect(() => {
    if (currentTheme === 'new-year' && containerRef.current) {
      const fireworks = new Fireworks(containerRef.current, {
        rocketsPoint: {
          min: 0,
          max: 100
        },
        opacity: 0.5,
      });
      fireworks.start();
      return () => fireworks.stop();
    }
  }, [currentTheme]);

  if (currentTheme !== 'new-year') {
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        position: 'fixed',
        zIndex: -1,
      }}
    />
  );
}
