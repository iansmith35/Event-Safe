/**
 * Stripe Webhook Handler
 * Processes Stripe webhook events for subscriptions and payments
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { log } from '@/lib/log';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature')!;

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { ok: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Log the processed webhook
    await log('stripe_webhook_processed', {
      eventType: event.type,
      eventId: event.id,
      timestamp: event.created
    });

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Webhook processing failed:', error);
    
    await log('stripe_webhook_error', {
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout session completion
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { type, guestId, venueId } = session.metadata || {};

  if (type === 'guest_membership' && guestId) {
    await updateGuestMembership(guestId, true, session);
  } else if (type === 'venue_subscription' && venueId) {
    await updateVenuePlan(venueId, true, session);
  }

  await log('stripe_checkout_completed', {
    sessionId: session.id,
    type,
    guestId,
    venueId,
    amount: session.amount_total,
    currency: session.currency
  });
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = typeof (invoice as any).subscription === 'string' 
    ? (invoice as any).subscription 
    : (invoice as any).subscription?.id;
    
  if (!subscriptionId) return;

  // Retrieve subscription to get metadata
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const { type, guestId, venueId } = subscription.metadata || {};

  if (type === 'guest_membership' && guestId) {
    await updateGuestMembership(guestId, true, null, subscription);
  } else if (type === 'venue_subscription' && venueId) {
    await updateVenuePlan(venueId, true, null, subscription);
  }

  await log('stripe_invoice_paid', {
    invoiceId: invoice.id,
    subscriptionId: subscription.id,
    type,
    guestId,
    venueId,
    amount: invoice.amount_paid,
    currency: invoice.currency
  });
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { type, guestId, venueId } = subscription.metadata || {};

  if (type === 'guest_membership' && guestId) {
    await updateGuestMembership(guestId, false);
  } else if (type === 'venue_subscription' && venueId) {
    await updateVenuePlan(venueId, false);
  }

  await log('stripe_subscription_deleted', {
    subscriptionId: subscription.id,
    type,
    guestId,
    venueId
  });
}

/**
 * Handle subscription updates (e.g., renewal)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { type, guestId, venueId } = subscription.metadata || {};
  const isActive = subscription.status === 'active';

  if (type === 'guest_membership' && guestId) {
    await updateGuestMembership(guestId, isActive, null, subscription);
  } else if (type === 'venue_subscription' && venueId) {
    await updateVenuePlan(venueId, isActive, null, subscription);
  }

  await log('stripe_subscription_updated', {
    subscriptionId: subscription.id,
    status: subscription.status,
    type,
    guestId,
    venueId
  });
}

/**
 * Update guest membership status in Firestore
 */
async function updateGuestMembership(
  guestId: string, 
  active: boolean, 
  session?: Stripe.Checkout.Session | null,
  subscription?: Stripe.Subscription
) {
  try {
    const userRef = doc(db, 'users', guestId);
    
    // Check if user exists
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      console.error(`User ${guestId} not found`);
      return;
    }

    const currentPeriodEnd = subscription 
      ? new Date((subscription as any).current_period_end * 1000)
      : null;

    await updateDoc(userRef, {
      'membership.active': active,
      'membership.currentPeriodEnd': currentPeriodEnd,
      'membership.updatedAt': serverTimestamp(),
      'membership.stripeSubscriptionId': subscription?.id || null,
      'membership.stripeCustomerId': subscription?.customer || session?.customer || null
    });

  } catch (error) {
    console.error('Failed to update guest membership:', error);
    throw error;
  }
}

/**
 * Update venue plan status in Firestore
 */
async function updateVenuePlan(
  venueId: string, 
  active: boolean, 
  session?: Stripe.Checkout.Session | null,
  subscription?: Stripe.Subscription
) {
  try {
    const venueRef = doc(db, 'venues', venueId);
    
    // Check if venue exists
    const venueDoc = await getDoc(venueRef);
    if (!venueDoc.exists()) {
      console.error(`Venue ${venueId} not found`);
      return;
    }

    const currentPeriodEnd = subscription 
      ? new Date((subscription as any).current_period_end * 1000)
      : null;

    await updateDoc(venueRef, {
      'plan.active': active,
      'plan.currentPeriodEnd': currentPeriodEnd,
      'plan.updatedAt': serverTimestamp(),
      'plan.stripeSubscriptionId': subscription?.id || null,
      'plan.stripeCustomerId': subscription?.customer || session?.customer || null
    });

  } catch (error) {
    console.error('Failed to update venue plan:', error);
    throw error;
  }
}