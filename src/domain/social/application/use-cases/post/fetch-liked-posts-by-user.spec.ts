import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeInMemoryPostRepository } from '@/test/factories/make-in-memory-post-repository';
import { makeLike } from '@/test/factories/make-like';
import { makePost } from '@/test/factories/make-post';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryLikeRepository } from '@/test/repositories/in-memory-like-repository';
import { InMemoryPostRepository } from '@/test/repositories/in-memory-post-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { FetchLikedPostsByUser } from './fetch-liked-posts-by-user';

let postRepository: InMemoryPostRepository;
let userRepository: InMemoryUsersRepository;
let likeRepository: InMemoryLikeRepository;
let sut: FetchLikedPostsByUser;
describe('Fetch Liked Posts By User', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    likeRepository = new InMemoryLikeRepository();
    postRepository = makeInMemoryPostRepository({
      userRepository,
      likeRepository,
    });
    sut = new FetchLikedPostsByUser(userRepository, postRepository);
  });

  it('should be able to fetch liked posts by a user', async () => {
    const user = makeUser({}, new UniqueEntityId('user-1'));

    const user2 = makeUser(
      { username: 'johndoe' },
      new UniqueEntityId('user-2'),
    );
    await userRepository.create(user);
    await userRepository.create(user2);

    const post1 = makePost({ author_id: user.id });
    const post2 = makePost({ author_id: user.id });
    const post3 = makePost({ author_id: user.id });

    await postRepository.create(post1);
    await postRepository.create(post2);
    await postRepository.create(post3);

    await likeRepository.create(
      makeLike({ user_id: user2.id, post_id: post1.id }),
    );
    await likeRepository.create(
      makeLike({ user_id: user2.id, post_id: post2.id }),
    );

    const result = await sut.execute({
      username: 'johndoe',
      page: 1,
      currentUserId: user.id.toString(),
    });

    console.log(result.value);
    expect(result.isRight()).toBe(true);
    expect(result.value?.posts).toHaveLength(2);
    expect(result.value?.posts).toMatchObject([
      {
        isLiked: false,
      },
      {
        isLiked: false,
      },
    ]);
  });
  it('should return NotFound when user not found', async () => {
    const result = await sut.execute({
      username: 'invalid-username',
      page: 1,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should return paginated fetched posts', async () => {
    const user = makeUser(
      { username: 'johndoe' },
      new UniqueEntityId('user-1'),
    );
    await userRepository.create(user);

    for (let i = 1; i <= 22; i++) {
      const post = makePost({
        author_id: user.id,
      });
      await postRepository.create(post);
      await likeRepository.create(
        makeLike({ user_id: user.id, post_id: post.id }),
      );
    }

    const result = await sut.execute({
      username: 'johndoe',
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.posts).toHaveLength(2);
    expect(result.value?.posts[0].isLiked).toEqual(false);
  });
});
