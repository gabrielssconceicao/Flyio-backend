import { Either, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Post } from '@/domain/social/enterprise/entities/post';

import { PostRepository } from '../../repository/post-repository';

export class CreatePostUseCaseRequest {
  authorId: string;
  content: string;
}

export type CreatePostUseCaseResponse = Either<null, { post: Post }>;

export class CreatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute({
    authorId,
    content,
  }: CreatePostUseCaseRequest): Promise<CreatePostUseCaseResponse> {
    const post = Post.create({
      author_id: new UniqueEntityId(authorId),
      content,
    });

    await this.postRepository.create(post);

    return right({ post });
  }
}
