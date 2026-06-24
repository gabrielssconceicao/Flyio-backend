import { TestComparer } from '@/test/domain/cryptografy/test-comparer';
import { makeEmail, makeUser, makeUsername } from '@/test/domain/factories/make-user';
import { TestJWT } from '@/test/domain/jwt/test-jwt';
import { InRefreshTokensRepository } from '@/test/domain/repositories/in-memory-refresh-tokens-repository';
import { InMemoryUsersRepository } from '@/test/domain/repositories/in-memory-users-repository';

import { InvalidCredentialsError } from '../../errors/invalid-credentials-error';
import { UserNotActiveError } from '../../errors/user-not-active';
import { LoginUseCase } from './log-in';

let sut: LoginUseCase;
let comparer: TestComparer;
let userRepository: InMemoryUsersRepository;
let refreshTokensRepository: InRefreshTokensRepository;
let jwt: TestJWT;

let password: string;
let email: string;
const createUser = async (overrive = {}) => {
  const user = makeUser({
    username: makeUsername('jonh_doe'),
    email: makeEmail(email),
    passwordHash: `hashed-${password}`,
    ...overrive,
  });

  await userRepository.create(user);
  return user;
};

describe('Log In Use Case', () => {
  beforeEach(() => {
    comparer = new TestComparer();
    userRepository = new InMemoryUsersRepository();
    refreshTokensRepository = new InRefreshTokensRepository();
    jwt = new TestJWT();
    sut = new LoginUseCase(userRepository, refreshTokensRepository, comparer, jwt);

    password = 'Test@123';
    email = 'jonh@doe.com';
  });

  it('should generate access token and refresh token', async () => {
    await createUser();

    const response = await sut.handle({
      login: 'jonh_doe',
      password: password,
    });

    if (response.isLeft()) {
      throw new Error('Should be right');
    }

    expect(response.isRight()).toBe(true);
    expect(refreshTokensRepository.items[0].token).toEqual(response.value.refreshToken);
    expect(response.value.accessToken).toEqual(expect.any(String));
    expect(response.value.refreshToken).toEqual(expect.any(String));
  });

  it('should return InvalidCredentialsError if user is not found', async () => {
    await createUser();

    const response = await sut.handle({
      login: 'any_login',
      password: 'any_password',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidCredentialsError);
  });

  it('should return InvalidCredentialsError if password is invalid', async () => {
    await createUser();
    const response = await sut.handle({
      login: email,
      password: 'invalid_password',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidCredentialsError);
  });

  it('should return UserNotActiveError if user is not active', async () => {
    await createUser({
      isActive: false,
    });

    const response = await sut.handle({
      login: email,
      password: password,
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(UserNotActiveError);
  });
});
