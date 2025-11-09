import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { User } from '@/domain/social/enterprise/entities/user';

import { FollowRepository } from '../../repositories/folllow-repository';
import { UsersRepository } from '../../repositories/users-repository';

interface FetchFollowerUsersUseCaseRequest {
  currentUserId?: string;
  username: string;
  page: number;
}

type FetchFollowerUsersUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    followerUsers: Array<{
      user: User;
      isFollowing: boolean;
    }>;
  }
>;

export class FetchFollowerUsersUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private followRepository: FollowRepository,
  ) {}

  async execute({
    username,
    page,
    currentUserId,
  }: FetchFollowerUsersUseCaseRequest): Promise<FetchFollowerUsersUseCaseResponse> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const followers = await this.followRepository.findFollowersByUserId(
      user.id.toString(),
      { page },
    );

    if (followers.length === 0) {
      return right({ followerUsers: [] });
    }

    const followerUsersId = followers.map((following) => following.followerId);

    // Trocar por findMany
    const followerUsers = await Promise.all(
      followerUsersId.map(async (followerUserId) => {
        const followerUser = (await this.usersRepository.findById(
          followerUserId.toString(),
        )) as User;

        return followerUser;
      }),
    );

    let followerSet = new Set<UniqueEntityId>();
    if (currentUserId) {
      const currentUserFollowing =
        await this.followRepository.findFollowingByUserId(currentUserId, {
          page: 1,
        });
      followerSet = new Set(currentUserFollowing.map((f) => f.followerId));
    }

    return right({
      followerUsers: followerUsers.map((followerUser) => ({
        user: followerUser,
        isFollowing: currentUserId ? followerSet.has(followerUser.id) : false,
      })),
    });
  }
}
