'use server';

/**
 * @fileOverview AI flow to analyze event reports for a guest and provide insights for admins.
 *
 * - analyzeEventReports - Analyzes event reports and provides recommendations.
 * - AnalyzeEventReportsInput - Input type for analyzeEventReports.
 * - AnalyzeEventReportsOutput - Output type for analyzeEventReports.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEventReportsInputSchema = z.object({
  guestId: z.string().describe('The ID of the guest to analyze reports for.'),
  eventReports: z.array(z.string()).describe('Array of event reports related to the guest.'),
});
export type AnalyzeEventReportsInput = z.infer<typeof AnalyzeEventReportsInputSchema>;

const AnalyzeEventReportsOutputSchema = z.object({
  summary: z.string().describe('A summary of the event reports and their implications.'),
  recommendation: z.string().describe('A recommendation for traffic light status change based on the reports.'),
});
export type AnalyzeEventReportsOutput = z.infer<typeof AnalyzeEventReportsOutputSchema>;

export async function analyzeEventReports(input: AnalyzeEventReportsInput): Promise<AnalyzeEventReportsOutput> {
  return analyzeEventReportsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEventReportsPrompt',
  input: {schema: AnalyzeEventReportsInputSchema},
  output: {schema: AnalyzeEventReportsOutputSchema},
  prompt: `You are an AI assistant helping an administrator analyze event reports related to a guest.
  Your task is to provide a summary of the reports and a recommendation for traffic light status change.

  Guest ID: {{{guestId}}}
  Event Reports:
  {{#each eventReports}}
  - {{{this}}}
  {{/each}}

  Based on these reports, provide a concise summary of the events and a clear recommendation for whether to change the guest's traffic light status (Green, Amber, or Red) and why.
  `,
});

const analyzeEventReportsFlow = ai.defineFlow(
  {
    name: 'analyzeEventReportsFlow',
    inputSchema: AnalyzeEventReportsInputSchema,
    outputSchema: AnalyzeEventReportsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
