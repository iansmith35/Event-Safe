
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { analyzeKudos, type AnalyzeKudosOutput } from '@/ai/flows/analyze-kudos';
import { KudosTagsSchema, type KudosTags } from '@/types/kudos';
import { Loader2, ThumbsUp, PlusCircle, XCircle, BadgeHelp, BadgeCheck, MessageSquare, Smile } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';

interface KudosItem {
  id: number;
  tag: KudosTags;
  comment?: string;
}

const tagIconMap: { [key in KudosTags]: React.ElementType } = {
    'Helpful': BadgeHelp,
    'Respectful': BadgeCheck,
    'Communicative': MessageSquare,
    'Positive': Smile,
}

export default function AdminKudosAnalyzer() {
  const [guestId, setGuestId] = useState('guest-001');
  const [eventReports, setEventReports] = useState('- Guest was seen arguing with staff.');
  const [kudosList, setKudosList] = useState<KudosItem[]>([
      { id: 1, tag: 'Helpful', comment: 'Helped another guest who fell.'},
      { id: 2, tag: 'Respectful', comment: ''},
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeKudosOutput | null>(null);
  const { toast } = useToast();

  const addKudos = () => {
    setKudosList([...kudosList, { id: Date.now(), tag: 'Helpful', comment: '' }]);
  };

  const removeKudos = (id: number) => {
    setKudosList(kudosList.filter(k => k.id !== id));
  };
  
  const updateKudos = (id: number, updatedKudos: Partial<KudosItem>) => {
    setKudosList(kudosList.map(k => k.id === id ? {...k, ...updatedKudos} : k));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAnalysis(null);

    const reportsArray = eventReports.split('\n').filter(r => r.trim() !== '');

    try {
      const result = await analyzeKudos({ 
          guestId, 
          eventReports: reportsArray,
          kudos: kudosList.map(({tag, comment}) => ({tag, comment}))
      });
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
        <CardTitle>AI-Powered Kudos Analysis</CardTitle>
        <CardDescription>Analyze a guest's positive feedback (kudos) against negative reports to get a balanced view.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="guestId-kudos">Guest ID</Label>
            <Input id="guestId-kudos" value={guestId} onChange={(e) => setGuestId(e.target.value)} placeholder="e.g., guest-001" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventReports-kudos">Negative Event Reports (one per line)</Label>
            <Textarea id="eventReports-kudos" value={eventReports} onChange={(e) => setEventReports(e.target.value)} rows={3} placeholder="Enter each report on a new line" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label>Guest Kudos</Label>
                 <Button type="button" variant="outline" size="sm" onClick={addKudos}>
                    <PlusCircle className="mr-2" /> Add Kudos
                </Button>
            </div>
            {kudosList.map((kudos) => {
                 const TagIcon = tagIconMap[kudos.tag];
                 return (
                    <div key={kudos.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                        <Select value={kudos.tag} onValueChange={(value) => updateKudos(kudos.id, { tag: value as KudosTags })}>
                            <SelectTrigger className="w-48">
                                <div className="flex items-center gap-2">
                                     <TagIcon className="h-4 w-4" />
                                    <SelectValue placeholder="Select tag" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {KudosTagsSchema.options.map(tag => {
                                    const Icon = tagIconMap[tag];
                                    return (
                                        <SelectItem key={tag} value={tag}>
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4 text-muted-foreground" /> {tag}
                                            </div>
                                        </SelectItem>
)

                                })}
                            </SelectContent>
                        </Select>
                        <Input 
                            value={kudos.comment} 
                            onChange={(e) => updateKudos(kudos.id, { comment: e.target.value })} 
                            placeholder="Optional comment..."
                            className="flex-1"
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeKudos(kudos.id)}>
                            <XCircle className="text-muted-foreground" />
                        </Button>
                    </div>
                )
            })}
          </div>

          <Button type="submit" disabled={isLoading || kudosList.length === 0}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsUp className="mr-2 h-4 w-4" />}
            Analyze Kudos
          </Button>
        </form>

        {isLoading && (
            <div className="mt-6 pt-6 border-t flex items-center justify-center">
                <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
                <span className="text-muted-foreground">Analyzing kudos...</span>
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
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold text-primary">Positive Impact Score</h4>
                <Progress value={analysis.positiveImpactScore} className="h-4" />
                 <p className="text-sm text-right font-bold">{analysis.positiveImpactScore}%</p>
                <p className="text-xs text-muted-foreground">This score represents how much the kudos mitigates the negative reports.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
