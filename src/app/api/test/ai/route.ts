import { NextResponse } from 'next/server';
import { isAiAvailable, getAiClient } from '@/lib/ai';
import { assertFeature } from '@/lib/featureGate';
import { checkAIUsageLimit, incrementAIUsage } from '@/lib/aiLimits';
import { log } from '@/lib/log';

export async function GET() {
  try {
    // Check if AI feature is enabled
    await assertFeature('ai');

    // Check if AI is available
    if (!isAiAvailable()) {
      await log('ai_test_unavailable', {});
      return NextResponse.json({ 
        ok: false, 
        error: 'AI_UNAVAILABLE',
        message: 'AI service is not available'
      }, { status: 503 });
    }

    // Mock guest ID for testing (in real app, get from auth)
    const testGuestId = 'test_guest_123';

    // Check usage limit
    const usageCheck = await checkAIUsageLimit(testGuestId);
    
    if (!usageCheck.allowed) {
      return NextResponse.json({
        ok: false,
        error: 'AI_LIMIT_EXCEEDED',
        message: `Daily AI message limit exceeded (${usageCheck.currentUsage}/${usageCheck.dailyLimit})`,
        usage: usageCheck
      }, { status: 429 }); // Too Many Requests
    }

    // Get AI client and test with simple ping
    const startTime = Date.now();
    
    try {
      const client = getAiClient();
      // Simple test - just verify we can get the client without throwing
      const latency = Date.now() - startTime;

      // Increment usage
      const usageUpdate = await incrementAIUsage(testGuestId);
      
      if (!usageUpdate.success) {
        await log('ai_usage_update_failed', { guestId: testGuestId });
        return NextResponse.json({
          ok: false,
          error: 'USAGE_UPDATE_FAILED',
          message: 'Failed to update AI usage tracking'
        }, { status: 500 });
      }
      
      await log('ai_test_success', { 
        latency,
        guestId: testGuestId,
        usage: usageUpdate.newCount,
        limit: usageCheck.dailyLimit
      });
      
      return NextResponse.json({ 
        ok: true, 
        latency,
        message: 'AI client available and usage tracked',
        usage: {
          current: usageUpdate.newCount,
          limit: usageCheck.dailyLimit,
          remaining: usageCheck.dailyLimit - usageUpdate.newCount,
          limitExceeded: usageUpdate.limitExceeded
        }
      });
    } catch (aiError) {
      await log('ai_test_error', { error: String(aiError) });
      return NextResponse.json({ 
        ok: false, 
        error: 'AI_ERROR',
        message: 'AI client error',
        detail: String(aiError)
      }, { status: 500 });
    }
  } catch (e) {
    console.error('ai test error', e);
    await log('ai_test_system_error', { error: String(e) });

    // Check for specific feature disabled error
    if (String(e).includes('FEATURE_DISABLED:ai')) {
      return NextResponse.json({
        ok: false,
        error: 'FEATURE_DISABLED',
        message: 'AI features are currently disabled'
      }, { status: 503 });
    }

    if (String(e).includes('GLOBAL_READ_ONLY')) {
      return NextResponse.json({
        ok: false,
        error: 'GLOBAL_READ_ONLY',
        message: 'System is in read-only mode'
      }, { status: 503 });
    }

    return NextResponse.json({ 
      ok: false, 
      error: 'AI_ERROR',
      message: 'AI test system error',
      detail: String(e)
    }, { status: 500 });
  }
}