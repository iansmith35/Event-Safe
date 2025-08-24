
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gavel, Scale, Loader2 } from "lucide-react";
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { judgeDemoCase, type JudgeDemoCaseOutput } from '@/ai/flows/judge-demo-case';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { FEATURES } from '@/config/features';


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
            
            // Check if this is an AI unavailable response
            if (res.verdict.includes('temporarily unavailable')) {
                toast({
                    title: "AI temporarily unavailable",
                    description: "The Resolution Center will be back online soon!"
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: "Error Judging Case",
                description: "The AI Judge is currently unavailable. Please try again later."
            });
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Scale /> EventSafe Resolution Center</CardTitle>
                <CardDescription>Submit a complaint for a non-binding, educational verdict from our AI Judge, based on UK law principles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="complaint">Describe the situation</Label>
                        <Textarea 
                            id="complaint"
                            value={complaint}
                            onChange={(e) => setComplaint(e.target.value)}
                            placeholder="e.g., The DJ played the wrong genre of music all night..."
                            rows={4}
                            required
                        />
                    </div>
                    <Button type="submit" disabled={isLoading || !FEATURES.judgeEnabled}>
                        {isLoading ? <Loader2 className="animate-spin" /> : <Gavel />}
                        {isLoading ? "Deliberating..." : "Submit to the Judge"}
                    </Button>
                    {!FEATURES.judgeEnabled && (
                        <p className="text-xs text-muted-foreground">Coming soon (AI temporarily unavailable)</p>
                    )}
                </form>

                {result && (
                     <div className="pt-4 border-t space-y-4">
                        <Alert>
                            <Gavel className="h-4 w-4" />
                            <AlertTitle>Judgment Rendered</AlertTitle>
                            <AlertDescription>
                                The following is a non-binding, educational simulation.
                            </AlertDescription>
                        </Alert>
                         <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                             <p className="text-sm">
                                <span className="font-semibold text-primary">Your Complaint:</span> {complaint}
                            </p>
                             <p className="text-sm">
                                <span className="font-semibold text-primary">AI-Simulated Defense:</span> {result.defense}
                            </p>
                            <div className="pt-2">
                                <h5 className="font-semibold text-chart-2">AI Judge's Verdict:</h5>
                                <p className="text-sm text-muted-foreground">
                                   {result.verdict}
                                </p>
                            </div>
                        </div>
                     </div>
                )}
            </CardContent>
        </Card>
    );
}
