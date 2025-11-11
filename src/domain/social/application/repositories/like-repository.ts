import { Like } from '../../enterprise/entities/like';

export interface LikeParams {
  postId: string;
  userId: string;
}

export abstract class LikeRepository {
  abstract create(like: Like): Promise<void>;

  abstract findByUserAndPostId(params: LikeParams): Promise<Like | null>;
}
