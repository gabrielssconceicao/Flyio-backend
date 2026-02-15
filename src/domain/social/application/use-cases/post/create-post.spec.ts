import { InMemoryPostRepository } from '@/test/repository/in-memory-post-repository';

import { CreatePostUseCase } from './create-post';

let sut: CreatePostUseCase;
let postRepository: InMemoryPostRepository;

describe('Create Post Use Case', () => {
  beforeEach(() => {
    postRepository = new InMemoryPostRepository();
    sut = new CreatePostUseCase(postRepository);
  });

  it('should create a post', async () => {
    const response = await sut.execute({
      authorId: 'test-id',
      content: 'test-content',
    });

    expect(response.isRight()).toBe(true);
    expect(postRepository.items[0].content).toEqual('test-content');
    expect(postRepository.items[0].author_id.value).toEqual('test-id');
  });
});
