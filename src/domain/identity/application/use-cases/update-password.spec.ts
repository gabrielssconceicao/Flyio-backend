import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { TestComparer } from '@/test/domain/cryptografy/test-comparer';
import { TestHasher } from '@/test/domain/cryptografy/test-hasher';
import { makeUser } from '@/test/domain/factories/make-user';
import { InMemoryUsersRepository } from '@/test/domain/repositories/in-memory-users-repository';

import { InvalidPasswordError } from '../../enterprise/errors/invalid-password-error';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
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
    const userId = UniqueEntityId.createFromText('user-id');
    const user = makeUser(
      {
        passwordHash: await hasher.hash('old-password'),
      },
      userId,
    );

    await usersRepository.create(user);
  });

  it('should update password successfully', async () => {
    const result = await sut.handle(request);

    expect(result.isRight()).toBe(true);

    const updatedUser = usersRepository.items[0];

    expect(updatedUser.passwordHash).toBe(await hasher.hash('newPassword@123'));
  });

  it('should not update password if user is not found', async () => {
    const result = await sut.handle({
      ...request,
      userId: 'invalid-user-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should not update password if current password is invalid', async () => {
    const result = await sut.handle({
      ...request,
      currentPassword: 'invalid-password',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not update password if new password is invalid', async () => {
    const result = await sut.handle({
      ...request,
      newPassword: 'invalid-password',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidPasswordError);
  });
});
