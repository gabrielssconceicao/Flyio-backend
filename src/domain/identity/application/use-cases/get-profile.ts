import { Either, left, right } from '@/core/either/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { User } from '../../enterprise/entities/user';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserFinder } from '../service/user-finder';

type GetProfileRequest = {
  userId: string;
};

type GetProfileResponse = Either<UserNotFoundError, User>;

export class GetProfileUseCase {
  constructor(private readonly userFinder: UserFinder) {}

  async handle({ userId }: GetProfileRequest): Promise<GetProfileResponse> {
    const response = await this.userFinder.findById(UniqueEntityId.createFromText(userId));
    if (response.isLeft()) {
      return left(response.value);
    }

    return right(response.value);
  }
}
