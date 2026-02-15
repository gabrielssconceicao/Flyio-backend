import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UserAlreadyExistError } from '@/core/errors/user-already-exist-error';
import { makeEmail, makeUser } from '@/test/factory/make-user';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { EditEmailUseCase } from './edit-email';

let userRepository: InMemoryUserRepository;
let sut: EditEmailUseCase;

describe('Edit User Email Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new EditEmailUseCase(userRepository);
  });

  it('should update user email', async () => {
    await userRepository.create(makeUser({}, new UniqueEntityId('test-id')));
    const response = await sut.execute({
      userId: 'test-id',
      email: 'johndoe@example.com',
    });

    expect(response.isRight()).toBe(true);
    expect(response.isRight() && response).not.toBe(undefined);
    expect(userRepository.items[0].email.value).toEqual('johndoe@example.com');
  });

  it('should not update email if email already in use', async () => {
    await userRepository.create(
      makeUser(
        { email: makeEmail('johndoe@example.com') },
        new UniqueEntityId('test-id'),
      ),
    );

    const response = await sut.execute({
      userId: 'test-id',
      email: 'johndoe@example.com',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(UserAlreadyExistError);
  });

  it('should not update user if not found', async () => {
    const response = await sut.execute({
      userId: 'non-existent-id',
      email: 'johndoe@example.com',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
