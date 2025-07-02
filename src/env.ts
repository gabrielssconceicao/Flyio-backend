import { z } from 'zod';
import { config } from 'dotenv';

// if (process.env.NODE_ENV === 'test') {
//   config({ path: '.env.test' });
// } else {
//   config();
// }
config();
const envSchema = z.object({
  APP_PORT: z.string().default('3000'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  JWT_SECRET: z.string(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string(),
  JWT_TOKEN_AUDIENCE: z.string().url(),
  JWT_TOKEN_ISSUER: z.string().url(),

  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),

  RESEND_API_KEY: z.string(),

  API_BASE_URL: z.string(),
  AUTH_REDIRECT_URL: z.string(),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
