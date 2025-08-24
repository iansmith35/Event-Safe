/**
 * Config Seeding API
 * Seeds default configuration documents in Firestore (idempotent)
 */

import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { log } from '@/lib/log';
import { DEFAULT_FEATURES, DEFAULT_PRICING, DEFAULT_LIMITS, DEFAULT_ADMIN_FLAGS } from '@/types/config';

export async function POST(request: NextRequest) {
  try {
    // Admin authentication is handled by middleware
    
    const results = {
      features: 'existing',
      pricing: 'existing', 
      limits: 'existing',
      admin: 'existing'
    };

    // Seed features config (idempotent)
    try {
      const featuresDoc = await getDoc(doc(db, 'config', 'features'));
      if (!featuresDoc.exists()) {
        await setDoc(doc(db, 'config', 'features'), {
          ...DEFAULT_FEATURES,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        results.features = 'created';
      }
    } catch (error) {
      console.error('Failed to seed features config:', error);
      results.features = 'error';
    }

    // Seed pricing config
    try {
      const pricingDoc = await getDoc(doc(db, 'config', 'pricing'));
      if (!pricingDoc.exists()) {
        await setDoc(doc(db, 'config', 'pricing'), {
          ...DEFAULT_PRICING,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        results.pricing = 'created';
      }
    } catch (error) {
      console.error('Failed to seed pricing config:', error);
      results.pricing = 'error';
    }

    // Seed limits config
    try {
      const limitsDoc = await getDoc(doc(db, 'config', 'limits'));
      if (!limitsDoc.exists()) {
        await setDoc(doc(db, 'config', 'limits'), {
          ...DEFAULT_LIMITS,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        results.limits = 'created';
      }
    } catch (error) {
      console.error('Failed to seed limits config:', error);
      results.limits = 'error';
    }

    // Seed admin flags
    try {
      const adminDoc = await getDoc(doc(db, 'config', 'admin'));
      if (!adminDoc.exists()) {
        await setDoc(doc(db, 'config', 'admin'), {
          ...DEFAULT_ADMIN_FLAGS,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        results.admin = 'created';
      }
    } catch (error) {
      console.error('Failed to seed admin config:', error);
      results.admin = 'error';
    }

    // Count newly created configs
    const created = Object.values(results).filter(status => status === 'created').length;
    const errors = Object.values(results).filter(status => status === 'error').length;

    // Log the seeding operation
    await log('admin_config_seed', {
      results,
      created,
      errors,
      adminIP: request.headers.get('x-forwarded-for') || 'unknown'
    });

    return NextResponse.json({
      ok: true,
      message: `Config seeding complete: ${created} created, ${errors} errors`,
      results
    });

  } catch (error) {
    console.error('Failed to seed configuration:', error);
    
    // Log the error
    await log('admin_config_seed_error', {
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}