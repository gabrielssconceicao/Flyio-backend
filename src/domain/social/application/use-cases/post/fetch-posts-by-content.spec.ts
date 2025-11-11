import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makePost } from '@/test/factories/make-post';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryPostRepository } from '@/test/repositories/in-memory-post-repository';
import { InMemoryTagRepository } from '@/test/repositories/in-memory-tag-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { FetchPostsByContentUseCase } from './fetch-posts-by-content';

let postRepository: InMemoryPostRepository;
let userRepository: InMemoryUsersRepository;
let tagRepository: InMemoryTagRepository;

let sut: FetchPostsByContentUseCase;

describe('Fetch Posts By Content', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    tagRepository = new InMemoryTagRepository();
    postRepository = new InMemoryPostRepository(userRepository, tagRepository);
    sut = new FetchPostsByContentUseCase(postRepository);
  });

  it('should be able to fetch posts by content', async () => {
    const user = makeUser({}, new UniqueEntityId('user-1'));
    await userRepository.create(user);

    await postRepository.create(
      makePost({ author_id: user.id, content: 'lorem ipsum' }),
    );
    await postRepository.create(
      makePost({ author_id: user.id, content: 'lorem sit' }),
    );
    await postRepository.create(
      makePost({ author_id: user.id, content: 'ipsum dolor' }),
    );
    await postRepository.create(
      makePost({ author_id: user.id, content: 'dolor sit' }),
    );

    const result = await sut.execute({
      query: 'lorem ipsum',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.posts).toHaveLength(3);
  });

  it('should return paginated fetched posts', async () => {
    const user = makeUser({}, new UniqueEntityId('user-1'));
    await userRepository.create(user);

    for (let i = 1; i <= 22; i++) {
      await postRepository.create(
        makePost({ author_id: user.id, content: `lorem ipsum ${i}` }),
      );
    }

    const result = await sut.execute({
      query: 'lorem ipsum',
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.posts).toHaveLength(2);
  });
});
