import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeFollow } from '@/test/factories/make-follow';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryFollowRepository } from '@/test/repositories/in-memory-follow-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { FetchUsersByNameOrUsernameUseCase } from './fetch-users-by-name-or-username';

let usersRepository: InMemoryUsersRepository;
let followRepository: InMemoryFollowRepository;
let sut: FetchUsersByNameOrUsernameUseCase;
describe('Fetch Users by name or username', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    followRepository = new InMemoryFollowRepository();
    sut = new FetchUsersByNameOrUsernameUseCase(
      usersRepository,
      followRepository,
    );
  });

  it('should be able to fetch active users by name or username', async () => {
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
    await usersRepository.create(
      makeUser({
        username: 'doe',
        isActive: false,
      }),
    );

    const result = await sut.execute({
      query: 'doe',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.users).toHaveLength(2);
    expect(result.value?.users).toEqual([
      expect.objectContaining({ isFollowing: false }),
      expect.objectContaining({ isFollowing: false }),
    ]);
  });
  it('should be able to fetch active users by name or username from the current user', async () => {
    const user1 = makeUser(
      {
        username: 'johndoe',
      },
      new UniqueEntityId('user-1'),
    );
    const user2 = makeUser(
      {
        name: 'John Doe',
      },
      new UniqueEntityId('user-2'),
    );
    await usersRepository.create(user1);
    await usersRepository.create(user2);
    await usersRepository.create(
      makeUser({
        username: 'maryjane',
      }),
    );
    await usersRepository.create(
      makeUser({
        username: 'doe',
        isActive: false,
      }),
    );

    await followRepository.create(
      makeFollow({
        followerId: user1.id,
        followingId: user2.id,
      }),
    );

    const result = await sut.execute({
      query: 'doe',
      page: 1,
      currentUserId: 'user-1',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.users).toHaveLength(1);
    expect(result.value?.users).toEqual([
      expect.objectContaining({ isFollowing: true }),
    ]);
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
