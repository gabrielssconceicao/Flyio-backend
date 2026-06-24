import { Either, right } from '@/core/either/either';

import { RefreshTokensRepository } from '../repository/refresh-tokens-repository';

type LogoutRequest = {
  refreshToken: string;
};

type LogoutResponse = Either<void, void>;

export class LogoutUseCase {
  constructor(private readonly refreshTokensRepository: RefreshTokensRepository) {}

  async handle({ refreshToken }: LogoutRequest): Promise<LogoutResponse> {
    await this.refreshTokensRepository.deleteByToken(refreshToken);

    return right(undefined);
  }
}
