
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Globe } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { flags } from "@/lib/flags";
import { useToast } from "@/hooks/use-toast";

import Image from "next/image";
    const { toast } = useToast();

    const handleInterestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const country = formData.get('country') as string;
        const city = formData.get('city') as string;
        const email = formData.get('email') as string;
        const role = formData.get('user-type') as string;
        
        // Create mailto URL with prefilled content
        const subject = encodeURIComponent('EventSafe Global Interest');
        const body = encodeURIComponent(`Country: ${country}\nCity: ${city}\nRole: ${role}\nContact: ${email}\n\nI'm interested in EventSafe expanding to my country.`);
        const mailtoUrl = `mailto:support@eventsafe.id?subject=${subject}&body=${body}`;
        
        // Open email client
        window.location.href = mailtoUrl;
        
        toast({
            title: "Opening email client...",
            description: "We've added you to the list and will notify you when EventSafe is coming to your country.",
        });
    }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 flex flex-col sm:flex-row justify-between items-center border-b gap-4 sm:gap-0">
         <Logo className="w-auto h-10" />
         <div className="flex items-center gap-4">
            <Button asChild variant="outline">
                <Link href="/uk">View UK Site</Link>
            </Button>
             <Button asChild>
                <Link href="/login">Login</Link>
            </Button>
         </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="container max-w-6xl space-y-12 text-center">
            
            <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Help Bring EventSafe to Your Country</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    EventSafe is building a global network for safer events, driven by community demand. Pre-register your interest to help us prioritize your country for our 2026 expansion.
                </p>
            </div>

            <div className="w-full">
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-semibold flex items-center justify-center gap-2"><Globe /> The Global EventSafe Network</h2>
                    <p className="text-muted-foreground">Our live network is growing in the UK. International expansion starts in 2026.</p>
                </div>
                 <Image
                    src="https://images.unsplash.com/photo-1572455024142-3db3115a76b5?q=80&w=1200" 
                    alt="World map with glowing points" 
                    width={1200}
                    height={600}
                    className="rounded-lg border max-w-full h-auto mx-auto" 
                    data-ai-hint="world map lights" 
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Register Your Interest</CardTitle>
                    <CardDescription>Let us know you want EventSafe. No commitment required.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleInterestSubmit} className="max-w-xl mx-auto text-left space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="country">Your Country</Label>
                                <Input id="country" name="country" placeholder="e.g., Germany" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">Your City</Label>
                                <Input id="city" name="city" placeholder="e.g., Berlin" required />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Your Email</Label>
                            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="user-type">I am a...</Label>
                            <Select required name="user-type">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your role..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="guest">Guest</SelectItem>
                                    <SelectItem value="host">Event Host</SelectItem>
                                    <SelectItem value="venue">Venue Owner</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="w-full">Notify Me When You Launch</Button>
                    </form>
                </CardContent>
            </Card>

            {flags.showDemoLinks && (
                <Card>
                    <CardHeader>
                        <CardTitle>Try Our Demos</CardTitle>
                        <CardDescription>Explore how EventSafe works for different user types</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild variant="outline">
                                <Link href="/demo/guest">Guest Demo</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/demo/venue">Venue Demo</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/demo/host">Host Demo</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

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
