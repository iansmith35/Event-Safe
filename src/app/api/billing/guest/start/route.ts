/**
 * Guest Billing API
 * Creates Stripe Checkout Session for guest yearly membership
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
    // Check if guest accounts feature is enabled
    if (!(await isFeatureEnabled('guestAccounts'))) {
      return NextResponse.json(
        { ok: false, error: 'Guest accounts are currently disabled' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { guestId, returnUrl } = body;

    if (!guestId) {
      return NextResponse.json(
        { ok: false, error: 'Guest ID is required' },
        { status: 400 }
      );
    }

    // Check required environment variables
    if (!process.env.STRIPE_PRICE_GUEST_YEARLY) {
      return NextResponse.json(
        { ok: false, error: 'Guest membership price not configured' },
        { status: 500 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_GUEST_YEARLY,
          quantity: 1,
        },
      ],
      metadata: {
        type: 'guest_membership',
        guestId: guestId,
      },
      customer_email: body.email, // Optional, if provided
      success_url: returnUrl ? `${returnUrl}?ok=1` : `${request.nextUrl.origin}/dashboard?ok=1`,
      cancel_url: returnUrl || `${request.nextUrl.origin}/dashboard`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    // Log the checkout session creation
    await log('guest_checkout_session_created', {
      guestId,
      sessionId: session.id,
      priceId: process.env.STRIPE_PRICE_GUEST_YEARLY,
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    return NextResponse.json({
      ok: true,
      checkoutUrl: session.url
    });

  } catch (error) {
    console.error('Failed to create guest billing session:', error);

    // Log the error
    await log('guest_billing_session_error', {
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