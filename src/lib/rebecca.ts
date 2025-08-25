/**
 * Rebecca AI endpoint wiring with feature flag support
 */

import { getFlags } from '@/lib/flags';

const ENDPOINT = "https://us-central1-rebbeca-bot.cloudfunctions.net/executeRebeccaCommand";

export interface RebeccaResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Call Rebecca AI with feature flag protection
 */
export async function callRebecca(input: string): Promise<RebeccaResponse> {
  try {
    // Check if AI is enabled
    const flags = await getFlags();
    if (!flags.aiRebecca) {
      throw new Error('AI disabled');
    }

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Rebecca API call failed:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if Rebecca AI is available
 */
export async function isRebeccaAvailable(): Promise<boolean> {
  const flags = await getFlags();
  return flags.aiRebecca;
}