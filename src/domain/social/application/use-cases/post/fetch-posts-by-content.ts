import { Either, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { FetchPostDTO } from '../../dtos/timeline-post.dto';
import { PostsQueryRepository } from '../../queries/post-timeline-query-repository';

interface FetchTimelineUseCaseRequest {
  viewerId: string;
  content: string;
  page: number;
  limit: number;
}

type FetchTimelineUseCaseResponse = Either<null, { posts: FetchPostDTO[] }>;

export class FetchTimelineUseCase {
  constructor(private postTimelineQueryRepository: PostsQueryRepository) {}

  async execute({
    viewerId,
    content,
    page,
    limit = 50,
  }: FetchTimelineUseCaseRequest): Promise<FetchTimelineUseCaseResponse> {
    const posts = await this.postTimelineQueryRepository.fetchPosts({
      viewerId: new UniqueEntityId(viewerId),
      content,
      pagination: {
        page,
        limit,
      },
    });

    return right({ posts });
  }
}
