import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import {
  PostsRepository,
  PostResponse,
} from '../../repositories/posts-repository';

interface GetPostByIdUseCaseRequest {
  postId: string;
}

type GetPostByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    post: PostResponse['post'];
    author: PostResponse['author'];
    tags: PostResponse['tags'];
  }
>;
export class GetPostByIdUseCase {
  constructor(private postsRepository: PostsRepository) {}
  async execute({
    postId,
  }: GetPostByIdUseCaseRequest): Promise<GetPostByIdUseCaseResponse> {
    const data = await this.postsRepository.findPostById(postId);

    if (!data) {
      return left(new ResourceNotFoundError());
    }

    const { author, post, tags } = data;
    return right({
      post,
      author,
      tags,
    });
  }
}
