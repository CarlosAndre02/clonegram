import { PostModel, PostDocument } from './PostModel';
import { BadRequestError } from '@/shared/AppErrors';

type CreatePost = {
  user: string;
  description: string;
  image: {
    key: string;
    url: string;
  };
};

type UpdatePost = {
  id: string;
  user: string;
  description: string;
};

export const createPost = async (post: CreatePost): Promise<PostDocument> => {
  return await new PostModel({ ...post }).save();
};

export const updatePost = async ({
  id,
  user,
  description
}: UpdatePost): Promise<PostDocument> => {
  const post = await PostModel.findById(id);
  if (!post) throw new BadRequestError('Post does not exist');

  if (post?.user.toString() !== user)
    throw new BadRequestError('You are unauthorized to update this post');

  post.description = description;
  await post.save();

  return post;
};
