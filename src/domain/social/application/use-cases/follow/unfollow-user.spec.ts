import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ActionNotAllowedError } from '@/core/errors/action-not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeFollow } from '@/test/factories/make-follow';
import { makeUser } from '@/test/factories/make-user';
import { ImMemoryFollowRepository } from '@/test/repositories/in-memory-follow-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { UnfollowUserUseCase } from './unfollow-user';

let userRepository: InMemoryUsersRepository;
let followRepository: ImMemoryFollowRepository;

let sut: UnfollowUserUseCase;
describe('Unfollow User', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    followRepository = new ImMemoryFollowRepository();

    sut = new UnfollowUserUseCase(userRepository, followRepository);
  });

  it('should be able to unfollow a user', async () => {
    const user = makeUser(
      {
        followingCount: 1,
      },
      new UniqueEntityId('user-1'),
    );
    const userToUnfollow = makeUser(
      {
        followersCount: 1,
      },
      new UniqueEntityId('user-2'),
    );

    const follow = makeFollow({
      followerId: user.id,
      followingId: userToUnfollow.id,
    });

    await userRepository.create(user);
    await userRepository.create(userToUnfollow);
    await followRepository.create(follow);

    const result = await sut.execute({
      followerId: 'user-1',
      followingId: 'user-2',
    });
    expect(result.isRight()).toBe(true);
    expect(followRepository.items).toHaveLength(0);
    expect(userRepository.items[0]?.followingCount).toBe(0);
    expect(userRepository.items[1]?.followersCount).toBe(0);
  });

  it('should not be able to unfollow yourself', async () => {
    const user = makeUser({}, new UniqueEntityId('user-1'));

    await userRepository.create(user);

    const result = await sut.execute({
      followerId: 'user-1',
      followingId: 'user-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ActionNotAllowedError);
  });

  it('should not be able to unfollow a non existing user', async () => {
    const user = makeUser({}, new UniqueEntityId('user-1'));

    await userRepository.create(user);

    const result = await sut.execute({
      followerId: 'user-1',
      followingId: 'non-existing-user-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to unfollow a user that you are not following', async () => {
    const user = makeUser(
      {
        followingCount: 1,
      },
      new UniqueEntityId('user-1'),
    );
    const userToFollow = makeUser(
      {
        followersCount: 1,
      },
      new UniqueEntityId('user-2'),
    );

    await userRepository.create(user);
    await userRepository.create(userToFollow);

    const result = await sut.execute({
      followerId: 'user-1',
      followingId: 'user-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ActionNotAllowedError);
  });
});
