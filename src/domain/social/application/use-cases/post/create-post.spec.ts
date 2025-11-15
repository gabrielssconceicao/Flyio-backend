import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { User } from '@/domain/social/enterprise/entities/user';
import { makeInMemoryPostRepository } from '@/test/factories/make-in-memory-post-repository';
import { makeTag } from '@/test/factories/make-tag';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryPostRepository } from '@/test/repositories/in-memory-post-repository';
import { InMemoryTagRepository } from '@/test/repositories/in-memory-tag-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { CreatePostUseCase } from './create-post';

let postRepository: InMemoryPostRepository;
let tagRepository: InMemoryTagRepository;
let userRepository: InMemoryUsersRepository;
let sut: CreatePostUseCase;

let user: User;
describe('Create Post', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    tagRepository = new InMemoryTagRepository();
    postRepository = makeInMemoryPostRepository({
      userRepository,
      tagRepository,
    });
    sut = new CreatePostUseCase(postRepository, tagRepository);
    user = makeUser({}, new UniqueEntityId('user-1'));
  });

  it('should create a post', async () => {
    await userRepository.create(user);

    const result = await sut.execute({
      authorId: 'user-1',
      content: 'content',
      tagNames: [],
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.isLiked).toEqual(false);
    expect(postRepository.items[0]?.id).toEqual(result?.value?.post.id);
    expect(postRepository.items[0]?.author_id).toEqual(
      result?.value?.author.id,
    );
  });

  it('should create a post with tags', async () => {
    await userRepository.create(user);
    await tagRepository.create(makeTag({ name: 'tag-1' }));

    const result = await sut.execute({
      authorId: 'user-1',
      content: 'Content',
      tagNames: ['tag-1', 'tag-2'],
    });
    expect(result.isRight()).toBe(true);
    expect(tagRepository.items).toHaveLength(2);
    expect(tagRepository.items[0].name).toEqual('tag-1');
    expect(tagRepository.items[1].name).toEqual('tag-2');
    expect(postRepository.items[0]?.id).toEqual(result?.value?.post.id);
    expect(postRepository.items[0]?.author_id).toEqual(
      result?.value?.author.id,
    );
    expect(postRepository.items[0]?.tags).toHaveLength(2);
  });
});
