import { NextResponse } from 'next/server';
import { runDemoSafely } from '@/lib/api-demo';

/**
 * API endpoint to test the EventSafe API integrations
 * GET /api/test/integrations
 */
export async function GET() {
  try {
    const results = await runDemoSafely();
    
    return NextResponse.json({
      ok: true,
      message: 'EventSafe API integrations test completed',
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      message: 'API integrations test failed',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}