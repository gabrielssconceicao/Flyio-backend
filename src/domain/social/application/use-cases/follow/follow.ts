import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AlreadyFollowingError } from '@/core/errors/follow/already-follow-user-error';
import { FollowYourselfError } from '@/core/errors/follow/follow-yourself-error';
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
  null
>;

export class FollowUseCase {
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
      followerId: follower.id,
      followingId: following.id,
    });

    if (isFollowing) {
      return left(new AlreadyFollowingError());
    }

    const follow = Follow.create({
      follower_id: follower.id,
      following_id: following.id,
    });

    follower.follow(following);

    await this.followRepository.create(follow);
    await this.userRepository.save(follower);
    await this.userRepository.save(following);

    return right(null);
  }
}
