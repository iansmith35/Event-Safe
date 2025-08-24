/**
 * Feature flags configuration
 */

import { isAiAvailable } from '@/lib/ai';

export const FEATURES = {
  judgeEnabled: isAiAvailable()
};