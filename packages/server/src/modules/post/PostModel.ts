import mongoose, { Schema, Document, Types } from 'mongoose';

export type IPost = {
  user: Types.ObjectId;
  description: string;
  image: {
    key: string;
    url: string;
  };
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type PostDocument = Document & IPost;

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    description: {
      type: String,
      required: true,
      minLength: 3
    },
    image: {
      key: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    },
    likes: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: 'User'
    },
    comments: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: 'Comment'
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true
    }
  }
);

export const PostModel = mongoose.model<PostDocument>('Post', PostSchema);
