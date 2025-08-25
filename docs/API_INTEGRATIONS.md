# EventSafe API Integration Setup

This implementation provides comprehensive API integration utilities for EventSafe, including Rebecca Bot (Cloud Function) and Google Maps services (Distance Matrix & Geocoding).

## Features Implemented

### 1. Rebecca Bot Integration (`callRebecca`)
```javascript
import { callRebecca } from '@/lib/api-integrations';

// Example usage
const result = await callRebecca("hello");
```

**Endpoint**: `https://us-central1-rebbeca-bot.cloudfunctions.net/executeRebeccaCommand`  
**Method**: POST  
**Payload**: `{ input: command }`  
**Error Handling**: Returns `{ error: "Rebecca temporarily unavailable" }` on failure

### 2. Google Maps Distance Matrix API (`getDistance`)
```javascript
import { getDistance } from '@/lib/api-integrations';

// Example usage
const result = await getDistance("Bristol", "London");
```

**API**: Google Maps Distance Matrix API  
**Error Handling**: Returns `{ error: "Map temporarily unavailable" }` on failure  
**API Key**: Uses `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable

### 3. Google Maps Geocoding API (`geocodeAddress`)
```javascript
import { geocodeAddress } from '@/lib/api-integrations';

// Example usage  
const result = await geocodeAddress("46 Picton Street, Montpelier, Bristol, BS6 5QA");
```

**API**: Google Maps Geocoding API  
**Error Handling**: Returns `{ error: "Geocode temporarily unavailable" }` on failure  
**API Key**: Uses `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable

## Complete Example Usage

```javascript
// ===============================
// EventSafe API Integration Setup
// ===============================

import { callRebecca, getDistance, geocodeAddress } from '@/lib/api-integrations';

// Rebecca test
const rebeccaResult = await callRebecca("hello");
console.log("✅ Rebecca replied:", rebeccaResult);

// Maps test - Distance
const distanceResult = await getDistance("Bristol", "London");
console.log("✅ Distance result:", distanceResult);

// Maps test - Geocoding
const geocodeResult = await geocodeAddress("46 Picton Street, Montpelier, Bristol, BS6 5QA");
console.log("✅ Geocode result:", geocodeResult);
```

## Testing

### API Endpoint
Test the integrations using the provided API endpoint:

```bash
GET /api/test/integrations
```

This endpoint runs all three integration examples and returns:
```json
{
  "ok": true,
  "message": "EventSafe API integrations test completed",
  "results": {
    "rebecca": { /* Rebecca response */ },
    "distance": { /* Distance response */ },
    "geocode": { /* Geocode response */ }
  },
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### Programmatic Testing
```javascript
import { runDemoSafely } from '@/lib/api-demo';

const results = await runDemoSafely();
console.log(results);
```

## Error Handling

All functions include comprehensive error handling with:
- **Network error resilience** - Graceful fallbacks when APIs are unreachable
- **API error handling** - Proper HTTP status code handling
- **Logging integration** - Uses EventSafe's centralized logging system
- **TypeScript support** - Full type definitions provided

## Environment Configuration

### Required Environment Variables
```bash
# Google Maps (for distance and geocoding functions)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Google Maps API Setup
1. Enable **Maps JavaScript API** in Google Cloud Console  
2. Enable **Distance Matrix API** in Google Cloud Console
3. Enable **Geocoding API** in Google Cloud Console
4. **Attach billing** to your Google Cloud project (required for Maps APIs)
5. **Configure API Key restrictions** (see README.md for details)

## Integration with EventSafe

The API integrations follow EventSafe's established patterns:
- **Error handling** - Similar to existing `src/lib/ai.ts` patterns
- **Environment variables** - Reuses existing Google Maps key configuration  
- **Logging** - Uses EventSafe's centralized `log()` utility
- **TypeScript** - Full type safety with interface definitions
- **Network resilience** - Graceful degradation when services are unavailable

## Files Created

- `/src/lib/api-integrations.ts` - Main integration utilities
- `/src/lib/api-demo.ts` - Example usage demonstrations  
- `/src/app/api/test/integrations/route.ts` - API testing endpoint
- `/docs/API_INTEGRATIONS.md` - This documentation file