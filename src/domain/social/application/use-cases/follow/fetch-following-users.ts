import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { User } from '@/domain/social/enterprise/entities/user';

import { FollowRepository } from '../../repositories/folllow-repository';
import { UsersRepository } from '../../repositories/users-repository';

interface FetchFollowingUsersUseCaseRequest {
  currentUserId?: string;
  username: string;
  page: number;
}

type FetchFollowingUsersUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    followingUsers: Array<{
      user: User;
      isFollowing: boolean;
    }>;
  }
>;

export class FetchFollowingUsersUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private followRepository: FollowRepository,
  ) {}

  async execute({
    username,
    page,
    currentUserId,
  }: FetchFollowingUsersUseCaseRequest): Promise<FetchFollowingUsersUseCaseResponse> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const followings = await this.followRepository.findFollowingByUserId(
      user.id.toString(),
      { page },
    );

    if (followings.length === 0) {
      return right({ followingUsers: [] });
    }

    const followingUsersId = followings.map(
      (following) => following.followingId,
    );

    const followingUsers = await Promise.all(
      followingUsersId.map(async (followingUserId) => {
        const followingUser = (await this.usersRepository.findById(
          followingUserId.toString(),
        )) as User;

        return followingUser;
      }),
    );

    let followingSet = new Set<UniqueEntityId>();
    if (currentUserId) {
      const currentUserFollowing =
        await this.followRepository.findFollowingByUserId(currentUserId, {
          page: 1,
        });
      followingSet = new Set(currentUserFollowing.map((f) => f.followingId));
    }

    return right({
      followingUsers: followingUsers.map((followingUser) => ({
        user: followingUser,
        isFollowing: currentUserId ? followingSet.has(followingUser.id) : false,
      })),
    });
  }
}
