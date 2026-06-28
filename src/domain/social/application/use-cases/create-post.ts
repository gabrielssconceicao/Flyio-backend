import { Either, right } from '@/core/either/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { Post } from '../../enterprise/entity/post';
import { PostsRepository } from '../repository/post-repository';

type CreatePostRequest = {
  authorId: string;
  content: string;
};

type CreatePostResponse = Either<void, Post>;

export class CreatePostUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async handle({ authorId, content }: CreatePostRequest): Promise<CreatePostResponse> {
    const post = Post.create({
      content: content,
      authorId: UniqueEntityId.createFromText(authorId),
    });

    await this.postsRepository.create(post);

    return right(post);
  }
}
