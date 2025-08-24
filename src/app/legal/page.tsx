import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="absolute top-4 left-4">
            <Button asChild variant="outline">
                <Link href="/uk">Back to Home</Link>
            </Button>
        </div>
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex flex-col items-center mb-6 text-center">
          <Logo className="w-auto h-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold">Legal — Terms, Privacy & Data</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            These Terms & Conditions, Privacy Policy and Data Handling Procedures form a binding agreement between EventSafe and its users. They are written to comply with UK consumer law and UK GDPR.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Introduction</h2>
          <p className="text-sm">
            By creating an account, browsing, or purchasing tickets on EventSafe (&ldquo;we/us/our&rdquo;), you agree to these Terms & Conditions, Privacy Policy and Data Handling Procedures (collectively, the &ldquo;Terms&rdquo;). These Terms form a binding agreement governed by the laws of England & Wales.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Who We Are & Role</h2>
          <p className="text-sm">
            EventSafe operates a ticketing and safety platform enabling venues and hosts (&ldquo;Organisers&rdquo;) to list events and sell tickets to registered guests (&ldquo;Guests&rdquo;). We act as a facilitating agent and technology provider. Organisers remain responsible for the event itself, venue rules, admission decisions and any statutory obligations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Accounts & Eligibility</h2>
          <div className="text-sm space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>You must be 18+. You must provide accurate details and keep them current.</li>
              <li>Anonymous display names/pseudonyms are supported; certain features require identity verification.</li>
              <li>We may suspend or terminate accounts for fraud, abuse or breach of these Terms.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Pricing & Fees</h2>
          <div className="text-sm space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Guest Price:</strong> Guests see a clear final price. Organisers absorb the platform fee so Guests are not surprised by add-ons.</li>
              <li><strong>Platform Fee (Organisers):</strong> 8% of the ticket price per paid order.</li>
              <li><strong>Processing/Admin Fee (Guests):</strong> £1 per order or pre-approval attempt; this fee is non-refundable once processing has begun.</li>
              <li><strong>Currency:</strong> GBP. Prices may change; premium features may be introduced. We may adjust pricing with at least monthly granularity.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Tickets, Pre-Approval & Issuance</h2>
          <div className="text-sm space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>Standard purchases are issued immediately upon successful payment.</li>
              <li>If an account is flagged, blacklisted by an Organiser, or an event uses manual approval, the order enters pre-approval:
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>We may authorise your payment and charge the £1 processing fee immediately.</li>
                  <li>If approved, the ticket is issued and payment is captured.</li>
                  <li>If declined, the ticket price is released/refunded; the £1 processing fee is retained.</li>
                </ul>
              </li>
              <li>Tickets are non-transferable unless the Organiser explicitly allows it.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Refunds, Cancellations & Downtime</h2>
          <div className="text-sm space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>Refunds are requested directly from EventSafe; do not raise bank/Stripe disputes. We process lawful refunds of the ticket price; the £1 processing fee is never refunded once processing has begun.</li>
              <li><strong>Platform Availability:</strong> Services are provided &ldquo;as is&rdquo;. We do not guarantee uninterrupted availability. No refunds are due for downtime, maintenance or project discontinuation.</li>
              <li><strong>Organiser Cancellations:</strong> If an event is cancelled by the Organiser, face value is refunded via EventSafe; the £1 processing fee may remain non-refundable.</li>
              <li>Partial refunds or adjustments may deduct third-party payment costs where permitted by law.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Disputes & Chargebacks</h2>
          <div className="text-sm space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>Raising external chargebacks is unnecessary and a breach of these Terms because EventSafe offers a direct refund route.</li>
              <li>If you raise a bank/card dispute, you may be liable to repay our reasonable administration costs (including third-party dispute charges). We reserve the right to recover such costs through lawful means.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Venue Rules, Blacklisting & Ratio Policies</h2>
          <div className="text-sm space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>Organisers may set lawful admission policies, including single-male ratios, couples/mixed-party rules, or pre-approval.</li>
              <li>Providing false information (e.g., claiming to attend as a couple and arriving alone) may result in cancellation without refund of the £1 processing fee and/or denial of entry.</li>
              <li>Organisers may blacklist specific users; where lawful, reasons may be communicated via EventSafe.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Safety, Conduct & Scores</h2>
          <div className="text-sm space-y-2">
            <p>We operate a safety score (0–1000) to reflect reported behaviour trends:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Minor issues (1–25), Medium (50–150), Serious (200–400+), Ban (admin/venue discretion).</li>
              <li>Reports are assessed fairly. Frivolous or abusive reporting is prohibited.</li>
              <li>Appeals may be available; serious matters may be referred to appropriate authorities.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">QR Admission</h2>
          <p className="text-sm">
            Admission requires a valid QR linked to your account. Duplicate or previously-used codes are invalid. Ensure your device is charged; carry suitable ID if the venue requests it.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Privacy & Data Protection (UK GDPR)</h2>
          <div className="text-sm space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Controller:</strong> EventSafe. Contact: support@eventsafe.id</li>
              <li><strong>Purposes & Bases:</strong> account management (contract), ticketing and payments (contract), safety scoring and venue access control (legitimate interests/consent where required), fraud prevention and security (legitimate interests), legal compliance.</li>
              <li><strong>Data:</strong> account details, contact info, verification status, event history, safety signals, device/usage data, and payment tokens (handled by Stripe).</li>
              <li><strong>Sub-processors:</strong> Stripe (payments), Google/Firebase (hosting, auth, Firestore), Google Maps (geolocation/UX). Each processes data under its own terms and safeguards.</li>
              <li><strong>Verified Identity & Lawful Requests:</strong> We use Stripe (payments) and Stripe Identity (identity verification). We may use verified identity and payment information to protect the platform, pursue unpaid debts, or comply with lawful requests from police, courts or regulators. This information is never shared with other users, hosts or venues.</li>
              <li><strong>International Transfers:</strong> protected via recognised mechanisms (e.g., SCCs) by our providers.</li>
              <li><strong>Retention:</strong> minimum necessary and proportionate; tickets/financial records retained per legal obligations.</li>
              <li><strong>Your Rights:</strong> access, rectification, erasure, restriction, portability, objection; contact us to exercise rights.</li>
              <li><strong>Cookies/Tracking:</strong> used for session security and analytics; see our cookie banner for choices.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Security</h2>
          <p className="text-sm">
            We use industry-standard controls (encrypted transport, access control, audit logs). No system is 100% secure; you must keep credentials confidential and report suspected compromise.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Acceptable Use</h2>
          <p className="text-sm">
            No illegal, abusive or deceptive activity; no attempts to bypass safety, ticketing or QR controls.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Changes to These Terms</h2>
          <p className="text-sm">
            We may update these Terms and pricing; material changes will be notified. Continued use after changes constitutes acceptance.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Liability</h2>
          <p className="text-sm">
            To the fullest extent permitted by law, we exclude indirect/ consequential loss and cap liability to the higher of (a) amounts you paid to us in the 12 months prior to the claim or (b) £100. Nothing limits liability for death/personal injury caused by negligence, fraud, or other liabilities that cannot be limited by law.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Governing Law & Jurisdiction</h2>
          <p className="text-sm">
            England & Wales. Exclusive jurisdiction of the English courts.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Contact</h2>
          <p className="text-sm">
            EventSafe Support — support@eventsafe.id
          </p>
        </section>
      </div>
    </div>
  );
}
