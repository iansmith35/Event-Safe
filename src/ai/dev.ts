
'use server';
import { config } from 'dotenv';
config();

// This single import will now pull in all the defined flows.
import '@/ai/flows';
