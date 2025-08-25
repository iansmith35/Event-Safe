import { NextResponse } from 'next/server';

/**
 * Simple debug endpoint to test Google Maps API directly
 * GET /api/test/maps-debug
 */
export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        ok: false,
        error: 'No API key found',
        timestamp: new Date().toISOString()
      });
    }
    
    // Test simple geocoding call
    const testAddress = "London";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(testAddress)}&key=${apiKey}`;
    
    console.log('Testing URL:', url.replace(apiKey, 'HIDDEN_KEY'));
    
    const response = await fetch(url);
    const data = await response.json();
    
    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      apiKeyExists: !!apiKey,
      apiKeyLength: apiKey.length,
      responseData: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}