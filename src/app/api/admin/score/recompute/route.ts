import { NextRequest, NextResponse } from 'next/server';
import { recomputeAllVenueScores, recomputeVenueScore } from '@/lib/score';
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

    const body = await request.json().catch(() => ({}));
    const { venueId } = body;

    let results;
    
    if (venueId) {
      // Recompute single venue score
      const scoreComponents = await recomputeVenueScore(venueId);
      
      await log('admin_venue_score_recompute_single', {
        venueId,
        scoreComponents,
        admin: 'admin'
      });

      results = {
        venuesProcessed: 1,
        results: [{ venueId, score: scoreComponents }]
      };
      
    } else {
      // Recompute all venue scores
      const allResults = await recomputeAllVenueScores();
      
      await log('admin_venue_score_recompute_all', {
        venuesProcessed: allResults.length,
        admin: 'admin'
      });

      results = {
        venuesProcessed: allResults.length,
        results: allResults
      };
    }

    return NextResponse.json({
      ok: true,
      message: `Successfully recomputed scores for ${results.venuesProcessed} venue${results.venuesProcessed === 1 ? '' : 's'}`,
      ...results
    });

  } catch (error) {
    console.error('Score recompute error:', error);
    await log('admin_venue_score_recompute_error', { error: String(error) });
    
    return NextResponse.json({
      ok: false,
      error: 'Failed to recompute venue scores',
      detail: String(error)
    }, { status: 500 });
  }
}