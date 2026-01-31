import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makePost } from '@/test/factory/make-post';
import { InMemoryPostRepository } from '@/test/repository/in-memory-post-repository';

import { DeletePostUseCase } from './delete-post';

let sut: DeletePostUseCase;
let postRepository: InMemoryPostRepository;

describe('Delete Post Use Case', () => {
  beforeEach(() => {
    postRepository = new InMemoryPostRepository();
    sut = new DeletePostUseCase(postRepository);
  });

  it('should delete a post', async () => {
    const post = makePost(
      {
        author_id: new UniqueEntityId('test-author-id'),
      },
      new UniqueEntityId('test-id'),
    );

    await postRepository.create(post);
    const response = await sut.execute({
      authorId: 'test-author-id',
      postId: 'test-id',
    });

    expect(response.isRight()).toBe(true);
    expect(postRepository.items[0].deleted_at).toBeInstanceOf(Date);
  });

  it('should not delete a post if not found', async () => {
    const response = await sut.execute({
      authorId: 'test-author-id',
      postId: 'fail-test-id',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not delete a post from another author', async () => {
    const post = makePost(
      {
        author_id: new UniqueEntityId('test-author-id'),
      },
      new UniqueEntityId('test-id'),
    );

    await postRepository.create(post);
    const response = await sut.execute({
      authorId: 'fail-test-author-id',
      postId: 'test-id',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(NotAllowedError);
  });
});
