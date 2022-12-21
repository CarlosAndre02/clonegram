import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsDefaultRegion: process.env.AWS_DEFAULT_REGION,
  s3BucketName: process.env.S3_BUCKET_NAME,
  secretAccessToken: process.env.SECRET_ACCESS_TOKEN,
  secretRefreshToken: process.env.SECRET_REFRESH_TOKEN,
  expiresInAccessToken: process.env.EXPIRES_IN_ACCESS_TOKEN,
  expiresInRefreshToken: process.env.EXPIRES_IN_REFRESH_TOKEN,
  expiresInRefreshTokenDays: process.env.EXPIRES_IN_REFRESH_TOKEN_DAYS
};
