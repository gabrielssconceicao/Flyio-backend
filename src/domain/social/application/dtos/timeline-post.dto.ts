import { UniqueEntityId } from '@/core/entities/unique-entity-id';

import { Username } from '../../enterprise/entities/value-obj/username';

export interface TimelinePostDTO {
  id: UniqueEntityId;
  content: string;
  createdAt: Date;

  author: {
    id: UniqueEntityId;
    username: Username;
  };

  likesCount: number;
  likedByViewer: boolean;
}
