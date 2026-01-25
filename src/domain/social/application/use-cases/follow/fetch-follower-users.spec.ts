import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeFollow } from '@/test/factory/make-follow';
import { makeUser, makeUsername } from '@/test/factory/make-user';
import { InMemoryFollowRepository } from '@/test/repository/in-memory-follow-repository';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { FetchFollowerUsersUseCase } from './fetch-follower-users';

let sut: FetchFollowerUsersUseCase;
let userRepository: InMemoryUserRepository;
let followRepository: InMemoryFollowRepository;

describe('Fetch Follower Users Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    followRepository = new InMemoryFollowRepository();
    sut = new FetchFollowerUsersUseCase(userRepository, followRepository);
  });

  it('should be able to fetch follower users', async () => {
    const viewer = makeUser({ username: makeUsername('johndoe') });
    const targetUser = makeUser({ username: makeUsername('johndoe2') });
    const user3 = makeUser({ username: makeUsername('johndoe3') });
    const user4 = makeUser({ username: makeUsername('johndoe4') });

    await userRepository.create(viewer);
    await userRepository.create(targetUser);
    await userRepository.create(user3);
    await userRepository.create(user4);

    await followRepository.create(
      makeFollow({ follower_id: viewer.id, following_id: targetUser.id }),
    );
    await followRepository.create(
      makeFollow({ follower_id: viewer.id, following_id: user3.id }),
    );

    await followRepository.create(
      makeFollow({ follower_id: user3.id, following_id: targetUser.id }),
    );
    await followRepository.create(
      makeFollow({ follower_id: user4.id, following_id: targetUser.id }),
    );

    const result = await sut.execute({
      username: 'johndoe2',
      viewerId: viewer.id.value,
      page: 1,
    });

    expect(result.isRight() && result.value.users).toHaveLength(3);
    expect(result.isRight() && result.value.count).toBe(3);

    if (result.isRight()) {
      const user3Follower = result.value.users.find(
        (item) => item.user.username.value === 'johndoe3',
      );
      const user4Follower = result.value.users.find(
        (item) => item.user.username.value === 'johndoe4',
      );

      expect(user3Follower?.isFollowing).toBe(true);
      expect(user4Follower?.isFollowing).toBe(false);
    }
  });
  it('should be able to fetch following users with pagination', async () => {
    const viewer = makeUser({ username: makeUsername('viewer') });
    const targetUser = makeUser({ username: makeUsername('johndoe') });

    await userRepository.create(viewer);
    await userRepository.create(targetUser);

    for (let i = 0; i < 8; i++) {
      const follower = makeUser();
      await userRepository.create(follower);
      await followRepository.create(
        makeFollow({ follower_id: follower.id, following_id: targetUser.id }),
      );
    }

    const result = await sut.execute({
      username: 'johndoe',
      viewerId: viewer.id.value,
      page: 2,
      limit: 5,
    });

    expect(result.isRight()).toBe(true);
    expect(result.isRight() && result.value.users).toHaveLength(3);
    expect(result.isRight() && result.value.count).toBe(8);
  });

  it('should not be able to fetch following users with non-existing user', async () => {
    const result = await sut.execute({
      username: 'non-existing-user',
      viewerId: 'any-existing-user',
      page: 1,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
