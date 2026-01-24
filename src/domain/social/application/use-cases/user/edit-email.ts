import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UserAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { Email } from '@/domain/social/enterprise/entities/value-obj/email';

import { UserRepository } from '../../repository/user-repository';

interface EditEmailUseCaseRequest {
  userId: string;
  email: string;
}

type EditEmailUseCaseResponse = Either<
  ResourceNotFoundError | UserAlreadyExistError,
  void
>;

export class EditEmailUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({
    userId,
    email,
  }: EditEmailUseCaseRequest): Promise<EditEmailUseCaseResponse> {
    const user = await this.usersRepository.findById(
      new UniqueEntityId(userId),
    );

    if (!user) {
      return left(new ResourceNotFoundError('User'));
    }

    const emailAlreadyExists = await this.usersRepository.findByEmail(email);

    if (emailAlreadyExists) {
      return left(new UserAlreadyExistError());
    }

    user.email = Email.create(email);

    await this.usersRepository.save(user);

    return right(undefined);
  }
}
