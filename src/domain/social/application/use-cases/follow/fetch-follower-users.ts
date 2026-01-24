import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { User } from '@/domain/social/enterprise/entities/user';

import { FollowRepository } from '../../repository/follow-repository';
import { UserRepository } from '../../repository/user-repository';

interface FetchFollowerUsersUseCaseRequest {
  viewerId: string;
  username: string;
  page: number;
  limit?: number;
}

type FetchFollowerUsersUseCaseResponse = Either<
  ResourceNotFoundError,
  { users: Array<{ user: User; following: boolean }>; count: number }
>;

export class FetchFollowerUsersUseCase {
  constructor(
    private userRepository: UserRepository,
    private followRepository: FollowRepository,
  ) {}

  async execute({
    username,
    page,
    viewerId,
    limit = 50,
  }: FetchFollowerUsersUseCaseRequest): Promise<FetchFollowerUsersUseCaseResponse> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return left(new ResourceNotFoundError('User'));
    }

    const { followers, count } =
      await this.followRepository.findFollowerIdsByUserId(user.id, {
        page,
        limit,
      });

    const followerUserIds = followers.map((follow) => follow.followerId);

    const followerUsers =
      await this.userRepository.findManyByIds(followerUserIds);

    const viewerFollowing = await this.followRepository.getFollowingIdsByUserId(
      new UniqueEntityId(viewerId),
    );

    const viewerFollowingSet = new Set(
      viewerFollowing.map((follow) => follow.followingId.value),
    );
    const users = followerUsers.map((followerUser) => ({
      user: followerUser,
      following: viewerFollowingSet.has(followerUser.id.value),
    }));

    return right({
      users,
      count,
    });
  }
}
