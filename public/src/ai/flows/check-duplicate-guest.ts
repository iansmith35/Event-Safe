'use server';

/**
 * @fileOverview AI flow to check for duplicate guest signups.
 *
 * - checkDuplicateGuest - A function that checks for duplicate guests.
 * - CheckDuplicateGuestInput - The input type for the checkDuplicateGuest function.
 * - CheckDuplicateGuestOutput - The return type for the checkDuplicateGuest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckDuplicateGuestInputSchema = z.object({
  selfieDataUri: z
    .string()
    .describe(
      "A photo of the guest, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  dob: z.string().describe("The guest's date of birth in ISO format."),
});
export type CheckDuplicateGuestInput = z.infer<typeof CheckDuplicateGuestInputSchema>;

const CheckDuplicateGuestOutputSchema = z.object({
  isPotentialDuplicate: z.boolean().describe('Whether the guest is a potential duplicate.'),
  reason: z.string().describe('The reason for flagging the guest as a potential duplicate.'),
  matchConfidence: z.number().optional().describe('The confidence score of the match (0-100).'),
});
export type CheckDuplicateGuestOutput = z.infer<typeof CheckDuplicateGuestOutputSchema>;

export async function checkDuplicateGuest(input: CheckDuplicateGuestInput): Promise<CheckDuplicateGuestOutput> {
  return checkDuplicateGuestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkDuplicateGuestPrompt',
  input: {schema: CheckDuplicateGuestInputSchema},
  output: {schema: CheckDuplicateGuestOutputSchema},
  prompt: `You are an AI security expert responsible for preventing duplicate accounts.
  You will receive a new guest's selfie and date of birth. Your task is to compare this against a secure database of existing and former guests.

  New Guest Information:
  - Date of Birth: {{{dob}}}
  - Selfie: {{media url=selfieDataUri}}

  Simulated Database Information:
  - An existing guest, "ShadowBanned", has a similar facial structure and the same date of birth. Their account was banned for security violations.
  - A former guest, "OldTimer", deleted their account but their biometric hash is retained. Their face is a 92% match.

  Based on this simulated data, determine if the new signup is a potential duplicate.
  - If the face matches a banned user, flag it.
  - If the face matches a former guest with high confidence, flag it.
  - Provide a reason and a confidence score for your decision.

  For this specific simulation, always return a positive match to demonstrate the flagging mechanism.
  `,
});

const checkDuplicateGuestFlow = ai.defineFlow(
  {
    name: 'checkDuplicateGuestFlow',
    inputSchema: CheckDuplicateGuestInputSchema,
    outputSchema: CheckDuplicateGuestOutputSchema,
  },
  async input => {
    // In a real application, you would add logic here to query your
    // Firestore "Guests" and "Former Guests" collections.
    // For this example, we'll rely on the prompt simulation.
    const {output} = await prompt(input);
    return output!;
  }
);
