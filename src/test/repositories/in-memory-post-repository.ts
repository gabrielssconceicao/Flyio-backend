import { PaginationParams } from '@/core/repositories/pagination-params';
import { PostsRepository } from '@/domain/social/application/repositories/posts-repository';
import { UsersRepository } from '@/domain/social/application/repositories/users-repository';
import { Post } from '@/domain/social/enterprise/entities/post';

import { InMemoryTagRepository } from './in-memory-tag-repository';

export class InMemoryPostRepository extends PostsRepository {
  items: Post[] = [];

  constructor(
    private userRepository: UsersRepository,
    private tagRepository?: InMemoryTagRepository,
  ) {
    super();
  }

  private async getUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  private async mapPostsWithAuthor(posts: Post[]) {
    const mapped = posts.map(async (post) => {
      const author = await this.getUser(post.author_id.toString());
      return { post, author };
    });
    return Promise.all(mapped);
  }

  async create(post: Post) {
    const author = await this.getUser(post.author_id.toString());
    this.items.push(post);
    return { post, author };
  }

  async findById(postId: string) {
    const post = this.items.find((item) => item.id.toString() === postId);
    if (!post) return null;
    const author = await this.getUser(post.author_id.toString());
    return { post, author };
  }

  async findManyByContent(query: string, params: PaginationParams) {
    const words = query.toLowerCase().split(' ');
    const posts = this.items
      .filter((item) =>
        words.some((word) => item.content.toLowerCase().includes(word)),
      )
      .slice((params.page - 1) * 20, params.page * 20);

    return this.mapPostsWithAuthor(posts);
  }

  async findManyByTag(query: string[], params: PaginationParams) {
    if (!this.tagRepository)
      throw new Error('TagRepository not provided in InMemoryPostRepository');

    const tags = query.map((tag) => tag.toLowerCase());
    const tagsFound = await this.tagRepository.findManyByNames(tags);

    const posts = this.items
      .filter((item) =>
        tagsFound.some((tag) =>
          item.tags.some((postTag) => postTag.tagId === tag.id),
        ),
      )
      .slice((params.page - 1) * 20, params.page * 20);

    return this.mapPostsWithAuthor(posts);
  }

  async findMany(params: PaginationParams) {
    const posts = this.items
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice((params.page - 1) * 20, params.page * 20);

    return this.mapPostsWithAuthor(posts);
  }

  async findManyByUserId(id: string, params: PaginationParams) {
    const posts = this.items
      .filter((post) => post.author_id.toString() === id)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice((params.page - 1) * 20, params.page * 20);

    return this.mapPostsWithAuthor(posts);
  }
}
