import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ConflictError } from '@/core/errors/conflict-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { DeactivateUserUseCase } from './deactivate-user';

let userRepository: InMemoryUsersRepository;
let sut: DeactivateUserUseCase;

describe('Deactivate User', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new DeactivateUserUseCase(userRepository);
  });

  it('shoud be able to deactivate the user', async () => {
    const user = makeUser({}, new UniqueEntityId('user-1'));

    await userRepository.create(user);

    const result = await sut.execute({ id: 'user-1' });
    expect(result.isRight()).toBe(true);
    expect(userRepository.items[0]?.isActive).toBe(false);
    expect(userRepository.items[0]?.deactivatedAt).toBeInstanceOf(Date);
  });

  it('should return a ResourceNotFoundError when user is not found', async () => {
    const result = await sut.execute({ id: 'not-found-id' });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should return a ConflictError when user is already deactivated', async () => {
    const user = makeUser({ isActive: false }, new UniqueEntityId('user-1'));

    await userRepository.create(user);

    const result = await sut.execute({ id: 'user-1' });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ConflictError);
  });
});
