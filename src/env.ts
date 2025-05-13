import { z } from 'zod';

const envSchema = z.object({
  APP_PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
