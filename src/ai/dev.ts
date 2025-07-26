import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-status-change.ts';
import '@/ai/flows/analyze-event-reports.ts';
import '@/ai/flows/handle-appeal-request.ts';
import '@/ai/flows/check-duplicate-guest.ts';
