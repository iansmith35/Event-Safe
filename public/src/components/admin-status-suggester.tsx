"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { suggestStatusChange, type SuggestStatusChangeOutput } from '@/ai/flows/suggest-status-change';
import { Loader2, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const statusVariantMap: { [key: string]: "default" | "destructive" | "secondary" | "outline" } = {
  'Green': 'default',
  'Amber': 'secondary',
  'Red': 'destructive',
};

export default function AdminStatusSuggester() {
  const [guestId, setGuestId] = useState('guest-002');
  const [eventReports, setEventReports] = useState('- Minor altercation with another guest.');
  const [historicalData, setHistoricalData] = useState('No prior incidents.');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestStatusChangeOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuggestion(null);

    const reportsArray = eventReports.split('\n').filter(r => r.trim() !== '');

    try {
      const result = await suggestStatusChange({ guestId, eventReports: reportsArray, historicalData });
      setSuggestion(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI suggestion. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Status Change Suggester</CardTitle>
        <CardDescription>Get an AI-powered suggestion for a guest's traffic light status based on reports and history.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="guestId-suggester">Guest ID</Label>
            <Input id="guestId-suggester" value={guestId} onChange={(e) => setGuestId(e.target.value)} placeholder="e.g., guest-002" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventReports-suggester">Event Reports (one per line)</Label>
            <Textarea id="eventReports-suggester" value={eventReports} onChange={(e) => setEventReports(e.target.value)} rows={3} placeholder="Enter each report on a new line" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="historicalData">Historical Data (optional)</Label>
            <Textarea id="historicalData" value={historicalData} onChange={(e) => setHistoricalData(e.target.value)} rows={2} placeholder="Provide relevant historical context" />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
            Get Suggestion
          </Button>
        </form>

        {isLoading && (
            <div className="mt-6 pt-6 border-t flex items-center justify-center">
                <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
                <span className="text-muted-foreground">Generating suggestion...</span>
            </div>
        )}

        {suggestion && (
          <div className="mt-6 space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold">Suggestion Result</h3>
            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
              <div className="flex items-center gap-4">
                <h4 className="font-semibold text-primary">Suggested Status:</h4>
                <Badge variant={statusVariantMap[suggestion.suggestedStatus] || 'default'} className="text-base">
                  {suggestion.suggestedStatus}
                </Badge>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-primary">Reasoning</h4>
                <p className="text-sm">{suggestion.reason}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
