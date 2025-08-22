"use client";

import dynamic from 'next/dynamic';

const SeasonalEffects = dynamic(() => import('@/components/seasonal-effects'), {
  ssr: false,
});

export default function SeasonalEffectsWrapper({ theme }: { theme: string }) {
  return <SeasonalEffects theme={theme} />;
}
