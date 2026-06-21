import { SignedToken, TokenGenerator, TokenPayload } from '@/domain/identity/application/jwt/token-genetator';

export class TestJWT implements TokenGenerator {
  sign(payload: TokenPayload): Promise<SignedToken> {
    return Promise.resolve({ token: `${payload.sub}-token`, expiresAt: new Date() });
  }

  signRefreshToken(payload: TokenPayload): Promise<SignedToken> {
    return Promise.resolve({ token: `${payload.sub}-refresh-token`, expiresAt: new Date() });
  }
}
