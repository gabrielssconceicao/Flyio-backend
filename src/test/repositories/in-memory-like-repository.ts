import {
  LikeParams,
  LikeRepository,
} from '@/domain/social/application/repositories/like-repository';
import { Like } from '@/domain/social/enterprise/entities/like';

export class InMemoryLikeRepository implements LikeRepository {
  public items: Like[] = [];

  async create(like: Like): Promise<void> {
    this.items.push(like);
  }

  async delete(like: Like): Promise<void> {
    const index = this.items.findIndex(
      (item) =>
        item.post_id.toString() === like.post_id.toString() &&
        item.user_id.toString() === like.user_id.toString(),
    );
    this.items.splice(index, 1);
  }

  async findByUserAndPostId(params: LikeParams): Promise<Like | null> {
    const like = this.items.find(
      (like) =>
        like.post_id.toString() === params.postId &&
        like.user_id.toString() === params.userId,
    );

    return like ?? null;
  }
}
