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

  findFollowingIdsByUserId(userId: string): Promise<Follow[]> {
    const follows = this.items.filter(
      (item) => item.followerId.value === userId,
    );
    return Promise.resolve(follows);
  }
}
