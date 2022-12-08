import aws from 'aws-sdk';
import stream from 'stream';

import { config } from '@/config/env';

const S3config = {
  region: 'us-east-1',
  accessKeyId: config.AWS_ACCESS_KEY_ID ?? '',
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY ?? ''
};

const s3Client = new aws.S3(S3config);

export const uploadObjectToS3 = async (fileStream: any, key: string) => {
  const pass = new stream.PassThrough();
  fileStream.pipe(pass);

  const response = await s3Client
    .upload({
      Bucket: config.S3_BUCKET_NAME ?? '',
      Key: key,
      Body: pass
    })
    .promise();
  return response;
};

export const deleteObjectFromS3 = async (key: string) => {
  await s3Client
    .deleteObject({
      Bucket: config.S3_BUCKET_NAME ?? '',
      Key: key
    })
    .promise();
};
