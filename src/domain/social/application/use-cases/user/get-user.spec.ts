import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { GetUserUseCase } from './get-user';

let userRepository: InMemoryUsersRepository;
let sut: GetUserUseCase;

describe('Get User', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new GetUserUseCase(userRepository);
  });

  it('shoud be able to get a user', async () => {
    const user = makeUser({
      username: 'johndoe',
    });

    await userRepository.create(user);

    const result = await sut.execute({ username: 'johndoe' });
    expect(result.isRight()).toBe(true);
    expect(result.value?.user).toEqual(user);
  });

  it('should not be able to get a user', async () => {
    const result = await sut.execute({ username: 'johndoe' });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
