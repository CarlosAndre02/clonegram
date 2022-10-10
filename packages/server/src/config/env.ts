import dotenv from 'dotenv';

dotenv.config();

const { PORT, MONGO_URI } = process.env;

export const config = {
  PORT: PORT || 3000,
  MONGO_URI
};
