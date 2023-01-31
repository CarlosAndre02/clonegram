import { GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from 'graphql';
import { fromGlobalId } from 'graphql-relay';

import { PostType } from '../PostType';
import { PostModel } from '../PostModel';

export const PostGetQuery: GraphQLFieldConfig<any, any, any> = {
  type: PostType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve: (_, args) => {
    const { id } = args;
    return PostModel.findById(fromGlobalId(id).id);
  }
};
