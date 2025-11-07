import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeFollow } from '@/test/factories/make-follow';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryFollowRepository } from '@/test/repositories/in-memory-follow-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { GetUserUseCase } from './get-user';

let userRepository: InMemoryUsersRepository;
let followRepository: InMemoryFollowRepository;
let sut: GetUserUseCase;

describe('Get User', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    followRepository = new InMemoryFollowRepository();
    sut = new GetUserUseCase(userRepository, followRepository);
  });

  it('shoud be able to get a user that are not following', async () => {
    const user = makeUser({
      username: 'johndoe',
    });

    await userRepository.create(user);

    const result = await sut.execute({ username: 'johndoe' });
    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: expect.objectContaining({
        username: 'johndoe',
      }),
      isFollowing: false,
    });
  });
  it('shoud be able to get a user that are following', async () => {
    const user = makeUser(
      {
        username: 'johndoe',
      },
      new UniqueEntityId('user-2'),
    );
    const follow = makeFollow({
      followerId: new UniqueEntityId('user-1'),
      followingId: user.id,
    });
    await userRepository.create(user);
    await followRepository.create(follow);

    const result = await sut.execute({
      username: 'johndoe',
      currentUserId: 'user-1',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: expect.objectContaining({
        username: 'johndoe',
      }),
      isFollowing: true,
    });
  });

  it('should return a ResourceNotFoundError when user is not found', async () => {
    const result = await sut.execute({ username: 'johndoe' });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
