import { Either, left, right } from '@/core/either';
import { NotFollowingError } from '@/core/errors/already-follow-error';
import { FollowYourselfError } from '@/core/errors/follow-yourself-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Follow } from '@/domain/social/enterprise/entities/follow';

import { FollowRepository } from '../../repository/follow-repository';
import { UserRepository } from '../../repository/user-repository';

interface UnfollowUseCaseRequest {
  followerId: string;
  followingId: string;
}

type UnfollowUseCaseResponse = Either<
  ResourceNotFoundError | NotFollowingError,
  null
>;

export class FollowwUseCase {
  constructor(
    private followRepository: FollowRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    followerId,
    followingId,
  }: UnfollowUseCaseRequest): Promise<UnfollowUseCaseResponse> {
    if (followerId === followingId) {
      return left(new FollowYourselfError('unfollow'));
    }

    const isFollowing = await this.followRepository.isFollowing({
      followerId,
      followingId,
    });

    if (!isFollowing) {
      return left(new NotFollowingError());
    }

    const follower = await this.userRepository.findById(followerId);
    const following = await this.userRepository.findById(followingId);

    if (!follower || !following) {
      return left(new ResourceNotFoundError('User'));
    }

    const follow = Follow.create({
      follower_id: follower.id,
      following_id: following.id,
    });

    follower.unfollow(following);

    await this.followRepository.delete(follow);
    await this.userRepository.save(follower);
    await this.userRepository.save(following);

    return right(null);
  }
}
