
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { analyzeFinancials, AnalyzeFinancialsInput, AnalyzeFinancialsOutput } from '@/ai/flows/analyze-financials';
import { Loader2, Sparkles, AlertTriangle, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface FinancialInsightsProps {
    data: {
        turnover: { source: string; amount: number; date?: string; }[];
        expenses: { item: string; amount: number; category: string; }[];
    }
}

export default function FinancialInsights({ data }: FinancialInsightsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeFinancialsOutput | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    setIsLoading(true);
    setAnalysis(null);

    const promoUsage = data.turnover.find(t => t.source === 'Promo Code Sales')?.amount || 0;
    
    const input: AnalyzeFinancialsInput = {
        turnover: data.turnover.map(({source, amount}) => ({source, amount})),
        expenses: data.expenses,
        promoCodeUsage: promoUsage,
    };

    try {
      const result = await analyzeFinancials(input);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI financial analysis. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary" /> AI Financial Analyst</CardTitle>
        <CardDescription>Get AI-powered insights into your platform's financial health to identify risks and opportunities.</CardDescription>
      </CardHeader>
      <CardContent>
        {!analysis && (
            <div className="flex flex-col items-center justify-center text-center p-6 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground mb-4">Press the button to get real-time analysis of your finances.</p>
                <Button onClick={handleAnalysis} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isLoading ? "Analyzing..." : "Get AI Financial Analysis"}
                </Button>
            </div>
        )}

        {analysis && (
          <div className="space-y-6">
            <div>
                <h3 className="font-semibold mb-2">AI Summary</h3>
                <p className="text-sm text-muted-foreground">{analysis.summary}</p>
            </div>
            
            {analysis.alerts.length > 0 && (
                <div className="space-y-2">
                    <h3 className="font-semibold">Alerts</h3>
                    {analysis.alerts.map((alert, index) => (
                         <Alert key={index} variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Financial Alert</AlertTitle>
                            <AlertDescription>{alert}</AlertDescription>
                        </Alert>
                    ))}
                </div>
            )}

            {analysis.recommendations.length > 0 && (
                <div className="space-y-2">
                    <h3 className="font-semibold">Recommendations</h3>
                     {analysis.recommendations.map((rec, index) => (
                         <Alert key={index} variant="default">
                            <Lightbulb className="h-4 w-4" />
                            <AlertTitle>Recommendation</AlertTitle>
                            <AlertDescription>{rec}</AlertDescription>
                        </Alert>
                    ))}
                </div>
            )}
             <Button onClick={handleAnalysis} disabled={isLoading} variant="outline">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {isLoading ? "Re-analyzing..." : "Run Analysis Again"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
