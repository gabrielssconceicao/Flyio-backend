import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import {
  PostResponse,
  PostsRepository,
} from '../../repositories/posts-repository';
import { UsersRepository } from '../../repositories/users-repository';

interface FetchPostsByContentRequest {
  username: string;
  page: number;
  currentUserId?: string | null;
}

type FetchPostsByContentResponse = Either<
  ResourceNotFoundError,
  {
    posts: PostResponse[];
  }
>;
export class FetchLikedPostsByUser {
  constructor(
    private userRepository: UsersRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute({
    username,
    page,
    currentUserId = null,
  }: FetchPostsByContentRequest): Promise<FetchPostsByContentResponse> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const posts = await this.postsRepository.findManyLikedByUserId(
      user.id.toString(),
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
