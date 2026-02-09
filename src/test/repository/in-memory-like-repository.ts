import {
  IsLikedParams,
  LikeRepository,
} from '@/domain/social/application/repository/like-repository';
import { Like } from '@/domain/social/enterprise/entities/like';

export class InMemoryLikeRepository extends LikeRepository {
  items: Like[] = [];

  create(like: Like): Promise<void> {
    this.items.push(like);
    return Promise.resolve();
  }

  isLiked(params: IsLikedParams): Promise<boolean> {
    return Promise.resolve(
      this.items.some(
        (like) =>
          like.user_id.equals(params.user_id) &&
          like.post_id.equals(params.post_id),
      ),
    );
  }
}
