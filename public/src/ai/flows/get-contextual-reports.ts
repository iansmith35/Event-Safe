
'use server';

/**
 * @fileOverview AI flow to get event reports for a guest with redaction based on venue type.
 *
 * - getContextualReports - Fetches and redacts reports based on the requesting venue's type.
 * - GetContextualReportsInput - Input type for getContextualReports.
 * - GetContextualReportsOutput - Output type for getContextualReports.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VenueTypeSchema = z.enum(['Sex-Positive', 'General/Public']);
export type VenueType = z.infer<typeof VenueTypeSchema>;

const ReportSchema = z.object({
  reportId: z.string(),
  isSensitive: z.boolean(),
  details: z.string(),
  timestamp: z.string(),
  eventName: z.string().optional(),
});
export type Report = z.infer<typeof ReportSchema>;

const GetContextualReportsInputSchema = z.object({
  guestId: z.string().describe('The ID of the guest to get reports for.'),
  requestingVenueType: VenueTypeSchema.describe('The type of the venue requesting the reports.'),
  reports: z.array(ReportSchema).describe('A list of all reports for the guest.'),
});
export type GetContextualReportsInput = z.infer<typeof GetContextualReportsInputSchema>;

const RedactedReportSchema = z.object({
  reportId: z.string(),
  redactedDetails: z.string(),
  timestamp: z.string(),
  eventName: z.string().optional(),
});
export type RedactedReport = z.infer<typeof RedactedReportSchema>;

const GetContextualReportsOutputSchema = z.object({
  reports: z.array(RedactedReportSchema).describe('The list of reports, with sensitive information redacted where necessary.'),
});
export type GetContextualReportsOutput = z.infer<typeof GetContextualReportsOutputSchema>;

export async function getContextualReports(input: GetContextualReportsInput): Promise<GetContextualReportsOutput> {
  return getContextualReportsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getContextualReportsPrompt',
  input: {schema: GetContextualReportsInputSchema},
  output: {schema: GetContextualReportsOutputSchema},
  prompt: `You are an AI assistant responsible for enforcing report visibility rules based on venue type to protect user privacy and event context.

  The requesting venue is classified as: {{{requestingVenueType}}}

  You will receive a list of reports for a specific guest. Your task is to process these reports and return a list of reports that are appropriately redacted based on the requesting venue's type.

  Rules:
  1. If the requesting venue is "Sex-Positive", they can see all report details, regardless of sensitivity. The 'redactedDetails' should be the same as the original 'details'.
  2. If the requesting venue is "General/Public", you MUST redact sensitive reports.
     - For reports where 'isSensitive' is true, the 'redactedDetails' field must be a generic, non-descriptive message like: "Behavioral concern reported." or "Sensitive incident reported at another private event. Not relevant to this venue context."
     - For reports where 'isSensitive' is false, the 'redactedDetails' can be the same as the original 'details'.
  3. All other report fields (reportId, timestamp, eventName) should be preserved.

  Guest ID: {{{guestId}}}
  Reports to process:
  {{#each reports}}
  - Report ID: {{{reportId}}}
    - Is Sensitive: {{{isSensitive}}}
    - Details: {{{details}}}
    - Timestamp: {{{timestamp}}}
    - Event Name: {{{eventName}}}
  {{/each}}
  
  Now, generate the final list of reports with the correctly redacted details for the output.
  `,
});

const getContextualReportsFlow = ai.defineFlow(
  {
    name: 'getContextualReportsFlow',
    inputSchema: GetContextualReportsInputSchema,
    outputSchema: GetContextualReportsOutputSchema,
  },
  async input => {
    // In a real application, you would also add logic here to validate if a report
    // was submitted by a guest who was checked into the same event as the reported guest.
    // For this simulation, we focus on the redaction logic within the prompt.
    const {output} = await prompt(input);
    return output!;
  }
);
