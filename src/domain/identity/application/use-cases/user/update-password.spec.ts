import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { TestComparer } from '@/test/domain/cryptografy/test-comparer';
import { TestHasher } from '@/test/domain/cryptografy/test-hasher';
import { makeUser } from '@/test/domain/factories/make-user';
import { InMemoryUsersRepository } from '@/test/domain/repositories/in-memory-users-repository';

import { InvalidPasswordError } from '../../../enterprise/errors/invalid-password-error';
import { InvalidCredentialsError } from '../../errors/invalid-credentials-error';
import { UserNotFoundError } from '../../errors/user-not-found-error';
import { UpdatePasswordRequest, UpdatePasswordUseCase } from './update-password';

let sut: UpdatePasswordUseCase;
let usersRepository: InMemoryUsersRepository;
let hasher: TestHasher;
let comparer: TestComparer;

let request: UpdatePasswordRequest;

describe('Update Password Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    hasher = new TestHasher();
    comparer = new TestComparer();

    sut = new UpdatePasswordUseCase(usersRepository, hasher, comparer);
    request = {
      userId: 'user-id',
      currentPassword: 'old-password',
      newPassword: 'newPassword@123',
    };

    await usersRepository.create(
      makeUser(
        {
          passwordHash: `hashed-${request.currentPassword}`,
        },
        UniqueEntityId.createFromText('user-id'),
      ),
    );
  });

  it('should update password successfully', async () => {
    const response = await sut.handle(request);

    expect(response.isRight()).toBe(true);
    expect(response.value).toBeUndefined();
    expect(usersRepository.items[0].passwordHash).toBe(`hashed-newPassword@123`);
  });

  it('should not update password if user is not found', async () => {
    const response = await sut.handle({
      ...request,
      userId: 'invalid-user-id',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should not update password if current password is invalid', async () => {
    const response = await sut.handle({
      ...request,
      currentPassword: 'invalid-password',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not update password if new password is invalid', async () => {
    const response = await sut.handle({
      ...request,
      newPassword: 'invalid-password',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidPasswordError);
  });
});
