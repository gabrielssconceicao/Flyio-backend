import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PaginationParams } from '@/core/repository/pagination-params';
import { FollowRepository } from '@/domain/social/application/repository/follow-repository';
import { Follow } from '@/domain/social/enterprise/entities/follow';

export class InMemoryFollowRepository extends FollowRepository {
  items: Follow[] = [];

  create(follow: Follow): Promise<void> {
    this.items.push(follow);
    return Promise.resolve();
  }

  async delete(follow: Follow): Promise<void> {
    const index = this.items.findIndex(
      (item) =>
        item.followerId.value === follow.followerId.value &&
        item.followingId.value === follow.followingId.value,
    );

    this.items.splice(index, 1);

    return Promise.resolve();
  }

  async isFollowing(params: {
    followerId: string;
    followingId: string;
  }): Promise<boolean> {
    const follow = this.items.find(
      (item) =>
        item.followerId.value === params.followerId &&
        item.followingId.value === params.followingId,
    );

    return Promise.resolve(!!follow);
  }

  findFollowingIdsByUserId(
    userId: UniqueEntityId,
    pagination: PaginationParams,
  ): Promise<{ follows: Follow[]; count: number }> {
    const filteredFollows = this.items
      .filter((item) => item.followerId.equals(userId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;

    const follows = filteredFollows.slice(start, end);
    return Promise.resolve({ follows, count: filteredFollows.length });
  }

  findFollowerIdsByUserId(
    userId: UniqueEntityId,
    pagination: PaginationParams,
  ): Promise<{ followers: Follow[]; count: number }> {
    const filteredFollows = this.items
      .filter((item) => item.followingId.equals(userId))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;

    const followers = filteredFollows.slice(start, end);
    return Promise.resolve({ followers, count: filteredFollows.length });
  }

  getFollowingIdsByUserId(userId: UniqueEntityId): Promise<Follow[]> {
    const follows = this.items.filter((item) => item.followerId.equals(userId));
    return Promise.resolve(follows);
  }
}
