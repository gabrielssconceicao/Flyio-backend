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
  { users: Array<{ user: User; isFollowing: boolean }>; count: number }
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
    const profileUser = await this.getUserByUsername(username);
    if (profileUser instanceof ResourceNotFoundError) {
      return left(profileUser);
    }

    const viewer = await this.getUserById(viewerId);
    if (viewer instanceof ResourceNotFoundError) {
      return left(viewer);
    }

    const { followingUserIds, count } = await this.getFollowingUserIds(
      profileUser.id,
      page,
      limit,
    );

    const followingUsersMap = await this.getUsersMappedById(followingUserIds);

    const viewerFollowingSet = await this.getViewerFollowingSet(viewer.id);

    const users = this.buildResponse(
      followingUserIds,
      followingUsersMap,
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

  private async getFollowingUserIds(
    userId: UniqueEntityId,
    page: number,
    limit: number,
  ): Promise<{ followingUserIds: UniqueEntityId[]; count: number }> {
    const { follows, count } =
      await this.followRepository.findFollowingIdsByUserId(userId, {
        page,
        limit,
      });

    return {
      followingUserIds: follows.map((follow) => follow.followingId),
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
    followingUserIds: UniqueEntityId[],
    usersMap: Map<string, User>,
    viewerFollowingSet: Set<string>,
  ): Array<{ user: User; isFollowing: boolean }> {
    return followingUserIds.map((id) => {
      const user = usersMap.get(id.value)!;

      return {
        user,
        isFollowing: viewerFollowingSet.has(id.value),
      };
    });
  }
}
