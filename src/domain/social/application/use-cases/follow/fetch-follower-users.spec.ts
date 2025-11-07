import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeFollow } from '@/test/factories/make-follow';
import { makeUser } from '@/test/factories/make-user';
import { ImMemoryFollowRepository } from '@/test/repositories/in-memory-follow-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { FetchFollowerUsersUseCase } from './fetch-follower-users';

let userRepository: InMemoryUsersRepository;
let followRepository: ImMemoryFollowRepository;
let sut: FetchFollowerUsersUseCase;

describe('Fetch Follower Users', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    followRepository = new ImMemoryFollowRepository();
    sut = new FetchFollowerUsersUseCase(userRepository, followRepository);
  });

  it('should be able to get user followers', async () => {
    const user1 = makeUser(
      { username: 'johndoe' },
      new UniqueEntityId('user-1'),
    );
    const user2 = makeUser({}, new UniqueEntityId('user-2'));
    const user3 = makeUser({}, new UniqueEntityId('user-3'));

    const follow1 = makeFollow({
      followerId: user2.id,
      followingId: user1.id,
    });

    const follow2 = makeFollow({
      followerId: user2.id,
      followingId: user1.id,
    });

    await userRepository.create(user1);
    await userRepository.create(user2);
    await userRepository.create(user3);
    await followRepository.create(follow1);
    await followRepository.create(follow2);

    const result = await sut.execute({
      username: 'johndoe',
      page: 1,
    });

    expect(result.isRight()).toBe(true);

    expect(result.value?.followerUsers).toHaveLength(2);
    expect(result.value?.followerUsers).toEqual([
      expect.objectContaining({
        isFollowing: false,
      }),
      expect.objectContaining({
        isFollowing: false,
      }),
    ]);
  });

  it('should be able to get follower users from the current user', async () => {
    const user1 = makeUser({}, new UniqueEntityId('user-1'));
    const user2 = makeUser(
      { username: 'johndoe' },
      new UniqueEntityId('user-2'),
    );

    const follow1 = makeFollow({
      followerId: user1.id,
      followingId: user2.id,
    });

    const follow2 = makeFollow({
      followerId: user2.id,
      followingId: user1.id,
    });

    await userRepository.create(user1);
    await userRepository.create(user2);
    await followRepository.create(follow1);
    await followRepository.create(follow2);

    const result = await sut.execute({
      username: 'johndoe',
      currentUserId: 'user-1',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.followerUsers).toHaveLength(1);
    expect(result.value?.followerUsers).toEqual([
      expect.objectContaining({
        isFollowing: true,
      }),
    ]);
  });

  it('should be able to fetch paginated followers', async () => {
    const user1 = makeUser(
      { username: 'johndoe' },
      new UniqueEntityId('user-1'),
    );
    await userRepository.create(user1);
    for (let i = 1; i <= 22; i++) {
      const userToFollow = makeUser({}, new UniqueEntityId(`user-${i + 1}`));
      const follow = makeFollow({
        followerId: userToFollow.id,
        followingId: user1.id,
      });

      await userRepository.create(userToFollow);
      await followRepository.create(follow);
    }

    const result1 = await sut.execute({
      username: 'johndoe',
      page: 2,
    });

    expect(result1.isRight()).toBe(true);
    expect(result1.value?.followerUsers).toHaveLength(2);
  });
});
