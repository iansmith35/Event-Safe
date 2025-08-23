"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, UserCheck, Video, X, Camera, Loader2, ShieldCheck, Upload } from 'lucide-react';
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { verifyDistinguishingMark, VerifyDistinguishingMarkOutput } from '@/ai/flows/verify-distinguishing-mark';
import { Separator } from './ui/separator';
import StripeIdentityVerification from './stripe-identity-verification';

// In a real app, this would be fetched from your database
const flaggedCases = [
    {
        id: 'flag-001',
        newGuest: {
            name: 'NewGuest123',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
            photoHint: 'man portrait',
            dob: '1990-05-15',
        },
        matchedUser: {
            name: 'ShadowBanned',
            status: 'Banned',
            photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400',
            photoHint: 'man face',
        },
        reason: "Biometric match (92%) to a previously banned user.",
        status: 'pending',
        distinguishingMark: {
            description: "Eagle tattoo on left forearm",
            location: "Left Forearm",
            registeredUri: "https://images.unsplash.com/photo-1588132506884-368e2c702d33?q=80&w=400"
        }
    }
];


export default function AdminVerificationHandler() {
    const [cases, setCases] = useState(flaggedCases);
    const { toast } = useToast();
    const [liveMarkUri, setLiveMarkUri] = useState<string | null>(null);
    const [verificationResult, setVerificationResult] = useState<VerifyDistinguishingMarkOutput | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    
    const handleDecision = (caseId: string, decision: 'approved' | 'rejected') => {
        setCases(cases.filter(c => c.id !== caseId));
        toast({
            title: `Case ${decision}`,
            description: `The guest signup has been ${decision}. This action has been logged for review.`,
        });
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setLiveMarkUri(dataUrl);
            setVerificationResult(null); // Reset previous result
          };
          reader.readAsDataURL(file);
        }
      };

    const handleMarkVerification = async (registeredMarkUri: string) => {
        if (!liveMarkUri) {
            toast({ variant: 'destructive', title: "No live photo provided."});
            return;
        }
        setIsVerifying(true);
        setVerificationResult(null);
        try {
            const result = await verifyDistinguishingMark({ registeredMarkUri, liveMarkUri });
            setVerificationResult(result);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: "Verification Failed", description: "Could not get AI analysis."});
        } finally {
            setIsVerifying(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manual Verification Queue</CardTitle>
                <CardDescription>Review new guest signups that have been automatically flagged as potential duplicates or policy violations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {cases.length > 0 ? cases.map((caseItem) => (
  <div key={caseItem.id} className="p-4 border rounded-lg space-y-4">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-semibold">Case ID: {caseItem.id}</h4>
        <p className="text-sm text-destructive font-semibold">{caseItem.reason}</p>
      </div>
      <Badge variant="secondary">{caseItem.status.toUpperCase()}</Badge>
    </div>

                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h5 className="font-semibold text-sm text-center">New Signup</h5>
                                <div className="p-2 border rounded-md bg-muted/30 text-center">
<Image
  src={caseItem.newGuest.photo}
  alt={caseItem.newGuest.name}
  width={150}
  height={150}
  className="w-32 h-32 object-cover rounded-full mx-auto mb-2"
  data-ai-hint={caseItem.newGuest.photoHint}
/>
<p className="font-bold">{caseItem.newGuest.name}</p>
<p className="text-xs text-muted-foreground">DOB: {caseItem.newGuest.dob}</p>

                                </div>
                            </div>
                             <div className="space-y-2">
                                <h5 className="font-semibold text-sm text-center">Matched User</h5>
                                 <div className="p-2 border rounded-md bg-muted/30 text-center">
<Image
  src={caseItem.newGuest.photo}
  alt={caseItem.newGuest.name}
  width={150}
  height={150}
  className="w-32 h-32 object-cover rounded-full mx-auto mb-2"
  data-ai-hint={caseItem.newGuest.photoHint}
/>
<p className="font-bold">{caseItem.newGuest.name}</p>
<p className="text-xs text-muted-foreground">DOB: {caseItem.newGuest.dob}</p>

                                </div>
                            </div>
                        </div>

                        <Separator />
                        
<StripeIdentityVerification caseId={caseItem.id} guestName={caseItem.newGuest.name} />


                        <Separator />

                        {/* Distinguishing Mark Verification Section */}
                        <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2"><ShieldCheck className="text-primary" /> Distinguishing Mark Verification</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                <div className="space-y-2">
                                    <h5 className="font-semibold text-sm text-center">Registered Mark</h5>
                                    <div className="p-2 border rounded-md bg-muted/30 text-center">
<Image
  src={caseItem.distinguishingMark.registeredUri}
  alt={caseItem.distinguishingMark.description}
  width={150}
  height={150}
  className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
  data-ai-hint="tattoo eagle"
/>
<p className="font-bold">{caseItem.distinguishingMark.description}</p>
<p className="text-xs text-muted-foreground">{caseItem.distinguishingMark.location}</p>

                                    </div>
                                </div>
                                <div className="space-y-2">
                                     <h5 className="font-semibold text-sm text-center">Live Capture</h5>
                                     <div className="p-2 border-dashed border-2 rounded-lg text-center h-full flex flex-col justify-center">
                                        {liveMarkUri ? (
                                             <Image src={liveMarkUri} alt="Live mark capture" width={150} height={150} className="w-32 h-32 object-cover rounded-lg mx-auto mb-2" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-muted-foreground py-8">
                                                <Camera className="h-8 w-8 mb-2" />
                                                <span className="text-sm">Capture live photo</span>
                                            </div>
                                        )}
                                        <Button asChild variant="outline" size="sm" className="w-full">
<label htmlFor={`upload-${caseItem.id}`}><Upload className="mr-2" /> Upload Live Photo</label>
</Button>
<input id={`upload-${caseItem.id}`} type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />

                                     </div>
                                </div>
                            </div>

<Button onClick={() => handleMarkVerification(caseItem.distinguishingMark.registeredUri)} disabled={!liveMarkUri || isVerifying}>

                                {isVerifying ? <Loader2 className="animate-spin" /> : <ShieldCheck />} Verify Mark with AI
                            </Button>

                            {verificationResult && (
                                <Alert variant={verificationResult.isMatch ? 'default' : 'destructive'}>
                                    <ShieldCheck className="h-4 w-4" />
                                    <AlertTitle>AI Verification Result</AlertTitle>
                                    <AlertDescription>
                                        <p><strong>Match:</strong> {verificationResult.isMatch ? `Yes (${verificationResult.confidenceScore}%)` : 'No'}</p>
                                        <p><strong>AI Analyst Reasoning:</strong> {verificationResult.reasoning}</p>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <Separator />

                        <div className="flex flex-wrap gap-2 justify-end pt-4 border-t">
<Button variant="destructive" onClick={() => handleDecision(caseItem.id, 'rejected')}><X /> Reject Signup</Button>
<Button className="bg-chart-2 hover:bg-chart-2/90" onClick={() => handleDecision(caseItem.id, 'approved')}><Check /> Approve Signup</Button>

                        </div>
                     </div>
                )) : (
                    <Alert>
                        <UserCheck className="h-4 w-4" />
                        <AlertTitle>All Clear!</AlertTitle>
                        <AlertDescription>
                            There are no flagged signups in the verification queue.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
