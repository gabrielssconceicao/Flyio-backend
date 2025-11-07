import { PaginationParams } from '@/core/repositories/pagination-params';

import { Follow } from '../../enterprise/entities/follow';

export interface FollowParams {
  followerId: string;
  followingId: string;
}
export abstract class FollowRepository {
  abstract create(follow: Follow): Promise<void>;
  abstract delete(follow: Follow): Promise<void>;
  abstract isFollowing(props: FollowParams): Promise<boolean>;

  abstract findFollowingByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<Follow[]>;
  abstract findFollowersByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<Follow[]>;
  abstract findByFollowerIdAndFollowingId(
    props: FollowParams,
  ): Promise<Follow | null>;
}
