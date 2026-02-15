import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { FetchPostDTO } from '../../dtos/timeline-post.dto';
import { PostsQueryRepository } from '../../queries/post-timeline-query-repository';
import { UserRepository } from '../../repository/user-repository';

interface FetchTimelineUseCaseRequest {
  viewerId: string;
  username: string;
  page: number;
  limit: number;
}

type FetchTimelineUseCaseResponse = Either<
  ResourceNotFoundError,
  { posts: FetchPostDTO[] }
>;

export class FetchTimelineUseCase {
  constructor(
    private postTimelineQueryRepository: PostsQueryRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    viewerId,
    username,
    page,
    limit = 50,
  }: FetchTimelineUseCaseRequest): Promise<FetchTimelineUseCaseResponse> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return left(new ResourceNotFoundError('User'));
    }

    const posts = await this.postTimelineQueryRepository.fetchLikedPosts({
      viewerId: new UniqueEntityId(viewerId),
      userId: user.id,
      pagination: {
        page,
        limit,
      },
    });

    return right({ posts });
  }
}
