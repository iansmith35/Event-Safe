"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { handleAppealRequest, type HandleAppealRequestOutput } from '@/ai/flows/handle-appeal-request';
import { Loader2, Gavel } from 'lucide-react';

export default function AdminAppealHandler() {
  const [guestId, setGuestId] = useState('guest-003');
  const [reportDetails, setReportDetails] = useState('Report: Guest was running inside the venue, which is against safety policy.');
  const [guestExplanation, setGuestExplanation] = useState('I was not running, I was briskly walking to the restroom as it was an emergency.');
  const [isLoading, setIsLoading] = useState(false);
  const [verdict, setVerdict] = useState<HandleAppealRequestOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setVerdict(null);

    try {
      const result = await handleAppealRequest({ guestId, reportDetails, guestExplanation });
      setVerdict(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI verdict. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Assisted Appeal Handler</CardTitle>
        <CardDescription>Review a guest's appeal with the help of an AI-suggested verdict and reasoning.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="guestId-appeal">Guest ID</Label>
            <Input id="guestId-appeal" value={guestId} onChange={(e) => setGuestId(e.target.value)} placeholder="e.g., guest-003" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reportDetails-appeal">Report Details</Label>
            <Textarea id="reportDetails-appeal" value={reportDetails} onChange={(e) => setReportDetails(e.target.value)} rows={3} placeholder="Details of the report being appealed" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guestExplanation">Guest's Explanation</Label>
            <Textarea id="guestExplanation" value={guestExplanation} onChange={(e) => setGuestExplanation(e.target.value)} rows={3} placeholder="The guest's reason for appealing" />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Gavel className="mr-2 h-4 w-4" />}
            Get AI Verdict
          </Button>
        </form>

        {isLoading && (
            <div className="mt-6 pt-6 border-t flex items-center justify-center">
                <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
                <span className="text-muted-foreground">Handling appeal...</span>
            </div>
        )}

        {verdict && (
          <div className="mt-6 space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold">AI Verdict</h3>
            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
              <div className="flex items-center gap-4">
                <h4 className="font-semibold text-primary">Verdict:</h4>
                <span className={`font-bold text-lg ${verdict.aiVerdict === 'Accept' ? 'text-chart-2' : 'text-destructive'}`}>{verdict.aiVerdict}</span>
              </div>
              <div>
                <h4 className="font-semibold text-primary">Reasoning:</h4>
                <p className="text-sm">{verdict.reasoning}</p>
              </div>
              <div className="flex gap-4 pt-2">
                <Button>Uphold Verdict</Button>
                <Button variant="outline">Override</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
