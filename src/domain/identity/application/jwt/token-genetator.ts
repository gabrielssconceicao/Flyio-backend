export type TokenPayload = {
  sub: string;
};

export type SignedToken = {
  token: string;
  expiresAt: Date;
};
export abstract class TokenGenerator {
  abstract sign(payload: TokenPayload): Promise<SignedToken>;
  abstract signRefreshToken(payload: TokenPayload): Promise<SignedToken>;
}
