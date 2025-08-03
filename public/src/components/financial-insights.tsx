
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { analyzeFinancials, AnalyzeFinancialsInput, AnalyzeFinancialsOutput } from '@/ai/flows/analyze-financials';
import { Loader2, Sparkles, AlertTriangle, Lightbulb, Percent } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';
import { Label } from './ui/label';

interface FinancialInsightsProps {
    data: {
        turnover: { source: string; amount: number; date?: string; }[];
        expenses: { item: string; amount: number; category: string; }[];
    }
}

const getProgressColor = (value: number, higherIsBetter = true) => {
    if (higherIsBetter) {
        if (value < 20) return 'bg-destructive';
        if (value < 50) return 'bg-amber-500';
        return 'bg-chart-2';
    }
    // Lower is better
    if (value > 70) return 'bg-destructive';
    if (value > 50) return 'bg-amber-500';
    return 'bg-chart-2';
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
        <CardDescription>Get AI-powered insights and visual gauges to understand your platform's financial health.</CardDescription>
      </CardHeader>
      <CardContent>
        {!analysis && (
            <div className="flex flex-col items-center justify-center text-center p-6 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground mb-4">Press the button to get real-time analysis and visual health gauges.</p>
                <Button onClick={handleAnalysis} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isLoading ? "Analyzing..." : "Get AI Financial Analysis"}
                </Button>
            </div>
        )}

        {analysis && (
          <div className="space-y-6">
            
            <div>
                <h3 className="font-semibold mb-4 text-lg">Financial Health Gauges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Profit Margin</Label>
                        <div className="flex items-center gap-2">
                            <Progress value={analysis.profitMargin} className="h-5" indicatorClassName={getProgressColor(analysis.profitMargin, true)} />
                            <span className="font-bold text-lg">{analysis.profitMargin.toFixed(1)}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">The percentage of turnover that is profit. Higher is better.</p>
                    </div>
                     <div className="space-y-2">
                        <Label>Expense Ratio</Label>
                        <div className="flex items-center gap-2">
                            <Progress value={analysis.expenseRatio} className="h-5" indicatorClassName={getProgressColor(analysis.expenseRatio, false)}/>
                            <span className="font-bold text-lg">{analysis.expenseRatio.toFixed(1)}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">The percentage of turnover spent on expenses. Lower is better.</p>
                    </div>
                     <div className="space-y-2 md:col-span-2">
                        <Label>AI Cost vs. Total Expenses</Label>
                        <div className="flex items-center gap-2">
                            <Progress value={analysis.aiCostPercentage} className="h-5" indicatorClassName={getProgressColor(analysis.aiCostPercentage, false)} />
                             <span className="font-bold text-lg">{analysis.aiCostPercentage.toFixed(1)}%</span>
                        </div>
                         <p className="text-xs text-muted-foreground">The percentage of your total expenses dedicated to AI services.</p>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t">
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
             <Button onClick={handleAnalysis} disabled={isLoading} variant="outline" className="mt-4">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {isLoading ? "Re-analyzing..." : "Run Analysis Again"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
