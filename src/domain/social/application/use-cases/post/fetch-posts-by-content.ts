import { Either, right } from '@/core/either';

import {
  PostResponse,
  PostsRepository,
} from '../../repositories/posts-repository';

interface FetchPostsByContentRequest {
  query: string;
  page: number;
  currentUserId?: string | null;
}

type FetchPostsByContentResponse = Either<
  null,
  {
    posts: PostResponse[];
  }
>;

export class FetchPostsByContentUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    query,
    page,
    currentUserId = null,
  }: FetchPostsByContentRequest): Promise<FetchPostsByContentResponse> {
    const posts = await this.postsRepository.findManyByContent(
      query,
      currentUserId,
      {
        page,
      },
    );

    return right({
      posts,
    });
  }
}
