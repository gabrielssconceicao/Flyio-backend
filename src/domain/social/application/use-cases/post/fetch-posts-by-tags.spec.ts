import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeInMemoryPostRepository } from '@/test/factories/make-in-memory-post-repository';
import { makePost } from '@/test/factories/make-post';
import { makePostTag } from '@/test/factories/make-post-tag';
import { makeTag } from '@/test/factories/make-tag';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryPostRepository } from '@/test/repositories/in-memory-post-repository';
import { InMemoryTagRepository } from '@/test/repositories/in-memory-tag-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { FetchPostsByTagUseCase } from './fetch-posts-by-tags';

let postRepository: InMemoryPostRepository;
let userRepository: InMemoryUsersRepository;
let tagRepository: InMemoryTagRepository;
let sut: FetchPostsByTagUseCase;

describe('Fetch Posts By Content', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    tagRepository = new InMemoryTagRepository();
    postRepository = makeInMemoryPostRepository({
      userRepository,
      tagRepository,
    });
    sut = new FetchPostsByTagUseCase(postRepository);
  });

  it('should be able to fetch posts by tags', async () => {
    const user = makeUser({}, new UniqueEntityId('user-1'));
    await userRepository.create(user);

    const tag1 = makeTag({ name: 'tag-1' });
    const tag2 = makeTag({ name: 'tag-2' });
    const tag3 = makeTag({ name: 'tag-3' });

    await tagRepository.create(tag1);
    await tagRepository.create(tag2);
    await tagRepository.create(tag3);

    const post1 = makePost({ author_id: user.id });
    post1.tags = [
      makePostTag({ tagId: tag1.id, postId: post1.id }),
      makePostTag({ tagId: tag2.id, postId: post1.id }),
    ];
    const post2 = makePost({ author_id: user.id });
    post2.tags = [
      makePostTag({ tagId: tag2.id, postId: post2.id }),
      makePostTag({ tagId: tag3.id, postId: post2.id }),
    ];
    const post3 = makePost({ author_id: user.id });
    post3.tags = [makePostTag({ tagId: tag3.id, postId: post3.id })];

    await postRepository.create(post1);
    await postRepository.create(post2);
    await postRepository.create(post3);

    const result = await sut.execute({
      query: ['tag-1', 'tag-2'],
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.posts).toHaveLength(2);
  });

  it('should return paginated fetched posts', async () => {
    const user = makeUser({}, new UniqueEntityId('user-1'));
    await userRepository.create(user);

    const tag = makeTag({ name: 'tag-1' });
    await tagRepository.create(tag);

    for (let i = 1; i <= 22; i++) {
      const post = makePost({ author_id: user.id });
      const postTag = makePostTag({ tagId: tag.id, postId: post.id });
      post.tags = [postTag];
      await postRepository.create(post);
    }

    const result = await sut.execute({
      query: ['tag-1'],
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.posts).toHaveLength(2);
  });
});
