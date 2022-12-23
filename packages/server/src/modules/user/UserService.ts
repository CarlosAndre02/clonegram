import { UserModel, UserDocument } from './UserModel';

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
