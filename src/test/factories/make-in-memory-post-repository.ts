import { InMemoryPostRepository } from '../repositories/in-memory-post-repository';
import { InMemoryTagRepository } from '../repositories/in-memory-tag-repository';
import { InMemoryUsersRepository } from '../repositories/in-memory-users-repository';

export function makeInMemoryPostRepository() {
  return new InMemoryPostRepository(
    new InMemoryUsersRepository(),
    new InMemoryTagRepository(),
  );
}
