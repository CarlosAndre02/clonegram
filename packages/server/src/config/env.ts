import dotenv from 'dotenv';

dotenv.config();

const {
  PORT,
  MONGO_URI,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_DEFAULT_REGION,
  S3_BUCKET_NAME
} = process.env;

export const config = {
  PORT: PORT || 3000,
  MONGO_URI,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_DEFAULT_REGION,
  S3_BUCKET_NAME
};
