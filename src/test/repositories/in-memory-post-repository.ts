import { PaginationParams } from '@/core/repositories/pagination-params';
import { PostsRepository } from '@/domain/social/application/repositories/posts-repository';
import { UsersRepository } from '@/domain/social/application/repositories/users-repository';
import { Post } from '@/domain/social/enterprise/entities/post';

import { InMemoryTagRepository } from './in-memory-tag-repository';

export class InMemoryPostRepository extends PostsRepository {
  items: Post[] = [];
  private tagRepository: InMemoryTagRepository;
  constructor(
    private userRepository: UsersRepository,
    tagRepository?: InMemoryTagRepository,
  ) {
    super();
    if (tagRepository) this.tagRepository = tagRepository;
  }

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

      .filter((item) => {
        const words = query.toLowerCase().split(' ');
        return words.some((word) => item.content.toLowerCase().includes(word));
      })
      .slice((params.page - 1) * 20, params.page * 20);

    const mapPosts = posts.map(async (post) => {
      const user = await this.getUser(post.author_id.toString());
      return { post, author: user };
    });

    return Promise.all(mapPosts);
  }

  async findManyByTag(query: string[], params: PaginationParams) {
    const tags = query.map((tag) => tag.toLowerCase());
    const tagsId = await this.tagRepository.findManyByNames(tags);
    const posts = this.items
      .filter((item) => {
        const result = tagsId.some((tag) =>
          item.tags.some((postTag) => postTag.tagId === tag.id),
        );

        return result;
      })
      .slice((params.page - 1) * 20, params.page * 20);

    const mapPosts = posts.map(async (post) => {
      const user = await this.getUser(post.author_id.toString());
      return { post, author: user };
    });

    return Promise.all(mapPosts);
  }
}
