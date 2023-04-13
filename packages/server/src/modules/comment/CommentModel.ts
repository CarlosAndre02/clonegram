import mongoose, { Schema, Document, Types } from 'mongoose';

export type IComment = {
  user: Types.ObjectId;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CommentDocument = Document & IComment;

const CommentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      minLength: 3
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true
    }
  }
);

export const CommentModel = mongoose.model<CommentDocument>(
  'Comment',
  CommentSchema
);
