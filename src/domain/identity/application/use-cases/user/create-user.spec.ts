import { faker } from '@faker-js/faker';

import { TestHasher } from '@/test/domain/cryptografy/test-hasher';
import { InMemoryUsersRepository } from '@/test/domain/repositories/in-memory-users-repository';

import { InvalidEmailError } from '../../../enterprise/errors/invalid-email-error';
import { InvalidPasswordError } from '../../../enterprise/errors/invalid-password-error';
import { InvalidUsernameError } from '../../../enterprise/errors/invalid-username-error';
import { UserAlreadyExistsError } from '../../errors/user-already-exists-error';
import { CreateUserRquest, CreateUserUseCase } from './create-user';

let sut: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let hasher: TestHasher;
let request: CreateUserRquest;

describe('Create User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    hasher = new TestHasher();
    sut = new CreateUserUseCase(usersRepository, hasher);

    request = {
      name: faker.person.firstName(),
      bio: faker.lorem.sentence(),
      username: 'myUsername',
      email: faker.internet.email(),
      password: 'myPassw@rd345',
    };
  });

  it('should be able to create a new user', async () => {
    const response = await sut.handle(request);

    expect(response.isRight()).toBe(true);
    expect(usersRepository.items).toHaveLength(1);
    expect(response.value).toBeUndefined();
  });

  it('should not be able to create a user with invalid username', async () => {
    const response = await sut.handle({ ...request, username: 'invalid+username' });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidUsernameError);
  });

  it('should not be able to create a user with invalid email', async () => {
    const response = await sut.handle({ ...request, email: 'invalid+email.com' });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidEmailError);
  });

  it('should not be able to create a user with invalid password', async () => {
    const response = await sut.handle({ ...request, password: 'invalid+password' });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(InvalidPasswordError);
  });

  it('should not be able to create a user with same email', async () => {
    await sut.handle(request);

    const response = await sut.handle({
      ...request,
      username: 'myUsername2',
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(UserAlreadyExistsError);
  });

  it('should not be able to create a user with same username', async () => {
    await sut.handle(request);

    const response = await sut.handle({
      ...request,
      email: faker.internet.email(),
    });

    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(UserAlreadyExistsError);
  });
});
