import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { Like } from '../../enterprise/entities/like';

export type IsLikedParams = {
  user_id: UniqueEntityId;
  post_id: UniqueEntityId;
};

export abstract class LikeRepository {
  abstract create(like: Like): Promise<void>;
  abstract delete(like: Like): Promise<void>;
  abstract isLiked(params: IsLikedParams): Promise<boolean>;
}
