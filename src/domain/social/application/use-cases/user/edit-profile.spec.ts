import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UserAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { TestHasher } from '@/test/cryptography/test-hasher';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { EditProfileUseCase } from './edit-profile';

let userRepository: InMemoryUsersRepository;
let hasher: TestHasher;
let sut: EditProfileUseCase;

describe('Edit Profile', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    hasher = new TestHasher();
    sut = new EditProfileUseCase(hasher, userRepository);
  });

  it('should be able to edit a user', async () => {
    await userRepository.create(makeUser({}, new UniqueEntityId('user-1')));

    const result = await sut.execute({
      id: 'user-1',
      name: 'John Doe',
      email: 'jonh@example.com',
      password: '123456',
    });

    const hashed_password = await hasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(userRepository.items[0]).toMatchObject(
      expect.objectContaining({
        name: 'John Doe',
        email: 'jonh@example.com',
        password_hash: hashed_password,
      }),
    );
  });

  it('should not be able to edit a non existing user', async () => {
    const result = await sut.execute({
      id: 'non-existing-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit a user with a existing email', async () => {
    await userRepository.create(
      makeUser({
        email: 'jonh@example.com',
      }),
    );

    await userRepository.create(makeUser({}, new UniqueEntityId('user-1')));

    const result = await sut.execute({
      id: 'user-1',
      email: 'jonh@example.com',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistError);
  });
});
