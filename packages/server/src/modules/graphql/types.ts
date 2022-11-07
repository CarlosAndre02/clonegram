import { DataLoaders } from './loaderRegister';
import { UserDocument } from '../user/UserModel';

type GraphQLContext = {
  user?: UserDocument;
  dataloaders: DataLoaders;
};

export { GraphQLContext };
