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

export const deletePost = async (
  id: string,
  user: string
): Promise<PostDocument> => {
  const post = await PostModel.findById(id);
  if (!post) throw new BadRequestError('Post does not exist');

  if (post?.user.toString() !== user)
    throw new BadRequestError('You are unauthorized to delete this post');

  await post.deleteOne();

  return post;
};

export const likePost = async (
  id: string,
  user: string
): Promise<PostDocument> => {
  const post = await PostModel.findOneAndUpdate(
    { _id: id },
    { $addToSet: { likes: user } },
    { new: true }
  );
  if (!post) throw new BadRequestError('Post does not exist');

  return post;
};

export const unlikePost = async (
  id: string,
  user: string
): Promise<PostDocument> => {
  const post = await PostModel.findOneAndUpdate(
    { _id: id },
    { $pull: { likes: user } },
    { new: true }
  );
  if (!post) throw new BadRequestError('Post does not exist');

  return post;
};

export const postAlreadyExists = (id: string): boolean => {
  return !!PostModel.exists({ id });
};

export const addCommentToPost = async (postId: string, commentId: string) => {
  const post = await PostModel.findOneAndUpdate(
    { _id: postId },
    { $addToSet: { comments: commentId } }
  );
  if (!post) throw new BadRequestError('Post does not exist');
};
