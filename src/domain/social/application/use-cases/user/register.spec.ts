import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ExistingUserError } from '@/core/errors/existing-user-error';
import { TestHasher } from '@/test/cryptography/test-hasher';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { RegisterUseCase } from './register';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;
let hasher: TestHasher;

describe('Register', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    hasher = new TestHasher();
    sut = new RegisterUseCase(hasher, usersRepository);
  });
  it('should register a user', async () => {
    const result = await sut.execute({
      email: 'j@j.com',
      name: 'John Doe',
      username: 'johndoe',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(usersRepository.items[0]?.id).toEqual(expect.any(UniqueEntityId));
  });

  it('should hash a password upon registration', async () => {
    const hashed_password = await hasher.hash('123456');
    const result = await sut.execute({
      email: 'j@j.com',
      name: 'John Doe',
      username: 'johndoe',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(usersRepository.items[0]?.password_hash).toEqual(hashed_password);
  });

  it('should not be able to register a user with a existing email', async () => {
    const email = 'johndoe@email.com';
    usersRepository.items.push(
      makeUser({
        email,
      }),
    );

    const result = await sut.execute({
      email,
      name: 'John Doe',
      username: 'johndoe',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ExistingUserError);
  });
});
