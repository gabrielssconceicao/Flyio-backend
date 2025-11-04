import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ConflictError } from '@/core/errors/conflict-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { ActivateUserUseCase } from './activate-user';

let userRepository: InMemoryUsersRepository;
let sut: ActivateUserUseCase;

describe('Activate User', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new ActivateUserUseCase(userRepository);
  });

  it('shoud be able to activate the user', async () => {
    const user = makeUser({ isActive: false }, new UniqueEntityId('user-1'));

    await userRepository.create(user);

    const result = await sut.execute({ id: 'user-1' });
    expect(result.isRight()).toBe(true);
    expect(userRepository.items[0]?.isActive).toBe(true);
  });

  it('should return a ResourceNotFoundError when user is not found', async () => {
    const result = await sut.execute({ id: 'not-found-id' });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should return a ConflictError when user is already activated', async () => {
    const user = makeUser({ isActive: true }, new UniqueEntityId('user-1'));

    await userRepository.create(user);

    const result = await sut.execute({ id: 'user-1' });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ConflictError);
  });
});
