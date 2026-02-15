import { InvalidCredentialsError } from '@/core/errors/auth/invalid-credentials-error';
import { TestComparator } from '@/test/cryptography/test-comparator';
import { makeEmail, makeUser } from '@/test/factory/make-user';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { LoginUseCase } from './login';

let userRepository: InMemoryUserRepository;
let sut: LoginUseCase;
let comparator: TestComparator;

describe('Login Use Case', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    comparator = new TestComparator();
    sut = new LoginUseCase(userRepository, comparator);

    await userRepository.create(
      makeUser({
        email: makeEmail('teste@example.com'),
        password_hash: 'hashed-password123',
      }),
    );
  });

  it('should login a user with correct credentials', async () => {
    const response = await sut.execute({
      email: 'teste@example.com',
      password: 'password123',
    });

    expect(response.isRight()).toBe(true);
    expect(response.isRight() && response.value.email.value).toEqual(
      'teste@example.com',
    );
  });
  it('should not login a user with incorrect email', async () => {
    const response = await sut.execute({
      email: 'invalid@example.com',
      password: 'password123',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidCredentialsError);
  });
  it('should not login a user with incorrect password', async () => {
    const response = await sut.execute({
      email: 'teste@example.com',
      password: 'wrongpassword',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidCredentialsError);
  });
});
