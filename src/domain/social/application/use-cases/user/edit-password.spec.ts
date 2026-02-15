import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { TestHasher } from '@/test/cryptography/test-hasher';
import { makeUser } from '@/test/factory/make-user';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { EditPasswordUseCase } from './edit-password';

let userRepository: InMemoryUserRepository;
let sut: EditPasswordUseCase;
let hasher: TestHasher;

describe('Edit User Password Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    hasher = new TestHasher();
    sut = new EditPasswordUseCase(hasher, userRepository);
  });

  it('should update user password', async () => {
    await userRepository.create(makeUser({}, new UniqueEntityId('test-id')));
    const response = await sut.execute({
      userId: 'test-id',
      password: 'updated-password',
    });

    expect(response.isRight()).toBe(true);
    expect(response.isRight() && response).not.toBe(undefined);
    expect(userRepository.items[0].password_hash).toEqual(
      'hashed-updated-password',
    );
  });

  it('should not update user if not found', async () => {
    const response = await sut.execute({
      userId: 'non-existent-id',
      password: 'updated-password',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
