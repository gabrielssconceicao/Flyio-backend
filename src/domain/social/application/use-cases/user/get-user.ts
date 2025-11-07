import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { User } from '@/domain/social/enterprise/entities/user';

import { FollowRepository } from '../../repositories/folllow-repository';
import { UsersRepository } from '../../repositories/users-repository';

interface GetUserUseCaseRequest {
  username: string;
  currentUserId?: string;
}

type GetUserUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User;
    isFollowing: boolean;
  }
>;
export class GetUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private followRepository: FollowRepository,
  ) {}

  async execute({
    username,
    currentUserId,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    let isFollowing = false;

    if (currentUserId && currentUserId !== user.id.toString()) {
      isFollowing = await this.followRepository.isFollowing({
        followerId: currentUserId,
        followingId: user.id.toString(),
      });
    }

    return right({
      user,
      isFollowing,
    });
  }
}
