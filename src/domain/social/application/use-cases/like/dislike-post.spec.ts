import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ActionNotAllowedError } from '@/core/errors/action-not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeInMemoryPostRepository } from '@/test/factories/make-in-memory-post-repository';
import { makeLike } from '@/test/factories/make-like';
import { makePost } from '@/test/factories/make-post';
import { InMemoryLikeRepository } from '@/test/repositories/in-memory-like-repository';
import { InMemoryPostRepository } from '@/test/repositories/in-memory-post-repository';

import { DislikeUseCase } from './dislike-post';

let postRepository: InMemoryPostRepository;
let likeRepository: InMemoryLikeRepository;
let sut: DislikeUseCase;

describe('Deslike Post', () => {
  beforeEach(() => {
    postRepository = makeInMemoryPostRepository();
    likeRepository = new InMemoryLikeRepository();
    sut = new DislikeUseCase(postRepository, likeRepository);
  });

  it('should be able to deslike a post', async () => {
    const post = makePost(
      {
        likes: 1,
      },
      new UniqueEntityId('post-1'),
    );
    postRepository.items.push(post);
    await likeRepository.create(
      makeLike({ post_id: post.id, user_id: new UniqueEntityId('user-1') }),
    );
    const result = await sut.execute({
      postId: 'post-1',
      userId: 'user-1',
    });

    expect(result.isRight()).toBe(true);
    expect(likeRepository.items).toHaveLength(0);
    expect(postRepository.items[0]?.likes).toBe(0);
  });
  it('should not be able to deslike a post twice', async () => {
    const post = makePost(
      {
        likes: 1,
      },
      new UniqueEntityId('post-1'),
    );
    postRepository.items.push(post);
    await likeRepository.create(
      makeLike({ post_id: post.id, user_id: new UniqueEntityId('user-1') }),
    );

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
    expect(postRepository.items[0]?.likes).toBe(0);
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
