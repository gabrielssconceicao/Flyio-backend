import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { GetUserProfileUseCase } from './get-user-profile';

let userRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(userRepository);
  });

  it('shoud be able to get user profile', async () => {
    const user = makeUser({}, new UniqueEntityId('teste-id'));

    await userRepository.create(user);

    const result = await sut.execute({ id: 'teste-id' });
    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: expect.objectContaining({
        id: new UniqueEntityId('teste-id'),
      }),
    });
  });

  it('should return a ResourceNotFoundError when user profile is not found', async () => {
    const result = await sut.execute({ id: 'error-id' });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
