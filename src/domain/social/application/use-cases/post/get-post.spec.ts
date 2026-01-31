import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makePost } from '@/test/factory/make-post';
import { makeUser } from '@/test/factory/make-user';
import { InMemoryPostRepository } from '@/test/repository/in-memory-post-repository';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { PostRepository } from '../../repository/post-repository';
import { UserRepository } from '../../repository/user-repository';
import { GetPostUseCase } from './get-post';

let sut: GetPostUseCase;
let postRepository: InMemoryPostRepository;
let userRepository: InMemoryUserRepository;

describe('Get Post Use Case', () => {
  beforeEach(() => {
    postRepository = new InMemoryPostRepository();
    userRepository = new InMemoryUserRepository();
    sut = new GetPostUseCase(postRepository, userRepository);
  });

  it('should get a post', async () => {
    const author = makeUser();
    const post = makePost(
      {
        author_id: author.id,
      },
      new UniqueEntityId('post-id-1'),
    );

    await postRepository.create(post);
    await userRepository.create(author);

    const response = await sut.execute({
      postId: 'post-id-1',
    });

    expect(response.isRight()).toBe(true);
    expect(response.isRight() && response.value.post.id.value).toEqual(
      post.id.value,
    );
    expect(response.isRight() && response.value.author.id.value).toEqual(
      author.id.value,
    );
  });

  it('should not get a post if not found', async () => {
    const response = await sut.execute({
      postId: 'fail-test-id',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(ResourceNotFoundError);
  });
  it('should not get a post if author not found', async () => {
    const poat = makePost();
    await postRepository.create(poat);

    const response = await sut.execute({
      postId: poat.id.value,
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
