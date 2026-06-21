import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeUser } from '@/test/domain/factories/make-user';
import { InMemoryUsersRepository } from '@/test/domain/repositories/in-memory-users-repository';

import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserFinder } from '../service/user-finder';
import { UpdateProfileUseCase } from './update-profile';

let sut: UpdateProfileUseCase;
let userFinder: UserFinder;
let userRepository: InMemoryUsersRepository;

let id: UniqueEntityId;
let user: ReturnType<typeof makeUser>;

describe('Get Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    userFinder = new UserFinder(userRepository);
    sut = new UpdateProfileUseCase(userFinder, userRepository);
    id = UniqueEntityId.createFromText('teste-id');
    user = makeUser({}, id);
  });

  it('should be able to update user profile', async () => {
    await userRepository.create(user);
    const response = await sut.handle({ userId: 'teste-id', bio: '', name: 'John Doe' });

    if (response.isRight()) {
      expect(response.value.updatedAt).not.toBeNull();
      expect(response.value.bio).toBe('');
      expect(response.value.name).toBe('John Doe');
    }
  });

  it('should remain the same if data not provided', async () => {
    await userRepository.create(user);
    const response = await sut.handle({ userId: 'teste-id' });

    if (response.isRight()) {
      expect(response.value.updatedAt).toBeNull();
      expect(response.value.bio).toEqual(user.bio);
      expect(response.value.name).toEqual(user.name);
    }
  });

  it('should return UseNotFoundError if user not found', async () => {
    const response = await sut.handle({ userId: 'invalid-id' });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(UserNotFoundError);
  });
});
