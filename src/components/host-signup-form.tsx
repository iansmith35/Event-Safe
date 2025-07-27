
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import Link from 'next/link';

const eventTypes = [
    "Adult (Sex-Positive)",
    "Vanilla (Non-Sexual/General)",
];

export default function HostSignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast({
      title: "Creating Host Account...",
      description: "Please wait while we set up your venue profile.",
    });
    // Simulate backend processing
    setTimeout(() => {
      setIsLoading(false);
       toast({
        title: "Account Created!",
        description: "You can now log in to your host dashboard.",
      });
      // In a real app, you would handle creating the venue, host user,
      // and linking them in Firestore.
    }, 3000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Venue & Host Details</CardTitle>
        <CardDescription>All fields are required to create a secure host profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="host-name">Your Name</Label>
                    <Input id="host-name" placeholder="e.g., Alex Smith" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="host-email">Your Email</Label>
                    <Input id="host-email" type="email" placeholder="host@example.com" required />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="safeWord">Safe Word</Label>
                    <Input id="safeWord" type="text" required placeholder="For account recovery" />
                </div>
            </div>

            <hr className="my-4"/>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="venue-name">Venue Name</Label>
                    <Input id="venue-name" placeholder="e.g., The Safe Space" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="venue-type">Primary Event Classification</Label>
                    <Select required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select event classification..." />
                        </SelectTrigger>
                        <SelectContent>
                            {eventTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

             <div className="space-y-2">
                <Label htmlFor="venue-address">Venue Address</Label>
                <Textarea id="venue-address" required placeholder="123 Safety Lane, Secure City, SC 45678"/>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="venue-proof">Venue Legitimacy</Label>
                    <div className="w-full p-2 border-dashed border-2 rounded-lg flex flex-col items-center justify-center gap-2">
                        <Button asChild variant="outline" className="w-full">
                            <label htmlFor="venue-upload">
                                <Upload className="mr-2" /> Upload License or Listing
                                <input id="venue-upload" type="file" accept="image/*,application/pdf" className="sr-only" />
                            </label>
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Upload proof of legitimacy (e.g., business license, rental agreement). For adult events, this must be a valid license to host sex-positive activities.</p>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="venue-logo">Venue Logo</Label>
                    <div className="w-full p-2 border-dashed border-2 rounded-lg flex flex-col items-center justify-center gap-2">
                        <Button asChild variant="outline" className="w-full">
                            <label htmlFor="logo-upload">
                                <Upload className="mr-2" /> Upload Logo
                                <input id="logo-upload" type="file" accept="image/*" className="sr-only" />
                            </label>
                        </Button>
                    </div>
                     <p className="text-xs text-muted-foreground mt-1">Upload a logo for your venue or event series. This can be used for branding on merchandise.</p>
                </div>
            </div>


            <div className="flex items-start space-x-3 pt-2">
                <Checkbox id="host-consent" required />
                <div className="grid gap-1.5 leading-none">
                <label
                    htmlFor="host-consent"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    I agree to the EventSafe Host <Link href="#" className="underline">terms and conditions</Link>.
                </label>
                <p className="text-sm text-muted-foreground">
                    I understand I am responsible for legal compliance, including venue licensing for adult events, and that EventSafe is a facilitation tool only.
                </p>
                </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Host Account
            </Button>
        </form>
      </CardContent>
    </Card>
  );
}
