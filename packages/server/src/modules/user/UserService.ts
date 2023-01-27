import { UserModel, UserDocument } from './UserModel';
import { BadRequestError } from '@/shared/AppErrors';

export const getUserById = async (id: string): Promise<UserDocument | null> => {
  return await UserModel.findById(id);
};

export const getUserByUsername = async (
  username: string
): Promise<UserDocument | null> => {
  return await UserModel.findOne({ username });
};

export const getUserByEmail = async (
  email: string
): Promise<UserDocument | null> => {
  return await UserModel.findOne({ email });
};

export const followUser = async (
  followerId: string,
  followeeId: string
): Promise<{ follower: UserDocument; followee: UserDocument }> => {
  const follower = await UserModel.findOneAndUpdate(
    { _id: followerId },
    { $addToSet: { following: followeeId } },
    { new: true }
  );
  if (!follower) throw new BadRequestError('User does not exist');

  const followee = await UserModel.findOneAndUpdate(
    { _id: followeeId },
    { $addToSet: { followers: followerId } },
    { new: true }
  );
  if (!followee) throw new BadRequestError('User does not exist');

  return { follower, followee };
};
