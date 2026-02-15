import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PostAlreadyLikedError } from '@/core/errors/like/post-already-liked-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeLike } from '@/test/factory/make-like';
import { makePost } from '@/test/factory/make-post';
import { InMemoryLikeRepository } from '@/test/repository/in-memory-like-repository';
import { InMemoryPostRepository } from '@/test/repository/in-memory-post-repository';

import { LikePostUseCase } from './like-post';

let postRepository: InMemoryPostRepository;
let likeRepository: InMemoryLikeRepository;
let sut: LikePostUseCase;

describe('Like Post Use Case', () => {
  beforeEach(() => {
    postRepository = new InMemoryPostRepository();
    likeRepository = new InMemoryLikeRepository();
    sut = new LikePostUseCase(postRepository, likeRepository);
  });

  it('should like a post', async () => {
    const post = makePost();
    await postRepository.create(post);

    const result = await sut.execute({
      userId: 'test-id',
      postId: post.id.value,
    });

    expect(result.isRight()).toBe(true);
    expect(postRepository.items[0].likes_count).toBe(1);
    expect(likeRepository.items).toHaveLength(1);
  });

  it('should not be able to like a non-existing post', async () => {
    const result = await sut.execute({
      userId: 'test-id',
      postId: 'error-post-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to like a post twice', async () => {
    const post = makePost();
    await postRepository.create(post);

    const like = makeLike({
      user_id: new UniqueEntityId('test-id'),
      post_id: post.id,
    });

    await likeRepository.create(like);

    const result = await sut.execute({
      userId: 'test-id',
      postId: post.id.value,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PostAlreadyLikedError);
  });
});
