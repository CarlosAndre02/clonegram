import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from 'graphql';

import { UserType } from '../UserType';
import { UserModel } from '../UserModel';

export const GetUserQuery: GraphQLFieldConfig<any, any, any> = {
  type: UserType,
  args: {
    username: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (_, args) => {
    const { username } = args;
    return UserModel.findOne({ username });
  }
};
