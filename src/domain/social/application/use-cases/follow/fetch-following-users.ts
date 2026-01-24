import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { User } from '@/domain/social/enterprise/entities/user';

import { FollowRepository } from '../../repository/follow-repository';
import { UserRepository } from '../../repository/user-repository';

interface FetchFollowingUsersUseCaseRequest {
  username: string;
  viewerId: string;
  page: number;
  limit?: number;
}

type FetchFollowingUsersUseCaseResponse = Either<
  ResourceNotFoundError,
  { users: Array<{ user: User; following: boolean }>; count: number }
>;

export class FetchFollowingUsersUseCase {
  constructor(
    private userRepository: UserRepository,
    private followRepository: FollowRepository,
  ) {}

  async execute({
    username,
    viewerId,
    page,
    limit = 50,
  }: FetchFollowingUsersUseCaseRequest): Promise<FetchFollowingUsersUseCaseResponse> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return left(new ResourceNotFoundError('User'));
    }

    const { follows: followingIds, count } =
      await this.followRepository.findFollowingIdsByUserId(user.id, {
        page,
        limit,
      });

    const followingUserIds = followingIds.map((follow) => follow.followingId);

    const followingUsers =
      await this.userRepository.findManyByIds(followingUserIds);

    const viewerFollowing = await this.followRepository.getFollowingIdsByUserId(
      new UniqueEntityId(viewerId),
    );

    const viewerFollowingSet = new Set(
      viewerFollowing.map((follow) => follow.followingId.value),
    );

    const users = followingUsers.map((followingUser) => ({
      user: followingUser,
      following: viewerFollowingSet.has(followingUser.id.value),
    }));

    return right({
      count,
      users,
    });
  }
}
