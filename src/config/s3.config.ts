import { S3ClientConfig } from '@aws-sdk/client-s3';
import { registerAs } from '@nestjs/config';

export const s3Config = registerAs(
  's3',
  (): S3ClientConfig => ({
    region: process.env.S3_REGION || '',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  }),
);
