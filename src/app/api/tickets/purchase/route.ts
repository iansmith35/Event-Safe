import { NextRequest, NextResponse } from 'next/server';
import { assertFeature, assertEntityEnabled } from '@/lib/featureGate';
import { calcPlatformFees, getFeeSummary } from '@/lib/fees';
import { log } from '@/lib/log';

export async function POST(request: NextRequest) {
  try {
    // Check if ticketing feature is enabled
    await assertFeature('ticketing');

    const body = await request.json();
    const { 
      eventId, 
      guestId, 
      ticketType, 
      quantity, 
      basePriceGBP, 
      user,
      venue 
    } = body;

    // Validate required fields
    if (!eventId || !guestId || !ticketType || !quantity || !basePriceGBP) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Check if entities are not suspended
    if (user) {
      assertEntityEnabled(user);
    }
    if (venue) {
      assertEntityEnabled(venue);
    }

    // Calculate fees using current pricing configuration
    // In a real app, we'd fetch this from the config
    const platformFeePct = 8;
    const processingFeeGBP = 1;

    const feeSummary = getFeeSummary(basePriceGBP, quantity, platformFeePct, processingFeeGBP);

    // Mock ticket purchase process
    const mockTicketId = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await log('ticket_purchase_request', {
      eventId,
      guestId,
      ticketType,
      quantity,
      feeSummary,
      mockTicketId
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({
      ok: true,
      message: 'Ticket purchase initiated',
      ticket: {
        id: mockTicketId,
        eventId,
        guestId,
        ticketType,
        quantity,
        status: 'pending_payment'
      },
      pricing: feeSummary,
      payment: {
        guestPays: feeSummary.guestTotal,
        organiserReceives: feeSummary.organiserNet,
        platformFee: feeSummary.platformFee,
        processingFee: feeSummary.processingFee,
        currency: 'GBP'
      },
      nextStep: {
        action: 'payment',
        message: `Please pay £${feeSummary.guestTotal} to complete your purchase`,
        mockCheckoutUrl: `https://checkout.stripe.com/c/pay/mock_${mockTicketId}`
      }
    });

  } catch (error) {
    console.error('Ticket purchase error:', error);
    await log('ticket_purchase_error', { error: String(error) });

    // Handle specific errors
    if (String(error).includes('FEATURE_DISABLED:ticketing')) {
      return NextResponse.json({
        ok: false,
        error: 'FEATURE_DISABLED',
        message: 'Ticket purchases are currently disabled'
      }, { status: 503 });
    }

    if (String(error).includes('ENTITY_SUSPENDED')) {
      return NextResponse.json({
        ok: false,
        error: 'ENTITY_SUSPENDED',
        message: 'Account is suspended. Contact support for assistance.'
      }, { status: 403 });
    }

    if (String(error).includes('GLOBAL_READ_ONLY')) {
      return NextResponse.json({
        ok: false,
        error: 'GLOBAL_READ_ONLY',
        message: 'System is in read-only mode'
      }, { status: 503 });
    }
    
    return NextResponse.json({
      ok: false,
      error: 'Failed to process ticket purchase',
      detail: String(error)
    }, { status: 500 });
  }
}