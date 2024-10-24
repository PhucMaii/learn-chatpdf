import { db } from '@/lib/db';
import { chats, messages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { withAuthGuard } from '@/utils/guard';

interface IBody {
  fileKey: string;
  chatId: number;
}

const handler = async (req: Request) => {
  try {
    const { fileKey, chatId }: IBody = await req.json();

    // Delete messages
    await db.delete(messages).where(eq(messages.chatId, chatId));

    // Delete chat
    await db.delete(chats).where(eq(chats.id, chatId));

    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    });

    // Remove from S3
    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      region: 'us-east-2',
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: fileKey,
    };

    await s3.deleteObject(params).promise();

    return NextResponse.json(
      { message: 'Chat deleted successfully' },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error },
      { status: 500 },
    );
  }
};

export const DELETE = withAuthGuard(handler);
