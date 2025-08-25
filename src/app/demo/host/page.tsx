"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, AlertTriangle, TrendingUp, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export default function HostDemoPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="p-4 flex justify-between items-center border-b">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline">
                        <Link href="/uk"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
                    </Button>
                    <Logo className="w-auto h-8" />
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">Demo data only</Badge>
            </header>

            <main className="flex-1 p-4 md:p-8">
                <div className="container max-w-6xl mx-auto space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Host Dashboard Demo</h1>
                        <p className="text-muted-foreground mt-2">This is a simulated view of what event hosts see when managing their events</p>
                        <Alert className="mt-4 max-w-md mx-auto">
                            <AlertDescription>
                                All data shown is for demonstration purposes only
                            </AlertDescription>
                        </Alert>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-blue-500" />
                                    Active Events
                                </CardTitle>
                                <CardDescription>Events you&apos;re currently managing</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="p-3 border rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold">Tech Meetup Series</h4>
                                            <Badge className="bg-green-100 text-green-800">Live</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">45 attendees • The Innovation Centre</p>
                                        <div className="mt-2">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>Check-ins</span>
                                                <span>38/45</span>
                                            </div>
                                            <Progress value={84} className="h-2" />
                                        </div>
                                    </div>
                                    <div className="p-3 border rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold">Winter Workshop</h4>
                                            <Badge variant="outline">Planning</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">12 registrations • Community Hall</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-purple-500" />
                                    Guest Management
                                </CardTitle>
                                <CardDescription>Attendee verification and safety tools</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">42</div>
                                            <div className="text-xs text-green-600">Verified Guests</div>
                                        </div>
                                        <div className="p-3 bg-yellow-50 rounded-lg">
                                            <div className="text-2xl font-bold text-yellow-600">3</div>
                                            <div className="text-xs text-yellow-600">Pending Review</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h5 className="font-semibold text-sm">Recent Guest Activity</h5>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-3 w-3 text-green-500" />
                                                <span>Guest_127 checked in</span>
                                                <span className="text-muted-foreground text-xs">2m ago</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-3 w-3 text-green-500" />
                                                <span>Guest_089 verified ID</span>
                                                <span className="text-muted-foreground text-xs">5m ago</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-500" />
                                    Event Analytics
                                </CardTitle>
                                <CardDescription>Real-time event insights</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <div className="text-xl font-bold text-blue-600">94%</div>
                                            <div className="text-xs text-blue-600">Attendance Rate</div>
                                        </div>
                                        <div className="p-3 bg-purple-50 rounded-lg">
                                            <div className="text-xl font-bold text-purple-600">940</div>
                                            <div className="text-xs text-purple-600">Safety Score</div>
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-sm mb-2">Safety Metrics</h5>
                                        <div className="text-sm space-y-1">
                                            <div className="flex justify-between">
                                                <span>Incidents</span>
                                                <span className="text-green-600 font-semibold">0</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Reports Filed</span>
                                                <span>2 (resolved)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                AI Safety Assistant
                            </CardTitle>
                            <CardDescription>Get AI-powered insights about your events and attendees</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-muted rounded-lg">
                                <h5 className="font-semibold mb-2">Latest AI Insight</h5>
                                <p className="text-sm text-muted-foreground">
                                    &ldquo;Your event &apos;Tech Meetup Series&apos; has an excellent safety track record. Consider promoting this as a key selling point to attract quality attendees. The 94% attendance rate suggests strong community engagement.&rdquo;
                                </p>
                                <div className="mt-3 text-xs text-muted-foreground">
                                    Generated by EventSafe AI • <Badge variant="outline" className="text-xs">Demo Result</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <p className="text-muted-foreground text-sm">
                            This demo shows powerful tools available to EventSafe hosts.
                            <br />
                            Ready to manage safer events?
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/host-signup">Create Your Host Account</Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}