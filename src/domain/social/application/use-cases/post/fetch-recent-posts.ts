import { Either, right } from '@/core/either';

import {
  PostResponse,
  PostsRepository,
} from '../../repositories/posts-repository';

interface FetchRecentPostsRequest {
  page: number;
  currentUserId?: string | null;
}

type FetchRecentPostsResponse = Either<
  null,
  {
    posts: PostResponse[];
  }
>;

export class FetchRecentPostsUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    page,
    currentUserId = null,
  }: FetchRecentPostsRequest): Promise<FetchRecentPostsResponse> {
    const posts = await this.postsRepository.findMany(currentUserId, { page });

    return right({
      posts,
    });
  }
}
