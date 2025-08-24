import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, or } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    // Admin authentication check
    const adminCode = process.env.ADMIN_CODE || '2338';
    const headerCode = request.headers.get('x-admin-code');
    const cookieCode = request.cookies.get('x-admin-code')?.value;
    
    if (headerCode !== adminCode && cookieCode !== adminCode) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q')?.trim();

    if (!searchQuery) {
      return NextResponse.json({
        ok: true,
        results: [],
        message: 'No search query provided'
      });
    }

    const results = [];

    try {
      // Search users by email
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '>=', searchQuery.toLowerCase()),
        where('email', '<=', searchQuery.toLowerCase() + '\uf8ff'),
        limit(10)
      );
      const usersSnapshot = await getDocs(usersQuery);
      
      usersSnapshot.forEach(doc => {
        const data = doc.data();
        results.push({
          id: doc.id,
          type: 'user',
          email: data.email,
          name: data.displayName || data.name,
          status: data.status || {}
        });
      });

    } catch (error) {
      console.error('User search error:', error);
      // Continue with venue search even if user search fails
    }

    try {
      // Search venues by name
      const venuesQuery = query(
        collection(db, 'venues'),
        where('name', '>=', searchQuery),
        where('name', '<=', searchQuery + '\uf8ff'),
        limit(10)
      );
      const venuesSnapshot = await getDocs(venuesQuery);
      
      venuesSnapshot.forEach(doc => {
        const data = doc.data();
        results.push({
          id: doc.id,
          type: 'venue',
          name: data.name,
          email: data.email || data.contactEmail,
          status: data.status || {}
        });
      });

    } catch (error) {
      console.error('Venue search error:', error);
      // Continue even if venue search fails
    }

    // Sort results by relevance (suspended items first, then alphabetically)
    results.sort((a, b) => {
      // Suspended items first
      if (a.status?.suspended && !b.status?.suspended) return -1;
      if (!a.status?.suspended && b.status?.suspended) return 1;
      
      // Then alphabetically by name/email
      const aName = a.name || a.email || '';
      const bName = b.name || b.email || '';
      return aName.localeCompare(bName);
    });

    return NextResponse.json({
      ok: true,
      results: results.slice(0, 20), // Limit to 20 results
      query: searchQuery,
      count: results.length
    });

  } catch (error) {
    console.error('Entity search error:', error);
    
    return NextResponse.json({
      ok: false,
      error: 'Failed to search entities',
      detail: String(error)
    }, { status: 500 });
  }
}