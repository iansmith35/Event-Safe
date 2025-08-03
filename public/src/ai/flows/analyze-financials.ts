
'use server';

/**
 * @fileOverview AI flow to analyze financial data and provide insights.
 *
 * - analyzeFinancials - Analyzes turnover and expenses to identify trends and risks.
 * - AnalyzeFinancialsInput - Input type for analyzeFinancials.
 * - AnalyzeFinancialsOutput - Output type for analyzeFinancials.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeFinancialsInputSchema = z.object({
  turnover: z.array(z.object({
    source: z.string(),
    amount: z.number(),
  })).describe('A list of all income sources and their amounts.'),
  expenses: z.array(z.object({
    item: z.string(),
    amount: z.number(),
    category: z.string(),
  })).describe('A list of all business expenses.'),
  promoCodeUsage: z.number().describe('The total amount discounted via promotional codes.'),
});
export type AnalyzeFinancialsInput = z.infer<typeof AnalyzeFinancialsInputSchema>;

export const AnalyzeFinancialsOutputSchema = z.object({
  summary: z.string().describe("A high-level summary of the current financial situation."),
  alerts: z.array(z.string()).describe("A list of critical alerts regarding high costs, low margins, or potential abuse."),
  recommendations: z.array(z.string()).describe("A list of actionable recommendations to improve financial health, such as price adjustments or cost-cutting measures."),
  profitMargin: z.number().describe("The calculated profit margin percentage."),
  expenseRatio: z.number().describe("The calculated expense to turnover ratio percentage."),
  aiCostPercentage: z.number().describe("The percentage of total expenses that are attributed to AI API usage."),
});
export type AnalyzeFinancialsOutput = z.infer<typeof AnalyzeFinancialsOutputSchema>;


export async function analyzeFinancials(input: AnalyzeFinancialsInput): Promise<AnalyzeFinancialsOutput> {
  return analyzeFinancialsFlow(input);
}


const prompt = ai.definePrompt({
    name: 'analyzeFinancialsPrompt',
    input: {schema: AnalyzeFinancialsInputSchema},
    output: {schema: AnalyzeFinancialsOutputSchema},
    prompt: `You are an expert financial analyst AI for a platform called EventSafe. Your primary role is to monitor the platform's running costs against its income and profit to ensure its long-term financial stability.

    You will be given the financial data for the current period. Your task is to:
    1.  Calculate the key financial metrics: Profit Margin, Expense Ratio, and the percentage of costs from AI.
    2.  Provide a concise summary of the financial health.
    3.  Identify and create a list of critical "alerts". An alert should be raised if:
        - The expense ratio is becoming dangerously high (e.g., > 70%).
        - The AI API Usage cost is a disproportionately large part of total expenses (e.g., > 30%).
        - Profit margins are significantly shrinking.
        - "Promo Code Sales" seem unusually high, which could indicate abuse.
    4.  Provide a list of actionable "recommendations". These should be concrete suggestions to address the alerts. For example:
        - If costs are high, suggest specific price increases (e.g., "Increase Host Event Fees by £1").
        - If promo code abuse is suspected, suggest adding restrictions.

    Here is the data for the current period:

    **Turnover:**
    {{#each turnover}}
    - Source: {{{source}}}, Amount: £{{{amount}}}
    {{/each}}

    **Expenses:**
    {{#each expenses}}
    - Item: {{{item}}}, Amount: £{{{amount}}}, Category: {{{category}}}
    {{/each}}

    **Promo Code Discounts:** £{{{promoCodeUsage}}}

    Now, generate your analysis including the calculated metrics. Be direct and clear in your alerts and recommendations.
    `,
});


const analyzeFinancialsFlow = ai.defineFlow(
  {
    name: 'analyzeFinancialsFlow',
    inputSchema: AnalyzeFinancialsInputSchema,
    outputSchema: AnalyzeFinancialsOutputSchema,
  },
  async (input) => {
    // In a real application, these calculations could be done here instead of relying on the model.
    // However, having the model do it allows it to reason about the numbers directly.
    const {output} = await prompt(input);
    return output!;
  }
);
