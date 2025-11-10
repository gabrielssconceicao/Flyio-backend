import { Either, right } from '@/core/either';

import {
  PostsRepository,
  PostWithAuthor,
} from '../../repositories/posts-repository';

interface FetchRecentPostsRequest {
  page: number;
}

type FetchRecentPostsResponse = Either<
  null,
  {
    posts: PostWithAuthor[];
  }
>;

export class FetchRecentPostsUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    page,
  }: FetchRecentPostsRequest): Promise<FetchRecentPostsResponse> {
    const posts = await this.postsRepository.findMany({ page });

    return right({
      posts,
    });
  }
}
