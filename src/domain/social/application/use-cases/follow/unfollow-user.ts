import { Either, left, right } from '@/core/either';
import { ActionNotAllowedError } from '@/core/errors/action-not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { FollowRepository } from '../../repositories/folllow-repository';
import { UsersRepository } from '../../repositories/users-repository';

interface UnfollowUserUseCaseRequest {
  followerId: string;
  followingId: string;
}

type UnfollowUserUseCaseResponse = Either<
  ResourceNotFoundError | ActionNotAllowedError,
  null
>;

export class UnfollowUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private followRepository: FollowRepository,
  ) {}

  async execute({
    followerId,
    followingId,
  }: UnfollowUserUseCaseRequest): Promise<UnfollowUserUseCaseResponse> {
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

    if (!isFollowing) {
      return left(new ActionNotAllowedError());
    }

    follower.unfollow(following);

    await this.followRepository.delete(isFollowing);
    await this.usersRepository.save(follower);
    await this.usersRepository.save(following);

    return right(null);
  }
}
