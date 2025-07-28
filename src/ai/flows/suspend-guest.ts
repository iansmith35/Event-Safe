'use server';

/**
 * @fileOverview AI flow to handle suspending a guest from a specific event.
 *
 * - suspendGuestFromEvent - Generates a polite suspension notice for a guest.
 * - SuspendGuestInput - Input type for suspendGuestFromEvent.
 * - SuspendGuestOutput - Output type for suspendGuestFromEvent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SuspendGuestInputSchema = z.object({
  guestId: z.string().describe("The ID of the guest being suspended."),
  eventId: z.string().describe("The ID of the event they are being suspended from."),
  reason: z.string().describe("The host's reason for the suspension (can be brief/informal)."),
});
export type SuspendGuestInput = z.infer<typeof SuspendGuestInputSchema>;

export const SuspendGuestOutputSchema = z.object({
  guestNotification: z.string().describe("A polite, non-emotional notification message for the guest."),
  logEntry: z.string().describe("A concise, factual log entry for the host's private records."),
});
export type SuspendGuestOutput = z.infer<typeof SuspendGuestOutputSchema>;

export async function suspendGuestFromEvent(input: SuspendGuestInput): Promise<SuspendGuestOutput> {
  return suspendGuestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suspendGuestPrompt',
  input: {schema: SuspendGuestInputSchema},
  output: {schema: SuspendGuestOutputSchema},
  prompt: `You are an AI assistant for EventSafe, responsible for communication between hosts and guests. Your tone must be professional, fair, and non-emotional.

  A host needs to suspend a guest from a single, specific event. You must take their reason and convert it into a polite, respectful notification for the guest and a separate, concise log entry for the host's records.

  **Host's Reason:**
  "{{{reason}}}"

  **Your Tasks:**
  1.  **Generate `guestNotification`**:
      *   This message is for the guest.
      *   It must clearly state that the suspension is for this specific event only and does not affect their overall EventSafe status.
      *   It should explain the reason politely and constructively, focusing on the behavior, not the person.
      *   It should offer a path to reconciliation, suggesting they can attend future events if they adhere to the rules.
      *   Do NOT be accusatory. Frame it as a measure to ensure a safe and enjoyable event for everyone.

  2.  **Generate `logEntry`**:
      *   This is for the host's private event log.
      *   It should be a brief, factual summary of the reason for the event-specific suspension.
      *   Example: "Guest suspended from this event due to intoxication at previous event."

  **Guest ID:** {{{guestId}}}
  **Event ID:** {{{eventId}}}

  Now, generate the output.
  `,
});

const suspendGuestFlow = ai.defineFlow(
  {
    name: 'suspendGuestFlow',
    inputSchema: SuspendGuestInputSchema,
    outputSchema: SuspendGuestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
