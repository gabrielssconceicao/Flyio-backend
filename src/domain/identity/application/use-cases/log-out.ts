import { RefreshTokensRepository } from '../repository/refresh-tokens-repository';

type LogoutRequest = {
  refreshToken: string;
};

export class LogoutUseCase {
  constructor(private readonly refreshTokensRepository: RefreshTokensRepository) {}

  async handle({ refreshToken }: LogoutRequest): Promise<void> {
    await this.refreshTokensRepository.deleteByToken(refreshToken);
  }
}
