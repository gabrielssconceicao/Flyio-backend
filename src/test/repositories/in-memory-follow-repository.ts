import {
  FollowParams,
  FollowRepository,
} from '@/domain/social/application/repositories/folllow-repository';
import { Follow } from '@/domain/social/enterprise/entities/follow';

export class ImMemoryFollowRepository extends FollowRepository {
  items: Follow[] = [];

  async follow(follow: Follow): Promise<void> {
    this.items.push(follow);
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
}
