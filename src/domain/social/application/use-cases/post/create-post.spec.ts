import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryPostRepository } from '@/test/repositories/in-memory-post-repository';

import { CreatePostUseCase } from './create-post';

let postRepository: InMemoryPostRepository;
let sut: CreatePostUseCase;

describe('Create Post', () => {
  beforeEach(() => {
    postRepository = new InMemoryPostRepository();
    sut = new CreatePostUseCase(postRepository);
  });

  it('should create a post', async () => {
    const result = await sut.execute({
      authorId: 'user-1',
      content: 'content',
    });

    expect(result.isRight()).toBe(true);
    expect(postRepository.items[0]?.id).toEqual(result?.value?.post.id);
  });
});
