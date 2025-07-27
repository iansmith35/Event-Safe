
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { Download, Apple, Wallet, Ticket, ShieldCheck, ThumbsUp, Star, Heart, Siren, Search, Lightbulb } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import SocialFeed from "./social-feed";
import SuggestionBox from "./suggestion-box";
import { Switch } from "./ui/switch";


type Status = 'Green' | 'Amber' | 'Red';

const statusConfig = {
  Green: {
    color: 'bg-chart-2',
    label: 'Green',
    description: 'All clear. You have a good standing.',
  },
  Amber: {
    color: 'bg-chart-4',
    label: 'Amber',
    description: 'Caution. There are some reports on your profile.',
  },
  Red: {
    color: 'bg-destructive',
    label: 'Red',
    description: 'Blocked. You are not permitted entry.',
  },
};

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

export default function GuestView() {
  const [status] = useState<Status>('Green');
  const currentStatus = statusConfig[status];
  const isAppealDisabled = status === 'Green';

  return (
    <div className="grid gap-8 md:grid-cols-3 noselect">
      {/* Left Column */}
      <div className="md:col-span-1 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 pt-2">
            <div className="relative flex items-center justify-center w-40 h-40">
              <div className="absolute w-full h-full rounded-full bg-muted/50 animate-pulse"></div>
              <div className={`w-36 h-36 rounded-full flex items-center justify-center shadow-lg ${currentStatus.color}`}>
                <span className="text-4xl font-bold text-white drop-shadow-md">{currentStatus.label}</span>
              </div>
            </div>
            <p className="text-center text-muted-foreground px-4">{currentStatus.description}</p>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive"><Siren /> Silent SOS</CardTitle>
            <CardDescription>Discreetly alert staff to an urgent issue.</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-4">Only use this in a genuine emergency. Misuse will result in a red status.</p>
            <Button variant="destructive" className="w-full">Request Assistance</Button>
          </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="@guest" data-ai-hint="profile picture" />
                        <AvatarFallback>G</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold text-lg">AgentIndigo</p>
                        <p className="text-sm text-muted-foreground">ESG-928301</p>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <SocialFeed />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb /> Premium Feature: Icebreaker</CardTitle>
            <CardDescription>Find and connect with other guests at an event.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <Label htmlFor="icebreaker-toggle" className="font-bold">
                    Enable Icebreaker
                </Label>
                <Switch id="icebreaker-toggle" defaultChecked />
            </div>
            <p className="text-xs text-muted-foreground">
              Opt-in to use our geofenced facial matching feature. To prevent spam, you can send two messages which cannot be replied to. A third attempt to message without a reply will block you for 24 hours. Misuse will be flagged.
            </p>
          </CardContent>
        </Card>

        <SuggestionBox />

      </div>

      {/* Right Column */}
      <div className="md:col-span-2 space-y-8">
        <Card>
          <CardHeader>
              <CardTitle>Your Event Pass</CardTitle>
              <CardDescription>Present this QR code for scanning at venue entry.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-center gap-6 p-10">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <Image
                src="https://placehold.co/250x250.png"
                alt="QR Code"
                width={250}
                height={250}
                className="rounded-md"
                data-ai-hint="qr code"
              />
            </div>
            <div className="flex flex-col gap-3">
                <Button>
                    <Download className="mr-2" /> Download Pass
                </Button>
                 <Button variant="outline">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6,5.21c.59-.58,1.55-.58,2.14,0l3.12,3.12c.59,.58,.59,1.54,0,2.12s-1.55,.58-2.14,0l-3.12-3.12c-.59-.58-.59-1.54,0-2.12m-11.47,4.23l-3.12,3.12c-.59,.58-.59,1.54,0,2.12s1.55,.58,2.14,0l3.12-3.12c.59-.58,.59-1.54,0-2.12s-1.55-.58-2.14,0m7.29-1.42l-7.79,7.79c-.59,.58-1.55,.58-2.14,0s-.59-1.54,0-2.12l7.79-7.79c.59-.58,1.55-.58,2.14,0s.59,1.54,0,2.12m2.84-2.83l-7.79,7.79c-.59,.58-1.55,.58-2.14,0s-.59-1.54,0-2.12l7.79-7.79c.59-.58,1.55,.58,2.14,0s.59,1.54,0-2.12M18.05,2.37l-3.12,3.12c-.59,.58-.59,1.54,0,2.12s1.55,.58,2.14,0l3.12-3.12c.59-.58,.59,1.54,0-2.12s-1.55-.58-2.14,0m-14.16,7.05c-.59-.58-1.55-.58-2.14,0s-.59,1.54,0,2.12l7.79,7.79c.59,.58,1.55,.58,2.14,0s.59-1.54,0-2.12l-7.79-7.79Z"/></svg>
                    Save to Google Wallet
                </Button>
                <Button variant="outline">
                    <Apple className="mr-2" />
                    Save to Apple Wallet
                </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="history">Event History</TabsTrigger>
            <TabsTrigger value="reports">My Reports</TabsTrigger>
            <TabsTrigger value="kudos">My Kudos</TabsTrigger>
            <TabsTrigger value="ratings" className="flex items-center gap-2"><Star className="h-4 w-4" /> Ratings</TabsTrigger>
            <TabsTrigger value="ticketing" className="flex items-center gap-2"><Ticket className="h-4 w-4" /> Events</TabsTrigger>
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
                    <CardTitle className="flex items-center gap-2"><ThumbsUp className="text-primary"/> Guest Kudos</CardTitle>
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
                    <CardTitle className="flex items-center gap-2"><Star /> Venue & Guest Ratings</CardTitle>
                    <CardDescription>Rate venues you attend and build your reputation in the community.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                    <div className="max-w-md mx-auto">
                        <h3 className="text-xl font-semibold">Coming Soon: Ratings & Analytics</h3>
                        <p className="text-muted-foreground mt-2">Unlock the ability to rate venues and view detailed analytics on your own ratings. This feature enhances community trust and transparency.</p>
                        <Button className="mt-6" disabled>Notify Me</Button>
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ticketing">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Ticket /> Event Discovery</CardTitle>
                    <CardDescription>Find events and see their EventSafe status and rating.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Search by event name, venue, or city..." className="pl-10"/>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                        See an event that isn't on EventSafe? Ask the host why they aren't part of the network.
                    </p>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

    