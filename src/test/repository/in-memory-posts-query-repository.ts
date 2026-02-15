import { FetchPostDTO } from '@/domain/social/application/dtos/timeline-post.dto';
import {
  FetchLikedPostsQueryParams,
  FetchPostsQueryParams,
  PostsQueryRepository,
} from '@/domain/social/application/queries/post-timeline-query-repository';

export class InMemoryPostsQueryRepository implements PostsQueryRepository {
  public items: FetchPostDTO[] = [];

  fetchLikedPosts({
    pagination,
  }: FetchLikedPostsQueryParams): Promise<FetchPostDTO[]> {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;

    return Promise.resolve(this.items.slice(start, end));
  }
  fetchPosts({ pagination }: FetchPostsQueryParams): Promise<FetchPostDTO[]> {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;

    return Promise.resolve(this.items.slice(start, end));
  }
  fetchTimeline({
    pagination,
  }: FetchLikedPostsQueryParams): Promise<FetchPostDTO[]> {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;

    return Promise.resolve(this.items.slice(start, end));
  }
}
