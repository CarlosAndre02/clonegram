import { createLoader } from '@entria/graphql-mongo-helpers';

import { CommentModel } from './CommentModel';
import { registerLoader } from '@/modules/graphql/loaderRegister';

const Loader = createLoader({
  model: CommentModel,
  loaderName: 'CommentLoader'
});

export const {
  Wrapper: Comment,
  getLoader,
  clearCache,
  load,
  loadAll
} = Loader;
export default Loader;

registerLoader('CommentLoader', getLoader);
