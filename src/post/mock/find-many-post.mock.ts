import { FindManyPostEntity } from '../entities/find-many.entity';
import { postMock } from './post.mock';

export const findManyPostMock = (): FindManyPostEntity => {
  return {
    count: 1,
    items: [postMock()],
  };
};
