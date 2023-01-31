import { PostModel, PostDocument } from './PostModel';

type CreatePost = {
  user: string;
  description: string;
  image: {
    key: string;
    url: string;
  };
};

export const createPost = async (post: CreatePost): Promise<PostDocument> => {
  return await new PostModel({ ...post }).save();
};
