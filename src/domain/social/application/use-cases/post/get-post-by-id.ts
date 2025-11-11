import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import {
  PostsRepository,
  PostWithAuthor,
} from '../../repositories/posts-repository';

interface GetPostByIdUseCaseRequest {
  postId: string;
}

type GetPostByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  { post: PostWithAuthor }
>;
export class GetPostByIdUseCase {
  constructor(private postsRepository: PostsRepository) {}
  async execute({
    postId,
  }: GetPostByIdUseCaseRequest): Promise<GetPostByIdUseCaseResponse> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    return right({
      post,
    });
  }
}
