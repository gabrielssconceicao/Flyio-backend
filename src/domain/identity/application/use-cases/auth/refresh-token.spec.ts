import { makeRefreshToken } from '@/test/domain/factories/make-refresh-token';
import { InvalidTestJWT, TestJWT } from '@/test/domain/jwt/test-jwt';
import { InRefreshTokensRepository } from '@/test/domain/repositories/in-memory-refresh-tokens-repository';

import { InvalidRefreshTokenError } from '../../errors/invalid-refresh-token-error';
import { RefreshTokenUseCase } from './refresh-token';

let sut: RefreshTokenUseCase;
let refreshTokensRepository: InRefreshTokensRepository;
let jwt: TestJWT;

const createToken = async (override = {}) => {
  await refreshTokensRepository.create(
    makeRefreshToken({
      token: 'user-id-refresh-token',
      expiresAt: new Date(Date.now() + 1000 * 60),
      ...override,
    }),
  );
};

describe('Refresh Token Use Case', () => {
  beforeEach(() => {
    refreshTokensRepository = new InRefreshTokensRepository();
    jwt = new TestJWT();
    sut = new RefreshTokenUseCase(refreshTokensRepository, jwt);
  });

  it('should refresh tokens', async () => {
    await createToken();
    const response = await sut.handle({
      refreshToken: 'user-id-refresh-token',
    });

    if (response.isLeft()) {
      throw new Error('Expected Right');
    }
    expect(response.isRight()).toBe(true);
    expect(refreshTokensRepository.items).toHaveLength(1);
    expect(response.value.accessToken).toEqual(expect.any(String));
    expect(response.value.refreshToken).toEqual(expect.any(String));
    expect(response.value.refreshToken).not.toEqual('user-refresh-token');
    expect(refreshTokensRepository.items[0].token).not.toBe('user-refresh-token');
  });

  it('should return InvalidRefreshTokenError if token was not found', async () => {
    const response = await sut.handle({ refreshToken: 'not-found-token' });
    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidRefreshTokenError);
  });

  it('should return InvalidRefreshTokenError if token is expired', async () => {
    await createToken({
      expiresAt: new Date(Date.now() - 1),
      token: 'any-token',
    });

    const response = await sut.handle({ refreshToken: 'any-token' });
    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidRefreshTokenError);
  });

  it('should return InvalidRefreshTokenError if token is invalid', async () => {
    jwt = new InvalidTestJWT();
    sut = new RefreshTokenUseCase(refreshTokensRepository, jwt);
    await createToken();

    const response = await sut.handle({
      refreshToken: 'user-id-refresh-token',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidRefreshTokenError);
    expect(refreshTokensRepository.items).toHaveLength(1);
  });
});
