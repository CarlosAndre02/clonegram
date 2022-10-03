import dotenv from 'dotenv';

dotenv.config();

const { PORT } = process.env;

export const config = {
  PORT: PORT || 3000
};
