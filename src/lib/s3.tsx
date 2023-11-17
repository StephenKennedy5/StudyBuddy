// Create S3 client
import { S3Client } from '@aws-sdk/client-s3';

const awsKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
if (!awsKeyId) {
  throw new Error('AWS_ACCESS_KEY_ID env variable is needed');
}

const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
if (!secretAccessKey) {
  throw new Error('AWS_SECRET_ACCESS_KEY env variable is needed');
}

const awsRegion = process.env.NEXT_PUBLIC_AWS_REGION;
if (!awsRegion) {
  throw new Error('AWS_REGION env variable is needed');
}

export const s3Client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsKeyId,
    secretAccessKey: secretAccessKey,
  },
});
