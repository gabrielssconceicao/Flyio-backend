import { Either, left, right } from '@/core/either';
import { AlreadyFollowingError } from '@/core/errors/already-follow-error';
import { FollowYourselfError } from '@/core/errors/follow-yourself-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Follow } from '@/domain/social/enterprise/entities/follow';

import { FollowRepository } from '../../repository/follow-repository';
import { UserRepository } from '../../repository/user-repository';

interface FollowUseCaseRequest {
  followerId: string;
  followingId: string;
}

type FollowUseCaseResponse = Either<
  ResourceNotFoundError | AlreadyFollowingError,
  void
>;

export class FollowwUseCase {
  constructor(
    private followRepository: FollowRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    followerId,
    followingId,
  }: FollowUseCaseRequest): Promise<FollowUseCaseResponse> {
    if (followerId === followingId) {
      return left(new FollowYourselfError('follow'));
    }

    const isFollowing = await this.followRepository.isFollowing({
      followerId,
      followingId,
    });

    if (isFollowing) {
      return left(new AlreadyFollowingError());
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

    follower.follow(following);

    await this.followRepository.create(follow);
    await this.userRepository.save(follower);
    await this.userRepository.save(following);

    return right(undefined);
  }
}
