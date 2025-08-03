
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-status-change.ts';
import '@/ai/flows/analyze-event-reports.ts';
import '@/ai/flows/handle-appeal-request.ts';
import '@/ai/flows/check-duplicate-guest.ts';
import '@/ai/flows/analyze-kudos.ts';
import '@/ai/flows/get-contextual-reports.ts';
import '@/ai/flows/get-seasonal-theme.ts';
import '@/ai/flows/rebecca-chat.ts';
import '@/ai/flows/diagnose-app-issue.ts';
import '@/ai/flows/judge-demo-case.ts';
import '@/ai/flows/suspend-guest.ts';
import '@/ai/flows/verify-le-request.ts';
import '@/ai/flows/verify-distinguishing-mark.ts';
import '@/ai/flows/analyze-financials.ts';
