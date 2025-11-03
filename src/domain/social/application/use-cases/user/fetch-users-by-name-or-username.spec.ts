import { makeUser } from '@/test/factories/make-user';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { FetchUsersByNameOrUsernameUseCase } from './fetch-users-by-name-or-username';

let usersRepository: InMemoryUsersRepository;
let sut: FetchUsersByNameOrUsernameUseCase;
describe('Fetch Users by name or username', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new FetchUsersByNameOrUsernameUseCase(usersRepository);
  });

  it('should be able to fetch users by name or username', async () => {
    await usersRepository.create(
      makeUser({
        username: 'johndoe',
      }),
    );
    await usersRepository.create(
      makeUser({
        name: 'John Doe',
      }),
    );
    await usersRepository.create(
      makeUser({
        username: 'maryjane',
      }),
    );

    const result = await sut.execute({
      query: 'doe',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.users).toHaveLength(2);
  });

  it('should be able to fetch paginated users', async () => {
    for (let i = 0; i < 22; i++) {
      await usersRepository.create(makeUser());
    }

    const result = await sut.execute({
      query: '',
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.users).toHaveLength(2);
  });
});
