"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gavel, Scale, Upload } from "lucide-react";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"

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
    },
    {
        id: 'CASE-004',
        complaint: "A guest was removed for violating the 'no phone cameras' rule at a private event.",
        defense: "The guest claims they were only checking a message and were not taking photos, arguing the removal was an overreaction.",
        verdict: "The AI Judge ruled in favor of the host. At private events with strict no-camera policies, even the appearance of using a phone can disrupt the safety and privacy of others. The verdict emphasized the importance of respecting house rules for the comfort of all guests."
    },
    {
        id: 'CASE-005',
        complaint: "A venue charged a host an unexpected 'deep cleaning' fee after an art event that used glitter.",
        defense: "The venue states that the use of 'excessive materials' like glitter requires specialized cleaning, which is covered by a clause in their standard rental agreement.",
        verdict: "The AI Judge found the venue's claim to be reasonable but noted the clause was vague. It recommended the venue create a clear schedule of additional fees for specific materials (like glitter, smoke machines, etc.) to ensure transparency for future hosts."
    },
    {
        id: 'CASE-006',
        complaint: "A DJ claims the venue's sound system was faulty and did not meet the technical specifications promised.",
        defense: "The venue provided a report from a sound technician from earlier that day showing the equipment was fully functional. They suggest the issue might have been with the DJ's own equipment or software.",
        verdict: "The AI Judge suggested a shared responsibility. While the venue showed due diligence, the issue still impacted the event. The verdict recommended a joint sound check before the next event and a small partial refund of the DJ's fee as a gesture of partnership."
    },
    {
        id: 'CASE-007',
        complaint: "A guest with a valid ticket was denied entry because they arrived 10 minutes after the 'last entry' time stated on the event page.",
        defense: "The host states the 'last entry' time is a strict rule to ensure the safety and flow of the event and to respect attendees who arrived on time.",
        verdict: "The AI Judge upheld the host's decision. The 'last entry' time is a clear and binding condition of the ticket. While unfortunate for the guest, enforcing such rules is critical for event management. No refund was recommended."
    },
    {
        id: 'CASE-008',
        complaint: "An event photographer complains that the host used their photos in promotional material without credit.",
        defense: "The host's contract with the photographer stipulated a flat fee for 'unrestricted use' of all event photos.",
        verdict: "The AI Judge sided with the host, as the contract was clear. However, it added that crediting photographers is a professional courtesy that builds good relationships and recommended the host do so in the future, even if not contractually required."
    }
];


export default function FunCourt() {
    const plugin = useRef(
        Autoplay({ delay: 8000, stopOnInteraction: true })
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Scale /> EventSafe Resolution Center</CardTitle>
                <CardDescription>Anonymized, AI-driven dispute resolution for educational purposes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert variant="destructive">
                    <Gavel className="h-4 w-4" />
                    <AlertTitle>Legal Disclaimer & User Responsibility</AlertTitle>
                    <AlertDescription>
                       This feature is for educational and entertainment purposes only and is **not legally binding**. It does not constitute real legal advice. EventSafe is a neutral facilitator and not a party to any disputes. All case details are anonymized. Users who choose to share case results publicly do so at their own risk and are responsible for any consequences of de-anonymizing themselves or others.
                    </AlertDescription>
                </Alert>

                <div className="p-4 border rounded-lg space-y-4">
                    <h4 className="font-semibold text-center">How It Works: Demo Carousel</h4>
                     <Carousel 
                        className="w-full max-w-lg mx-auto" 
                        plugins={[plugin.current]}
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                        opts={{ loop: true }}
                    >
                        <CarouselContent>
                            {demoCases.map((demoCase) => (
                                <CarouselItem key={demoCase.id}>
                                    <div className="p-1">
                                        <div className="p-4 bg-muted/50 rounded-lg space-y-3 h-[320px] overflow-y-auto">
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
                     <h4 className="font-semibold">Ready to File a Real Case? (Private & Secure)</h4>
                     <p className="text-sm text-muted-foreground">
                        This premium feature allows a complainant to file a case for £1. The accused party is invited to reply for free. Both sides are represented by an AI lawyer to argue their case based on provided statements and evidence (limited to 2 image uploads). This fee prevents abuse and covers AI processing costs. Real cases are completely private and never made public.
                    </p>
                     <div className="flex flex-col sm:flex-row gap-2">
                        <Button disabled className="flex-1">
                            <Gavel /> File a Private Case (£1)
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
