import { findManyPostMock } from './find-many-post.mock';
import { findOnePostMock } from './find-one-post.mock';
import { postMock } from './post.mock';

const _count = { _count: { likes: 0, replies: 0 }, likes: [] };

export { findManyPostMock, postMock, _count, findOnePostMock };
