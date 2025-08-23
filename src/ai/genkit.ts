import { config } from 'dotenv';
// Load environment variables immediately to ensure the API key is available during Next.js build (prerendering)
config();

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Get API key from environment variables with fallback
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || 'placeholder-key-for-build';

export const ai = genkit({
  plugins: [
// Only initialize GoogleAI if a key exists
...(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY ? [
  googleAI({
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
  })
] : []),

  ],
  // Fallback model when no API key is available
  model: (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) 
    ? 'googleai/gemini-2.0-flash' 
    : undefined,
});