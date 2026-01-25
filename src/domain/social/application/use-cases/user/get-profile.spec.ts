import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUser } from '@/test/factory/make-user';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { GetProfileUseCase } from './get-profile';

let userRepository: InMemoryUserRepository;
let sut: GetProfileUseCase;

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new GetProfileUseCase(userRepository);
  });

  it('should return a user by username', async () => {
    await userRepository.create(makeUser({}, new UniqueEntityId('test-id')));
    const response = await sut.execute({ userId: 'test-id' });

    expect(response.isRight()).toBe(true);
    expect(response.isRight() && response.value.user.id.value).toEqual(
      'test-id',
    );
  });
  it('should not return a user if not found', async () => {
    const response = await sut.execute({ userId: 'fail-test-id' });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
