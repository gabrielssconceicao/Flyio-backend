import { makeUser, makeUsername } from '@/test/domain/factories/make-user';
import { InMemoryUsersRepository } from '@/test/domain/repositories/in-memory-users-repository';

import { InvalidUsernameError } from '../../enterprise/errors/invalid-username-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { UserFinder } from '../service/user-finder';
import { GetUserByUsernameUseCase } from './get-user-by-username';

let sut: GetUserByUsernameUseCase;
let userFinder: UserFinder;
let userRepository: InMemoryUsersRepository;

describe('Get Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    userFinder = new UserFinder(userRepository);
    sut = new GetUserByUsernameUseCase(userFinder);
  });

  it('should be able to get user by username', async () => {
    await userRepository.create(
      makeUser({
        username: makeUsername('jonh_doe'),
      }),
    );

    const response = await sut.handle({ username: 'jonh_doe' });

    if (response.isLeft()) {
      throw new Error('Should be right');
    }
    expect(response.isRight()).toBe(true);
    expect(response.value.username.value).toEqual('jonh_doe');
  });

  it('should return UseNotFoundError if user not found', async () => {
    const response = await sut.handle({ username: 'invalid_username' });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should return InvalidUsernameError if username is invalid', async () => {
    const response = await sut.handle({ username: 'invalid+username' });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidUsernameError);
  });
});
