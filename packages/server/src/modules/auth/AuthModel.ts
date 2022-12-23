import mongoose, { Schema, Document, Types } from 'mongoose';

export type IAuth = {
  user: Types.ObjectId;
  accessToken?: string;
  refreshToken: string;
  expiresDate: Date;
};

export type AuthDocument = Document & IAuth;

const AuthSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    refreshToken: {
      type: String,
      required: true
    },
    expiresDate: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true
    }
  }
);

export const AuthModel = mongoose.model<AuthDocument>('Auth', AuthSchema);
