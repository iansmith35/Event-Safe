/**
 * AI utility functions with graceful fallbacks and enhanced error handling
 */

import { log } from './log';

export class AIUnavailableError extends Error {
  constructor(message = 'AI functionality is temporarily unavailable') {
    super(message);
    this.name = 'AIUnavailableError';
  }
}

export type AIErrorCode = 'AI_UNAVAILABLE' | 'QUOTA' | 'KEY_RESTRICTED' | 'HTTP_400' | 'HTTP_401' | 'HTTP_403' | 'HTTP_429' | 'HTTP_500' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR';

export interface AIResult<T> {
  ok: boolean;
  data?: T;
  code?: AIErrorCode;
  detail?: string;
}

/**
 * Wrap AI calls with enhanced error handling and logging
 */
export async function withAIErrorHandling<T>(
  operation: () => Promise<T>
): Promise<AIResult<T>> {
  try {
    if (!isAiAvailable()) {
      await log('ai_error', { code: 'AI_UNAVAILABLE', detail: 'No API key configured' });
      return { ok: false, code: 'AI_UNAVAILABLE', detail: 'AI functionality requires an API key' };
    }

    const data = await operation();
    return { ok: true, data };
  } catch (error) {
    const result = await handleAIError(error);
    await log('ai_error', { code: result.code, detail: result.detail });
    return result;
  }
}

/**
 * Handle and categorize AI errors
 */
async function handleAIError(error: unknown): Promise<AIResult<never>> {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Check for specific error patterns
    if (message.includes('quota') || message.includes('limit')) {
      return { ok: false, code: 'QUOTA', detail: 'API quota exceeded or rate limited' };
    }
    
    if (message.includes('unauthorized') || message.includes('401')) {
      return { ok: false, code: 'HTTP_401', detail: 'API key unauthorized' };
    }
    
    if (message.includes('forbidden') || message.includes('403')) {
      return { ok: false, code: 'HTTP_403', detail: 'API key forbidden or restricted' };
    }
    
    if (message.includes('referernotallowed') || message.includes('referrer')) {
      return { ok: false, code: 'KEY_RESTRICTED', detail: 'API key restricted by referrer settings' };
    }
    
    if (message.includes('429')) {
      return { ok: false, code: 'HTTP_429', detail: 'Rate limited - too many requests' };
    }
    
    if (message.includes('500') || message.includes('internal server')) {
      return { ok: false, code: 'HTTP_500', detail: 'API server error' };
    }
    
    if (message.includes('400') || message.includes('bad request')) {
      return { ok: false, code: 'HTTP_400', detail: 'Invalid request format' };
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return { ok: false, code: 'NETWORK_ERROR', detail: 'Network connectivity issue' };
    }
    
    return { ok: false, code: 'UNKNOWN_ERROR', detail: error.message };
  }
  
  return { ok: false, code: 'UNKNOWN_ERROR', detail: 'Unknown error occurred' };
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