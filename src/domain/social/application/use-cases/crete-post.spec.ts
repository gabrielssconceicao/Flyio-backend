import { InMemoryPostsRepository } from '@/test/domain/repositories/in-memory-post-repository';

import { CreatePostUseCase } from './create-post';

let sut: CreatePostUseCase;
let postsRepository: InMemoryPostsRepository;
describe('Create Post Use Case', () => {
  beforeEach(() => {
    postsRepository = new InMemoryPostsRepository();
    sut = new CreatePostUseCase(postsRepository);
  });
  it('should be able to create a new post', async () => {
    const response = await sut.handle({
      authorId: '12-3456-78-9',
      content: 'lorem ipsum',
    });

    if (response.isLeft()) {
      throw new Error('Should be right');
    }

    expect(response.isRight()).toBe(true);
    expect(response.value.authorId.value).toEqual('12-3456-78-9');
    expect(response.value.content).toEqual('lorem ipsum');
  });
});
