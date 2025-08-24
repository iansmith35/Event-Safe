/**
 * Venue Billing API
 * Creates Stripe Checkout Session for venue monthly subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { log } from '@/lib/log';
import { isFeatureEnabled } from '@/lib/featureGate';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    // Check if venue accounts feature is enabled
    if (!(await isFeatureEnabled('venueAccounts'))) {
      return NextResponse.json(
        { ok: false, error: 'Venue accounts are currently disabled' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { venueId, returnUrl } = body;

    if (!venueId) {
      return NextResponse.json(
        { ok: false, error: 'Venue ID is required' },
        { status: 400 }
      );
    }

    // Check required environment variables
    if (!process.env.STRIPE_PRICE_VENUE_MONTHLY) {
      return NextResponse.json(
        { ok: false, error: 'Venue subscription price not configured' },
        { status: 500 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_VENUE_MONTHLY,
          quantity: 1,
        },
      ],
      metadata: {
        type: 'venue_subscription',
        venueId: venueId,
      },
      customer_email: body.email, // Optional, if provided
      success_url: returnUrl ? `${returnUrl}?ok=1` : `${request.nextUrl.origin}/venue/dashboard?ok=1`,
      cancel_url: returnUrl || `${request.nextUrl.origin}/venue/dashboard`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    // Log the checkout session creation
    await log('venue_checkout_session_created', {
      venueId,
      sessionId: session.id,
      priceId: process.env.STRIPE_PRICE_VENUE_MONTHLY,
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    return NextResponse.json({
      ok: true,
      checkoutUrl: session.url
    });

  } catch (error) {
    console.error('Failed to create venue billing session:', error);

    // Log the error
    await log('venue_billing_session_error', {
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { ok: false, error: `Stripe error: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}