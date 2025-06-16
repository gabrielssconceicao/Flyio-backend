import { postMock } from '@/post/mock';
import { GetLikedPostEntity } from '../entities/get-liked-post-entity';

export const getLikesMock = (): GetLikedPostEntity => {
  return {
    count: 1,
    items: [{ ...postMock(), parent: null }],
  };
};
