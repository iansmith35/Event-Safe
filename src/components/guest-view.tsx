
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Button } from "./ui/button";
import { Ticket, ShieldCheck, ThumbsUp, Star, Users, Map, MicVocal, Award, UserPlus, RefreshCw, Heart, Search, Bot } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "./ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SocialFeed from "./social-feed";
import SuggestionBox from "./suggestion-box";
import { Separator } from "@/components/ui/separator";
import RebeccaChatbot from "./rebecca-chatbot";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type Status = 'Green' | 'Amber' | 'Red';

const statusConfig = {
  Green: {
    color: 'bg-chart-2',
    label: 'Green',
    score: 950,
  },
  Amber: {
    color: 'bg-chart-4',
    label: 'Amber',
    score: 650,
  },
  Red: {
    color: 'bg-destructive',
    label: 'Red',
    score: 300,
  },
};

const profileVariants = [
    {
        id: 'vanilla-male',
        pseudonym: 'AgentIndigo',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
        photoHint: 'female person',
        type: 'Vanilla'
    },
    {
        id: 'adult-female',
        pseudonym: 'Vixen',
        photo: 'https://images.unsplash.com/photo-1596644230693-bdfc6f50531b?q=80&w=400',
        photoHint: 'woman intense',
        type: 'Adult'
    }
]

const eventHistory = [
  { event: "Summer Fest '24", date: "2024-07-20", status: "Attended" },
  { event: "Tech Con 2024", date: "2024-05-15", status: "Attended" },
  { event: "NYE Gala", date: "2023-12-31", status: "Attended" },
];

const accountReports = [
    { id: "REP-001", date: "2024-07-20", report: "Minor verbal altercation.", status: "Resolved"},
];

const kudosHistory = [
    { id: "KUD-001", date: "2024-07-20", tag: "Helpful", comment: "Helped staff clean up a spill."},
    { id: "KUD-002", date: "2024-05-15", tag: "Respectful", comment: "" },
    { id: "KUD-003", date: "2023-12-31", tag: "Communicative", comment: "Reported a safety concern clearly."}
];

const eventTeam = {
  host: "HostPseudonym",
  venue: "The Velvet Rope",
  volunteers: [
    { id: 'vol-1', pseudonym: 'SafetyFirst', role: 'Safety Officer' },
    { id: 'vol-2', pseudonym: 'GateKeeper', role: 'Door Staff' },
    { id: 'vol-3', pseudonym: 'VibeSetter', role: 'Ambiance' },
  ]
}

