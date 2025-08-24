/**
 * Entity Suspension API
 * Allows admins to suspend/unsuspend users and venues
 */

import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { log } from '@/lib/log';

export async function POST(request: NextRequest) {
  try {
    // Admin authentication is handled by middleware
    const body = await request.json();
    const { entityId, type, suspend, notes } = body;

    if (!entityId || !type) {
      return NextResponse.json(
        { ok: false, error: 'Missing entityId or type' },
        { status: 400 }
      );
    }

    if (!['user', 'venue'].includes(type)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid entity type' },
        { status: 400 }
      );
    }

    const collection = type === 'user' ? 'users' : 'venues';
    const entityRef = doc(db, collection, entityId);

    // Get current entity data for logging
    let currentEntity: any = null;
    try {
      const entityDoc = await getDoc(entityRef);
      if (!entityDoc.exists()) {
        return NextResponse.json(
          { ok: false, error: 'Entity not found' },
          { status: 404 }
        );
      }
      currentEntity = entityDoc.data();
    } catch (error) {
      console.error('Failed to fetch entity:', error);
      return NextResponse.json(
        { ok: false, error: 'Entity not found' },
        { status: 404 }
      );
    }

    // Update entity status
    const statusUpdate = suspend ? {
      status: {
        suspended: true,
        suspendedAt: serverTimestamp(),
        suspendedBy: 'admin', // In real app, this would be the actual admin user ID
        notes: notes || 'Suspended by admin'
      }
    } : {
      status: {
        suspended: false,
        unsuspendedAt: serverTimestamp(),
        unsuspendedBy: 'admin',
        notes: notes || 'Unsuspended by admin'
      }
    };

    await updateDoc(entityRef, statusUpdate);

    // Log the action
    await log('admin_entity_suspension', {
      entityId,
      entityType: type,
      action: suspend ? 'suspend' : 'unsuspend',
      notes,
      before: currentEntity?.status,
      after: statusUpdate.status,
      adminIP: request.headers.get('x-forwarded-for') || 'unknown'
    });

    return NextResponse.json({ 
      ok: true, 
      message: `${type} ${suspend ? 'suspended' : 'unsuspended'} successfully` 
    });

  } catch (error) {
    console.error('Failed to update entity suspension status:', error);
    
    // Log the error
    await log('admin_entity_suspension_error', {
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}