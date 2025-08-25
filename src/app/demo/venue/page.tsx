"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Building, PoundSterling, Calendar, Shield, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export default function VenueDemoPage() {
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
                        <h1 className="text-3xl font-bold">Venue Dashboard Demo</h1>
                        <p className="text-muted-foreground mt-2">This is a simulated view of what venue owners see when managing their space</p>
                        <Alert className="mt-4 max-w-md mx-auto">
                            <AlertDescription>
                                All data shown is for demonstration purposes only
                            </AlertDescription>
                        </Alert>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Total Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">£12,450</div>
                                <p className="text-sm text-muted-foreground">This month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Events Hosted</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">28</div>
                                <p className="text-sm text-muted-foreground">This month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Safety Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-600">980/1000</div>
                                <p className="text-sm text-muted-foreground">Excellent rating</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Unique Guests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">342</div>
                                <p className="text-sm text-muted-foreground">All time</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Upcoming Events
                                </CardTitle>
                                <CardDescription>Events scheduled at your venue</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="p-3 border rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-semibold">Tech Meetup Manchester</h4>
                                                <p className="text-sm text-muted-foreground">Host: DevCommunity_UK</p>
                                                <p className="text-sm text-muted-foreground">Jan 15, 2025 • 7:00 PM</p>
                                            </div>
                                            <Badge className="bg-green-100 text-green-800">45 Registered</Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <CheckCircle className="h-3 w-3 text-green-500" />
                                            <span>All guests verified</span>
                                        </div>
                                    </div>
                                    <div className="p-3 border rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-semibold">Friday Night Mixer</h4>
                                                <p className="text-sm text-muted-foreground">Host: SocialEvents_MCR</p>
                                                <p className="text-sm text-muted-foreground">Jan 17, 2025 • 8:00 PM</p>
                                            </div>
                                            <Badge variant="outline">32 Registered</Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <CheckCircle className="h-3 w-3 text-green-500" />
                                            <span>All guests verified</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-green-500" />
                                    Safety Management
                                </CardTitle>
                                <CardDescription>Real-time safety monitoring and controls</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <div className="text-xl font-bold text-green-600">0</div>
                                            <div className="text-xs text-green-600">Active Incidents</div>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <div className="text-xl font-bold text-blue-600">12</div>
                                            <div className="text-xs text-blue-600">Staff on Duty</div>
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-sm mb-2">Recent Activity</h5>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-3 w-3 text-green-500" />
                                                <span>Guest check-in successful</span>
                                                <span className="text-muted-foreground text-xs">1m ago</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-3 w-3 text-blue-500" />
                                                <span>Staff verified on duty</span>
                                                <span className="text-muted-foreground text-xs">15m ago</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PoundSterling className="h-5 w-5 text-green-500" />
                                    Revenue Insights
                                </CardTitle>
                                <CardDescription>Financial performance and trends</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm">This Month</span>
                                            <span className="font-semibold">£12,450</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Last Month</span>
                                            <span className="font-semibold text-muted-foreground">£10,200</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Growth</span>
                                            <span className="font-semibold text-green-600">+22%</span>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <h5 className="font-semibold text-sm mb-2">Top Performing Events</h5>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span>Tech Meetups</span>
                                                <span className="font-semibold">£4,500</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Social Mixers</span>
                                                <span className="font-semibold">£3,200</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    Venue Profile
                                </CardTitle>
                                <CardDescription>Your venue&apos;s EventSafe status</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">EventSafe Verified</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">Safety protocols active</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">Staff training complete</span>
                                    </div>
                                    <div className="pt-2">
                                        <h5 className="font-semibold text-sm">Venue Rating</h5>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Progress value={98} className="flex-1 h-2" />
                                            <span className="text-sm font-semibold">980/1000</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>AI Venue Insights</CardTitle>
                            <CardDescription>Personalized recommendations for your venue</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-muted rounded-lg">
                                <h5 className="font-semibold mb-2">Weekly AI Report</h5>
                                <p className="text-sm text-muted-foreground">
                                    &ldquo;Your venue consistently attracts high-quality events with excellent safety records. The 22% revenue growth this month correlates with your EventSafe verification. Consider offering EventSafe-exclusive booking slots to premium event hosts.&rdquo;
                                </p>
                                <div className="mt-3 text-xs text-muted-foreground">
                                    Generated by EventSafe AI • <Badge variant="outline" className="text-xs">Demo Result</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <p className="text-muted-foreground text-sm">
                            This demo shows comprehensive tools available to EventSafe venues.
                            <br />
                            Ready to make your venue safer and more profitable?
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/host-signup">Onboard Your Venue</Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}