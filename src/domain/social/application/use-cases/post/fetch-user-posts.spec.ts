import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeInMemoryPostRepository } from '@/test/factories/make-in-memory-post-repository';
import { makePost } from '@/test/factories/make-post';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryPostRepository } from '@/test/repositories/in-memory-post-repository';
import { InMemoryTagRepository } from '@/test/repositories/in-memory-tag-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { FetchUserPostsUseCase } from './fetch-user-posts';

let postRepository: InMemoryPostRepository;
let userRepository: InMemoryUsersRepository;
let tagRepository: InMemoryTagRepository;

let sut: FetchUserPostsUseCase;

describe('Fetch User Posts', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    tagRepository = new InMemoryTagRepository();
    postRepository = makeInMemoryPostRepository({
      userRepository,
      tagRepository,
    });
    sut = new FetchUserPostsUseCase(userRepository, postRepository);
  });

  it('should be able to fetch user posts by username', async () => {
    const user = makeUser(
      { username: 'johndoe' },
      new UniqueEntityId('user-1'),
    );
    const user2 = makeUser({}, new UniqueEntityId('user-2'));
    await userRepository.create(user);
    await userRepository.create(user2);

    await postRepository.create(
      makePost({ author_id: user.id, created_at: new Date('2000-01-01') }),
    );
    await postRepository.create(
      makePost({ author_id: user2.id, created_at: new Date('2000-01-02') }),
    );
    await postRepository.create(
      makePost({ author_id: user.id, created_at: new Date('2000-01-03') }),
    );

    const result = await sut.execute({
      username: 'johndoe',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.posts).toHaveLength(2);
    expect(result.value?.posts[0]?.author.username).toEqual('johndoe');
    expect(result.value?.posts[0]?.post.created_at).toEqual(
      new Date('2000-01-03'),
    );
  });

  it('should return paginated fetched posts', async () => {
    const user = makeUser(
      { username: 'johndoe' },
      new UniqueEntityId('user-1'),
    );
    await userRepository.create(user);

    for (let i = 1; i <= 22; i++) {
      const post = makePost({
        author_id: user.id,
      });
      await postRepository.create(post);
    }

    const result = await sut.execute({
      username: 'johndoe',
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.posts).toHaveLength(2);
    expect(result.value?.posts[1].author.username).toEqual('johndoe');
  });
});
