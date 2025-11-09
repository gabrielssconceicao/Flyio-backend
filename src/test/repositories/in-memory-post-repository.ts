import { PostsRepository } from '@/domain/social/application/repositories/posts-repository';
import { UsersRepository } from '@/domain/social/application/repositories/users-repository';
import { Post } from '@/domain/social/enterprise/entities/post';

export class InMemoryPostRepository implements PostsRepository {
  items: Post[] = [];

  constructor(private userRepository: UsersRepository) {}

  async create(post: Post) {
    const user = await this.userRepository.findById(post.author_id.toString());

    if (!user) {
      throw new Error('User not found');
    }
    const postWithAuthor = { post, author: user };
    this.items.push(post);
    return postWithAuthor;
  }
}
