import { Either, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { User } from '@/domain/social/enterprise/entities/user';

import { FollowRepository } from '../../repository/follow-repository';
import { UserRepository } from '../../repository/user-repository';

interface FetchUsersByNameOrUsernameUseCaseRequest {
  search: string;
  viewerId: string;
  page: number;
  limit?: number;
}

type FetchUsersByNameOrUsernameUseCaseResponse = Either<
  null,
  { users: Array<{ user: User; isFollowing: boolean }>; count: number }
>;

export class FetchUsersByNameOrUsernameUseCase {
  constructor(
    private userRepository: UserRepository,
    private followRepository: FollowRepository,
  ) {}

  async execute({
    search,
    page,
    viewerId,
    limit = 50,
  }: FetchUsersByNameOrUsernameUseCaseRequest): Promise<FetchUsersByNameOrUsernameUseCaseResponse> {
    const { users: fetchedUsers, count } = await this.userRepository.fetch(
      search,
      { page, limit },
    );

    // TODO: add if viwer is following
    const viewerFollowing = await this.followRepository.getFollowingIdsByUserId(
      new UniqueEntityId(viewerId),
    );

    const viewerFollowingSet = new Set(
      viewerFollowing.map((follow) => follow.followingId.value),
    );

    const users = fetchedUsers.map((user) => ({
      user,
      isFollowing: viewerFollowingSet.has(user.id.value),
    }));

    return right({ users, count });
  }
}
