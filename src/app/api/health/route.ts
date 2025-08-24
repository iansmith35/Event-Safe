import { NextResponse } from 'next/server';
import { getStatus } from '@/lib/status';

export async function GET() {
  try {
    return NextResponse.json({ ok: true, ...(await getStatus()) });
  } catch (e) {
    console.error('health', e);
    return NextResponse.json({ ok: false, error: 'HEALTH_FAIL' }, { status: 500 });
  }
}