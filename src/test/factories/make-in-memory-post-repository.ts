import { InMemoryLikeRepository } from '../repositories/in-memory-like-repository';
import { InMemoryPostRepository } from '../repositories/in-memory-post-repository';
import { InMemoryTagRepository } from '../repositories/in-memory-tag-repository';
import { InMemoryUsersRepository } from '../repositories/in-memory-users-repository';

type makeInMemoryPostRepositoryProps = {
  userRepository?: InMemoryUsersRepository;
  tagRepository?: InMemoryTagRepository;
  likeRepository?: InMemoryLikeRepository;
};

export function makeInMemoryPostRepository({
  likeRepository,
  tagRepository,
  userRepository,
}: makeInMemoryPostRepositoryProps = {}) {
  return new InMemoryPostRepository(
    userRepository ?? new InMemoryUsersRepository(),
    tagRepository ?? new InMemoryTagRepository(),
    likeRepository ?? new InMemoryLikeRepository(),
  );
}
