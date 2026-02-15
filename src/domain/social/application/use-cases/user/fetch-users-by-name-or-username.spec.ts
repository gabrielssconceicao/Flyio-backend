import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeFollow } from '@/test/factory/make-follow';
import { makeUser, makeUsername } from '@/test/factory/make-user';
import { InMemoryFollowRepository } from '@/test/repository/in-memory-follow-repository';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { FetchUsersByNameOrUsernameUseCase } from './fetch-users-by-name-or-username';

let userRepository: InMemoryUserRepository;
let followRepository: InMemoryFollowRepository;
let sut: FetchUsersByNameOrUsernameUseCase;

describe('Fetch Users By Name Or Username', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    followRepository = new InMemoryFollowRepository();
    sut = new FetchUsersByNameOrUsernameUseCase(
      userRepository,
      followRepository,
    );
  });

  it('should fetch users by name or username', async () => {
    const target = makeUser({ username: makeUsername('johndoe') });
    const user2 = makeUser({ username: makeUsername('marydoe') });
    const user3 = makeUser({ name: 'John Doe' });

    await userRepository.create(target);
    await userRepository.create(user2);
    await userRepository.create(user3);

    await followRepository.create(
      makeFollow({
        follower_id: new UniqueEntityId('test-id'),
        following_id: target.id,
      }),
    );

    const response = await sut.execute({
      search: 'john',
      viewerId: 'test-id',
      page: 1,
    });

    expect(response.isRight()).toBe(true);
    expect(response.isRight() && response.value.users).toHaveLength(2);
    expect(response.isRight() && response.value.users[0].isFollowing).toBe(
      true,
    );
    expect(response.isRight() && response.value.users[1].isFollowing).toBe(
      false,
    );
    expect(response.isRight() && response.value.users[0].user.id).toEqual(
      target.id,
    );
  });
  it('should fetch users by name or username paginated', async () => {
    for (let i = 0; i <= 5; i++) {
      await userRepository.create(
        makeUser({ username: makeUsername(`johndoe_${i}`) }),
      );
    }
    const response = await sut.execute({
      search: 'johndoe',
      viewerId: 'test-id',
      page: 2,
      limit: 5,
    });

    expect(response.isRight()).toBe(true);
    expect(response.isRight() && response.value.users).toHaveLength(1);
  });
});
