import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createWriteStream } from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
export async function downloadFromS3(fileKey: string) {
  try {
    const r2Client = new S3Client({
      region: 'us-east-1',
      endpoint: process.env.NEXT_PUBLIC_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY!,
        secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY!,
      },
    }) as any;

    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME,
      Key: fileKey,
    });

    const obj = await r2Client.send(getObjectCommand);

    const fileName = path.join('/tmp', `pdf-${Date.now()}.pdf`);
    const writeStream = createWriteStream(fileName);

    await pipeline(obj.Body, writeStream); // Proper stream handling
    return fileName;
  } catch (error: unknown) {
    console.log('There was an error', error);
  }
}
