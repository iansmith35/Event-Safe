'use server';

/**
 * @fileOverview AI flow to determine the current seasonal theme for the app.
 *
 * - getSeasonalTheme - Returns the current theme name.
 * - SeasonalThemeOutput - The return type for the getSeasonalTheme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ThemeEnum = z.enum([
    "default",
    "new-year",
    "valentines",
    "easter",
    "spring",
    "summer",
    "back-to-school",
    "halloween",
    "christmas"
]);

const SeasonalThemeOutputSchema = z.object({
  theme: ThemeEnum.describe("The name of the current seasonal theme."),
});
export type SeasonalThemeOutput = z.infer<typeof SeasonalThemeOutputSchema>;

export async function getSeasonalTheme(): Promise<SeasonalThemeOutput> {
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Badge } from "./ui/badge";
import {
  BarChart,
  BookOpen,
  Briefcase,
  Landmark,
  MinusCircle,
  PlusCircle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Bar, CartesianGrid, XAxis, YAxis, BarChart as RechartsBarChart } from "recharts";
import FinancialInsights from "./financial-insights";

// Mock data simulating data fetched from Firestore and tagged for ESAFE
const financialData = {
  turnover: [
    { source: "Guest Signup Fees", amount: 12500, date: "2024-07-31" },
    { source: "Host Event Fees", amount: 2500, date: "2024-07-31" },
    { source: "Promo Code Sales", amount: 500, date: "2024-07-31" },
  ],
  expenses: [
    { item: "Cloud Server Costs", amount: 1500, category: "IT & Software" },
    { item: "Stripe Processing Fees", amount: 450, category: "Bank, credit card and other financial charges" },
    { item: "AI API Usage (Genkit)", amount: 800, category: "IT & Software" },
    { item: "Legal Consultation", amount: 1200, category: "Professional fees" },
  ]
};

export default function FinancialDashboard() {
  // Your component logic...
}

  }
}

const prompt = ai.definePrompt({
  name: 'getSeasonalThemePrompt',
  input: { schema: z.object({ currentDate: z.string() }) },
  output: { schema: SeasonalThemeOutputSchema },
  prompt: `Based on the provided date, determine the appropriate seasonal theme for a web application.

  Date: {{{currentDate}}}

  Here are the possible themes and their corresponding date ranges:
  - "new-year": January 1st to January 15th
  - "valentines": February 1st to February 20th
  - "easter": March 20th to April 25th (variable, based on Easter date)
  - "spring": March 20th to June 20th
  - "summer": June 21st to September 22nd
  - "back-to-school": August 15th to September 15th
  - "halloween": October 15th to November 5th
  - "christmas": December 5th to December 31st

  If the date falls into multiple ranges (e.g., Spring and Easter), prioritize the more specific holiday theme. If no specific theme applies, return "default".
  `,
});

const getSeasonalThemeFlow = ai.defineFlow(
  {
    name: 'getSeasonalThemeFlow',
    inputSchema: z.object({ currentDate: z.string() }),
    outputSchema: SeasonalThemeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
