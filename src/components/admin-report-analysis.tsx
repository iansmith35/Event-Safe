"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { analyzeEventReports, type AnalyzeEventReportsOutput } from '@/ai/flows/analyze-event-reports';
import { Loader2, Sparkles } from 'lucide-react';

export default function AdminReportAnalysis() {
  const [guestId, setGuestId] = useState('guest-001');
  const [eventReports, setEventReports] = useState('- Guest was seen arguing with staff.\n- Guest appeared intoxicated.');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeEventReportsOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAnalysis(null);

    const reportsArray = eventReports.split('\n').filter(r => r.trim() !== '');

    try {
      const result = await analyzeEventReports({ guestId, eventReports: reportsArray });
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI analysis. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Event Report Analysis</CardTitle>
        <CardDescription>Analyze event reports for a guest and receive an AI-generated summary and recommendation.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="guestId-analysis">Guest ID</Label>
            <Input id="guestId-analysis" value={guestId} onChange={(e) => setGuestId(e.target.value)} placeholder="e.g., guest-001" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventReports">Event Reports (one per line)</Label>
            <Textarea id="eventReports" value={eventReports} onChange={(e) => setEventReports(e.target.value)} rows={5} placeholder="Enter each report on a new line" />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Analyze Reports
          </Button>
        </form>

        {isLoading && (
            <div className="mt-6 pt-6 border-t flex items-center justify-center">
                <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
                <span className="text-muted-foreground">Analyzing reports...</span>
            </div>
        )}

        {analysis && (
          <div className="mt-6 space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold">Analysis Result</h3>
            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
              <div>
                <h4 className="font-semibold text-primary">Summary</h4>
                <p className="text-sm">{analysis.summary}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-primary">Recommendation</h4>
                <p className="text-sm">{analysis.recommendation}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
