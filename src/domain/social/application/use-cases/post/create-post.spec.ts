import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeTag } from '@/test/factories/make-tag';
import { InMemoryPostRepository } from '@/test/repositories/in-memory-post-repository';
import { InMemoryTagRepository } from '@/test/repositories/in-memory-tag-repository';

import { CreatePostUseCase } from './create-post';

let postRepository: InMemoryPostRepository;
let tagRepository: InMemoryTagRepository;
let sut: CreatePostUseCase;

describe('Create Post', () => {
  beforeEach(() => {
    postRepository = new InMemoryPostRepository();
    tagRepository = new InMemoryTagRepository();
    sut = new CreatePostUseCase(postRepository, tagRepository);
  });

  it('should create a post', async () => {
    const result = await sut.execute({
      authorId: 'user-1',
      content: 'content',
      tags: [],
    });

    expect(result.isRight()).toBe(true);
    expect(postRepository.items[0]?.id).toEqual(result?.value?.post.id);
  });

  it('should create a post with tags', async () => {
    await tagRepository.create(makeTag({ name: 'tag-1' }));

    const result = await sut.execute({
      authorId: 'user-1',
      content: 'Content',
      tags: ['tag-1', 'tag-2'],
    });

    console.log(tagRepository.items);

    expect(result.isRight()).toBe(true);
    expect(tagRepository.items).toHaveLength(2);
    expect(tagRepository.items[0].name).toEqual('tag-1');
    expect(tagRepository.items[1].name).toEqual('tag-2');
    expect(postRepository.items[0]?.id).toEqual(result?.value?.post.id);
    expect(postRepository.items[0]?.tags).toHaveLength(2);
  });
});
