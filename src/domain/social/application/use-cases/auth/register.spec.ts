import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { UserAlreadyExistError } from '@/core/errors/user/user-already-exist-error';
import { InvalidEmailError } from '@/domain/social/enterprise/value-obj/errors/invalid-email-error';
import { InvalidUsernameError } from '@/domain/social/enterprise/value-obj/errors/invalid-username-error';
import { TestHasher } from '@/test/cryptography/test-hasher';
import { makeEmail, makeUser, makeUsername } from '@/test/factory/make-user';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { RegisterUseCase } from './register';

let userRepository: InMemoryUserRepository;
let sut: RegisterUseCase;
let hasher: TestHasher;

describe('Register Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    hasher = new TestHasher();
    sut = new RegisterUseCase(hasher, userRepository);
  });

  it('should hash the password before saving', async () => {
    await sut.execute({
      name: 'John Doe',
      username: 'johndoe',
      email: 'teste@example.com',
      password: 'password123',
    });

    expect(userRepository.items[0].password_hash).toEqual('hashed-password123');
  });

  it('should register a user', async () => {
    const response = await sut.execute({
      name: 'John Doe',
      username: 'johndoe',
      email: 'teste@example.com',
      password: 'password123',
      bio: 'lorem ipsum dolor sit amet',
    });

    expect(response.isRight()).toBe(true);
    expect(userRepository.items).toHaveLength(1);
    expect(userRepository.items[0].id).toEqual(expect.any(UniqueEntityId));
  });
  it('should not register a user with existing email or username', async () => {
    await userRepository.create(
      makeUser({
        email: makeEmail('teste@example.com'),
        username: makeUsername('johndoe'),
      }),
    );
    const response = await sut.execute({
      name: 'Jane Doe',
      username: 'johndoe',
      email: 'teste@example.com',
      password: 'password123',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(UserAlreadyExistError);
  });

  it('should not register a user with invalid email', async () => {
    const response = await sut.execute({
      name: 'John Doe',
      username: 'johndoe',
      email: 'invalid-email',
      password: 'password123',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidEmailError);
  });
  it('should not register a user with invalid username', async () => {
    const response = await sut.execute({
      name: 'John Doe',
      username: 'invalid username!',
      email: 'johndoe@example.com',
      password: 'password123',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidUsernameError);
  });
});
