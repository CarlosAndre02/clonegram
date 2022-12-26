import { DataLoaders } from './loaderRegister';
import { UserDocument } from '../user/UserModel';

type GraphQLContext = {
  user: UserDocument | null;
  dataloaders: DataLoaders;
};

export { GraphQLContext };
