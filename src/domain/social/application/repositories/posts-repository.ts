import { PaginationParams } from '@/core/repositories/pagination-params';

import { Post } from '../../enterprise/entities/post';
import { Tag } from '../../enterprise/entities/tag';
import { User } from '../../enterprise/entities/user';

export interface PostWithAuthorAndTags {
  post: Post;
  author: User;
  tags: Tag[];
}

export abstract class PostsRepository {
  abstract create(post: Post): Promise<PostWithAuthorAndTags>;
  abstract save(post: Post): Promise<void>;

  abstract findPostById(postId: string): Promise<PostWithAuthorAndTags | null>;
  abstract findById(id: string): Promise<Post | null>;
  abstract findMany(params: PaginationParams): Promise<PostWithAuthorAndTags[]>;
  abstract findManyByContent(
    query: string,
    params: PaginationParams,
  ): Promise<PostWithAuthorAndTags[]>;
  abstract findManyByTag(
    query: string[],
    params: PaginationParams,
  ): Promise<PostWithAuthorAndTags[]>;
  abstract findManyByUserId(
    id: string,
    params: PaginationParams,
  ): Promise<PostWithAuthorAndTags[]>;
}
