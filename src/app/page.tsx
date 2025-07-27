
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { ShieldCheck, User, Users } from "lucide-react";
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
        <div className="container max-w-5xl space-y-12">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">The New Standard in Event Safety</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    EventSafe is a unified platform for venues, hosts, and guests to create safer, more transparent, and accountable live events.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <User className="w-8 h-8 text-primary" />
                            <span className="text-2xl">For Guests</span>
                        </CardTitle>
                        <CardDescription>
                            Your secure, universal pass to events. Know who's running the show and feel safer with our traffic light system.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button asChild className="flex-1" size="lg">
                                <Link href="/dashboard?view=guest">Explore Guest Features</Link>
                            </Button>
                            <Button asChild className="flex-1" size="lg" variant="secondary">
                                <Link href="/signup">Create Guest Account</Link>
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
                            Access powerful AI tools to manage staff, handle reports, and build a trusted community around your events.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end">
                        <div className="flex flex-col sm:flex-row gap-4">
                             <Button asChild className="flex-1" size="lg">
                                <Link href="/dashboard?view=admin">Explore Admin Tools</Link>
                            </Button>
                            <Button asChild className="flex-1" size="lg" variant="secondary">
                                <Link href="/host-signup">Create Host Account</Link>
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
          <p>&copy; {new Date().getFullYear()} EventSafe. All rights reserved.</p>
          <p className="mt-1">EventSafe is a facilitation tool. Users are responsible for their own legal and tax compliance.</p>
      </footer>
    </div>
  );
}
