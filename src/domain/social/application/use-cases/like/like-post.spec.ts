import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ActionNotAllowedError } from '@/core/errors/action-not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeInMemoryPostRepository } from '@/test/factories/make-in-memory-post-repository';
import { makePost } from '@/test/factories/make-post';
import { InMemoryLikeRepository } from '@/test/repositories/in-memory-like-repository';
import { InMemoryPostRepository } from '@/test/repositories/in-memory-post-repository';

import { LikePostUseCase } from './like-post';

let postRepository: InMemoryPostRepository;
let likeRepository: InMemoryLikeRepository;
let sut: LikePostUseCase;

describe('Like Post', () => {
  beforeEach(() => {
    postRepository = makeInMemoryPostRepository();
    likeRepository = new InMemoryLikeRepository();
    sut = new LikePostUseCase(postRepository, likeRepository);
  });

  it('should be able to like a post', async () => {
    const post = makePost({}, new UniqueEntityId('post-1'));
    postRepository.items.push(post);

    const result = await sut.execute({
      postId: 'post-1',
      userId: 'user-1',
    });

    expect(result.isRight()).toBe(true);
    expect(likeRepository.items).toHaveLength(1);
    expect(likeRepository.items[0]).toMatchObject({
      post_id: post.id,
      user_id: new UniqueEntityId('user-1'),
    });
    expect(postRepository.items[0]?.likes).toBe(1);
  });
  it('should not be able to like a post twice', async () => {
    const post = makePost({}, new UniqueEntityId('post-1'));
    postRepository.items.push(post);

    await sut.execute({
      postId: 'post-1',
      userId: 'user-1',
    });

    const result = await sut.execute({
      postId: 'post-1',
      userId: 'user-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ActionNotAllowedError);
    expect(postRepository.items[0]?.likes).toBe(1);
  });
  it('should not be able to like a non existing post', async () => {
    const result = await sut.execute({
      postId: 'post-1',
      userId: 'user-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
