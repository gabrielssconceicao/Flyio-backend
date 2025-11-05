import { Follow } from '../../enterprise/entities/follow';

export interface FollowParams {
  followerId: string;
  followingId: string;
}
export abstract class FollowRepository {
  abstract follow(follow: Follow): Promise<void>;

  abstract findByFollowerIdAndFollowingId(
    props: FollowParams,
  ): Promise<Follow | null>;
}
