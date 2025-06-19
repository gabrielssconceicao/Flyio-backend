import { FindOnePostEntity } from '../entities/find-one-post.entity';
import { postMock } from './post.mock';

export const findOnePostMock = (): FindOnePostEntity => {
  return {
    ...postMock(),
    comments: [],
    parent: null,
  };
};
