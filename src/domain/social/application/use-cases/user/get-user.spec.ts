import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUser, makeUsername } from '@/test/factory/make-user';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { GetUserUseCase } from './get-user';

let userRepository: InMemoryUserRepository;
let sut: GetUserUseCase;

describe('Get User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new GetUserUseCase(userRepository);
  });

  it('should return a user by username', async () => {
    await userRepository.create(
      makeUser({ username: makeUsername('johndoe') }),
    );
    const response = await sut.execute({ username: 'johndoe' });

    expect(response.isRight()).toBe(true);
    expect(response.isRight() && response.value.username.value).toEqual(
      'johndoe',
    );
  });
  it('should return a user by username', async () => {
    const response = await sut.execute({ username: 'johndoe' });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
