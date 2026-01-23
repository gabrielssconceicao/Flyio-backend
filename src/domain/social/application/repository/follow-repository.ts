import { Follow } from '../../enterprise/entities/follow';

type FollowParams = {
  followerId: string;
  followingId: string;
};

export abstract class FollowRepository {
  abstract create(follow: Follow): Promise<void>;
  abstract delete(follow: Follow): Promise<void>;
  abstract isFollowing(params: FollowParams): Promise<boolean>;
  abstract findFollowingIdsByUserId(userId: string): Promise<Follow[]>;
}
