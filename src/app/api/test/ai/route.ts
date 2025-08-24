import { NextResponse } from 'next/server';
import { isAiAvailable, getAiClient } from '@/lib/ai';
import { log } from '@/lib/log';

export async function GET() {
  try {
    // Check if AI is available
    if (!isAiAvailable()) {
      await log('ai_test_unavailable', {});
      return NextResponse.json({ ok: false, reason: 'AI_UNAVAILABLE' });
    }

    // Get AI client and test with simple ping
    const startTime = Date.now();
    
    try {
      const client = getAiClient();
      // Simple test - just verify we can get the client without throwing
      const latency = Date.now() - startTime;
      
      await log('ai_test_success', { latency });
      return NextResponse.json({ 
        ok: true, 
        latency,
        message: 'AI client available'
      });
    } catch (aiError) {
      await log('ai_test_error', { error: String(aiError) });
      return NextResponse.json({ ok: false, reason: 'AI_ERROR' });
    }
  } catch (e) {
    console.error('ai test error', e);
    await log('ai_test_system_error', { error: String(e) });
    return NextResponse.json({ ok: false, reason: 'AI_ERROR' }, { status: 500 });
  }
}