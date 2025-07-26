
import { z } from 'zod';

export const KudosTagsSchema = z.enum(['Helpful', 'Respectful', 'Communicative', 'Positive']);
export type KudosTags = z.infer<typeof KudosTagsSchema>;
