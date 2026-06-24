import { Either, left, right } from '@/core/either/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotFoundError } from '@/core/errors/not-found-error';

import { User } from '../../enterprise/entities/user';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UsersRepository } from '../repository/users-repository';

type UpdateProfileRequest = {
  userId: string;
  name?: string;
  bio?: string;
};

type UpdateProfileResponse = Either<NotFoundError, User>;

export class UpdateProfileUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle({ userId, name, bio }: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const user = await this.usersRepository.findById(UniqueEntityId.createFromText(userId));

    if (!user) {
      return left(new UserNotFoundError());
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    await this.usersRepository.save(user);
    return right(user);
  }
}
