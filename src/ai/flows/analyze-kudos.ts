'use server';

/**
 * @fileOverview AI flow to analyze guest kudos and factor them into their overall profile.
 *
 * - analyzeKudos - Analyzes kudos and their impact.
 * - AnalyzeKudosInput - Input type for analyzeKudos.
 * - AnalyzeKudosOutput - Output type for analyzeKudos.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const KudosTagsSchema = z.enum(['Helpful', 'Respectful', 'Communicative', 'Positive']);
export type KudosTags = z.infer<typeof KudosTagsSchema>;

const AnalyzeKudosInputSchema = z.object({
  guestId: z.string().describe('The ID of the guest to analyze kudos for.'),
  kudos: z.array(z.object({
    tag: KudosTagsSchema,
    comment: z.string().optional(),
  })).describe('An array of kudos received by the guest.'),
   eventReports: z.array(z.string()).describe('A list of negative event reports related to the guest.'),
});
export type AnalyzeKudosInput = z.infer<typeof AnalyzeKudosInputSchema>;

const AnalyzeKudosOutputSchema = z.object({
  summary: z.string().describe('A summary of the kudos and their balancing effect on any negative reports.'),
  positiveImpactScore: z.number().min(0).max(100).describe('A score from 0-100 representing the positive influence of the kudos.'),
});
export type AnalyzeKudosOutput = z.infer<typeof AnalyzeKudosOutputSchema>;

export async function analyzeKudos(input: AnalyzeKudosInput): Promise<AnalyzeKudosOutput> {
  return analyzeKudosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeKudosPrompt',
  input: {schema: AnalyzeKudosInputSchema},
  output: {schema: AnalyzeKudosOutputSchema},
  prompt: `You are an AI assistant tasked with analyzing a guest's positive feedback (kudos) to balance against any negative reports.

  Guest ID: {{{guestId}}}
  
  Kudos Received:
  {{#each kudos}}
  - Tag: {{{tag}}}{{#if comment}} - Comment: {{{comment}}}{{/if}}
  {{/each}}

  Negative Event Reports:
  {{#each eventReports}}
  - {{{this}}}
  {{/each}}

  Based on the kudos, provide a summary of the guest's positive behavior.
  Then, calculate a 'Positive Impact Score' (0-100) that quantifies how much the kudos mitigates the negative reports. A higher score means the positive feedback strongly outweighs the negative.
  `,
});

const analyzeKudosFlow = ai.defineFlow(
  {
    name: 'analyzeKudosFlow',
    inputSchema: AnalyzeKudosInputSchema,
    outputSchema: AnalyzeKudosOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
