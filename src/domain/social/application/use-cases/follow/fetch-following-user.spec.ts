import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeFollow } from '@/test/factory/make-follow';
import { makeUser, makeUsername } from '@/test/factory/make-user';
import { InMemoryFollowRepository } from '@/test/repository/in-memory-follow-repository';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { FetchFollowingUsersUseCase } from './fetch-following-users';

let sut: FetchFollowingUsersUseCase;
let userRepository: InMemoryUserRepository;
let followRepository: InMemoryFollowRepository;

describe('Fetch Following Users Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    followRepository = new InMemoryFollowRepository();
    sut = new FetchFollowingUsersUseCase(userRepository, followRepository);
  });

  it('should be able to fetch following users', async () => {
    const user = makeUser({ username: makeUsername('johndoe') });
    const following_user_1 = makeUser();
    const following_user_2 = makeUser();
    const following_user_3 = makeUser();

    await userRepository.create(user);
    await userRepository.create(following_user_1);
    await userRepository.create(following_user_2);
    await userRepository.create(following_user_3);

    await followRepository.create(
      makeFollow({ follower_id: user.id, following_id: following_user_1.id }),
    );
    await followRepository.create(
      makeFollow({ follower_id: user.id, following_id: following_user_2.id }),
    );
    await followRepository.create(
      makeFollow({ follower_id: user.id, following_id: following_user_3.id }),
    );
    const result = await sut.execute({
      username: 'johndoe',
      viewerId: user.id.value,
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.isRight() && result.value.users).toHaveLength(3);
    expect(result.isRight() && result.value.count).toBe(3);
    expect(result.isRight() && result.value.users[0].following).toBe(true);
    expect(result.isRight() && result.value.users[1].following).toBe(true);
    expect(result.isRight() && result.value.users[2].following).toBe(true);
  });

  it('should be able to fetch following users with pagination', async () => {
    const user = makeUser({ username: makeUsername('johndoe') });
    await userRepository.create(user);

    for (let i = 0; i < 7; i++) {
      const following = makeUser();
      await userRepository.create(following);
      await followRepository.create(
        makeFollow({ follower_id: user.id, following_id: following.id }),
      );
    }
    const result = await sut.execute({
      username: 'johndoe',
      viewerId: user.id.value,
      page: 2,
      limit: 5,
    });

    expect(result.isRight()).toBe(true);
    expect(result.isRight() && result.value.users).toHaveLength(2);
    expect(result.isRight() && result.value.count).toBe(7);
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
