import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    // Only initialize GoogleAI plugin if API key is available
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