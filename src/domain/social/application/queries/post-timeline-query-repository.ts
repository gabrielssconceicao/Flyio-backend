import { PaginationParams } from '@/core/repository/pagination-params';

import { TimelinePostDTO } from '../dtos/timeline-post.dto';

export type PostTimelineQueryParams = {
  viewerId: string;
  papagination: PaginationParams;
};

export abstract class PostTimelineQueryRepository {
  abstract fetchTimeline(
    params: PostTimelineQueryParams,
  ): Promise<TimelinePostDTO[]>;
}
