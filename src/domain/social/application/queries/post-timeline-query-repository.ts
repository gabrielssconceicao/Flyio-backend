import { TimelinePostDTO } from '../dtos/timeline-post.dto';

export abstract class PostTimelineQueryRepository {
  abstract fetchTimeline(params: {
    viewerId: string;
    page: number;
    limit: number;
  }): Promise<TimelinePostDTO[]>;
}
