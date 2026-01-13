import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUser } from '@/test/factory/make-user';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { EditProfileUseCase } from './edit-profile';

let userRepository: InMemoryUserRepository;
let sut: EditProfileUseCase;

describe('Edit User Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new EditProfileUseCase(userRepository);
  });

  it('should update user data', async () => {
    await userRepository.create(makeUser({}, new UniqueEntityId('teste-id')));
    const response = await sut.execute({
      userId: 'teste-id',
      data: { name: 'Updated Name', bio: 'Updated Bio' },
    });

    expect(response.isRight()).toBe(true);
    expect(response.isRight() && response.value.updated_at).not.toBe(undefined);
    expect(userRepository.items[0].name).toEqual('Updated Name');
    expect(userRepository.items[0].bio).toEqual('Updated Bio');
  });

  it('should not update user if not found', async () => {
    const response = await sut.execute({ userId: 'non-existent-id', data: {} });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
