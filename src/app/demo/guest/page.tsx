"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MapPin, Calendar, Users, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function GuestDemoPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="p-4 flex justify-between items-center border-b">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline">
                        <Link href="/uk"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
                    </Button>
                    <Logo className="w-auto h-8" />
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">DEMO MODE</Badge>
            </header>

            <main className="flex-1 p-4 md:p-8">
                <div className="container max-w-4xl mx-auto space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Guest Dashboard Demo</h1>
                        <p className="text-muted-foreground mt-2">This is a simulated view of what guests see when using EventSafe</p>
                        <Alert className="mt-4 max-w-md mx-auto">
                            <AlertDescription>
                                All data shown is for demonstration purposes only
                            </AlertDescription>
                        </Alert>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-green-500" />
                                    Your Safety Score
                                </CardTitle>
                                <CardDescription>Your community standing and verification status</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span>Safety Score</span>
                                        <Badge variant="default" className="bg-green-500 text-white">Excellent (4.8/5)</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Events Attended</span>
                                        <span className="font-semibold">23</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Kudos Received</span>
                                        <span className="font-semibold">18</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">ID Verified</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Upcoming Events
                                </CardTitle>
                                <CardDescription>Events you&apos;re planning to attend</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="p-3 border rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold">Tech Meetup Manchester</h4>
                                                <p className="text-sm text-muted-foreground">Jan 15, 2025 • 7:00 PM</p>
                                                <p className="text-sm text-muted-foreground">The Innovation Centre</p>
                                            </div>
                                            <Badge variant="secondary">Registered</Badge>
                                        </div>
                                    </div>
                                    <div className="p-3 border rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold">Winter Music Festival</h4>
                                                <p className="text-sm text-muted-foreground">Jan 22, 2025 • 8:00 PM</p>
                                                <p className="text-sm text-muted-foreground">Brighton Warehouse</p>
                                            </div>
                                            <Badge variant="outline">Interested</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Nearby Venues
                                </CardTitle>
                                <CardDescription>EventSafe verified venues in your area</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-2 border rounded">
                                        <div>
                                            <h4 className="font-medium">The Basement Club</h4>
                                            <p className="text-xs text-muted-foreground">0.3 miles away</p>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                                    </div>
                                    <div className="flex justify-between items-center p-2 border rounded">
                                        <div>
                                            <h4 className="font-medium">Rooftop Lounge</h4>
                                            <p className="text-xs text-muted-foreground">0.7 miles away</p>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Recent Activity
                                </CardTitle>
                                <CardDescription>Your recent EventSafe interactions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Checked into &ldquo;Friday Night Mixer&rdquo;</span>
                                        <span className="text-muted-foreground text-xs">2 days ago</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-blue-500" />
                                        <span>Received kudos from Sarah_M</span>
                                        <span className="text-muted-foreground text-xs">3 days ago</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Profile verified successfully</span>
                                        <span className="text-muted-foreground text-xs">1 week ago</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="text-center">
                        <p className="text-muted-foreground text-sm">
                            This demo shows typical features available to EventSafe guests.
                            <br />
                            Ready to get started?
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/signup">Create Your Real Account</Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}