import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { User } from '@/domain/social/enterprise/entities/user';

import { UserRepository } from '../../repository/user-repository';

interface EditProfileUseCaseRequest {
  userId: string;
  data: Partial<{
    name: string;
    bio: string;
  }>;
}

type EditProfileUseCaseResponse = Either<ResourceNotFoundError, { user: User }>;

export class EditProfileUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({
    userId,
    data,
  }: EditProfileUseCaseRequest): Promise<EditProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(
      new UniqueEntityId(userId),
    );

    if (!user) {
      return left(new ResourceNotFoundError('User'));
    }

    if (data.name) {
      user.name = data.name;
    }

    if (data.bio) {
      user.bio = data.bio;
    }

    await this.usersRepository.save(user);

    return right({ user });
  }
}
