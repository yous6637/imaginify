import { ChargilyClient } from '@/vendor/chargily/src';
import { neon } from '@neondatabase/serverless';
import { NeonHttpDatabase, drizzle } from 'drizzle-orm/neon-http';
import dotenv from 'dotenv';
import path from 'path';
import { CHARGILY_SK, DATABASE_URL } from '@/constants/variables';



dotenv.config({ path: path.resolve(__dirname, '../.env.local') });


if (!DATABASE_URL) { 
    throw new Error('DATABASE_URL environment variable not set');
}

if (!CHARGILY_SK) { 
    throw new Error('CHARGILY_SK environment variable not set');
}

declare global {

    var db : NeonHttpDatabase<Record<string, never>>
    var chargily : ChargilyClient
}
const sql = neon(DATABASE_URL);
export const db  = globalThis.db || drizzle(sql); 
export const chargily = globalThis.chargily || new ChargilyClient({api_key: CHARGILY_SK, mode: "test"})