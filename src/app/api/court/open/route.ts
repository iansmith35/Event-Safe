import { NextRequest, NextResponse } from 'next/server';
import { createCourtCasePayment } from '@/lib/courtCase';
import { assertFeature } from '@/lib/featureGate';
import { log } from '@/lib/log';

export async function POST(request: NextRequest) {
  try {
    // Check if court feature is enabled
    await assertFeature('court');

    const body = await request.json();
    const { guestId, title, description, category, evidence } = body;

    // Validate required fields
    if (!guestId || !title || !description) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields: guestId, title, description' }, 
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['financial_dispute', 'safety_incident', 'contract_breach', 'other'];
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid category' }, 
        { status: 400 }
      );
    }

    // Get court case fee from environment or default to £3
    const courtCaseFee = parseFloat(process.env.STRIPE_PRICE_COURT_CASE_AMOUNT || '3');

    // Create payment session
    const paymentSession = await createCourtCasePayment({
      title,
      guestId,
      amount: courtCaseFee
    });

    await log('court_case_open_request', {
      guestId,
      title,
      category: category || 'other',
      sessionId: paymentSession.sessionId,
      amount: courtCaseFee
    });

    return NextResponse.json({
      ok: true,
      message: 'Court case payment session created',
      checkoutUrl: paymentSession.checkoutUrl,
      sessionId: paymentSession.sessionId,
      amount: courtCaseFee,
      currency: 'GBP',
      casePreview: {
        title,
        category: category || 'other',
        description: description.substring(0, 100) + (description.length > 100 ? '...' : '')
      }
    });

  } catch (error) {
    console.error('Court case open error:', error);
    await log('court_case_open_error', { error: String(error) });

    // Check for specific feature disabled error
    if (String(error).includes('FEATURE_DISABLED:court')) {
      return NextResponse.json({
        ok: false,
        error: 'FEATURE_DISABLED',
        message: 'Court case system is currently disabled',
        code: 503
      }, { status: 503 });
    }

    if (String(error).includes('GLOBAL_READ_ONLY')) {
      return NextResponse.json({
        ok: false,
        error: 'GLOBAL_READ_ONLY',
        message: 'System is in read-only mode',
        code: 503
      }, { status: 503 });
    }
    
    return NextResponse.json({
      ok: false,
      error: 'Failed to open court case',
      detail: String(error)
    }, { status: 500 });
  }
}