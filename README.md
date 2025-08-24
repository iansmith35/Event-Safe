# Event-Safe

This is a Next.js application for event safety management, built with Firebase and AI-powered features.

## Getting Started

To get started, take a look at src/app/page.tsx.

## Admin Features & Controls

### Admin Dashboard

Access the admin dashboard at `/admin` with the admin code. The admin code can be set via:
- Environment variable: `ADMIN_CODE` (defaults to `2338`)
- HTTP header: `x-admin-code: 2338`
- Cookie: `x-admin-code=2338` (set automatically via query parameter)
- Temporary query parameter: `?admin=2338` (sets a cookie for 24 hours)

The admin dashboard shows:
- Live system status (AI, Maps, Firebase connectivity)
- Build information and deployment details
- Service diagnostic tests
- Recent system logs from Firestore

### Admin Controls Panel

Access the advanced admin controls at `/admin/controls` to manage:

#### Feature Toggles
- **Core Features**: Ticketing, Map, AI, Account types (Guest/Host/Venue)
- **Premium Features**: Guest-to-guest QR scanning, Court case system, Staff seats
- **System Features**: Door scanning, Refunds, New signups, Notifications
- **Emergency Control**: Global read-only mode (emergency kill switch)

#### Pricing Configuration
- **Platform Fee**: 8% absorbed by organiser (configurable 0-50%)
- **Processing Fee**: £1 per order paid by guest (configurable 0-£10)
- **Guest Membership**: £3/year subscription via Stripe (configurable 0-£100)
- **Venue Subscription**: £40/month subscription via Stripe (configurable 0-£500)
- **Court Case Fee**: £3 per case filing (configurable 0-£50)

#### Usage Limits
- **AI Daily Limits**: Per-guest message limits (default: 10/day, configurable 1-1000)

#### Entity Management
- Search and suspend/unsuspend user and venue accounts
- View account status and add suspension notes

#### Venue Scoring System
- Automated scoring formula: Base 750 + Events×10 - Refunds×20 - Disputes×50 - Incidents×100
- Admin recompute function for all venues
- Score range: 0-1000 with quality ratings

### Configuration Setup

#### Environment Variables Required

```bash
# Stripe Configuration (Required for billing)
STRIPE_SECRET_KEY=sk_live_or_test_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key_here  
STRIPE_WEBHOOK_SECRET=whsec_webhook_secret_here

# Stripe Price IDs (Create these in Stripe Dashboard with GBP currency)
STRIPE_PRICE_GUEST_YEARLY=price_guest_yearly_3gbp
STRIPE_PRICE_VENUE_MONTHLY=price_venue_monthly_40gbp
STRIPE_PRICE_COURT_CASE=price_court_case_3gbp

# Admin Access
ADMIN_CODE=2338  # Change this for production

# Firebase, AI, and Maps (see .env.example for full list)
```

#### Firestore Configuration Documents

The system uses configuration documents in the `config` collection:

```javascript
// config/features - Feature toggles
{
  ticketing: true,
  map: true,
  ai: true,
  guestAccounts: true,
  hostAccounts: true,
  venueAccounts: true,
  doorScan: true,
  guestToGuestScan: false,  // Premium feature
  court: false,             // Premium feature  
  staffSeats: false,        // Premium feature
  refundsEnabled: true,
  newSignups: true,
  notifications: true
}

// config/pricing - Pricing configuration
{
  platformFeePct: 8,
  processingFeeGBP: 1,
  guestMembershipGBPPerYear: 3,
  venueSubscriptionGBPPerMonth: 40,
  courtCaseGBP: 3
}

// config/limits - Usage limits
{
  aiGuestDailyMessages: 10
}

// config/admin - Admin flags
{
  globalReadOnly: false  // Emergency kill switch
}
```

#### Seeding Configuration

Use the admin seed endpoint to create default configuration:

```bash
curl -X POST http://localhost:3000/api/admin/seed-config \
  -H "x-admin-code: 2338"
```

## Operations & Administration

### Health Monitoring

The application provides a health check endpoint at `/api/health` that returns JSON with:
```json
{
  "ok": true,
  "ai": true,
  "maps": true, 
  "firebase": true,
  "buildTime": "abc123",
  "now": "2024-01-01T00:00:00.000Z"
}
```

This endpoint can be used for:
- Uptime monitoring (recommend GCP Uptime Checks)
- Load balancer health checks
- Service discovery and status verification

### API Examples

#### Feature-Gated APIs
All APIs check feature flags and entity suspension status:

```bash
# Test AI with usage limits
GET /api/test/ai
# Returns usage tracking: current/limit/remaining

# Court case creation (requires court feature enabled)
POST /api/court/open
{
  "guestId": "user123",
  "title": "Payment dispute", 
  "description": "Details...",
  "category": "financial_dispute"
}

# Ticket purchase with fee calculation
POST /api/tickets/purchase
{
  "eventId": "event123",
  "guestId": "user123", 
  "basePriceGBP": 25,
  "quantity": 2
}
# Returns clean pricing breakdown with platform fees
```

#### Billing APIs
```bash
# Start guest membership checkout
POST /api/billing/guest/start
{"userId": "user123", "returnUrl": "https://yoursite.com/dashboard"}

# Start venue subscription checkout  
POST /api/billing/venue/start
{"venueId": "venue123", "returnUrl": "https://yoursite.com/admin"}

# Stripe webhook handler
POST /api/billing/webhook
# Handles: checkout.session.completed, invoice.paid, customer.subscription.deleted
```

### Logging

System events are logged to:
- Firestore collection: `system_logs` 
- Console output (fallback)
- Google Cloud Logging (in production)

### Legal Compliance

The system includes legal framework for:
- Identity verification via Stripe Identity
- Lawful information requests from authorities  
- Clear pricing disclosure (8% platform fee absorbed by organisers)
- £1 processing fee transparency
- Premium feature access controls

Logs include structured data with timestamps and event details for debugging and monitoring.

### Google Cloud Platform Setup

For production monitoring:

1. **Uptime Checks**: Create a GCP Uptime Check for `GET /api/health`
2. **Logging**: View logs in GCP Console > Logging
3. **Error Reporting**: Automatic error reporting for exceptions
4. **Monitoring**: Set up alerts based on health check failures

### Environment Variables

Required for full functionality:
```env
# AI Services
GEMINI_API_KEY=your_gemini_key
# or GOOGLE_API_KEY=your_google_key

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key

# Firebase
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Admin Access
ADMIN_CODE=2338
```
