import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeUser } from '@/test/domain/factories/make-user';
import { InMemoryUsersRepository } from '@/test/domain/repositories/in-memory-users-repository';

import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserFinder } from '../service/user-finder';
import { GetProfileUseCase } from './get-profile';

let sut: GetProfileUseCase;
let userFinder: UserFinder;
let userRepository: InMemoryUsersRepository;

describe('Get Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    userFinder = new UserFinder(userRepository);
    sut = new GetProfileUseCase(userFinder);
  });

  it('should be able to get user profile', async () => {
    const id = UniqueEntityId.createFromText('teste-id');
    await userRepository.create(makeUser({}, id));

    const response = await sut.handle({ userId: 'teste-id' });

    expect(response.isRight()).toBe(true);
    if (response.isLeft()) {
      throw new Error('Should be right');
    }
    expect(response.value.id).toEqual(id);
  });

  it('should return UseNotFoundError if user not found', async () => {
    const response = await sut.handle({ userId: 'invalid-id' });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(UserNotFoundError);
  });
});
