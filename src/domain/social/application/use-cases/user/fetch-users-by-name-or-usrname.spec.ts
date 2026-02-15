import { makeUser, makeUsername } from '@/test/factory/make-user';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { FetchUsersByNameOrUsernameUseCase } from './fetch-users-by-name-or-username';

let userRepository: InMemoryUserRepository;
let sut: FetchUsersByNameOrUsernameUseCase;

describe('Get User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new FetchUsersByNameOrUsernameUseCase(userRepository);
  });

  it('should fetch users by name or username', async () => {
    await userRepository.create(
      makeUser({ username: makeUsername('johndoe') }),
    );
    await userRepository.create(makeUser({ name: 'John Doe' }));
    await userRepository.create(
      makeUser({ username: makeUsername('johndoe2jonh') }),
    );
    const response = await sut.execute({ search: 'john', page: 1 });

    expect(response.isRight()).toBe(true);
    expect(response.isRight() && response.value).toHaveLength(3);
  });
  it('should fetch users by name or username paginated', async () => {
    for (let i = 0; i <= 5; i++) {
      await userRepository.create(
        makeUser({ username: makeUsername(`johndoe_${i}`) }),
      );
    }
    const response = await sut.execute({
      search: 'johndoe',
      page: 2,
      limit: 5,
    });

    expect(response.isRight()).toBe(true);
    expect(response.value).toHaveLength(1);
  });
});
