import { PaginationParams } from '@/core/repositories/pagination-params';
import {
  FollowParams,
  FollowRepository,
} from '@/domain/social/application/repositories/folllow-repository';
import { Follow } from '@/domain/social/enterprise/entities/follow';

export class ImMemoryFollowRepository extends FollowRepository {
  items: Follow[] = [];

  async create(follow: Follow): Promise<void> {
    this.items.push(follow);
  }

  async delete(follow: Follow): Promise<void> {
    const index = this.items.findIndex((item) => {
      return (
        item.followerId.toString() === follow.followerId.toString() &&
        item.followingId.toString() === follow.followingId.toString()
      );
    });

    this.items.splice(index, 1);
  }

  async findByFollowerIdAndFollowingId(props: FollowParams) {
    const follow = this.items.find((item) => {
      return (
        item.followerId.toString() === props.followerId &&
        item.followingId.toString() === props.followingId
      );
    });

    return follow || null;
  }

  async findFollowingByUserId(userId: string, params: PaginationParams) {
    const followings = this.items
      .filter((item) => item.followerId.toString() === userId)
      .slice((params.page - 1) * 20, params.page * 20);

    return followings;
  }
}
