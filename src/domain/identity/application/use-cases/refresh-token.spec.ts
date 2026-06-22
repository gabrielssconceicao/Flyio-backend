import { makeRefreshToken } from '@/test/domain/factories/make-refresh-token';
import { InvalidTestJWT, TestJWT } from '@/test/domain/jwt/test-jwt';
import { InRefreshTokensRepository } from '@/test/domain/repositories/in-memory-refresh-tokens-repository';

import { InvalidRefreshTokenError } from '../errors/invalid-refresh-token-error';
import { RefreshTokenUseCase } from './refresh-token';

let sut: RefreshTokenUseCase;
let refreshTokensRepository: InRefreshTokensRepository;
let jwt: TestJWT;

describe('Refresh Token Use Case', () => {
  beforeEach(() => {
    refreshTokensRepository = new InRefreshTokensRepository();
    jwt = new TestJWT();
    sut = new RefreshTokenUseCase(refreshTokensRepository, jwt);
  });

  it('should refresh tokens', async () => {
    await refreshTokensRepository.create(
      makeRefreshToken({
        token: 'user-id-refresh-token',
        expiresAt: new Date(Date.now() + 1000 * 60),
      }),
    );

    const result = await sut.handle({
      refreshToken: 'user-id-refresh-token',
    });

    expect(result.isRight()).toBe(true);

    if (result.isLeft()) {
      throw new Error('Expected Right');
    }

    expect(result.value).toEqual({
      accessToken: 'user-token',
      refreshToken: 'user-refresh-token',
    });

    expect(refreshTokensRepository.items).toHaveLength(1);

    expect(refreshTokensRepository.items[0].token).toBe('user-refresh-token');
  });

  it('should return InvalidRefreshTokenError if token was not found', async () => {
    const result = await sut.handle({ refreshToken: 'not-found-token' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidRefreshTokenError);
  });

  it('should return InvalidRefreshTokenError if token is expired', async () => {
    await refreshTokensRepository.create(
      makeRefreshToken({
        expiresAt: new Date(Date.now() - 1),
        token: 'any-token',
      }),
    );

    const result = await sut.handle({ refreshToken: 'any-token' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidRefreshTokenError);
  });

  it('should return InvalidRefreshTokenError if token is invalid', async () => {
    jwt = new InvalidTestJWT();

    sut = new RefreshTokenUseCase(refreshTokensRepository, jwt);

    await refreshTokensRepository.create(
      makeRefreshToken({
        token: 'user-id-refresh-token',
        expiresAt: new Date(Date.now() + 1000 * 60),
      }),
    );

    const result = await sut.handle({
      refreshToken: 'user-id-refresh-token',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidRefreshTokenError);
  });
});
