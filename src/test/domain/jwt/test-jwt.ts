import { SignedToken, TokenGenerator, TokenPayload } from '@/domain/identity/application/jwt/token-genetator';

export class TestJWT implements TokenGenerator {
  sign(payload: TokenPayload): Promise<SignedToken> {
    return Promise.resolve({ token: `${payload.sub}-token`, expiresAt: new Date() });
  }

  signRefreshToken(payload: TokenPayload): Promise<SignedToken> {
    return Promise.resolve({ token: `${Math.random()}-${payload.sub}-refresh-token`, expiresAt: new Date() });
  }

  verify(token: string): Promise<TokenPayload> {
    return Promise.resolve({ sub: token.split('-')[0] });
  }
}

export class InvalidTestJWT extends TestJWT {
  override verify(): Promise<TokenPayload> {
    throw new Error('Invalid token');
  }
}
