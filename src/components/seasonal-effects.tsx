"use client";

import { Fireworks } from 'fireworks-js';
import { useRef, useEffect } from 'react';

export default function SeasonalEffects({ theme }: { theme: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (theme === 'new-year' && containerRef.current) {
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
  }, [theme]);

  if (theme !== 'new-year') {
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
