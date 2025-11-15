import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeLike } from '@/test/factories/make-like';
import { makePost } from '@/test/factories/make-post';
import { makePostTag } from '@/test/factories/make-post-tag';
import { makeTag } from '@/test/factories/make-tag';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryLikeRepository } from '@/test/repositories/in-memory-like-repository';
import { InMemoryPostRepository } from '@/test/repositories/in-memory-post-repository';
import { InMemoryTagRepository } from '@/test/repositories/in-memory-tag-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { GetPostByIdUseCase } from './get-post-by-id';

let postRepository: InMemoryPostRepository;
let userRepository: InMemoryUsersRepository;
let tagRepository: InMemoryTagRepository;
let likeRepository: InMemoryLikeRepository;
let sut: GetPostByIdUseCase;

describe('Get Post by Id', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    tagRepository = new InMemoryTagRepository();
    likeRepository = new InMemoryLikeRepository();
    postRepository = new InMemoryPostRepository(
      userRepository,
      tagRepository,
      likeRepository,
    );
    sut = new GetPostByIdUseCase(postRepository);
  });

  it('should get a post by id', async () => {
    const user = makeUser({}, new UniqueEntityId('user-1'));
    await userRepository.create(user);

    const tag = makeTag({ name: 'tag-1' });
    await tagRepository.create(tag);

    const post = makePost({ author_id: user.id }, new UniqueEntityId('post-1'));
    const postTag = makePostTag({ tagId: tag.id, postId: post.id });
    post.tags = [postTag];
    await postRepository.create(post);

    const result = await sut.execute({
      postId: 'post-1',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.post.id).toEqual(post.id);
    expect(result.value?.author.id).toEqual(user.id);
    expect(result.value?.tags).toHaveLength(1);
    expect(result.value?.isLiked).toEqual(false);
  });

  it('should get a post by id with like', async () => {
    const user = makeUser({}, new UniqueEntityId('user-1'));
    await userRepository.create(user);
    const post = makePost({ author_id: user.id }, new UniqueEntityId('post-1'));
    await postRepository.create(post);
    const like = makeLike({ user_id: user.id, post_id: post.id });
    await likeRepository.create(like);

    const result = await sut.execute({
      postId: 'post-1',
      currentUserId: 'user-1',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.post.id).toEqual(post.id);
    expect(result.value?.author.id).toEqual(user.id);
    expect(result.value?.isLiked).toEqual(true);
  });

  it('should return NotFound when post not found', async () => {
    const result = await sut.execute({
      postId: 'post-1',
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
