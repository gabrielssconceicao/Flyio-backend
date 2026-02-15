import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeLike } from '@/test/factory/make-like';
import { makePost } from '@/test/factory/make-post';
import { InMemoryLikeRepository } from '@/test/repository/in-memory-like-repository';
import { InMemoryPostRepository } from '@/test/repository/in-memory-post-repository';

import { DislikePostUseCase } from './dislike-post';

let postRepository: InMemoryPostRepository;
let likeRepository: InMemoryLikeRepository;
let sut: DislikePostUseCase;

describe('Like Post Use Case', () => {
  beforeEach(() => {
    postRepository = new InMemoryPostRepository();
    likeRepository = new InMemoryLikeRepository();
    sut = new DislikePostUseCase(postRepository, likeRepository);
  });

  it('should be able to dislike post', async () => {
    const post = makePost({ likes_count: 1 });
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

    expect(result.isRight()).toBe(true);
    expect(postRepository.items[0].likes_count).toEqual(0);
    expect(likeRepository.items).toHaveLength(0);
  });

  it('should not be able to dislike a post that is not liked', async () => {
    const post = makePost();
    await postRepository.create(post);

    const result = await sut.execute({
      userId: 'test-id',
      postId: post.id.value,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should  be able to dislike post', async () => {
    const result = await sut.execute({
      userId: 'test-id',
      postId: 'error-post-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
