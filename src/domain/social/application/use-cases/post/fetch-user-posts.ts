import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import {
  PostResponse,
  PostsRepository,
} from '../../repositories/posts-repository';
import { UsersRepository } from '../../repositories/users-repository';

interface FetchUserPostsRequest {
  username: string;
  page: number;
}

type FetchUserPostsResponse = Either<
  ResourceNotFoundError,
  {
    posts: PostResponse[];
  }
>;

export class FetchUserPostsUseCase {
  constructor(
    private userRepository: UsersRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute({
    username,
    page,
  }: FetchUserPostsRequest): Promise<FetchUserPostsResponse> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return left(new ResourceNotFoundError());
    }
    const posts = await this.postsRepository.findManyByUserId(
      user.id.toString(),
      {
        page,
      },
    );

    return right({
      posts,
    });
  }
}
