
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function GlobalPage() {
    const { toast } = useToast();

    const handleInterestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Interest Registered!",
            description: "Thank you! We've added you to the list and will notify you when EventSafe is coming to your country.",
        });
        (e.target as HTMLFormElement).reset();
    }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 flex justify-between items-center border-b">
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

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl"><Globe /> The Global EventSafe Network</CardTitle>
                    <CardDescription>Our live network is growing in the UK. International expansion starts in 2026.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Image src="https://images.unsplash.com/photo-1572455024142-3db3115a76b5?q=80&w=1200" alt="World map with glowing points" width={1200} height={675} className="rounded-lg border" data-ai-hint="world map lights" />
                </CardContent>
            </Card>

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
                                <Input id="country" placeholder="e.g., Germany" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">Your City</Label>
                                <Input id="city" placeholder="e.g., Berlin" required />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Your Email</Label>
                            <Input id="email" type="email" placeholder="you@example.com" required />
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
