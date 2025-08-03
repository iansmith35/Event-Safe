
'use server';

/**
 * @fileOverview An AI tool to help administrators verify law enforcement data requests.
 *
 * - verifyLawEnforcementRequestTool - A Genkit tool that provides a checklist for verifying a request.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VerificationInputSchema = z.object({
  requestSummary: z.string().describe('A brief summary of the request received, e.g., "Email from someone claiming to be from the Met Police asking for user data."'),
});

const VerificationOutputSchema = z.object({
  verificationChecklist: z.array(z.string()).describe('A checklist of steps the administrator should take to verify the request.'),
  redFlags: z.array(z.string()).describe('A list of potential red flags to watch out for.'),
  nextSteps: z.string().describe('A summary of the appropriate next steps after verification.'),
  disclaimer: z.string().describe('A legal disclaimer about not releasing data without proper verification.'),
});

export const verifyLawEnforcementRequestTool = ai.defineTool(
  {
    name: 'verifyLawEnforcementRequestTool',
    description: 'Provides a structured checklist and expert advice for an administrator on how to verify a data request that appears to come from law enforcement. Use this when the admin asks for help or guidance on handling such requests.',
    inputSchema: VerificationInputSchema,
    outputSchema: VerificationOutputSchema,
  },
  async (input) => {
    // This tool does not perform verification. It provides expert guidance.
    // The logic is embedded in the prompt for the LLM to generate the checklist.
    const { output } = await ai.generate({
      prompt: `You are a legal and security expert for the EventSafe platform. An administrator needs guidance on how to handle a potential law enforcement request. 

      **Administrator's summary of the request:**
      "${input.requestSummary}"

      **Your Task:**
      Generate a structured response to guide the administrator. Provide a professional, cautious, and secure set of steps.

      - **verificationChecklist**: Create a list of actions the admin must take. This should include checking email headers, verifying domain names (e.g., '.police.uk'), finding an official phone number for the police department (do NOT use one from the email), and calling to confirm the officer's identity and the case number.
      - **redFlags**: List common signs of a fraudulent request, such as pressure tactics, unusual email domains (e.g., gmail.com), spelling/grammar errors, or requests for data via insecure channels.
      - **nextSteps**: Advise the admin that if the request is verified, they should consult the company's legal counsel before releasing any data. If it cannot be verified, they must not respond and should report it internally.
      - **disclaimer**: Add a strong, clear disclaimer stating that releasing user data without a lawfully issued warrant, court order, or explicit, verified user consent is illegal and harmful.
      `,
      output: {
        schema: VerificationOutputSchema,
      },
    });

    return output!;
  }
);
