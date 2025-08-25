# Event-Safe

This is a Next.js application for event safety management, built with Firebase and AI-powered features.

## Getting Started

To get started, take a look at src/app/page.tsx.

## Admin Features & Controls

### Admin Dashboard

**Admin access**: Sign in with your normal account, then visit `/admin/login` and enter passcode. Only `ADMIN_EMAIL` is permitted. Successful entry sets a 7-day admin session cookie and marks your user doc as `{role:'admin'}`. Use `/admin/logout` to clear.

To change admin email/passcode, update `ADMIN_EMAIL`, `ADMIN_PASSCODE` env and redeploy.

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
ADMIN_EMAIL=ian@ishe-ltd.co.uk
ADMIN_PASSCODE=2338  # Change this for production

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

## Maps Setup & Allowed Referrers

To set up Google Maps properly:

1. **Enable Maps JavaScript API** in Google Cloud Console
2. **Attach billing** to your Google Cloud project (required for Maps API)
3. **Configure API Key restrictions**:
   - Go to Google Cloud Console > APIs & Services > Credentials
   - Click on your API key
   - Under "Application restrictions", select "HTTP referrers"
   - Add these referrers:
     - `https://event-safe-id--rebbeca-bot.us-central1.hosted.app/*`
     - `https://event-safe-id--rebbeca-bot.web.app/*`
     - `http://localhost:3000/*`
4. **If maps are still blocked**, temporarily remove all restrictions to verify functionality, then re-apply restrictions

**Note**: If `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is missing, the map component will show a graceful fallback message instead of crashing.

# Firebase
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Admin Access
ADMIN_EMAIL=ian@ishe-ltd.co.uk
ADMIN_PASSCODE=2338
```

## AI Fallback Behavior

The Rebecca chatbot includes graceful error handling:

- **When AI is unavailable**: Shows user-friendly message "Rebecca is temporarily unavailable" and keeps the user on the same page
- **Temporary cooldown**: Disables send button for 10 seconds after an error, then automatically re-enables
- **No crashes**: All AI errors are caught and handled gracefully with fallback responses
- **User experience**: Non-intrusive toast notifications instead of disruptive error dialogs

## Maps Setup Checklist

To set up the interactive UK map with venue interest workflow:

### 1. Enable Google Maps API

1. **Enable "Maps JavaScript API"** in Google Cloud Console
2. **Attach billing** to your Google Cloud project (required for Maps API)
3. **Enable the Visualization Library** (included automatically with `libraries=visualization`)

### 2. Configure API Key Restrictions

1. Go to **Google Cloud Console > APIs & Services > Credentials**
2. Click on your API key
3. Under **"Application restrictions"**, select **"HTTP referrers"**
4. Add these referrers:
   - `https://event-safe-id--rebbeca-bot.us-central1.hosted.app/*`
   - `https://event-safe-id--rebbeca-bot.web.app/*`
   - `https://*.vercel.app/*`
   - `http://localhost:3000/*`

### 3. Environment Variables

Add to both Firebase Hosting env and Vercel Project env:

```env
# Required for map functionality
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key

# Optional for email notifications
EMAIL_FROM=support@eventsafe.id
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_sendgrid_key
SITE_URL=https://event-safe-id--rebbeca-bot.us-central1.hosted.app
```

### 4. Seed UK Cities Data

After deployment, use the admin panel to seed initial venue data:

```bash
# Login as admin, then POST to:
/api/admin/seed-cities
```

This creates prospect venues for major UK cities (London, Manchester, Birmingham, etc.) with `interestCount: 0`.

### 5. Troubleshooting

- **If maps are still blocked**: Temporarily remove all restrictions to verify functionality, then re-apply restrictions
- **If `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is missing**: The map component will show a graceful fallback message instead of crashing
- **For email notifications**: If `EMAIL_PROVIDER` is not configured, notifications will be logged only (no actual emails sent)

## CTA Buttons Responsive Rule

The "For Hosts & Venues" call-to-action buttons follow these responsive rules:

- **Desktop (md+)**: Buttons display inline in a single row with proper spacing
- **Mobile/Small screens**: Buttons stack vertically with full width
- **Overflow prevention**: Uses `flex-wrap` and `max-w-full` to prevent buttons from hanging outside their container
- **Spacing**: Consistent gap spacing (3-4 units) between buttons on all screen sizes
