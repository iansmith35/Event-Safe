
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gavel, Scale, Upload } from "lucide-react";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const demoCases = [
    {
        id: 'CASE-001',
        complaint: "A host alleges a venue failed to provide the agreed-upon number of security staff, leading to gate-crashers.",
        defense: "The venue claims the host under-reported the expected number of attendees, and the security provided was adequate for the number agreed upon in the contract.",
        verdict: "The AI Judge determined that while the venue met the letter of the contract, industry best practice suggests scaling security with ticket sales. It recommended a future contract clause linking security levels to final attendance numbers."
    },
    {
        id: 'CASE-002',
        complaint: "A guest reports that their coat was stolen from a supposedly secure cloakroom.",
        defense: "The venue's defense is that their policy, printed on the ticket, states they are not liable for lost or stolen items and the guest accepted this risk.",
        verdict: "The AI Judge noted that while the liability waiver holds some weight, a 'secure' cloakroom implies a reasonable duty of care. The verdict suggested the venue should offer partial compensation as a gesture of goodwill to maintain its reputation."
    },
    {
        id: 'CASE-003',
        complaint: "A volunteer staff member complains they were dismissed from their post mid-event without a clear reason.",
        defense: "The host claims the volunteer was not following instructions and was creating a negative atmosphere, which is a breach of the volunteer agreement.",
        verdict: "The AI Judge advised that while hosts have the right to manage their teams, feedback should be given clearly before dismissal, unless it's a serious safety issue. It recommended the host provide a specific reason to the volunteer post-event."
    }
];


export default function FunCourt() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Scale /> EventSafe Resolution Center</CardTitle>
                <CardDescription>Anonymized, AI-driven dispute resolution for educational purposes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert variant="destructive">
                    <Gavel className="h-4 w-4" />
                    <AlertTitle>Legal Disclaimer</AlertTitle>
                    <AlertDescription>
                       This feature is for educational and entertainment purposes only and is not legally binding. It does not constitute real legal advice. EventSafe is not a party to any disputes.
                    </AlertDescription>
                </Alert>

                <div className="p-4 border rounded-lg space-y-4">
                    <h4 className="font-semibold text-center">How It Works: Demo Carousel</h4>
                     <Carousel className="w-full max-w-lg mx-auto" opts={{ loop: true }}>
                        <CarouselContent>
                            {demoCases.map((demoCase) => (
                                <CarouselItem key={demoCase.id}>
                                    <div className="p-1">
                                        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                                             <div className="flex justify-between items-center">
                                                <span className="font-mono text-xs">{demoCase.id}</span>
                                                <Badge variant="secondary">Judgment Rendered</Badge>
                                            </div>
                                             <p className="text-sm">
                                                <span className="font-semibold text-primary">Complaint:</span> {demoCase.complaint}
                                            </p>
                                             <p className="text-sm">
                                                <span className="font-semibold text-primary">AI-Simulated Defense:</span> {demoCase.defense}
                                            </p>
                                            <div className="pt-2">
                                                <h5 className="font-semibold text-chart-2">AI Judge's Verdict:</h5>
                                                <p className="text-sm text-muted-foreground">
                                                   {demoCase.verdict}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="-left-4" />
                        <CarouselNext className="-right-4" />
                    </Carousel>
                </div>
               
                <div className="p-4 border rounded-lg space-y-4">
                     <h4 className="font-semibold">Ready to File a Real Case?</h4>
                     <p className="text-sm text-muted-foreground">
                        This premium feature allows a complainant to file a case for £1. The accused party is invited to reply for free. Both sides are represented by an AI lawyer to argue their case based on provided statements and evidence (limited to 2 image uploads). This fee prevents abuse and covers AI processing costs.
                    </p>
                     <div className="flex flex-col sm:flex-row gap-2">
                        <Button disabled className="flex-1">
                            <Gavel /> File a Case (£1)
                        </Button>
                         <Button disabled variant="outline" className="flex-1">
                            <Upload /> Upload Evidence (Images Only)
                        </Button>
                     </div>
                </div>
            </CardContent>
        </Card>
    );
}
