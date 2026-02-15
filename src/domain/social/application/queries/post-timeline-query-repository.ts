import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PaginationParams } from '@/core/repository/pagination-params';

import { FetchPostDTO } from '../dtos/timeline-post.dto';

type PostTimelineQueryParams = {
  viewerId: UniqueEntityId;
  pagination: PaginationParams;
};

export type FetchPostsQueryParams = PostTimelineQueryParams & {
  content: string;
};

export type FetchLikedPostsQueryParams = PostTimelineQueryParams & {
  userId: UniqueEntityId;
};

export abstract class PostsQueryRepository {
  abstract fetchTimeline(
    params: PostTimelineQueryParams,
  ): Promise<FetchPostDTO[]>;

  abstract fetchPosts(params: FetchPostsQueryParams): Promise<FetchPostDTO[]>;
  abstract fetchLikedPosts(
    params: FetchLikedPostsQueryParams,
  ): Promise<FetchPostDTO[]>;
}