export default function GuestView() {
  const [status] = useState<Status>('Green');
  const [activeProfileId, setActiveProfileId] = useState('vanilla-male');
  const isAppealDisabled = status === 'Green';
  const { toast } = useToast();

  const handleKudosSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Feedback Submitted!",
        description: "Thank you! Your positive feedback helps build a better community.",
    });
    (e.target as HTMLFormElement).reset();
  }

  const handleNomination = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('venue-nomination') as HTMLInputElement;
    if (input && input.value) {
        toast({
            title: "Venue Nominated!",
            description: `Thank you for nominating ${input.value}. We'll reach out to them about joining EventSafe.`,
        });
        input.value = '';
    }
  }

  const activeProfile = profileVariants.find(p => p.id === activeProfileId) || profileVariants[0];

  return (
    <div className="grid gap-8 md:grid-cols-3 noselect">
      {/* Left Column */}
      <div className="md:col-span-1 space-y-8">
         <Card>
            <CardHeader>
                <CardTitle>Event Pass</CardTitle>
                <CardDescription>This feature is temporarily unavailable while we perform maintenance or due to connectivity issues.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Your event pass and badge generator will be back online shortly. If you are at an event, please use your distinguishing mark for verification.</p>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><MicVocal /> Host an Event</CardTitle>
                <CardDescription>£5 per event, pay as you go.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full" disabled>Create an Event</Button>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Award /> Join an Event Team</CardTitle>
                <CardDescription>Enter a code from a host/venue to get temporary, role-specific access for an event (e.g., Door Staff, Volunteer).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Label htmlFor="volunteer-code">Event Code</Label>
                <div className="flex gap-2">
                    <Input id="volunteer-code" placeholder="Enter code..."/>
                    <Button>Activate Role</Button>
                </div>
            </CardContent>
        </Card>

        <SocialFeed />

      </div>

      {/* Right Column */}
      <div className="md:col-span-2 space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={activeProfile.photo} alt={activeProfile.pseudonym} data-ai-hint={activeProfile.photoHint} />
                        <AvatarFallback>G</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold text-lg">{activeProfile.pseudonym}</p>
                        <p className="text-sm text-muted-foreground">ESG-928301 (Score: 950)</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><RefreshCw /> Profile Variants</CardTitle>
                <CardDescription>Switch your appearance for different event types. Your core identity and score remain the same.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {profileVariants.map(variant => (
                        <button key={variant.id} onClick={() => setActiveProfileId(variant.id)} className={`p-2 border-2 rounded-lg flex flex-col items-center gap-2 text-center transition-all ${activeProfileId === variant.id ? 'border-primary ring-2 ring-primary' : 'border-transparent hover:border-muted-foreground'}`}>
                             <Image src={variant.photo} alt={variant.pseudonym} width={80} height={80} className="w-20 h-20 object-cover rounded-full" data-ai-hint={variant.photoHint}/>
                             <div className="text-sm">
                                <p className="font-semibold">{variant.pseudonym}</p>
                                <p className="text-xs text-muted-foreground">{variant.type}</p>
                             </div>
                        </button>
                    ))}
                    <button className="p-2 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-center transition-all hover:border-primary hover:text-primary">
                        <UserPlus className="h-10 w-10 text-muted-foreground" />
                        <span className="text-sm font-semibold">Add Variant</span>
                    </button>
                </div>
                <Alert>
                    <ShieldCheck className="h-4 w-4"/>
                    <AlertTitle>Safety Notice</AlertTitle>
                    <AlertDescription>
                        Creating a new variant requires AI-biometric comparison to your master photo to prevent fraud. All reports and ratings are tied to your single, core account.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>

        {activeProfile.type === 'Adult' && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot /> Premium AI Companions</CardTitle>
                    <CardDescription>Enhance your experience with a dedicated AI role-play companion for a monthly subscription of £7.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                     <div className="max-w-md mx-auto">
                        <h3 className="text-xl font-semibold">Coming Soon: Truly Interactive AI Personalities</h3>
                        <p className="text-muted-foreground mt-2">Choose a 'Virtual Partner', 'Virtual Dom', or 'Virtual Submissive'. Give them a name and explore interactions privately and securely. Our AIs are designed for deep immersion, with usage limits that feel like real-life interactions, not technical cut-offs.</p>
                        <Button className="mt-6" disabled>Notify Me</Button>
                    </div>
                </CardContent>
            </Card>
        )}
        
        <Card>
          <CardContent className="pt-6">
            <Separator className="mb-4" />
            <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2"><Users /> Event Team</h3>
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                    <p className="text-sm"><strong>Host:</strong> {eventTeam.host}</p>
                    <p className="text-sm"><strong>Venue:</strong> {eventTeam.venue}</p>
                    <div>
                        <p className="text-sm font-semibold">Verified Volunteers:</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground pl-2">
                            {eventTeam.volunteers.map(v => (
                                <li key={v.id}>{v.pseudonym} ({v.role})</li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-center gap-2 pt-2 text-xs text-chart-2 font-medium">
                        <ShieldCheck className="h-4 w-4" />
                        <span>This event has verified staff/volunteers on record.</span>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="history">Event History</TabsTrigger>
            <TabsTrigger value="reports">My Reports</TabsTrigger>
            <TabsTrigger value="kudos">My Kudos</TabsTrigger>
            <TabsTrigger value="ratings" className="flex items-center gap-2"><Star className="h-4 w-4" /> Ratings</TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2"><Map className="h-4 w-4" /> Event Map</TabsTrigger>
          </TabsList>
          <TabsContent value="history">
            <Card>
                <CardHeader><CardTitle>Event Attendance</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {eventHistory.map((event) => (
                            <TableRow key={event.event}>
                                <TableCell className="font-medium">{event.event}</TableCell>
                                <TableCell>{event.date}</TableCell>
                                <TableCell>{event.status}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports">
             <Card>
                <CardHeader>
                    <CardTitle>Linked Reports</CardTitle>
                    <CardDescription>This is a read-only log of reports linked to your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {accountReports.length > 0 ? (
                         <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Report ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {accountReports.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                                    <TableCell>{r.date}</TableCell>
                                    <TableCell>{r.report}</TableCell>
                                    <TableCell><Badge variant="secondary">{r.status}</Badge></TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">No reports found. Keep it up!</p>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="comment">Submit a Comment</Label>
                        <Textarea id="comment" placeholder="You can submit comments or clarifications here. They will be logged and reviewed." />
                        <p className="text-xs text-muted-foreground">Comments are monitored for tone and manipulation.</p>
                    </div>

                    <div className="flex gap-4">
                        <Button>Submit Comment</Button>
                         <Button variant="destructive" disabled={isAppealDisabled}>
                            Appeal Status
                        </Button>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="kudos">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ThumbsUp className="h-5 w-5" /> My Kudos</CardTitle>
                    <CardDescription>This is a log of positive feedback you've received. Keep up the great work!</CardDescription>
                </CardHeader>
                <CardContent>
                    {kudosHistory.length > 0 ? (
                         <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Praise</TableHead>
                                <TableHead>Comment</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {kudosHistory.map((k) => (
                                <TableRow key={k.id}>
                                    <TableCell>{k.date}</TableCell>
                                    <TableCell><Badge>{k.tag}</Badge></TableCell>
                                    <TableCell>{k.comment || 'No comment'}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">No kudos yet. Be helpful and respectful at events!</p>
                    )}
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ratings">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5" /> Ratings & Analytics</CardTitle>
                    <CardDescription>Rate venues you attend and build your reputation in the community.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                    <div className="max-w-md mx-auto">
                        <h3 className="text-xl font-semibold">Coming Soon: Ratings & Analytics</h3>
                        <p className="text-muted-foreground mt-2">Unlock the ability to rate venues and view detailed analytics on your own ratings. This enhances community trust and transparency.</p>
                        <Button className="mt-6" disabled>Notify Me</Button>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="map">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Map className="h-5 w-5" /> Event Venue Map & Wishlist</CardTitle>
                    <CardDescription>Discover EventSafe venues or nominate your favorite spots to join the network.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <form onSubmit={handleNomination} className="flex gap-2">
                            <Input name="venue-nomination" placeholder="Search for a venue to nominate..." />
                            <Button type="submit"><Search className="mr-2 h-4 w-4" /> Nominate</Button>
                        </form>
                         <p className="text-xs text-muted-foreground mt-2">Help us grow! By nominating venues, you show them their customers want a safer event experience.</p>
                    </div>
                    <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden border">
                         <Image src="https://placehold.co/800x450.png" alt="Map of venues" layout="fill" objectFit="cover" data-ai-hint="map city" />
                         <div className="absolute inset-0 bg-background/30 flex items-center justify-center">
                            <div className="p-4 rounded-lg bg-background/80 backdrop-blur-sm text-center">
                                <h4 className="font-bold">Interactive Map Coming Soon</h4>
                                <p className="text-sm text-muted-foreground">This map will show Verified and Community Suggested venues.</p>
                            </div>
                         </div>
                    </div>
                    <div className="flex justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <span>EventSafe Verified</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                            <span>Community Suggested</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Heart /> Leave a Public Comment</CardTitle>
                <CardDescription>Love using EventSafe? Share your thoughts! Your comment might be featured on our homepage.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleKudosSubmit} className="space-y-4">
                    <Textarea 
                        name="public-kudos"
                        placeholder="e.g., EventSafe is a game-changer for event safety! I feel so much more secure knowing venues are verified."
                        rows={4}
                    />
                    <Button type="submit">Submit Feedback</Button>
                </form>
            </CardContent>
        </Card>

        <RebeccaChatbot />
        <SuggestionBox />

      </div>
    </div>
  );
}
