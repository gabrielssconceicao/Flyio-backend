import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { User } from '@/domain/social/enterprise/entities/user';

import { FollowRepository } from '../../repository/follow-repository';
import { UserRepository } from '../../repository/user-repository';

interface GetUserUseCaseRequest {
  username: string;
  viewerId: string;
}

type GetUserUseCaseResponse = Either<
  ResourceNotFoundError,
  { user: User; isFollowing: boolean }
>;

export class GetUserUseCase {
  constructor(
    private usersRepository: UserRepository,
    private followRepository: FollowRepository,
  ) {}

  async execute({
    username,
    viewerId,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      return left(new ResourceNotFoundError('User'));
    }

    // TODO: add if viwer is following
    const isFollowing = await this.followRepository.isFollowing({
      followerId: new UniqueEntityId(viewerId),
      followingId: user.id,
    });

    return right({ user, isFollowing });
  }
}
