import AWS from 'aws-sdk';

export async function uploadToS3(file: File, setProgress: any) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      region: 'us-east-2',
    });

    const fileKey =
      'uploads/' + Date.now().toString() + file.name.replace(' ', '-');

    if (!process.env.NEXT_PUBLIC_S3_BUCKET_NAME) {
      throw new Error(
        'Missing NEXT_PUBLIC_S3_BUCKET_NAME environment variable',
      );
    }

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: fileKey,
      Body: file,
    };

    const upload = s3
      .putObject(params)
      .on('httpUploadProgress', (evt) => {
        setProgress(parseInt(((evt.loaded / evt.total) * 100).toString()));
        console.log(
          'uploading to s3...',
          parseInt(((evt.loaded / evt.total) * 100).toString() + '%'),
        );
      })
      .promise();

    await upload.then(() => {
      console.log('successfully uploaded to s3', fileKey);
    });

    return Promise.resolve({
      fileKey,
      fileName: file.name,
    });
  } catch (error) {
    console.log(error);
  }
}
export function getS3Url(fileKey: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${fileKey}`;
  return url;
}
