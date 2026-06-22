import { RefreshToken } from '../../enterprise/entities/refresh-token';

export abstract class RefreshTokensRepository {
  abstract create(refreshToken: RefreshToken): Promise<void>;
  abstract save(refreshToken: RefreshToken): Promise<void>;

  abstract findByToken(refreshToken: string): Promise<RefreshToken | null>;
  abstract deleteByToken(refreshToken: string): Promise<void>;
}
