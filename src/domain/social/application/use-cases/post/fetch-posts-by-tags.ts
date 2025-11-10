import { Either, right } from '@/core/either';

import {
  PostsRepository,
  PostWithAuthor,
} from '../../repositories/posts-repository';

interface FetchPostsByTagRequest {
  query: string[];
  page: number;
}

type FetchPostsByTagResponse = Either<
  null,
  {
    posts: PostWithAuthor[];
  }
>;

export class FetchPostsByTagUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    query,
    page,
  }: FetchPostsByTagRequest): Promise<FetchPostsByTagResponse> {
    const posts = await this.postsRepository.findManyByTag(query, { page });

    return right({
      posts,
    });
  }
}
