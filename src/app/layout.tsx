import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { getSeasonalTheme } from '@/ai/flows/get-seasonal-theme';
import { Fireworks } from 'fireworks-js/dist/react';

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
        {theme === 'new-year' && (
          <Fireworks
            options={{
                rocketsPoint: {
                    min: 0,
                    max: 100
                },
                opacity: 0.5,
            }}
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              position: 'fixed',
              zIndex: -1,
            }}
          />
        )}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
