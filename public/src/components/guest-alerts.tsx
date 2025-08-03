
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellRing } from 'lucide-react';

export default function GuestAlerts() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BellRing /> Guest Alerts</CardTitle>
                <CardDescription>Send real-time or scheduled announcements to all guests checked into your event.</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
                 <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-semibold">Coming Soon: Real-Time Guest Communication</h3>
                    <p className="text-muted-foreground mt-2">
                        This premium feature will allow you to send instant and scheduled push notifications to your attendees. To prevent misuse and cover potential costs, this feature will be available for a small fee of £1/month or £10/year.
                    </p>
                    <Button className="mt-6" disabled>Notify Me</Button>
                </div>
            </CardContent>
        </Card>
    );
}
