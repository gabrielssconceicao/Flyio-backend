import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeUser } from '@/test/factory/make-user';
import { InMemoryUserRepository } from '@/test/repository/in-memory-user-repository';

import { GetProfileUseCase } from './get-profile';

let userRepository: InMemoryUserRepository;
let sut: GetProfileUseCase;

describe('Get User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new GetProfileUseCase(userRepository);
  });

  it('should return a user by username', async () => {
    await userRepository.create(makeUser({}, new UniqueEntityId('teste-id')));
    const response = await sut.execute({ userId: 'teste-id' });

    expect(response.isRight()).toBe(true);
    expect(response.isRight() && response.value.id.value).toEqual('teste-id');
  });
  it('should return a user by username', async () => {
    const response = await sut.execute({ userId: 'fail-test-id' });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
