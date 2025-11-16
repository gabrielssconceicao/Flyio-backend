import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ActionNotAllowedError } from '@/core/errors/action-not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeInMemoryPostRepository } from '@/test/factories/make-in-memory-post-repository';
import { makePost } from '@/test/factories/make-post';
import { InMemoryPostRepository } from '@/test/repositories/in-memory-post-repository';

import { DeletePostUseCase } from './delete-post';

let postRepository: InMemoryPostRepository;
let sut: DeletePostUseCase;

describe('Delete Post', () => {
  beforeEach(() => {
    postRepository = makeInMemoryPostRepository();
    sut = new DeletePostUseCase(postRepository);
  });

  it('should be able to delete a post', async () => {
    postRepository.items.push(
      makePost(
        {
          author_id: new UniqueEntityId('user-1'),
        },
        new UniqueEntityId('post-1'),
      ),
    );

    const result = await sut.execute({
      postId: 'post-1',
      userId: 'user-1',
    });

    expect(result.isRight()).toBe(true);
    expect(postRepository.items[0].isDeleted).toBe(true);
    expect(postRepository.items[0].content).toBe(null);
    expect(postRepository.items[0].deleted_at).toBeInstanceOf(Date);
  });
  it('should not be able to delete a post that does not exist', async () => {
    const result = await sut.execute({
      postId: 'post-1',
      userId: 'user-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
  it('should not be able to delete a post that does not belong to the user', async () => {
    postRepository.items.push(
      makePost(
        {
          author_id: new UniqueEntityId('user-1'),
        },
        new UniqueEntityId('post-1'),
      ),
    );

    const result = await sut.execute({
      postId: 'post-1',
      userId: 'user-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ActionNotAllowedError);
  });
});
