import { RefreshTokensRepository } from '@/domain/identity/application/repository/refresh-tokens-repository';
import { RefreshToken } from '@/domain/identity/enterprise/entities/refresh-token';

export class InRefreshTokensRepository implements RefreshTokensRepository {
  items: RefreshToken[] = [];

  async create(refreshToken: RefreshToken): Promise<void> {
    this.items.push(refreshToken);
    return Promise.resolve();
  }

  async deleteByToken(refreshToken: string): Promise<void> {
    this.items = this.items.filter((item) => item.token !== refreshToken);
    return Promise.resolve();
  }
}
