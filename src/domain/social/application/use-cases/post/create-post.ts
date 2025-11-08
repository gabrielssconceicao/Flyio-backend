import { Either, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Post } from '@/domain/social/enterprise/entities/post';

import { PostsRepository } from '../../repositories/posts-repository';

interface CreatePostRequest {
  authorId: string;
  content: string;
}

type CreatePostResponse = Either<null, { post: Post }>;

export class CreatePostUseCase {
  constructor(private postRepository: PostsRepository) {}

  async execute({
    authorId,
    content,
  }: CreatePostRequest): Promise<CreatePostResponse> {
    const post = Post.create({
      author_id: new UniqueEntityId(authorId),
      content: content,
    });

    await this.postRepository.create(post);

    return right({ post });
  }
}
