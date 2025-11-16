import { PaginationParams } from '@/core/repositories/pagination-params';

import { Post } from '../../enterprise/entities/post';
import { Tag } from '../../enterprise/entities/tag';
import { User } from '../../enterprise/entities/user';

export interface PostResponse {
  post: Post;
  author: User;
  tags: Tag[];
  isLiked: boolean;
}

export abstract class PostsRepository {
  abstract create(post: Post): Promise<PostResponse>;
  abstract save(post: Post): Promise<void>;

  abstract findPostById(
    postId: string,
    currentUserId: string | null,
  ): Promise<PostResponse | null>;

  abstract findById(id: string): Promise<Post | null>;

  abstract findMany(
    currentUserId: string | null,
    params: PaginationParams,
  ): Promise<PostResponse[]>;

  abstract findManyByContent(
    query: string,
    currentUserId: string | null,
    params: PaginationParams,
  ): Promise<PostResponse[]>;

  abstract findManyByTag(
    query: string[],
    currentUserId: string | null,
    params: PaginationParams,
  ): Promise<PostResponse[]>;

  abstract findManyByUserId(
    userId: string,
    currentUserId: string | null,
    params: PaginationParams,
  ): Promise<PostResponse[]>;

  abstract findManyLikedByUserId(
    userId: string,
    currentUserId: string | null,
    params: PaginationParams,
  ): Promise<PostResponse[]>;
}
