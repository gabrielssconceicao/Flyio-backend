import { RefreshToken } from '../../enterprise/entities/refresh-token';

export abstract class RefreshTokensRepository {
  abstract create(refreshToken: RefreshToken): Promise<void>;
  abstract deleteByToken(refreshToken: string): Promise<void>;
}
