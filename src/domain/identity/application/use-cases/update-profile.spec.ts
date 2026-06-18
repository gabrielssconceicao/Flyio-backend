import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeUser } from '@/test/domain/factories/make-user';
import { InMemoryUsersRepository } from '@/test/domain/repositories/in-memory-users-repository';

import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserFinder } from '../service/user-finder';
import { UpdateProfileUseCase } from './update-profile';

let sut: UpdateProfileUseCase;
let userFinder: UserFinder;
let userRepository: InMemoryUsersRepository;

describe('Get Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    userFinder = new UserFinder(userRepository);
    sut = new UpdateProfileUseCase(userFinder, userRepository);
  });

  it('should be able to update user profile', async () => {
    const id = UniqueEntityId.createFromText('teste-id');
    await userRepository.create(makeUser({}, id));

    const response = await sut.handle({ userId: 'teste-id', bio: '', name: 'John Doe' });

    if (response.isRight()) {
      expect(response.value.updated_at).not.toBeNull();
      expect(response.value.bio).toBe('');
      expect(response.value.name).toBe('John Doe');
    }
  });

  it('should return UseNotFoundError if user not found', async () => {
    const response = await sut.handle({ userId: 'invalid-id' });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(UserNotFoundError);
  });
});
