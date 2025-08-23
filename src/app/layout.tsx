
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import SeasonalEffects from '@/components/seasonal-effects';

export const metadata: Metadata = {
  title: 'Event Traffic',
  description: 'Live-event safety system for venues and guests.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use default theme during build time, seasonal effects will update on client side
  const theme = 'default';
  
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
        <SeasonalEffects theme={theme} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
