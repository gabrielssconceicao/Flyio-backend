import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Follow,
  FollowProps,
} from '@/domain/social/enterprise/entities/follow';

export function makeFollow(override: Partial<FollowProps> = {}) {
  const newFollow = Follow.create({
    followerId: new UniqueEntityId(),
    followingId: new UniqueEntityId(),
    created_at: new Date(),
    ...override,
  });

  return newFollow;
}
