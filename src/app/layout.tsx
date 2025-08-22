import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { getSeasonalTheme } from '@/ai/flows/get-seasonal-theme';
import SeasonalEffectsWrapper from '@/components/seasonal-effects-wrapper';

export const metadata: Metadata = {
  title: 'Event Traffic',
  description: 'Live-event safety system for venues and guests.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = await getSeasonalTheme();
  
  return (
    <html lang="en" suppressHydrationWarning className={theme}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SeasonalEffectsWrapper theme={theme} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
