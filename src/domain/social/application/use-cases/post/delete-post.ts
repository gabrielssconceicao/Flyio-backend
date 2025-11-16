import { Either, left, right } from '@/core/either';
import { ActionNotAllowedError } from '@/core/errors/action-not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { PostsRepository } from '../../repositories/posts-repository';
interface DeletePostUseCaseRequest {
  postId: string;
  userId: string;
}

type DeletePostUseCaseResponse = Either<
  ResourceNotFoundError | ActionNotAllowedError,
  null
>;

export class DeletePostUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    postId,
    userId,
  }: DeletePostUseCaseRequest): Promise<DeletePostUseCaseResponse> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    if (post.author_id.toString() !== userId) {
      return left(new ActionNotAllowedError());
    }

    post.delete();

    await this.postsRepository.save(post);

    return right(null);
  }
}
