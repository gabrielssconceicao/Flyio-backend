import { makeUserDto } from '@/test/domain/factories/make-user-dto';
import { InMemoryUsersQuery } from '@/test/domain/queries/in-memory-user-queries';

import { SearchUsersUseCase } from './search-users';

let sut: SearchUsersUseCase;
let userQuery: InMemoryUsersQuery;

describe('Fetch Users By Name Or Username Use Case', () => {
  beforeEach(() => {
    userQuery = new InMemoryUsersQuery();
    sut = new SearchUsersUseCase(userQuery);
    const names = ['Jonh Doe', 'Mary Jane', 'Paul Smit', 'Henry Gray'];
    const usernames = ['jonhdoe', 'maryjane', 'paulsmith'];
    Array.from({ length: 10 }).forEach((_, i) => {
      userQuery.items.push(
        makeUserDto({
          name: names[i % 4],
          username: usernames[(i + 2) % 3],
        }),
      );
    });
  });

  it('should be able to fetch users by name or username', async () => {
    const response = await sut.execute({ query: 'Henry', viewerId: '' });
    if (response.isLeft()) {
      throw new Error('Should be right');
    }
    expect(response.isRight()).toBe(true);
    expect(response.value.users).toHaveLength(2);
    expect(response.value.total).toEqual(2);
  });

  it('should be able to fetch users by name or username with pagination', async () => {
    const response = await sut.execute({ query: '', viewerId: '', page: 3, limit: 4 });
    if (response.isLeft()) {
      throw new Error('Should be right');
    }
    expect(response.isRight()).toBe(true);
    expect(response.value.users).toHaveLength(2);
    expect(response.value.total).toEqual(10);
  });
});
