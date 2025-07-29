
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { ShieldCheck, User, Users, CheckCircle, Ban, Scale, ArrowRight, Heart, Handshake, Lock, Group } from "lucide-react";
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
    const testimonialPlugin = useRef(Autoplay({ delay: 10000, stopOnInteraction: true }));

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
            
            <div className="grid md:grid-cols-2 gap-8 items-start">
                 <div className="flex flex-col gap-6">
                     <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                           <div className="p-3 rounded-full bg-destructive text-white"><Ban className="h-8 w-8" /></div>
                            <div>
                               <CardTitle>Prevent Abuse</CardTitle>
                                <CardDescription>Stop problem individuals from moving between venues.</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 rounded-full bg-chart-4 text-white"><Scale className="h-8 w-8" /></div>
                            <div>
                                <CardTitle>Resolve Disputes</CardTitle>
                                <CardDescription>Handle disagreements fairly and privately with our AI tools.</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 rounded-full bg-chart-2 text-white"><CheckCircle className="h-8 w-8" /></div>
                            <div>
                               <CardTitle>Build Trust</CardTitle>
                               <CardDescription>Create a community built on transparency and respect.</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
                <div className="space-y-8">
                     <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-center">Our Commitment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="flex items-start gap-4">
                                <Lock className="h-8 w-8 text-primary flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Privacy by Design</h3>
                                    <p className="text-sm text-muted-foreground">Your data is yours. We are a facilitation tool, not a data broker. Your privacy is paramount.</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <ShieldCheck className="h-8 w-8 text-primary flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Safety First</h3>
                                    <p className="text-sm text-muted-foreground">We build tools to empower hosts and protect guests, creating a secure environment for everyone.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Handshake className="h-8 w-8 text-primary flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Community Trust</h3>
                                    <p className="text-sm text-muted-foreground">We believe in accountability and transparency to build a better, more respectful events scene.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">What Our Community Says</h2>
                <p className="mt-2 text-muted-foreground">Real feedback from real users.</p>
            </div>
             <Carousel
                className="w-full max-w-4xl mx-auto"
                plugins={[testimonialPlugin.current]}
                opts={{ loop: true }}
            >
                <CarouselContent>
                    {testimonials.map((testimonial, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
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

    
