import type { Config } from "drizzle-kit";
import * as dotenv from 'dotenv';

dotenv.config({path: ".env"});


if (!process.env.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL environment variable');
}

export default {
    dialect: 'postgresql',
    schema: './src/lib/db/schema.ts',
    dbCredentials: {
        url: process.env.DATABASE_URL
    }
} satisfies Config;