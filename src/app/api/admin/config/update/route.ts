import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { log } from '@/lib/log';
import { clearFeatureCache } from '@/lib/featureGate';
import { Features, Pricing, Limits, AdminFlags } from '@/types/config';

export async function POST(request: NextRequest) {
  try {
    // Admin authentication check
    const adminCode = process.env.ADMIN_CODE || '2338';
    const headerCode = request.headers.get('x-admin-code');
    const cookieCode = request.cookies.get('x-admin-code')?.value;
    
    if (headerCode !== adminCode && cookieCode !== adminCode) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json(
        { ok: false, error: 'Missing section or data' }, 
        { status: 400 }
      );
    }

    // Validate section
    const validSections = ['features', 'pricing', 'limits', 'admin'];
    if (!validSections.includes(section)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid section' }, 
        { status: 400 }
      );
    }

    // Basic validation based on section
    let validatedData;
    switch (section) {
      case 'features':
        validatedData = validateFeatures(data);
        break;
      case 'pricing':
        validatedData = validatePricing(data);
        break;
      case 'limits':
        validatedData = validateLimits(data);
        break;
      case 'admin':
        validatedData = validateAdminFlags(data);
        break;
      default:
        throw new Error('Invalid section');
    }

    // Get current data for logging
    const configRef = doc(db, 'config', section);
    
    // Update Firestore document
    await setDoc(configRef, {
      ...validatedData,
      updatedAt: serverTimestamp(),
      updatedBy: 'admin' // In a real app, use actual admin user ID
    }, { merge: true });

    // Clear cache to force reload
    clearFeatureCache();

    // Log the change
    await log('admin_config_update', {
      section,
      before: {}, // In a real app, fetch current data first
      after: validatedData,
      admin: 'admin'
    });

    return NextResponse.json({
      ok: true,
      message: `${section} configuration updated successfully`,
      section,
      data: validatedData
    });

  } catch (error) {
    console.error('Config update error:', error);
    await log('admin_config_update_error', { error: String(error) });
    
    return NextResponse.json({
      ok: false,
      error: 'Failed to update configuration',
      detail: String(error)
    }, { status: 500 });
  }
}

function validateFeatures(data: any): Features {
  const requiredFields = [
    'ticketing', 'map', 'ai', 'guestAccounts', 'hostAccounts', 'venueAccounts',
    'doorScan', 'guestToGuestScan', 'court', 'staffSeats', 'refundsEnabled',
    'newSignups', 'notifications'
  ];

  const validated: any = {};
  
  for (const field of requiredFields) {
    if (typeof data[field] !== 'boolean') {
      throw new Error(`Invalid value for ${field}: must be boolean`);
    }
    validated[field] = data[field];
  }

  return validated as Features;
}

function validatePricing(data: any): Pricing {
  const validated: any = {};

  // Validate platform fee percentage (0-50%)
  const platformFeePct = parseFloat(data.platformFeePct);
  if (isNaN(platformFeePct) || platformFeePct < 0 || platformFeePct > 50) {
    throw new Error('Platform fee must be between 0 and 50 percent');
  }
  validated.platformFeePct = platformFeePct;

  // Validate processing fee (0-10 GBP)
  const processingFeeGBP = parseFloat(data.processingFeeGBP);
  if (isNaN(processingFeeGBP) || processingFeeGBP < 0 || processingFeeGBP > 10) {
    throw new Error('Processing fee must be between 0 and 10 GBP');
  }
  validated.processingFeeGBP = processingFeeGBP;

  // Validate guest membership (0-100 GBP)
  const guestMembershipGBPPerYear = parseFloat(data.guestMembershipGBPPerYear);
  if (isNaN(guestMembershipGBPPerYear) || guestMembershipGBPPerYear < 0 || guestMembershipGBPPerYear > 100) {
    throw new Error('Guest membership must be between 0 and 100 GBP per year');
  }
  validated.guestMembershipGBPPerYear = guestMembershipGBPPerYear;

  // Validate venue subscription (0-500 GBP)
  const venueSubscriptionGBPPerMonth = parseFloat(data.venueSubscriptionGBPPerMonth);
  if (isNaN(venueSubscriptionGBPPerMonth) || venueSubscriptionGBPPerMonth < 0 || venueSubscriptionGBPPerMonth > 500) {
    throw new Error('Venue subscription must be between 0 and 500 GBP per month');
  }
  validated.venueSubscriptionGBPPerMonth = venueSubscriptionGBPPerMonth;

  // Validate court case fee (0-50 GBP)
  const courtCaseGBP = parseFloat(data.courtCaseGBP);
  if (isNaN(courtCaseGBP) || courtCaseGBP < 0 || courtCaseGBP > 50) {
    throw new Error('Court case fee must be between 0 and 50 GBP');
  }
  validated.courtCaseGBP = courtCaseGBP;

  return validated as Pricing;
}

function validateLimits(data: any): Limits {
  const validated: any = {};

  // Validate AI daily messages (1-1000)
  const aiGuestDailyMessages = parseInt(data.aiGuestDailyMessages);
  if (isNaN(aiGuestDailyMessages) || aiGuestDailyMessages < 1 || aiGuestDailyMessages > 1000) {
    throw new Error('AI guest daily messages must be between 1 and 1000');
  }
  validated.aiGuestDailyMessages = aiGuestDailyMessages;

  return validated as Limits;
}

function validateAdminFlags(data: any): AdminFlags {
  const validated: any = {};

  // Validate global read-only flag
  if (typeof data.globalReadOnly !== 'boolean') {
    throw new Error('Global read-only must be boolean');
  }
  validated.globalReadOnly = data.globalReadOnly;

  return validated as AdminFlags;
}