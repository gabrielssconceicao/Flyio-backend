import { Entity } from '@/core/entities/entity';

export interface FollowProps {
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export class Follow extends Entity<FollowProps> {}
