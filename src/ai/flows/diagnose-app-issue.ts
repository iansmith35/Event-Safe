
'use server';

/**
 * @fileOverview An AI tool to diagnose application issues reported by users.
 *
 * - diagnoseAppIssueTool - A Genkit tool that analyzes a user's problem description and creates a structured bug report.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiagnoseAppIssueInputSchema = z.object({
  problemDescription: z.string().describe('A user\'s description of the problem they are encountering.'),
});

const DiagnoseAppIssueOutputSchema = z.object({
  summary: z.string().describe('A concise, one-sentence summary of the problem.'),
  reproductionSteps: z.string().describe('A numbered list of steps to reproduce the issue. Infer this from the user\'s description.'),
  expectedBehavior: z.string().describe('What the user expected to happen.'),
  actualBehavior: z.string().describe('What actually happened.'),
  suggestedFix: z.string().describe('A technical recommendation for the development AI (Studio) on how to fix the issue. This should be specific and suggest code changes if possible.'),
});

export const diagnoseAppIssueTool = ai.defineTool(
  {
    name: 'diagnoseAppIssueTool',
    description: 'Analyzes a user\'s description of a software problem and transforms it into a structured bug report for the development team. Use this when a user reports a bug, error, or that something is not working as expected.',
    inputSchema: DiagnoseAppIssueInputSchema,
    outputSchema: DiagnoseAppIssueOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `You are a senior software engineer acting as a bug triage specialist. A user has reported an issue. Your task is to analyze their report and structure it into a formal bug report.

      **User's Problem Description:**
      "${input.problemDescription}"

      **Your Task:**
      Fill out the following fields based on the user's report. Be concise and technical. Infer any missing information where possible. The 'suggestedFix' should be a direct instruction for another AI developer.

      - **summary**: A brief, one-sentence summary.
      - **reproductionSteps**: Numbered steps to reproduce the error.
      - **expectedBehavior**: What should have happened.
      - **actualBehavior**: What went wrong.
      - **suggestedFix**: A technical recommendation for a development AI on how to fix it.
      `,
      output: {
        schema: DiagnoseAppIssueOutputSchema,
      },
    });

    return output!;
  }
);
