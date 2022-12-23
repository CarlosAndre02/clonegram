import { createLoader } from '@entria/graphql-mongo-helpers';

import { registerLoader } from '@/modules/graphql/loaderRegister';
import { AuthModel } from './AuthModel';

const Loader = createLoader({
  model: AuthModel,
  loaderName: 'AuthLoader'
});

export const { Wrapper: Auth, getLoader, clearCache, load, loadAll } = Loader;
export default Loader;

registerLoader('AuthLoader', getLoader);
