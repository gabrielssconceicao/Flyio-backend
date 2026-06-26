import { NotFoundError } from '@/core/errors/not-found-error';
import { makeUserDto } from '@/test/domain/factories/make-user-dto';
import { InMemoryUsersQuery } from '@/test/domain/queries/in-memory-user-queries';

import { GetProfileByUsernameUseCase } from './get-profile-by-username';

let sut: GetProfileByUsernameUseCase;
let userQuery: InMemoryUsersQuery;
describe('Get Profile By Username Use Case', () => {
  beforeEach(() => {
    userQuery = new InMemoryUsersQuery();
    sut = new GetProfileByUsernameUseCase(userQuery);
    userQuery.items.push(makeUserDto({ username: 'jonhdoe' }));
  });

  it('should be able to get user profile by username', async () => {
    const response = await sut.handle({ username: 'jonhdoe' });
    if (response.isLeft()) {
      throw new Error('Should be right');
    }
    expect(response.isRight()).toBe(true);
    expect(response.value.username).toEqual('jonhdoe');
  });

  it('should return a UserNotFoundError if user is not found', async () => {
    const response = await sut.handle({ username: 'maryDoe' });
    expect(response.isLeft()).toBe(true);
    expect(response.value).toBeInstanceOf(NotFoundError);
  });
});
