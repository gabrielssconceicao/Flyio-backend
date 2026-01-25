import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { FollowRepository, Metrics } from '../../repository/follow-repository';
import { UserRepository } from '../../repository/user-repository';

interface FollowMetricsUseCaseRequest {
  username: string;
}

type FollowMetricsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    metrics: Metrics;
  }
>;

export class FollowMetricsUseCase {
  constructor(
    private userRepository: UserRepository,
    private followRepository: FollowRepository,
  ) {}

  async execute({
    username,
  }: FollowMetricsUseCaseRequest): Promise<FollowMetricsUseCaseResponse> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return left(new ResourceNotFoundError('User'));
    }

    const { followersCount, followingCount } =
      await this.followRepository.metrics(user.id);

    return right({ metrics: { followersCount, followingCount } });
  }
}
