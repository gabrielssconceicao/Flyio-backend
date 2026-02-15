import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UserAlreadyInactiveError } from '@/core/errors/user/user-already-inactive-error';
import { makeUser } from '@/test/factory/make-user';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { DeactivateUserUseCase } from './deactivate-user';

let userRepository: InMemoryUserRepository;
let sut: DeactivateUserUseCase;

describe('Deactivate User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new DeactivateUserUseCase(userRepository);
  });

  it('should deactivate the user', async () => {
    await userRepository.create(makeUser({}, new UniqueEntityId('test-id')));
    const response = await sut.execute({
      userId: 'test-id',
    });

    expect(response.isRight()).toBe(true);
    expect(userRepository.items[0].is_active).toEqual(false);
  });

  it('should not deactivate user if not found', async () => {
    const response = await sut.execute({ userId: 'non-existent-id' });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(ResourceNotFoundError);
  });
  it('should not deactivate user if its already deactivated', async () => {
    await userRepository.create(
      makeUser({ is_active: false }, new UniqueEntityId('test-id')),
    );

    const response = await sut.execute({ userId: 'test-id' });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(UserAlreadyInactiveError);
  });
});
