
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { CheckCircle, Ban, Scale, Users as UsersIcon, Users, MapPin } from "lucide-react";
import Link from "next/link";
import RebeccaChatbot from "@/components/rebecca-chatbot";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FunCourt from "@/components/fun-court";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

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

const carouselMessages = [
    {
        title: "Stop Bad Actors. Start Great Events.",
        description: "EventSafe is the UK's first unified safety platform for the live events scene. We give hosts the tools to manage risk and guests the confidence to enjoy themselves."
    },
    {
        title: "For Guests: Your Passport to Safer Events.",
        description: "Attend with confidence. Your EventSafe pass shows you respect the community and unlocks access to the best, most secure events in the UK."
    },
    {
        title: "For Hosts: Protect Your Reputation & Attendees.",
        description: "Use powerful AI tools to vet guests, manage reports, and reduce risk. Build a reputation for safe, well-run events that people trust."
    },
     {
        title: "Build the Network. Nominate Your Favourite Venues.",
        description: "Don't see your favorite spot on EventSafe? Nominate them through the app! Help us build a safer event community, one venue at a time."
    },
    {
        title: "For Venues: The New Standard in Safety.",
        description: "Adopt EventSafe to reduce incidents, protect your staff, and attract a higher quality of events and clientele. Become a leader in venue safety."
    },
    {
        title: "Accountability for Everyone.",
        description: "By creating a shared, secure network, we make the entire events ecosystem safer and more transparent for guests, hosts, and venues alike."
    },
    {
        title: "AI-Powered Resolution. Fair & Private.",
        description: "Our unique 'Fun Court' feature helps resolve disputes privately and constructively, using AI to find common ground. See the demo below!"
    },
    {
        title: "Privacy is Paramount. Your Data is Yours.",
        description: "We are a tool for safety, not a data broker. Your identity is protected with pseudonyms and robust privacy controls. We will never share your data without your consent."
    },
    {
        title: "Verified Staff & Volunteers.",
        description: "Hosts can issue temporary, verifiable digital ID cards to their event staff, so you always know who is officially part of the team."
    },
    {
        title: "A Community Built on Trust.",
        description: "Leave kudos for great guests, rate venues, and help us build a community where respect and good behaviour are the norm."
    },
    {
        title: "The Future of Live Events is Here.",
        description: "Join the movement. Whether you're a guest, host, or venue, EventSafe is your partner in creating unforgettable—and safe—experiences."
    }
];


export default function WelcomePage() {
    const autoplayPlugin = useRef(Autoplay({ delay: 8000, stopOnInteraction: true }));
    const testimonialPlugin = useRef(Autoplay({ delay: 10000, stopOnInteraction: true }));
    const { toast } = useToast();

    const handleInterestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Interest Registered!",
            description: "Thank you! We'll keep you updated on new venues and events in your area.",
        });
        (e.target as HTMLFormElement).reset();
    }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 flex justify-between items-center border-b">
         <Logo className="w-auto h-10" />
         <div className="flex items-center gap-2">
            <Button asChild variant="outline">
                <Link href="/">Global Site</Link>
            </Button>
             <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/signup">Sign Up</Link>
            </Button>
         </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="container max-w-6xl space-y-16">
            <div className="text-center">
                <Carousel
                    className="w-full max-w-4xl mx-auto"
                    plugins={[autoplayPlugin.current]}
                    opts={{ loop: true }}
                >
                    <CarouselContent>
                        {carouselMessages.map((msg, index) => (
                             <CarouselItem key={index}>
                                 <div className="space-y-4 py-8">
                                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{msg.title}</h1>
                                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                                        {msg.description}
                                    </p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex"/>
                </Carousel>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Left Column */}
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-8">
                         <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 rounded-full bg-destructive/80 text-white"><Ban className="h-8 w-8" /></div>
                                <div>
                                <CardTitle>Prevent Abuse</CardTitle>
                                    <CardDescription>Stop problem individuals from moving between venues.</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="p-3 rounded-full bg-chart-4/80 text-white"><Scale className="h-8 w-8" /></div>
                                <div>
                                    <CardTitle>Resolve Disputes</CardTitle>
                                    <CardDescription>Handle disagreements fairly and privately with our AI tools.</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="p-3 rounded-full bg-chart-2/80 text-white"><CheckCircle className="h-8 w-8" /></div>
                                <div>
                                <CardTitle>Build Trust</CardTitle>
                                <CardDescription>Create a community built on transparency and respect.</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>

                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <UsersIcon className="w-8 h-8 text-primary" />
                                <span className="text-2xl">For Guests</span>
                            </CardTitle>
                            <CardDescription>
                                Your secure, universal pass to the UK's best events. Attend with confidence, knowing every event is EventSafe verified.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-end">
                            <div className="flex flex-col sm:flex-row gap-4">
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
                                <Button asChild className="flex-1" size="lg" variant="secondary">
                                    <Link href="/host-signup">Onboard Your Venue</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                 {/* Right Column */}
                <div className="flex flex-col gap-8">
                    
                    <Card className="flex flex-col flex-1">
                        <CardHeader>
                            <CardTitle>What Our Community Says</CardTitle>
                            <CardDescription>Real feedback from real users.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex items-center justify-center">
                             <Carousel
                                className="w-full max-w-md mx-auto"
                                plugins={[testimonialPlugin.current]}
                                opts={{ loop: true }}
                            >
                                <CarouselContent>
                                    {testimonials.map((testimonial, index) => (
                                        <CarouselItem key={index} className="md:basis-1/1 lg:basis-1/1">
                                            <div className="p-1 h-full">
                                                <Card className="h-full flex flex-col shadow-none border-0">
                                                    <CardContent className="pt-0 flex-1 flex flex-col justify-center">
                                                        <p className="italic text-center text-lg">"{testimonial.comment}"</p>
                                                        <div className="flex items-center gap-3 pt-4 justify-center mt-4">
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
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="max-w-4xl mx-auto w-full">
                <RebeccaChatbot />
            </div>

             <div className="max-w-6xl mx-auto w-full space-y-12">
                 <div className="text-center mb-4">
                    <h2 className="text-2xl font-semibold flex items-center justify-center gap-2"><MapPin /> Put Your UK Scene on the Map</h2>
                    <p className="text-muted-foreground">Tell us where you are. Help us bring EventSafe to your favorite local venues.</p>
                </div>
                <img 
                    src="https://images.unsplash.com/photo-1529107386315-e42103494675?q=80&w=1200" 
                    alt="UK map with glowing points"
                    className="rounded-lg border max-w-full h-auto mx-auto"
                    data-ai-hint="UK map lights" 
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Register Your Local Interest</CardTitle>
                        <CardDescription>Let us know you want EventSafe in your city.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleInterestSubmit} className="max-w-xl mx-auto text-left space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="city-uk">Your City</Label>
                                <Input id="city-uk" placeholder="e.g., Manchester, Bristol, Glasgow" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email-uk">Your Email</Label>
                                <Input id="email-uk" type="email" placeholder="you@example.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="user-type-uk">I am a...</Label>
                                <Select required name="user-type-uk">
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
                            <Button type="submit" className="w-full">Register Interest</Button>
                        </form>
                    </CardContent>
                </Card>
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

    