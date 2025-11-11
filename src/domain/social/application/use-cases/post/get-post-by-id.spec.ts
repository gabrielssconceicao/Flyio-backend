import { NotFoundException } from '@nestjs/common';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { User } from '@/domain/social/enterprise/entities/user';
import { makePost } from '@/test/factories/make-post';
import { makePostTag } from '@/test/factories/make-post-tag';
import { makeTag } from '@/test/factories/make-tag';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryPostRepository } from '@/test/repositories/in-memory-post-repository';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';

import { GetPostByIdUseCase } from './get-post-by-id';

let postRepository: InMemoryPostRepository;
let userRepository: InMemoryUsersRepository;
let tagRepository: InMemoryPostRepository;
let sut: GetPostByIdUseCase;

describe('Get Post by Id', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    postRepository = new InMemoryPostRepository(userRepository);
    sut = new GetPostByIdUseCase(postRepository);
  });

  it('should get a post by id', async () => {
    const user = makeUser({}, new UniqueEntityId('user-1'));
    await userRepository.create(user);

    const post = makePost({ author_id: user.id }, new UniqueEntityId('post-1'));
    await postRepository.create(post);

    const result = await sut.execute({
      postId: 'post-1',
    });
    console.log(result);

    expect(result.isRight()).toBe(true);
    expect(result.value?.post.post.id).toEqual(post.id);
  });

  it('should return NotFound when post not found', async () => {
    const result = await sut.execute({
      postId: 'post-1',
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
