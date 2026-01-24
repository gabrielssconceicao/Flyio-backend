import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
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

export class UnfollowUseCase {
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

    const follower = await this.userRepository.findById(
      new UniqueEntityId(followerId),
    );
    const following = await this.userRepository.findById(
      new UniqueEntityId(followingId),
    );

    if (!follower || !following) {
      return left(new ResourceNotFoundError('User'));
    }

    const isFollowing = await this.followRepository.isFollowing({
      followerId,
      followingId,
    });

    if (!isFollowing) {
      return left(new NotFollowingError());
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
