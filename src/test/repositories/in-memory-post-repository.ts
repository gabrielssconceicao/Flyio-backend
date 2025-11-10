import { PaginationParams } from '@/core/repositories/pagination-params';
import { PostsRepository } from '@/domain/social/application/repositories/posts-repository';
import { UsersRepository } from '@/domain/social/application/repositories/users-repository';
import { Post } from '@/domain/social/enterprise/entities/post';

export class InMemoryPostRepository implements PostsRepository {
  items: Post[] = [];

  constructor(private userRepository: UsersRepository) {}

  private async getUser(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async create(post: Post) {
    const user = await this.getUser(post.author_id.toString());
    const postWithAuthor = { post, author: user };
    this.items.push(post);
    return postWithAuthor;
  }

  async findManyByContent(query: string, params: PaginationParams) {
    const posts = this.items
      .slice((params.page - 1) * 20, params.page * 20)
      .filter((item) => {
        const words = query.toLowerCase().split(' ');
        return words.some((word) => item.content.toLowerCase().includes(word));
      });

    const mapPosts = posts.map(async (post) => {
      const user = await this.getUser(post.author_id.toString());
      return { post, author: user };
    });

    return Promise.all(mapPosts);
  }
}
