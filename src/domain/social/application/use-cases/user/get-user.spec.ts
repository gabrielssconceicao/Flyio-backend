import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeFollow } from '@/test/factory/make-follow';
import { makeUser, makeUsername } from '@/test/factory/make-user';
import { InMemoryFollowRepository } from '@/test/repository/in-memory-follow-repository';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { GetUserUseCase } from './get-user';

let userRepository: InMemoryUserRepository;
let followRepository: InMemoryFollowRepository;
let sut: GetUserUseCase;

describe('Get User Use Case', () => {
  beforeEach(() => {
    followRepository = new InMemoryFollowRepository();
    userRepository = new InMemoryUserRepository();
    sut = new GetUserUseCase(userRepository, followRepository);
  });

  it('should return a user by username', async () => {
    const target = makeUser({ username: makeUsername('johndoe') });
    await userRepository.create(target);
    await followRepository.create(
      makeFollow({
        follower_id: new UniqueEntityId('test-id'),
        following_id: target.id,
      }),
    );
    const response = await sut.execute({
      username: 'johndoe',
      viewerId: 'test-id',
    });

    expect(response.isRight()).toBe(true);
    expect(response.isRight() && response.value.user.username.value).toEqual(
      'johndoe',
    );
    expect(response.isRight() && response.value.isFollowing).toBe(true);
  });
  it('should not return a user if not found', async () => {
    const response = await sut.execute({
      username: 'johndoe',
      viewerId: 'test-id',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
