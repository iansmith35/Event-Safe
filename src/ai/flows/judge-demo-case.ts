'use server';

/**
 * @fileOverview AI flow to simulate a legal judgment for the "Fun Court" feature.
 *
 * - judgeDemoCase - Simulates a defense and verdict for a given complaint.
 * - JudgeDemoCaseInput - Input type for judgeDemoCase.
 * - JudgeDemoCaseOutput - Output type for judgeDemoCase.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JudgeDemoCaseInputSchema = z.object({
  complaint: z.string().describe('The complaint filed by the user.'),
});
export type JudgeDemoCaseInput = z.infer<typeof JudgeDemoCaseInputSchema>;

const JudgeDemoCaseOutputSchema = z.object({
  defense: z.string().describe("A plausible, AI-generated defense from the accused party's perspective."),
  verdict: z.string().describe("The AI Judge's final verdict and educational summary, based on both the complaint and the generated defense."),
});
export type JudgeDemoCaseOutput = z.infer<typeof JudgeDemoCaseOutputSchema>;

export async function judgeDemoCase(input: JudgeDemoCaseInput): Promise<JudgeDemoCaseOutput> {
  return judgeDemoCaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'judgeDemoCasePrompt',
  input: {schema: JudgeDemoCaseInputSchema},
  output: {schema: JudgeDemoCaseOutputSchema},
  prompt: `You are an impartial AI Judge for the 'EventSafe Resolution Center'. This is an educational and entertainment feature, not a real court. Your tone should be professional, fair, and based on principles of UK law and general event management best practices.

  A user has submitted a complaint for a demo case. Your task is to:
  1.  Create a plausible, reasonable 'defense' for the accused party. Do not make the defense silly or obviously wrong; it should represent a valid counter-argument.
  2.  Based on BOTH the user's complaint and the defense you invented, provide a final 'verdict'.
  3.  The verdict should be a balanced summary. It should not just declare a winner, but explain the responsibilities of both parties and provide a constructive, educational recommendation for how to avoid such issues in the future. It must be clear that this is not legally binding.

  **User's Complaint:**
  "{{{complaint}}}"

  Now, generate the defense and the final verdict.
  `,
});

const judgeDemoCaseFlow = ai.defineFlow(
  {
    name: 'judgeDemoCaseFlow',
    inputSchema: JudgeDemoCaseInputSchema,
    outputSchema: JudgeDemoCaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
