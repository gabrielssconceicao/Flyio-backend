import { Either, right } from '@/core/either';

import {
  PostsRepository,
  PostResponse,
} from '../../repositories/posts-repository';

interface FetchPostsByContentRequest {
  query: string;
  page: number;
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
  }: FetchPostsByContentRequest): Promise<FetchPostsByContentResponse> {
    const posts = await this.postsRepository.findManyByContent(query, { page });

    return right({
      posts,
    });
  }
}
