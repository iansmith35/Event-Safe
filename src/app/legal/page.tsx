
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gavel, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="absolute top-4 left-4">
            <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex flex-col items-center mb-6">
          <Logo className="w-auto h-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold text-center">Legal, Safety, and Data Request Information</h1>
          <p className="text-muted-foreground mt-2 text-center max-w-2xl">
            Our policies on data disclosure, law enforcement cooperation, and user consent.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserCheck /> User-Consent Pathway</CardTitle>
                    <CardDescription>For situations where users wish to proactively cooperate.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm">
                        EventSafe provides a mechanism for users to consent to the release of their own data to verified third parties, including law enforcement, in the event of a dispute or investigation.
                    </p>
                    <p className="text-sm">
                        A user who has filed a police report can notify us through their dashboard. We may then, with their explicit and re-authenticated consent, provide their contact information to the verified officer associated with their case number.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        This pathway is designed to be fast and transparent, but relies entirely on user consent. EventSafe does not compel any user to share their data through this method. If a user does not consent, the formal legal process must be followed.
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Gavel /> Formal Law Enforcement & Data Requests</CardTitle>
                    <CardDescription>Our process for handling official legal and data subject access requests.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm">
                        EventSafe is committed to user privacy and will only disclose user data when required by law, such as through a Data Subject Access Request (SAR) or a valid court order.
                    </p>
                    <p className="text-sm">
                       All official requests for user data must be directed to our legal department. Requests from law enforcement must be accompanied by a valid court order, warrant, or other legally-binding instrument.
                    </p>
                     <p className="text-sm">
                        Requests must be sent from an official, verifiable email domain (e.g., '.police.uk' for law enforcement). We will not respond to requests from public email providers (e.g., gmail.com). Where legally permissible for requests that are manifestly unfounded, excessive, or for further copies of data already provided, a reasonable administrative fee may be charged to cover processing costs.
                    </p>
                     <p className="font-semibold text-sm">
                        Please direct all inquiries to: <a href="mailto:legal@eventsafe.com" className="text-primary underline">legal@eventsafe.com</a>
                    </p>
                </CardContent>
            </Card>
        </div>

        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive"><ShieldCheck /> Our Commitment to Data Protection</CardTitle>
            </Header>
            <CardContent>
                <p className="text-sm text-destructive/90">
                    We will not release any user data without either explicit, verified user consent or a formal, legally-binding request. We will challenge any requests that are overly broad or do not adhere to the correct legal procedures to protect our users' privacy. The safety and trust of our community is paramount.
                </p>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
