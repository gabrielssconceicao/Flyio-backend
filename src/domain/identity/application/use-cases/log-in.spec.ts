import { TestHasher } from '@/test/domain/cryptografy/test-hasher';
import { makeEmail, makeUser, makeUsername } from '@/test/domain/factories/make-user';
import { TestJWT } from '@/test/domain/jwt/test-jwt';
import { InRefreshTokensRepository } from '@/test/domain/repositories/in-memory-refresh-tokens-repository';
import { InMemoryUsersRepository } from '@/test/domain/repositories/in-memory-users-repository';

import { InvalidCredentialsError } from '../errors/invalid-credentials-error';
import { UserNotActiveError } from '../errors/user-not-active';
import { LoginUseCase } from './log-in';

let sut: LoginUseCase;
let hasher: TestHasher;
let userRepository: InMemoryUsersRepository;
let refreshTokensRepository: InRefreshTokensRepository;
let jwt: TestJWT;

let password: string;
let email: string;

describe('Log In Use Case', () => {
  beforeEach(() => {
    hasher = new TestHasher();
    userRepository = new InMemoryUsersRepository();
    refreshTokensRepository = new InRefreshTokensRepository();
    jwt = new TestJWT();
    sut = new LoginUseCase(userRepository, refreshTokensRepository, hasher, jwt);

    password = 'Test@123';
    email = 'jonh@doe.com';
  });

  it('should generate access token and refresh token', async () => {
    await userRepository.create(
      makeUser({
        username: makeUsername('jonh_doe'),
        password_hash: await hasher.hash(password),
      }),
    );

    const result = await sut.handle({
      login: 'jonh_doe',
      password: password,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(refreshTokensRepository.items[0].token).toEqual(result.value.refreshToken);
      expect(result.value.accessToken).toEqual(expect.any(String));
      expect(result.value.refreshToken).toEqual(expect.any(String));
    }
  });

  it('should return InvalidCredentialsError if user is not found', async () => {
    await userRepository.create(makeUser());

    const result = await sut.handle({
      login: 'any_login',
      password: 'any_password',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });

  it('should return InvalidCredentialsError if password is invalid', async () => {
    await userRepository.create(makeUser({ email: makeEmail(email), password_hash: 'hashed_password' }));

    const result = await sut.handle({
      login: email,
      password: 'invalid_password',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });

  it('should return UserNotActiveError if user is not active', async () => {
    await userRepository.create(
      makeUser({ email: makeEmail(email), is_active: false, password_hash: await hasher.hash(password) }),
    );

    const result = await sut.handle({
      login: email,
      password: password,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotActiveError);
  });
});
