import { AlreadyFollowingError } from '@/core/errors/already-follow-error';
import { FollowYourselfError } from '@/core/errors/follow-yourself-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeFollow } from '@/test/factory/make-follow';
import { makeUser } from '@/test/factory/make-user';
import { InMemoryFollowRepository } from '@/test/repository/in-memory-follow-repository';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { FollowwUseCase } from './follow';

let sut: FollowwUseCase;
let userRepository: InMemoryUserRepository;
let followRepository: InMemoryFollowRepository;

describe('Follow Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    followRepository = new InMemoryFollowRepository();
    sut = new FollowwUseCase(followRepository, userRepository);
  });

  it('should be able to follow a user', async () => {
    const user = makeUser();
    const following = makeUser();
    await userRepository.create(user);
    await userRepository.create(following);

    const result = await sut.execute({
      followerId: user.id.value,
      followingId: following.id.value,
    });

    expect(result.isRight()).toBe(true);
    expect(user.following_count).toBe(1);
    expect(userRepository.items[0].following_count).toBe(1);
    expect(following.followers_count).toBe(1);
    expect(userRepository.items[1].followers_count).toBe(1);
  });

  it('should not be able to follow yourself', async () => {
    const result = await sut.execute({
      followerId: 'user-1',
      followingId: 'user-1',
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(FollowYourselfError);
  });

  it('should not be able to follow the same user twice', async () => {
    const user = makeUser({});
    const following = makeUser();
    await userRepository.create(user);
    await userRepository.create(following);

    const follow = makeFollow({
      follower_id: user.id,
      following_id: following.id,
    });
    await followRepository.create(follow);

    const result = await sut.execute({
      followerId: user.id.value,
      followingId: following.id.value,
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyFollowingError);
  });

  it('should not be able to follow a non-existing user', async () => {
    const user = makeUser();
    await userRepository.create(user);

    const result = await sut.execute({
      followerId: user.id.value,
      followingId: 'non-existing-user',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
