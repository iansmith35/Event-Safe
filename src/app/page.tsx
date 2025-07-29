
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { ShieldCheck, User, Users, CheckCircle, Ban, Scale } from "lucide-react";
import Link from "next/link";
import RebeccaChatbot from "@/components/rebecca-chatbot";


export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 flex justify-between items-center border-b">
         <Logo className="w-auto h-10" />
         <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
                <Link href="/dashboard">Dashboard Demo</Link>
            </Button>
             <Button asChild>
                <Link href="/login">Login</Link>
            </Button>
         </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="container max-w-5xl space-y-16">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Stop Bad Actors. Start Great Events.</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    EventSafe is the UK's first unified safety platform for the live events scene. We give hosts the tools to manage risk and guests the confidence to enjoy events, creating a more accountable community for everyone.
                </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="h-10 w-10 text-chart-2" />
                    <h3 className="text-xl font-semibold">Build Trust</h3>
                    <p className="text-muted-foreground">Verify hosts, staff, and guests to create a community built on transparency and respect.</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Ban className="h-10 w-10 text-destructive" />
                    <h3 className="text-xl font-semibold">Prevent Abuse</h3>
                    <p className="text-muted-foreground">Share anonymized, contextual data to stop problem individuals from moving between venues.</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Scale className="h-10 w-10 text-primary" />
                    <h3 className="text-xl font-semibold">Resolve Disputes</h3>
                    <p className="text-muted-foreground">Use our AI-driven resolution center to handle disagreements fairly and privately.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <User className="w-8 h-8 text-primary" />
                            <span className="text-2xl">For Guests</span>
                        </CardTitle>
                        <CardDescription>
                            Your secure, universal pass to the UK's best events. Attend with confidence, knowing every event is EventSafe verified.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button asChild className="flex-1" size="lg">
                                <Link href="/dashboard?view=guest">Explore Guest Features</Link>
                            </Button>
                            <Button asChild className="flex-1" size="lg" variant="secondary">
                                <Link href="/signup">Create Your Event Pass</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Users className="w-8 h-8 text-primary" />
                            <span className="text-2xl">For Hosts & Venues</span>
                        </CardTitle>
                        <CardDescription>
                           Protect your reputation, staff, and attendees with powerful AI tools to vet guests, manage reports, and reduce risk.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end">
                        <div className="flex flex-col sm:flex-row gap-4">
                             <Button asChild className="flex-1" size="lg">
                                <Link href="/dashboard?view=admin">Explore Admin Tools</Link>
                            </Button>
                            <Button asChild className="flex-1" size="lg" variant="secondary">
                                <Link href="/host-signup">Onboard Your Venue</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="max-w-xl mx-auto w-full">
              <RebeccaChatbot />
            </div>

        </div>
      </main>

      <footer className="p-4 text-center text-xs text-muted-foreground border-t">
          <div className="flex justify-center gap-4">
            <p>&copy; {new Date().getFullYear()} EventSafe. All rights reserved.</p>
            <Link href="/legal" className="underline hover:text-primary">Legal & Data Requests</Link>
          </div>
          <p className="mt-1">EventSafe is a facilitation tool. Users are responsible for their own legal and tax compliance.</p>
      </footer>
    </div>
  );
}
