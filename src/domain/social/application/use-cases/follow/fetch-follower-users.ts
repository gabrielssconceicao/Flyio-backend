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
  { users: Array<{ user: User; isFollowing: boolean }>; count: number }
>;

export class FetchFollowerUsersUseCase {
  constructor(
    private userRepository: UserRepository,
    private followRepository: FollowRepository,
  ) {}

  async execute({
    username,
    viewerId,
    page,
    limit = 50,
  }: FetchFollowerUsersUseCaseRequest): Promise<FetchFollowerUsersUseCaseResponse> {
    const profileUser = await this.getUserByUsername(username);
    if (profileUser instanceof ResourceNotFoundError) {
      return left(profileUser);
    }

    const viewer = await this.getUserById(viewerId);
    if (viewer instanceof ResourceNotFoundError) {
      return left(viewer);
    }

    const { followerUserIds, count } = await this.getFollowerUserIds(
      profileUser.id,
      page,
      limit,
    );

    const followerUsersMap = await this.getUsersMappedById(followerUserIds);

    const viewerFollowingSet = await this.getViewerFollowingSet(viewer.id);

    const users = this.buildResponse(
      followerUserIds,
      followerUsersMap,
      viewerFollowingSet,
    );

    return right({
      users,
      count,
    });
  }

  private async getUserByUsername(
    username: string,
  ): Promise<User | ResourceNotFoundError> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      return new ResourceNotFoundError('User');
    }
    return user;
  }

  private async getUserById(
    userId: string,
  ): Promise<User | ResourceNotFoundError> {
    const user = await this.userRepository.findById(new UniqueEntityId(userId));
    if (!user) {
      return new ResourceNotFoundError('User');
    }
    return user;
  }

  private async getFollowerUserIds(
    userId: UniqueEntityId,
    page: number,
    limit: number,
  ): Promise<{ followerUserIds: UniqueEntityId[]; count: number }> {
    const { followers, count } =
      await this.followRepository.findFollowerIdsByUserId(userId, {
        page,
        limit,
      });

    return {
      followerUserIds: followers.map((follow) => follow.followerId),
      count,
    };
  }

  private async getUsersMappedById(
    userIds: UniqueEntityId[],
  ): Promise<Map<string, User>> {
    const users = await this.userRepository.findManyByIds(userIds);

    return new Map(users.map((user) => [user.id.value, user]));
  }

  private async getViewerFollowingSet(
    viewerId: UniqueEntityId,
  ): Promise<Set<string>> {
    const viewerFollowing =
      await this.followRepository.findAllFollowingIdsByUserId(viewerId);

    return new Set(viewerFollowing.map((follow) => follow.followingId.value));
  }

  private buildResponse(
    followerUserIds: UniqueEntityId[],
    usersMap: Map<string, User>,
    viewerFollowingSet: Set<string>,
  ): Array<{ user: User; isFollowing: boolean }> {
    return followerUserIds.map((id) => {
      const user = usersMap.get(id.value)!;

      return {
        user,
        isFollowing: viewerFollowingSet.has(id.value),
      };
    });
  }
}
