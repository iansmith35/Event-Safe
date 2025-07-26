'use server';

/**
 * @fileOverview This file implements the Genkit flow for suggesting traffic light status changes based on event reports and historical data.
 *
 * - suggestStatusChange - A function that suggests traffic light status changes for a guest.
 * - SuggestStatusChangeInput - The input type for the suggestStatusChange function.
 * - SuggestStatusChangeOutput - The return type for the suggestStatusChange function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestStatusChangeInputSchema = z.object({
  guestId: z.string().describe('The ID of the guest to suggest a status change for.'),
  eventReports: z.array(z.string()).describe('A list of event reports related to the guest.'),
  historicalData: z.string().optional().describe('Historical data for the guest (optional).'),
});
export type SuggestStatusChangeInput = z.infer<typeof SuggestStatusChangeInputSchema>;

const SuggestStatusChangeOutputSchema = z.object({
  suggestedStatus: z.enum(['Green', 'Amber', 'Red']).describe('The suggested traffic light status.'),
  reason: z.string().describe('The reason for the suggested status change.'),
});
export type SuggestStatusChangeOutput = z.infer<typeof SuggestStatusChangeOutputSchema>;

export async function suggestStatusChange(input: SuggestStatusChangeInput): Promise<SuggestStatusChangeOutput> {
  return suggestStatusChangeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestStatusChangePrompt',
  input: {schema: SuggestStatusChangeInputSchema},
  output: {schema: SuggestStatusChangeOutputSchema},
  prompt: `You are an AI assistant helping administrators manage traffic light statuses for guests at events.

  Based on the provided event reports and historical data, suggest a traffic light status (Green, Amber, or Red) and provide a reason for the suggestion.

  Event Reports:
  {{#each eventReports}}
  - {{{this}}}
  {{/each}}

  {{#if historicalData}}
  Historical Data: {{{historicalData}}}
  {{/if}}

  Consider the severity of the reports, the guest's historical behavior, and any other relevant information to make an informed suggestion.

  Format your response as follows:
  {
  "suggestedStatus": "<Green|Amber|Red>",
  "reason": "<reason for the suggestion>"
  }
  `,
});

const suggestStatusChangeFlow = ai.defineFlow(
  {
    name: 'suggestStatusChangeFlow',
    inputSchema: SuggestStatusChangeInputSchema,
    outputSchema: SuggestStatusChangeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
