/**
 * AI utility functions with graceful fallbacks for missing API keys
 */

export class AIUnavailableError extends Error {
  constructor(message = 'AI functionality is temporarily unavailable') {
    super(message);
    this.name = 'AIUnavailableError';
  }
}

/**
 * Get AI client configuration
 * @throws {AIUnavailableError} When no API keys are available
 */
export function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new AIUnavailableError('AI functionality requires an API key');
  }
  
  return {
    apiKey,
    isAvailable: true
  };
}

/**
 * Check if AI functionality is available
 */
export function isAiAvailable(): boolean {
  return !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
}