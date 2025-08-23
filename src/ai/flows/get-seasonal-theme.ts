'use server';

/**
 * @fileOverview AI flow to determine the current seasonal theme for the app.
 *
 * - getSeasonalTheme - Returns the current theme name.
 * - SeasonalThemeOutput - The return type for the getSeasonalTheme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ThemeEnum = z.enum([
    "default",
    "new-year",
    "valentines",
    "easter",
    "spring",
    "summer",
    "back-to-school",
    "halloween",
    "christmas"
]);

const SeasonalThemeOutputSchema = z.object({
  theme: ThemeEnum.describe("The name of the current seasonal theme."),
});
export type SeasonalThemeOutput = z.infer<typeof SeasonalThemeOutputSchema>;

export async function getSeasonalTheme(): Promise<SeasonalThemeOutput> {
  // Check if API key is available, provide fallback during build time
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    // Fallback for build time - return the demo theme
    return { theme: 'new-year' };
  }

  // In a real scenario, you might pass the current date in, but the model can also use the current date it knows.
  // For this demo, we'll force it to be New Year's for demonstration.
  // In a real implementation, you would remove the hardcoded date.
  const currentDate = 'January 1st';
  return getSeasonalThemeFlow({ currentDate });
}

const prompt = ai.definePrompt({
  name: 'getSeasonalThemePrompt',
  input: { schema: z.object({ currentDate: z.string() }) },
  output: { schema: SeasonalThemeOutputSchema },
  prompt: `Based on the provided date, determine the appropriate seasonal theme for a web application.

  Date: {{{currentDate}}}

  Here are the possible themes and their corresponding date ranges:
  - "new-year": January 1st to January 15th
  - "valentines": February 1st to February 20th
  - "easter": March 20th to April 25th (variable, based on Easter date)
  - "spring": March 20th to June 20th
  - "summer": June 21st to September 22nd
  - "back-to-school": August 15th to September 15th
  - "halloween": October 15th to November 5th
  - "christmas": December 5th to December 31st

  If the date falls into multiple ranges (e.g., Spring and Easter), prioritize the more specific holiday theme. If no specific theme applies, return "default".
  `,
});

const getSeasonalThemeFlow = ai.defineFlow(
  {
    name: 'getSeasonalThemeFlow',
    inputSchema: z.object({ currentDate: z.string() }),
    outputSchema: SeasonalThemeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
