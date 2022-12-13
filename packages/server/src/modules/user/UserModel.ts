import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export type UserDocument = Document & {
  fullname?: string;
  username: string;
  email: string;
  avatar?: {
    key: string;
    url: string;
  };
  biography?: string;
  password: string;
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  posts: Types.ObjectId[];
  isPasswordValid: (textPassword: string) => boolean;
  encryptPassword: (password: string) => string;
};

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      minLength: 3
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 20
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    avatar: {
      key: {
        type: String
      },
      url: {
        type: String
      }
    },
    biography: {
      type: String
    },
    password: {
      type: String,
      required: true,
      minLength: 8
    },
    following: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: 'User'
    },
    followers: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: 'User'
    },
    posts: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: 'Post'
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true
    }
  }
);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = this.encryptPassword(this.password);
  }

  return next();
});

UserSchema.methods = {
  encryptPassword(password: string) {
    return bcrypt.hashSync(password, 8);
  },
  isPasswordValid(textPassword: string) {
    return bcrypt.compareSync(textPassword, this.password);
  }
};

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
