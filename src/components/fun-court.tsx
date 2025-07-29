
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
        complaint: "A Complainant (a host) alleges a Defendant (a venue) failed to provide the agreed-upon number of security staff, leading to gate-crashers.",
        defense: "The Defendant claims the Complainant under-reported the expected number of attendees, and the security provided was adequate for the number agreed upon in the contract.",
        verdict: "The AI Judge determined that while the Defendant met the letter of the contract, industry best practice suggests scaling security with ticket sales. It recommended a future contract clause linking security levels to final attendance numbers. This verdict is for educational purposes and is not legally binding."
    },
    {
        id: 'CASE-002',
        complaint: "A Complainant (a guest) reports that their coat was stolen from a supposedly secure cloakroom.",
        defense: "The Defendant's (the venue) defense is that their policy, printed on the ticket, states they are not liable for lost or stolen items and the guest accepted this risk.",
        verdict: "The AI Judge noted that while the liability waiver holds some weight, a 'secure' cloakroom implies a reasonable duty of care. The verdict suggested the Defendant should offer partial compensation as a gesture of goodwill to maintain its reputation. This verdict is for educational purposes and is not legally binding."
    },
    {
        id: 'CASE-003',
        complaint: "A Complainant (a volunteer) complains they were dismissed from their post mid-event without a clear reason.",
        defense: "The Defendant (the host) claims the Complainant was not following instructions and was creating a negative atmosphere, which is a breach of the volunteer agreement.",
        verdict: "The AI Judge advised that while hosts have the right to manage their teams, feedback should be given clearly before dismissal, unless it's a serious safety issue. It recommended the host provide a specific reason to the volunteer post-event. This verdict is for educational purposes and is not legally binding."
    },
    {
        id: 'CASE-004',
        complaint: "A Complainant (a guest) was removed for violating the 'no phone cameras' rule at a private event.",
        defense: "The Complainant claims they were only checking a message and were not taking photos, arguing the removal was an overreaction by the Defendant (the host).",
        verdict: "The AI Judge ruled in favor of the Defendant. At private events with strict no-camera policies, even the appearance of using a phone can disrupt the safety and privacy of others. The verdict emphasized the importance of respecting house rules. This verdict is for educational purposes and is not legally binding."
    },
    {
        id: 'CASE-005',
        complaint: "A Complainant (a host) was charged an unexpected 'deep cleaning' fee by the Defendant (a venue) after an art event that used glitter.",
        defense: "The Defendant states that the use of 'excessive materials' like glitter requires specialized cleaning, which is covered by a clause in their standard rental agreement.",
        verdict: "The AI Judge found the Defendant's claim to be reasonable but noted the clause was vague. It recommended the venue create a clear schedule of additional fees for specific materials to ensure transparency. This verdict is for educational purposes and is not legally binding."
    },
    {
        id: 'CASE-006',
        complaint: "A Complainant (a DJ) claims the Defendant's (a venue) sound system was faulty and did not meet the technical specifications promised.",
        defense: "The Defendant provided a report from a sound technician from earlier that day showing the equipment was fully functional. They suggest the issue might have been with the DJ's own equipment or software.",
        verdict: "The AI Judge suggested a shared responsibility. The verdict recommended a joint sound check before the next event and a small partial refund of the DJ's fee as a gesture of partnership. This verdict is for educational purposes and is not legally binding."
    },
    {
        id: 'CASE-007',
        complaint: "A Complainant (a guest) with a valid ticket was denied entry because they arrived 10 minutes after the 'last entry' time stated on the event page.",
        defense: "The Defendant (the host) states the 'last entry' time is a strict rule to ensure the safety and flow of the event and to respect attendees who arrived on time.",
        verdict: "The AI Judge upheld the Defendant's decision. The 'last entry' time is a clear and binding condition of the ticket. While unfortunate for the guest, enforcing such rules is critical for event management. This verdict is for educational purposes and is not legally binding."
    },
    {
        id: 'CASE-008',
        complaint: "An Complainant (an event photographer) complains that the Defendant (the host) used their photos in promotional material without credit.",
        defense: "The Defendant's contract with the photographer stipulated a flat fee for 'unrestricted use' of all event photos.",
        verdict: "The AI Judge sided with the Defendant, as the contract was clear. However, it added that crediting photographers is a professional courtesy that builds good relationships and recommended the host do so in the future. This verdict is for educational purposes and is not legally binding."
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
                <CardDescription>Anonymized, AI-driven dispute resolution for educational purposes, based on UK law principles. All verdicts are non-binding.</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    );
}

    
