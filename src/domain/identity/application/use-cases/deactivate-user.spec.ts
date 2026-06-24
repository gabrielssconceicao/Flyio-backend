import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { TestComparer } from '@/test/domain/cryptografy/test-comparer';
import { makeUser } from '@/test/domain/factories/make-user';
import { InMemoryUsersRepository } from '@/test/domain/repositories/in-memory-users-repository';

import { InvalidCredentialsError } from '../errors/invalid-credentials-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { DeactivateUser } from './deactivate-user';

let sut: DeactivateUser;
let usersRepository: InMemoryUsersRepository;
let comparer: TestComparer;
let user: ReturnType<typeof makeUser>;

let password: string;
let id: string;

describe('Deactivate User Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    comparer = new TestComparer();
    password = 'Tes3@123';
    id = '12-3456-78-9';
    sut = new DeactivateUser(usersRepository, comparer);
    user = makeUser({ passwordHash: `hashed-${password}` }, UniqueEntityId.createFromText(id));

    await usersRepository.create(user);
  });

  it('should deactivate a user', async () => {
    const result = await sut.handle({ password, userId: id });

    expect(result.isRight()).toBe(true);

    if (result.isLeft()) {
      throw new Error('Expected Right');
    }

    expect(usersRepository.items[0].isActive).toBe(false);
    expect(result.value).toBeUndefined();
  });

  it('should return a UserNotFoundError if user is not found', async () => {
    const result = await sut.handle({ password, userId: 'invalid-id' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should return an InvalidCredentialsError if password is invalid', async () => {
    const result = await sut.handle({ password: 'invalid-password', userId: id });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });
});
