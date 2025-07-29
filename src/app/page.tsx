
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { ShieldCheck, User, Users, CheckCircle, Ban, Scale, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import RebeccaChatbot from "@/components/rebecca-chatbot";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  { name: 'Sarah L.', role: 'Guest', comment: "EventSafe is a game-changer. I finally feel totally secure at events!" },
  { name: 'The Velvet Lounge', role: 'Venue', comment: "Our regulars love the extra layer of safety. It's great for business and peace of mind." },
  { name: 'Mark R.', role: 'Host', comment: "Managing my event team and guest list has never been easier. The AI tools are amazing." },
  { name: 'Jess P.', role: 'Guest', comment: "Can't imagine going to a non-EventSafe venue now. It's the new standard." },
  { name: 'Festival Planners Inc.', role: 'Host', comment: "The reduction in incidents and problem guests has been dramatic. Thank you, EventSafe." },
  { name: 'Tom H.', role: 'Guest', comment: "The fact that staff are verified makes all the difference. More dancing, less worrying." },
  { name: 'Community Hall', role: 'Venue', comment: "We've seen a huge improvement in guest behavior since requiring EventSafe passes." },
  { name: 'Anonymous', role: 'Guest', comment: "This is what the events scene has needed for years. So grateful for this platform." },
];

export default function WelcomePage() {
    const autoplayPlugin = useRef(Autoplay({ delay: 8000, stopOnInteraction: true }));
    const testimonialPlugin = useRef(Autoplay({ delay: 7000, stopOnInteraction: true }));

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
        <div className="container max-w-6xl space-y-16">
            <div className="text-center">
                <Carousel 
                    className="w-full max-w-4xl mx-auto"
                    plugins={[autoplayPlugin.current]}
                    opts={{ loop: true }}
                >
                    <CarouselContent>
                        <CarouselItem>
                             <div className="space-y-4 py-8">
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Stop Bad Actors. Start Great Events.</h1>
                                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                                    EventSafe is the UK's first unified safety platform for the live events scene. We give hosts the tools to manage risk and guests the confidence to enjoy events.
                                </p>
                            </div>
                        </CarouselItem>
                         <CarouselItem>
                            <div className="space-y-4 py-8">
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Accountability for Everyone.</h1>
                                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                                   By creating a shared, secure network for venues, hosts, and guests, we make the entire events ecosystem safer and more transparent.
                                </p>
                            </div>
                        </CarouselItem>
                         <CarouselItem>
                             <div className="space-y-4 py-8">
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Featuring the AI-Powered Resolution Center.</h1>
                                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                                    Fairly and privately resolve disputes with our unique "Fun Court" feature, where AI lawyers argue your case before an impartial AI judge.
                                </p>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex"/>
                </Carousel>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
                 <div className="flex flex-col gap-6">
                     <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                        <div className="p-3 rounded-full bg-destructive text-white"><Ban className="h-8 w-8" /></div>
                        <h3 className="text-xl font-semibold text-center">Prevent Abuse</h3>
                        <p className="text-muted-foreground text-center">Share anonymized, contextual data to stop problem individuals from moving between venues.</p>
                    </div>
                     <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-amber-100 dark:bg-yellow-900/30 border border-amber-200 dark:border-yellow-800">
                        <div className="p-3 rounded-full bg-chart-4 text-white"><Scale className="h-8 w-8" /></div>
                        <h3 className="text-xl font-semibold text-center">Resolve Disputes</h3>
                        <p className="text-muted-foreground text-center">Use our AI-driven resolution center to handle disagreements fairly and privately.</p>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                        <div className="p-3 rounded-full bg-chart-2 text-white"><CheckCircle className="h-8 w-8" /></div>
                        <h3 className="text-xl font-semibold text-center">Build Trust</h3>
                        <p className="text-muted-foreground text-center">Verify hosts, staff, and guests to create a community built on transparency and respect.</p>
                    </div>
                </div>
                <div>
                     <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold tracking-tight">What Our Community Says</h2>
                        <p className="mt-2 text-muted-foreground">Real feedback from real users.</p>
                    </div>
                     <Carousel
                        className="w-full max-w-md mx-auto"
                        plugins={[testimonialPlugin.current]}
                        opts={{ loop: true }}
                    >
                        <CarouselContent>
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-1 h-full">
                                        <Card className="h-full flex flex-col">
                                            <CardContent className="pt-6 flex-1 flex flex-col justify-between">
                                                <p className="italic">"{testimonial.comment}"</p>
                                                <div className="flex items-center gap-3 pt-4 mt-auto">
                                                    <Avatar>
                                                        <AvatarImage src={`https://placehold.co/40x40.png?text=${testimonial.name.charAt(0)}`} />
                                                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold">{testimonial.name}</p>
                                                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                         <CarouselPrevious className="-left-4 hidden md:flex" />
                         <CarouselNext className="-right-4 hidden md:flex"/>
                    </Carousel>
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

    
