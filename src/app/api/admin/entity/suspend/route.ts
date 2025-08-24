import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { log } from '@/lib/log';

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
    const { entityId, entityType, suspended, notes } = body;

    if (!entityId || !entityType) {
      return NextResponse.json(
        { ok: false, error: 'Missing entityId or entityType' }, 
        { status: 400 }
      );
    }

    if (!['user', 'venue'].includes(entityType)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid entityType. Must be user or venue' }, 
        { status: 400 }
      );
    }

    if (typeof suspended !== 'boolean') {
      return NextResponse.json(
        { ok: false, error: 'suspended must be boolean' }, 
        { status: 400 }
      );
    }

    // Determine collection based on entity type
    const collection = entityType === 'user' ? 'users' : 'venues';
    
    // Update entity status
    const entityRef = doc(db, collection, entityId);
    const statusUpdate = {
      'status.suspended': suspended,
      'status.updatedAt': serverTimestamp(),
      'status.updatedBy': 'admin' // In a real app, use actual admin user ID
    };

    if (notes) {
      statusUpdate['status.notes'] = notes;
    }

    await updateDoc(entityRef, statusUpdate);

    // Log the action
    await log('admin_entity_suspend', {
      entityId,
      entityType,
      suspended,
      notes: notes || null,
      admin: 'admin'
    });

    return NextResponse.json({
      ok: true,
      message: `${entityType} ${suspended ? 'suspended' : 'unsuspended'} successfully`,
      entityId,
      entityType,
      suspended
    });

  } catch (error) {
    console.error('Entity suspension error:', error);
    await log('admin_entity_suspend_error', { error: String(error) });
    
    return NextResponse.json({
      ok: false,
      error: 'Failed to update entity status',
      detail: String(error)
    }, { status: 500 });
  }
}