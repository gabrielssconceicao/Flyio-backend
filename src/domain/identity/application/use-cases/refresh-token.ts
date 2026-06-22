import { Either, left, right } from '@/core/either/either';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

import { InvalidRefreshTokenError } from '../errors/invalid-refresh-token-error';
import { TokenGenerator } from '../jwt/token-genetator';
import { RefreshTokensRepository } from '../repository/refresh-tokens-repository';

type RefreshTokenRequest = {
  refreshToken: string;
};

type RefreshTokenResponse = Either<
  UnauthorizedError,
  {
    accessToken: string;
    refreshToken: string;
  }
>;

export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokensRepository,
    private readonly jwt: TokenGenerator,
  ) {}

  async handle({ refreshToken }: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const storedToken = await this.refreshTokenRepository.findByToken(refreshToken);

    if (!storedToken) {
      console.log('refresh token not found');

      return left(new InvalidRefreshTokenError());
    }

    if (storedToken.isExpired()) {
      await this.refreshTokenRepository.deleteByToken(refreshToken);
      return left(new InvalidRefreshTokenError());
    }

    let payload: { sub: string };
    try {
      payload = await this.jwt.verify(refreshToken);
    } catch {
      return left(new InvalidRefreshTokenError());
    }

    const accessToken = await this.jwt.sign({ sub: payload.sub });
    const newRefreshToken = await this.jwt.signRefreshToken({ sub: payload.sub });

    storedToken.refresh({
      token: newRefreshToken.token,
      expiresAt: newRefreshToken.expiresAt,
    });

    await this.refreshTokenRepository.save(storedToken);

    return right({ accessToken: accessToken.token, refreshToken: newRefreshToken.token });
  }
}
