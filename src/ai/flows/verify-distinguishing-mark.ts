
'use server';

/**
 * @fileOverview AI flow to verify a distinguishing mark using image comparison.
 *
 * - verifyDistinguishingMark - Compares a live photo of a mark against a registered one.
 * - VerifyDistinguishingMarkInput - The input type for the function.
 * - VerifyDistinguishingMarkOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const VerifyDistinguishingMarkInputSchema = z.object({
  registeredMarkUri: z
    .string()
    .describe(
      "The registered photo of the distinguishing mark, as a data URI."
    ),
  liveMarkUri: z
    .string()
    .describe(
      "The new, live photo of the mark taken for verification, as a data URI."
    ),
});
export type VerifyDistinguishingMarkInput = z.infer<typeof VerifyDistinguishingMarkInputSchema>;

export const VerifyDistinguishingMarkOutputSchema = z.object({
  isMatch: z.boolean().describe('Whether the two images are a confident match.'),
  confidenceScore: z.number().min(0).max(100).describe('The confidence score of the match (0-100).'),
  reasoning: z.string().describe('A brief explanation of the AI\'s decision, noting similarities or differences.'),
});
export type VerifyDistinguishingMarkOutput = z.infer<typeof VerifyDistinguishingMarkOutputSchema>;


export async function verifyDistinguishingMark(input: VerifyDistinguishingMarkInput): Promise<VerifyDistinguishingMarkOutput> {
  return verifyMarkFlow(input);
}


const prompt = ai.definePrompt({
    name: 'verifyMarkPrompt',
    input: {schema: VerifyDistinguishingMarkInputSchema},
    output: {schema: VerifyDistinguishingMarkOutputSchema},
    prompt: `You are a forensic image analyst. Your task is to compare two images of a distinguishing mark (like a tattoo or birthmark) and determine if they are a match.

    Pay close attention to shape, size, unique patterns, and any specific details.

    - **Registered Mark:** {{media url=registeredMarkUri}}
    - **Live Verification Mark:** {{media url=liveMarkUri}}

    Analyze the images and determine if they show the exact same mark. Provide a confidence score and a brief reasoning for your conclusion. For this simulation, assume they are a good match.
    `,
});


const verifyMarkFlow = ai.defineFlow(
  {
    name: 'verifyMarkFlow',
    inputSchema: VerifyDistinguishingMarkInputSchema,
    outputSchema: VerifyDistinguishingMarkOutputSchema,
  },
  async (input) => {
    // In a real scenario, this flow would use a vision model to compare the two images.
    // For this demo, we'll simulate a positive match based on the prompt.
    const {output} = await prompt(input);
    return output!;
  }
);
