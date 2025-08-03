
'use server';

/**
 * @fileOverview AI flow to verify if a specific guest is present in an event photo.
 *
 * - verifyGuestInPhoto - Compares a guest's photo to an event photo.
 * - VerifyGuestInPhotoInput - The input type for the function.
 * - VerifyGuestInPhotoOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const VerifyGuestInPhotoInputSchema = z.object({
  guestProfilePhotoUri: z
    .string()
    .describe(
      "The guest's registered profile photo, as a data URI."
    ),
  eventPhotoUri: z
    .string()
    .describe(
      "The event photo to check, as a data URI."
    ),
});
export type VerifyGuestInPhotoInput = z.infer<typeof VerifyGuestInPhotoInputSchema>;

export const VerifyGuestInPhotoOutputSchema = z.object({
  isMatch: z.boolean().describe('Whether the guest is confidently identified in the event photo.'),
  reasoning: z.string().describe('A brief explanation of the AI\'s decision.'),
});
export type VerifyGuestInPhotoOutput = z.infer<typeof VerifyGuestInPhotoOutputSchema>;


export async function verifyGuestInPhoto(input: VerifyGuestInPhotoInput): Promise<VerifyGuestInPhotoOutput> {
  return verifyGuestFlow(input);
}


const prompt = ai.definePrompt({
    name: 'verifyGuestInPhotoPrompt',
    input: {schema: VerifyGuestInPhotoInputSchema},
    output: {schema: VerifyGuestInPhotoOutputSchema},
    prompt: `You are an AI security expert specializing in facial recognition. Your task is to determine if the person in the guest profile photo is also present in the event photo.

    Analyze the two photos provided.

    - **Guest Profile Photo:** {{media url=guestProfilePhotoUri}}
    - **Event Photo:** {{media url=eventPhotoUri}}

    Is the person from the Guest Profile Photo clearly visible in the Event Photo? Provide a simple yes/no answer and a brief justification. For this simulation, assume they are a match if a person is visible in both.
    `,
});


const verifyGuestFlow = ai.defineFlow(
  {
    name: 'verifyGuestFlow',
    inputSchema: VerifyGuestInPhotoInputSchema,
    outputSchema: VerifyGuestInPhotoOutputSchema,
  },
  async (input) => {
    // In a real scenario, this flow would use a vision model to compare the two images.
    // For this demo, we'll simulate a positive match based on the prompt.
    const {output} = await prompt(input);
    return output!;
  }
);
