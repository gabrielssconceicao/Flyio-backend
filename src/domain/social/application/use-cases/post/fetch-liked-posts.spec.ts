import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makePost } from '@/test/factory/make-post';
import { makeUser, makeUsername } from '@/test/factory/make-user';
import { InMemoryPostsQueryRepository } from '@/test/repository/in-memory-posts-query-repository';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { FetchTimelineUseCase } from './fetch-liked-posts';

let sut: FetchTimelineUseCase;

let userRepository: InMemoryUserRepository;
let postsQueryRepository: InMemoryPostsQueryRepository;

describe('Fetch User Liked Posts Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();

    postsQueryRepository = new InMemoryPostsQueryRepository();

    sut = new FetchTimelineUseCase(postsQueryRepository, userRepository);
  });

  it('should fetch liked posts', async () => {
    const user = makeUser({
      username: makeUsername('johndoe'),
    });

    await userRepository.create(user);

    postsQueryRepository.items.push({
      author: makeUser(),
      post: makePost(),
      isLiked: true,
    });
    const result = await sut.execute({
      viewerId: user.id.value,
      username: user.username.value,
      page: 1,
      limit: 10,
    });

    expect(result.isRight()).toBe(true);

    expect(result.isRight() && result.value.posts).toHaveLength(1);

    expect(result.isRight() && result.value.posts[0].isLiked).toEqual(true);
  });

  it('should return error if user does not exist', async () => {
    const result = await sut.execute({
      viewerId: 'test-id',
      username: 'invalid',
      page: 1,
      limit: 10,
    });

    expect(result.isLeft()).toBe(true);

    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
