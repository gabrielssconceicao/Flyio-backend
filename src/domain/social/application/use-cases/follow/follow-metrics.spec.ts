import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeFollow } from '@/test/factory/make-follow';
import { makeUser, makeUsername } from '@/test/factory/make-user';
import { InMemoryFollowRepository } from '@/test/repository/in-memory-follow-repository';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { FollowMetricsUseCase } from './follow-metrics';

let sut: FollowMetricsUseCase;
let followRepository: InMemoryFollowRepository;
let userRepository: InMemoryUserRepository;

describe('Follow Metrics Use Case', () => {
  beforeEach(() => {
    followRepository = new InMemoryFollowRepository();
    userRepository = new InMemoryUserRepository();
    sut = new FollowMetricsUseCase(userRepository, followRepository);
  });
  it('should get user follow metrics', async () => {
    const target = makeUser({ username: makeUsername('johndoe') });
    await userRepository.create(target);

    await followRepository.create(
      makeFollow({
        follower_id: target.id,
        following_id: new UniqueEntityId(),
      }),
    );
    await followRepository.create(
      makeFollow({
        follower_id: target.id,
        following_id: new UniqueEntityId(),
      }),
    );
    await followRepository.create(
      makeFollow({
        follower_id: target.id,
        following_id: new UniqueEntityId(),
      }),
    );
    await followRepository.create(
      makeFollow({
        follower_id: new UniqueEntityId(),
        following_id: target.id,
      }),
    );
    await followRepository.create(
      makeFollow({
        follower_id: new UniqueEntityId(),
        following_id: target.id,
      }),
    );

    const result = await sut.execute({
      username: 'johndoe',
    });
    expect(result.isRight()).toBe(true);
    expect(result.isRight() && result.value.metrics).toEqual({
      followersCount: 2,
      followingCount: 3,
    });
  });

  it('should not get user follow metrics if user not found', async () => {
    const result = await sut.execute({
      username: 'non-existing-user',
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
