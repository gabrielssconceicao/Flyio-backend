import { z } from 'zod';

const envSchema = z.object({
  APP_PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  JWT_SECRET: z.string(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string(),
  JWT_TOKEN_AUDIENCE: z.string().url(),
  JWT_TOKEN_ISSUER: z.string().url(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
