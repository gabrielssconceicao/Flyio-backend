import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { User } from '@/domain/social/enterprise/entities/user';

import { FollowRepository } from '../../repository/follow-repository';
import { UserRepository } from '../../repository/user-repository';

interface FetchFollowingUsersUseCaseRequest {
  username: string;
  page: number;
  limit?: number;
}

type FetchFollowingUsersUseCaseResponse = Either<
  ResourceNotFoundError,
  { users: Array<{ user: User; following: boolean }> }
>;

export class FetchFollowingUsersUseCase {
  constructor(
    private userRepository: UserRepository,
    private followRepository: FollowRepository,
  ) {}

  async execute({
    username,
    page,
    limit = 50,
  }: FetchFollowingUsersUseCaseRequest): Promise<FetchFollowingUsersUseCaseResponse> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return left(new ResourceNotFoundError('User'));
    }

    const followingIds = await this.followRepository.findFollowingIdsByUserId(
      user.id.value,
    );

    const followingUserIds = followingIds.map(
      (follow) => follow.followingId.value,
    );

    const followingUsers = await this.userRepository.findManyByIds(
      followingUserIds,
      {
        page,
        limit,
      },
    );

    return right({
      users: followingUsers.map((user) => ({ user, following: true })),
    });
  }
}
