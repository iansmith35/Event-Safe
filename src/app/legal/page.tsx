
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gavel, ShieldCheck, UserCheck, Gift } from "lucide-react";
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
          <h1 className="text-3xl font-bold">Legal, Safety, and Data Request Information</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            This page outlines our terms, privacy policy, and data handling procedures. These are provided for informational purposes and are subject to review by a qualified legal professional.
          </p>
        </div>

        <section id="terms-of-use" className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">Terms of Use</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>1. Acceptance of Terms:</strong> By creating an account and using the EventSafe platform ("Service"), you agree to be bound by these Terms of Use, our Privacy Policy, and any other policies referenced. This Service is provided as a facilitation tool to enhance safety and accountability at live events.</p>
                <p><strong>2. Eligibility:</strong> You must be at least 18 years of age and have the legal capacity to enter into a binding contract to use this Service. By creating an account, you warrant that you meet these requirements.</p>
                <p><strong>3. User Accounts:</strong> You are responsible for maintaining the confidentiality of your account credentials, including your password and Safe Word. You are responsible for all activities that occur under your account. You agree to notify EventSafe immediately of any unauthorized use of your account.</p>
                <p><strong>4. User Conduct:</strong> You agree to use the Service in a manner that is lawful, respectful, and in accordance with the community standards of the events you attend. EventSafe is not responsible for the conduct of any user, host, or venue. We reserve the right to suspend or terminate accounts that violate our policies or are deemed to pose a risk to the community.</p>
                <p><strong>5. Disclaimers:</strong> The Service is provided on an "as is" and "as available" basis. EventSafe makes no warranties, express or implied, regarding the operation or availability of the Service. We are a facilitation tool and are not a party to any agreement between guests, hosts, or venues. All users are responsible for their own legal and tax compliance.</p>
            </div>
        </section>

        <section id="privacy-policy" className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">Privacy & Data Policy (UK GDPR)</h2>
             <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>1. Data Controller:</strong> EventSafe is the data controller for the personal data collected through the Service.</p>
                <p><strong>2. Data We Collect:</strong> We collect data necessary to provide the Service, including: name, date of birth, email address, biometric data for verification (processed as a secure hash), user-provided photographs, and optional distinguishing mark information. We also process data related to event attendance, reports, and kudos.</p>
                <p><strong>3. Lawful Basis for Processing:</strong> We process your data based on your consent (provided at signup), for the performance of our contract with you (to provide the Service), and for our legitimate interests (fraud prevention, security, and service improvement).</p>
                <p><strong>4. Data Use:</strong> Your data is used to create and manage your account, verify your identity, facilitate entry to events, and operate the reporting and community feedback systems. Anonymized and aggregated data may be used for statistical analysis.</p>
                <p><strong>5. Data Retention & Deletion:</strong> Your personal data is retained for the duration of your account's existence. For fraud prevention and security purposes, an anonymized hash of your biometric data and report history may be retained for up to 12 months after account deletion. For offline verification, staff devices may cache event data securely for the duration of an event, which is automatically purged within 24 hours of the event's conclusion.</p>
                <p><strong>6. Your Rights (Data Subject Access Requests):</strong> Under UK GDPR, you have the right to access, rectify, or erase your personal data. To make a Data Subject Access Request (SAR), please contact <a href="mailto:legal@eventsafe.com" className="text-primary underline">legal@eventsafe.com</a> from the email address associated with your account. We may require further verification to protect your privacy.</p>
            </div>
        </section>

        <section id="data-disclosure" className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">Data Disclosure & Law Enforcement</h2>
            <div className="grid md:grid-cols-2 gap-8 text-sm">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base"><UserCheck /> User-Consent Pathway</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>With your explicit and re-authenticated consent, we can provide your contact information to a verified law enforcement officer associated with a specific case number you have provided. This pathway is designed to be transparent and is entirely controlled by you.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base"><Gavel /> Formal Legal Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>EventSafe will only disclose user data in response to a valid, legally-binding instrument such as a court order or warrant. All requests must be sent from an official, verifiable domain (e.g., '.police.uk'). We will challenge any requests that are overly broad to protect our users' privacy.</p>
                         <p className="font-semibold pt-2">
                            Direct inquiries to: <a href="mailto:legal@eventsafe.com" className="text-primary underline">legal@eventsafe.com</a>
                        </p>
                    </CardContent>
                </Card>
            </div>
             <Card className="border-destructive mt-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive"><ShieldCheck /> Our Commitment</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-destructive/90">
                        We will not release any user data without either explicit user consent or a formal, legally-binding request. The safety and trust of our community is paramount.
                    </p>
                </CardContent>
            </Card>
        </section>

        <section id="promotional-terms" className="space-y-4">
             <h2 className="text-2xl font-semibold border-b pb-2 flex items-center gap-2"><Gift/> Host & Venue Promotional Terms</h2>
             <Card>
                <CardHeader>
                    <CardDescription>A summary of our launch offers for early adopters.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <p>
                    All new host or venue accounts are eligible for a **one-month free trial** to experience the full benefits of the EventSafe platform. To reward our pioneering early adopters, we offer extended free periods for the first venues to sign up:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li>The **first 20 venues** to sign up will receive **6 months free**.</li>
                        <li>The **next 30 venues** to sign up will receive **3 months free**.</li>
                    </ul>
                    <p>
                        <strong>Billing Process:</strong> Your first month is always free. At the start of your second month, your first subscription payment will be taken. For promotional offer recipients, billing will then be suspended for the remainder of your offer period (e.g., 5 months for the 6-month offer) and will resume automatically on a monthly basis thereafter.
                    </p>
                    <p className="text-muted-foreground">
                        The first subscription payment is non-refundable. You may cancel your subscription at any time. These terms are subject to change and are part of the full terms and conditions agreed to upon signup.
                    </p>
                </CardContent>
             </Card>
        </section>
      </div>
    </div>
  );
}
