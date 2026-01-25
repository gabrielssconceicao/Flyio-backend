import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PaginationParams } from '@/core/repository/pagination-params';

import { Follow } from '../../enterprise/entities/follow';

export type IsFollowingParams = {
  followerId: UniqueEntityId;
  followingId: UniqueEntityId;
};

export type Metrics = {
  followersCount: number;
  followingCount: number;
};

export abstract class FollowRepository {
  abstract create(follow: Follow): Promise<void>;
  abstract delete(follow: Follow): Promise<void>;
  abstract isFollowing(params: IsFollowingParams): Promise<boolean>;
  abstract getFollowingIdsByUserId(userId: UniqueEntityId): Promise<Follow[]>;
  abstract findFollowingIdsByUserId(
    userId: UniqueEntityId,
    pagination: PaginationParams,
  ): Promise<{ follows: Follow[]; count: number }>;
  abstract findFollowerIdsByUserId(
    userId: UniqueEntityId,
    pagination: PaginationParams,
  ): Promise<{ followers: Follow[]; count: number }>;

  abstract metrics(id: UniqueEntityId): Promise<Metrics>;
}
