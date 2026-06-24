import { Either, left, right } from '@/core/either/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotFoundError } from '@/core/errors/not-found-error';

import { User } from '../../../enterprise/entities/user';
import { UserFinder } from '../../service/user-finder';

type GetProfileRequest = {
  userId: string;
};

type GetProfileResponse = Either<NotFoundError, User>;

export class GetProfileUseCase {
  constructor(private readonly userFinder: UserFinder) {}

  async handle({ userId }: GetProfileRequest): Promise<GetProfileResponse> {
    const userOrError = await this.userFinder.findById(UniqueEntityId.createFromText(userId));
    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    return right(userOrError.value);
  }
}
