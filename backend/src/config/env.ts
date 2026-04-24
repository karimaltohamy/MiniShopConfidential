import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),

  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  MOBILE_APP_URL: z.string().url(),
  ADMIN_DASHBOARD_URL: z.string().url(),

  RESET_PASSWORD_REDIRECT_URL: z.string().default('myapp://reset-password'),
});

export const env = envSchema.parse(process.env);
