
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // We removed the ignoreBuildErrors fields as planned.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  
  // New Webpack configuration for Genkit/OpenTelemetry compatibility
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...config.externals,
        '@opentelemetry/instrumentation',
        '@opentelemetry/winston-transport',
        '@genkit-ai/core',
        'genkit',
        'handlebars',
        'dotprompt',
      ];
    }
    return config;
  },
};

export default nextConfig;
