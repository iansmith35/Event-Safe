
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "./logo";

export default function ProfileBadgeGenerator() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Logo className="h-8 w-auto" /> Your Event Pass
                </CardTitle>
                <CardDescription>
                This feature is temporarily unavailable while we perform maintenance.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <p className="text-sm text-muted-foreground">Your event pass and badge generator will be back online shortly. Thank you for your patience.</p>
            </CardContent>
        </Card>
    );
}
