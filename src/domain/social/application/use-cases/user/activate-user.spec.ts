import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InvalidUserStateError } from '@/core/errors/invalid-user-state-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUser } from '@/test/factory/make-user';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { ActivateUserUseCase } from './activate-user';

let userRepository: InMemoryUserRepository;
let sut: ActivateUserUseCase;

describe('Activate User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new ActivateUserUseCase(userRepository);
  });

  it('should activate the user', async () => {
    await userRepository.create(
      makeUser({ is_active: false }, new UniqueEntityId('test-id')),
    );
    const response = await sut.execute({
      userId: 'test-id',
    });

    expect(response.isRight()).toBe(true);
    expect(userRepository.items[0].is_active).toEqual(true);
  });

  it('should not activate user if not found', async () => {
    const response = await sut.execute({ userId: 'non-existent-id' });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(ResourceNotFoundError);
  });
  it('should not activate user if its already activated', async () => {
    await userRepository.create(makeUser({}, new UniqueEntityId('test-id')));

    const response = await sut.execute({ userId: 'test-id' });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidUserStateError);
  });
});
