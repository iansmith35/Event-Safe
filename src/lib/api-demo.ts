/**
 * EventSafe API Integration Demo
 * 
 * This file demonstrates the usage of the EventSafe API integrations
 * as specified in the problem statement.
 */

import { callRebecca, getDistance, geocodeAddress } from '@/lib/api-integrations';

// ===============================
// Example Usage (as per problem statement)
// ===============================

export async function runApiIntegrationDemo() {
  console.log('🚀 Starting EventSafe API Integration Demo...\n');
  
  // Rebecca test
  console.log('📞 Testing Rebecca Bot...');
  const rebeccaResult = await callRebecca("hello");
  console.log('Rebecca response:', rebeccaResult);
  console.log('');
  
  // Maps test - Distance
  console.log('🗺️ Testing Google Maps Distance API...');
  const distanceResult = await getDistance("Bristol", "London");
  console.log('Distance result:', distanceResult);
  console.log('');
  
  // Maps test - Geocoding
  console.log('📍 Testing Google Maps Geocoding API...');
  const geocodeResult = await geocodeAddress("46 Picton Street, Montpelier, Bristol, BS6 5QA");
  console.log('Geocode result:', geocodeResult);
  console.log('');
  
  console.log('✅ EventSafe API Integration Demo completed!');
  
  return {
    rebecca: rebeccaResult,
    distance: distanceResult,
    geocode: geocodeResult
  };
}

// Helper function to run demo with error handling
export async function runDemoSafely() {
  try {
    return await runApiIntegrationDemo();
  } catch (error) {
    console.error('❌ Demo failed:', error);
    return { error: error instanceof Error ? error.message : String(error) };
  }
}