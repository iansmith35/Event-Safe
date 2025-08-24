/**
 * Court Case Billing API
 * Creates Stripe Checkout Session for court case fees (premium feature)
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
    // Check if court feature is enabled
    if (!(await isFeatureEnabled('court'))) {
      return NextResponse.json(
        { ok: false, error: 'Court feature is currently disabled' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { caseId, userId, caseTitle, returnUrl } = body;

    if (!caseId || !userId) {
      return NextResponse.json(
        { ok: false, error: 'Case ID and User ID are required' },
        { status: 400 }
      );
    }

    // Check required environment variables
    if (!process.env.STRIPE_PRICE_COURT_CASE) {
      return NextResponse.json(
        { ok: false, error: 'Court case price not configured' },
        { status: 500 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', // One-time payment, not subscription
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_COURT_CASE,
          quantity: 1,
        },
      ],
      metadata: {
        type: 'court_case',
        caseId: caseId,
        userId: userId,
        caseTitle: caseTitle || 'EventSafe Court Case'
      },
      customer_email: body.email, // Optional, if provided
      success_url: returnUrl ? `${returnUrl}?ok=1&case=${caseId}` : `${request.nextUrl.origin}/court/case/${caseId}?ok=1`,
      cancel_url: returnUrl || `${request.nextUrl.origin}/court`,
      billing_address_collection: 'required',
    });

    // Log the checkout session creation
    await log('court_case_checkout_created', {
      caseId,
      userId,
      caseTitle,
      sessionId: session.id,
      priceId: process.env.STRIPE_PRICE_COURT_CASE,
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    return NextResponse.json({
      ok: true,
      checkoutUrl: session.url
    });

  } catch (error) {
    console.error('Failed to create court case billing session:', error);

    // Log the error
    await log('court_case_billing_error', {
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