
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gavel, Scale, Loader2, Upload } from "lucide-react";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { judgeDemoCase, type JudgeDemoCaseOutput } from '@/ai/flows/judge-demo-case';

export default function FunCourt() {
    const [complaint, setComplaint] = useState("A host alleges a venue failed to provide the agreed-upon number of security staff, leading to gate-crashers.");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<JudgeDemoCaseOutput | null>(null);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);

        try {
            const res = await judgeDemoCase({ complaint });
            setResult(res);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to get AI judgment. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

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

                <form onSubmit={handleSubmit} className="p-4 border rounded-lg space-y-4">
                    <h4 className="font-semibold">Interactive Demo</h4>
                    <div className="space-y-2">
                        <Label htmlFor="complaint">Enter a sample complaint:</Label>
                        <Textarea 
                            id="complaint" 
                            value={complaint}
                            onChange={(e) => setComplaint(e.target.value)}
                            rows={3}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="evidence-upload">Upload Evidence (Optional)</Label>
                        <Button asChild variant="outline" className="w-full">
                            <label htmlFor="evidence-upload-input">
                                <Upload className="mr-2" /> Upload Photos or Documents
                                <input id="evidence-upload-input" type="file" multiple className="sr-only" />
                            </label>
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            Evidence is used for this case and securely logged against your profile for internal safety review. It is not publicly visible.
                        </p>
                    </div>
                     <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Gavel className="mr-2 h-4 w-4" />}
                        Get Demo Judgment
                    </Button>
                </form>


                {isLoading && (
                    <div className="mt-4 pt-4 border-t flex items-center justify-center">
                        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
                        <span className="text-muted-foreground">The AI Judge is deliberating...</span>
                    </div>
                )}


                {result && (
                     <div className="p-4 border rounded-lg space-y-4 animate-in fade-in-50">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-mono text-xs">Case ID: ES-DEMO-001</span>
                                <Badge variant="secondary">Judgment Rendered</Badge>
                            </div>
                            <p className="text-sm">
                                <span className="font-semibold">Your Complaint:</span> {complaint}
                            </p>
                            <p className="text-sm">
                                <span className="font-semibold">AI-Simulated Defense:</span> {result.defense}
                            </p>
                            <div className="pt-2">
                                <h5 className="font-semibold text-primary">AI Judge's Verdict (Summary):</h5>
                                <p className="text-sm text-muted-foreground">
                                   {result.verdict}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
               
                <p className="text-sm text-muted-foreground pt-4">
                    This premium feature allows a complainant to file a case for £1. The accused party is invited to reply for free. Both sides are represented by an AI lawyer to argue their case based on provided statements.
                </p>

                <Button disabled className="w-full">
                    Coming Soon: File a Case
                </Button>
            </CardContent>
        </Card>
    );
}
