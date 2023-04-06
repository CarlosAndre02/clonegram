import { CommentDocument, CommentModel } from './CommentModel';

type CreateComment = {
  user: string;
  content: string;
};

export const createComment = async (
  comment: CreateComment
): Promise<CommentDocument> => {
  return await new CommentModel({ ...comment }).save();
};
