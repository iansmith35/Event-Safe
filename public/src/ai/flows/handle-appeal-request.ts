'use server';

/**
 * @fileOverview AI flow to handle appeal requests from guests regarding their traffic light status.
 *
 * - handleAppealRequest - A function that handles the appeal request process.
 * - HandleAppealRequestInput - The input type for the handleAppealRequest function.
 * - HandleAppealRequestOutput - The return type for the handleAppealRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HandleAppealRequestInputSchema = z.object({
  guestId: z.string().describe('The ID of the guest submitting the appeal.'),
  reportDetails: z.string().describe('The details of the report that the guest is appealing.'),
  guestExplanation: z.string().describe('The guest explanation of why the report is unfair.'),
});
export type HandleAppealRequestInput = z.infer<typeof HandleAppealRequestInputSchema>;

const HandleAppealRequestOutputSchema = z.object({
  aiVerdict: z.string().describe('The AI suggested verdict on the appeal request.'),
  reasoning: z.string().describe('The AI reasoning behind the suggested verdict.'),
});
export type HandleAppealRequestOutput = z.infer<typeof HandleAppealRequestOutputSchema>;

export async function handleAppealRequest(input: HandleAppealRequestInput): Promise<HandleAppealRequestOutput> {
  return handleAppealRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'handleAppealRequestPrompt',
  input: {schema: HandleAppealRequestInputSchema},
  output: {schema: HandleAppealRequestOutputSchema},
  prompt: `You are an impartial AI assistant helping to review appeal requests from guests regarding their traffic light status at Event Safe.

You will receive details of the initial report, the guest's explanation for why the report is unfair, and your task is to provide a suggested verdict and your reasoning.

Report Details: {{{reportDetails}}}
Guest Explanation: {{{guestExplanation}}}

Based on these details, provide an AI suggested verdict (Accept or Reject) and explain your reasoning in a concise manner.

Output the AI verdict and the reasoning in the following JSON format:
{
  "aiVerdict": "Accept" | "Reject",
  "reasoning": "Explanation of the verdict"
}
`,
});

const handleAppealRequestFlow = ai.defineFlow(
  {
    name: 'handleAppealRequestFlow',
    inputSchema: HandleAppealRequestInputSchema,
    outputSchema: HandleAppealRequestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
