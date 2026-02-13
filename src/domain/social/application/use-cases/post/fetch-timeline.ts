import { Either, right } from '@/core/either';

import { TimelinePostDTO } from '../../dtos/timeline-post.dto';
import { PostTimelineQueryRepository } from '../../queries/post-timeline-query-repository';

interface FetchTimelineUseCaseRequest {
  viewerId: string;
  page: number;
  limit: number;
}

type FetchTimelineUseCaseResponse = Either<null, { posts: TimelinePostDTO[] }>;

export class FetchTimelineUseCase {
  constructor(
    private postTimelineQueryRepository: PostTimelineQueryRepository,
  ) {}

  async execute({
    viewerId,
    page,
    limit,
  }: FetchTimelineUseCaseRequest): Promise<FetchTimelineUseCaseResponse> {
    const posts = await this.postTimelineQueryRepository.fetchTimeline({
      viewerId,
      papagination: {
        page,
        limit,
      },
    });

    return right({ posts });
  }
}
