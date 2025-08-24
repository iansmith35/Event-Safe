import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { log } from '@/lib/log';
import { DEFAULT_FEATURES, DEFAULT_PRICING, DEFAULT_LIMITS, DEFAULT_ADMIN_FLAGS } from '@/types/config';

export async function POST(request: NextRequest) {
  try {
    // Admin authentication check
    const adminCode = process.env.ADMIN_CODE || '2338';
    const headerCode = request.headers.get('x-admin-code');
    const cookieCode = request.cookies.get('x-admin-code')?.value;
    
    if (headerCode !== adminCode && cookieCode !== adminCode) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    await log('admin_seed_config_start', {});

    // Seed features configuration
    const featuresRef = doc(db, 'config', 'features');
    await setDoc(featuresRef, {
      ...DEFAULT_FEATURES,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      seededBy: 'admin'
    });

    // Seed pricing configuration
    const pricingRef = doc(db, 'config', 'pricing');
    await setDoc(pricingRef, {
      ...DEFAULT_PRICING,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      seededBy: 'admin'
    });

    // Seed limits configuration
    const limitsRef = doc(db, 'config', 'limits');
    await setDoc(limitsRef, {
      ...DEFAULT_LIMITS,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      seededBy: 'admin'
    });

    // Seed admin flags configuration
    const adminRef = doc(db, 'config', 'admin');
    await setDoc(adminRef, {
      ...DEFAULT_ADMIN_FLAGS,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      seededBy: 'admin'
    });

    await log('admin_seed_config_complete', {
      features: DEFAULT_FEATURES,
      pricing: DEFAULT_PRICING,
      limits: DEFAULT_LIMITS,
      admin: DEFAULT_ADMIN_FLAGS
    });

    return NextResponse.json({
      ok: true,
      message: 'Configuration documents seeded successfully',
      seeded: {
        features: DEFAULT_FEATURES,
        pricing: DEFAULT_PRICING,
        limits: DEFAULT_LIMITS,
        admin: DEFAULT_ADMIN_FLAGS
      }
    });

  } catch (error) {
    console.error('Config seed error:', error);
    await log('admin_seed_config_error', { error: String(error) });
    
    return NextResponse.json({
      ok: false,
      error: 'Failed to seed configuration',
      detail: String(error)
    }, { status: 500 });
  }
}