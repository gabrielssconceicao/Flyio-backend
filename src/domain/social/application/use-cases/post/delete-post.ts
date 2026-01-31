import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { PostRepository } from '../../repository/post-repository';

interface DeletePostUseCaseRequest {
  postId: string;
  authorId: string;
}

type DeletePostUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

export class DeletePostUseCase {
  constructor(private postRepository: PostRepository) {}
  async execute({
    postId,
    authorId,
  }: DeletePostUseCaseRequest): Promise<DeletePostUseCaseResponse> {
    const post = await this.postRepository.findById(new UniqueEntityId(postId));

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    if (!post.author_id.equals(authorId)) {
      return left(new NotAllowedError());
    }

    post.delete();

    await this.postRepository.save(post);

    return right(null);
  }
}
