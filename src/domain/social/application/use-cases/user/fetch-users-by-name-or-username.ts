import { Either, right } from '@/core/either';
import { User } from '@/domain/social/enterprise/entities/user';

import { FollowRepository } from '../../repositories/folllow-repository';
import { UsersRepository } from '../../repositories/users-repository';

export class FetchUsersByNameOrUsernameUseCaseRequest {
  query: string;
  page: number;
  currentUserId?: string;
}

export type FetchUsersByNameOrUsernameUseCaseResponse = Either<
  null,
  {
    users: Array<{
      user: User;
      isFollowing: boolean;
    }>;
  }
>;

export class FetchUsersByNameOrUsernameUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private followRepository: FollowRepository,
  ) {}
  async execute({
    currentUserId,
    query,
    page,
  }: FetchUsersByNameOrUsernameUseCaseRequest): Promise<FetchUsersByNameOrUsernameUseCaseResponse> {
    const users = await this.usersRepository.findByNameOrUsername(query, {
      page,
    });

    const usersWithFollowingStatus = await Promise.all(
      users
        .filter((user) => user.id.toString() !== currentUserId)
        .map(async (user) => {
          let isFollowing = false;
          if (currentUserId) {
            isFollowing = await this.followRepository.isFollowing({
              followerId: currentUserId,
              followingId: user.id.toString(),
            });
          }

          return {
            user,
            isFollowing,
          };
        }),
    );
    return right({ users: usersWithFollowingStatus });
  }
}
