import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import {
  PostResponse,
  PostsRepository,
} from '../../repositories/posts-repository';

interface GetPostByIdUseCaseRequest {
  currentUserId?: string | null;
  postId: string;
}

type GetPostByIdUseCaseResponse = Either<ResourceNotFoundError, PostResponse>;
export class GetPostByIdUseCase {
  constructor(private postsRepository: PostsRepository) {}
  async execute({
    postId,
    currentUserId = null,
  }: GetPostByIdUseCaseRequest): Promise<GetPostByIdUseCaseResponse> {
    const data = await this.postsRepository.findPostById(postId, currentUserId);

    if (!data) {
      return left(new ResourceNotFoundError());
    }

    const { author, post, tags, isLiked } = data;
    return right({
      post,
      author,
      tags,
      isLiked,
    });
  }
}
