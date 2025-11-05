import { Either, left, right } from '@/core/either';
import { ActionNotAllowedError } from '@/core/errors/action-not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Follow } from '@/domain/social/enterprise/entities/follow';

import { FollowRepository } from '../../repositories/folllow-repository';
import { UsersRepository } from '../../repositories/users-repository';

interface FollowUserUseCaseRequest {
  followerId: string;
  followingId: string;
}

type FollowUserUseCaseResponse = Either<
  ResourceNotFoundError | ActionNotAllowedError,
  null
>;

export class FollowUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private followRepository: FollowRepository,
  ) {}

  async execute({
    followerId,
    followingId,
  }: FollowUserUseCaseRequest): Promise<FollowUserUseCaseResponse> {
    if (followerId === followingId) {
      return left(new ActionNotAllowedError());
    }

    const follower = await this.usersRepository.findById(followerId);
    const following = await this.usersRepository.findById(followingId);

    if (!follower || !following) {
      return left(new ResourceNotFoundError());
    }

    const isFollowing =
      await this.followRepository.findByFollowerIdAndFollowingId({
        followerId,
        followingId,
      });

    if (isFollowing) {
      return left(new ActionNotAllowedError());
    }

    const follow = Follow.create({
      followerId: follower.id,
      followingId: following.id,
    });

    follower.follow(following);
    await this.usersRepository.save(follower);
    await this.usersRepository.save(following);

    await this.followRepository.follow(follow);

    return right(null);
  }
}
