/**
 * Admin Configuration Update API
 * Allows admins to update features, pricing, limits, and admin flags
 */

import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { log } from '@/lib/log';
import { clearFeaturesCache } from '@/lib/featureGate';
import { Features, Pricing, Limits, AdminFlags } from '@/types/config';

export async function POST(request: NextRequest) {
  try {
    // Admin authentication is handled by middleware
    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json(
        { ok: false, error: 'Missing section or data' },
        { status: 400 }
      );
    }

    // Validate section type
    const validSections = ['features', 'pricing', 'limits', 'admin'];
    if (!validSections.includes(section)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid section' },
        { status: 400 }
      );
    }

    // Get current data for logging
    let currentData: any = null;
    try {
      const currentDoc = await import('firebase/firestore').then(mod => 
        mod.getDoc(doc(db, 'config', section))
      );
      if (currentDoc.exists()) {
        currentData = currentDoc.data();
      }
    } catch (error) {
      console.warn('Could not fetch current config for logging:', error);
    }

    // Update configuration document
    await setDoc(doc(db, 'config', section), {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: 'admin' // In a real app, this would be the actual admin user ID
    }, { merge: true });

    // Clear feature cache if features were updated
    if (section === 'features') {
      clearFeaturesCache();
    }

    // Log the change
    await log('admin_config_updated', {
      section,
      before: currentData,
      after: data,
      adminIP: request.headers.get('x-forwarded-for') || 'unknown'
    });

    return NextResponse.json({ 
      ok: true, 
      message: `${section} configuration updated successfully` 
    });

  } catch (error) {
    console.error('Failed to update admin config:', error);
    
    // Log the error
    await log('admin_config_update_error', {
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}