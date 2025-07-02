// import AWS from 'aws-sdk';
import {
  // PutObjectAclCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// const r2Client = new S3Client({
//   region: 'us-east-1',
//   endpoint: process.env.NEXT_PUBLIC_R2_ENDPOINT,
//   credentials: {
//     accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY!,
//     secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY!,
//   },
// }) as any;


export const s3Client = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY || '',
  },
});
export async function uploadToS3(file: File, userId: string) {
  try {
    // AWS.config.update({
    //   accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
    //   secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    // });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileKey = `${userId}/${Date.now()}-${file.name}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(putObjectCommand);

    // const s3 = new AWS.S3({
    //   params: {
    //     Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    //   },
    //   region: 'us-east-2',
    // });

    // const fileKey =
    //   'uploads/' + Date.now().toString() + file.name.replace(' ', '-');

    // if (!process.env.NEXT_PUBLIC_S3_BUCKET_NAME) {
    //   throw new Error(
    //     'Missing NEXT_PUBLIC_S3_BUCKET_NAME environment variable',
    //   );
    // }

    // const params = {
    //   Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    //   Key: fileKey,
    //   Body: file,
    // };

    // const upload = s3
    //   .putObject(params)
    //   .on('httpUploadProgress', (evt) => {
    //     setProgress(parseInt(((evt.loaded / evt.total) * 100).toString()));
    //     console.log(
    //       'uploading to s3...',
    //       parseInt(((evt.loaded / evt.total) * 100).toString() + '%'),
    //     );
    //   })
    //   .promise();

    // await upload.then(() => {
    //   console.log('successfully uploaded to s3', fileKey);
    // });

    // return Promise.resolve({
    //   fileKey,
    //   fileName: file.name,
    // });

    return Promise.resolve({
      fileKey: fileKey,
      fileName: file.name,
    });
  } catch (error) {
    console.log('error uploading to s3', error);
  }
}

export function getS3Url(fileKey: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${fileKey}`;
  return url;
}

export async function generatePresignedUrl(
  fileKey: string,
  contentType: string,
  expiresIn: number = 3600,
) {
  try {
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn,
    });

    return presignedUrl;
  } catch (error) {
    console.log('Error generating pre-signed URL:', error);
    throw error;
  }
}

export async function uploadToS3WithPresignedUrl(file: File, userId: string) {
  try {
    const fileKey = `${userId}/${Date.now()}-${file.name}`;

    // Generate pre-signed URL
    const presignedUrl = await generatePresignedUrl(fileKey, file.type);

    // Upload directly to S3/R2 using the pre-signed URL
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    return {
      fileKey,
      fileName: file.name,
    };
  } catch (error) {
    console.log('Error uploading with pre-signed URL:', error);
    throw error;
  }
}
