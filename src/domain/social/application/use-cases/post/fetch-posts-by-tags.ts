import { Either, right } from '@/core/either';

import {
  PostResponse,
  PostsRepository,
} from '../../repositories/posts-repository';

interface FetchPostsByTagRequest {
  query: string[];
  page: number;
  currentUserId?: string | null;
}

type FetchPostsByTagResponse = Either<
  null,
  {
    posts: PostResponse[];
  }
>;

export class FetchPostsByTagUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    query,
    page,
    currentUserId = null,
  }: FetchPostsByTagRequest): Promise<FetchPostsByTagResponse> {
    const posts = await this.postsRepository.findManyByTag(
      query,
      currentUserId,
      { page },
    );

    return right({
      posts,
    });
  }
}
