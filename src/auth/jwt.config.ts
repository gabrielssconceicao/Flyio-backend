import { env } from '@/env';
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: env.JWT_SECRET,
    accessTokenExpiresIn: Number(env.JWT_ACCESS_TOKEN_EXPIRES_IN ?? '3600'),
    refreshTokenExpiresIn: Number(env.JWT_REFRESH_TOKEN_EXPIRES_IN ?? '14400'),
    audience: env.JWT_TOKEN_AUDIENCE,
    issuer: env.JWT_TOKEN_ISSUER,
  };
});
