import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makePost } from '@/test/factories/make-post';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryPostRepository } from '@/test/repositories/in-memory-post-repository';
import { InMemoryTagRepository } from '@/test/repositories/in-memory-tag-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { FetchRecentPostsUseCase } from './fetch-recent-posts';

let postRepository: InMemoryPostRepository;
let userRepository: InMemoryUsersRepository;
let tagRepository: InMemoryTagRepository;
let sut: FetchRecentPostsUseCase;
describe('Fetch Recent Posts', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    tagRepository = new InMemoryTagRepository();
    postRepository = new InMemoryPostRepository(userRepository, tagRepository);
    sut = new FetchRecentPostsUseCase(postRepository);
  });

  it('should be able to fetch recent posts', async () => {
    const user = makeUser({}, new UniqueEntityId('user-1'));
    await userRepository.create(user);

    await postRepository.create(
      makePost({ author_id: user.id, created_at: new Date('2000-01-01') }),
    );
    await postRepository.create(
      makePost({ author_id: user.id, created_at: new Date('2000-01-02') }),
    );
    await postRepository.create(
      makePost({ author_id: user.id, created_at: new Date('2000-01-03') }),
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.posts).toHaveLength(3);
    expect(result.value?.posts[0].post.created_at).toEqual(
      new Date('2000-01-03'),
    );
  });

  it('should return paginated fetched posts', async () => {
    const user = makeUser({}, new UniqueEntityId('user-1'));
    await userRepository.create(user);

    for (let i = 1; i <= 22; i++) {
      const post = makePost({
        author_id: user.id,
        created_at: new Date(`2000-01-${i > 10 ? i : '0' + i}`),
      });
      await postRepository.create(post);
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.posts).toHaveLength(2);
    expect(result.value?.posts[1].post.created_at).toEqual(
      new Date('2000-01-01'),
    );
  });
});
