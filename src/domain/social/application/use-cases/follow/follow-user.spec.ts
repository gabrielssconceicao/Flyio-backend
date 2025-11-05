import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ActionNotAllowedError } from '@/core/errors/action-not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeFollow } from '@/test/factories/make-follow';
import { makeUser } from '@/test/factories/make-user';
import { ImMemoryFollowRepository } from '@/test/repositories/in-memory-follow-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { FollowUserUseCase } from './follow-user';

let userRepository: InMemoryUsersRepository;
let followRepository: ImMemoryFollowRepository;

let sut: FollowUserUseCase;
describe('Follow User', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    followRepository = new ImMemoryFollowRepository();

    sut = new FollowUserUseCase(userRepository, followRepository);
  });

  it('should be able to follow a user', async () => {
    const user = makeUser({}, new UniqueEntityId('user-1'));
    const userToFollow = makeUser({}, new UniqueEntityId('user-2'));

    await userRepository.create(user);
    await userRepository.create(userToFollow);

    const result = await sut.execute({
      followerId: 'user-1',
      followingId: 'user-2',
    });

    expect(result.isRight()).toBe(true);
    expect(followRepository.items).toHaveLength(1);
    expect(followRepository.items[0]).toMatchObject({
      followerId: new UniqueEntityId('user-1'),
      followingId: new UniqueEntityId('user-2'),
    });
    expect(userRepository.items[0]?.followingCount).toBe(1);
    expect(userRepository.items[1]?.followersCount).toBe(1);
  });

  it('should not be able to follow yourself', async () => {
    const user = makeUser({}, new UniqueEntityId('user-1'));

    await userRepository.create(user);

    const result = await sut.execute({
      followerId: 'user-1',
      followingId: 'user-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ActionNotAllowedError);
  });

  it('should not be able to follow a non existing user', async () => {
    const user = makeUser({}, new UniqueEntityId('user-1'));

    await userRepository.create(user);

    const result = await sut.execute({
      followerId: 'user-1',
      followingId: 'non-existing-user-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to follow a user twice', async () => {
    const user = makeUser({}, new UniqueEntityId('user-1'));
    const userToFollow = makeUser({}, new UniqueEntityId('user-2'));
    const follow = makeFollow({
      followerId: user.id,
      followingId: userToFollow.id,
    });

    await userRepository.create(user);
    await userRepository.create(userToFollow);
    await followRepository.create(follow);

    const result = await sut.execute({
      followerId: 'user-1',
      followingId: 'user-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ActionNotAllowedError);
  });
});
