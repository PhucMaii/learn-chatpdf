// pages/api/create-chat-stream.ts

import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { loadS3IntoPinecone } from '@/lib/pinecone';
import { getS3Url } from '@/lib/s3';
import { NextRequest, NextResponse } from 'next/server';
import { createFlashCards } from '../create-chat/route';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const fileKey = searchParams.get('fileKey');
  const fileName = searchParams.get('fileName');
  const url = searchParams.get('url');
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  //   const userId = 'mock-user'; // Replace with real auth if needed

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      };

      try {
        send({ stage: 'AI is absorbing...' });
        // Convert the object to a JSON string and enqueue it as a data event
        let vectors = [];
        // const vectors = await loadS3IntoPinecone(fileKey);
        if (fileKey) {
          vectors = await loadS3IntoPinecone(fileKey, 'fileKey');
        } else if (url) {
          vectors = await loadS3IntoPinecone(url, 'url');
        }

        send({ stage: 'Creating chat record...' });

        const newChat: any = {
          userId: userId,
        };

        if (fileKey) {
          newChat.fileKey = fileKey;
          newChat.pdfName = fileName;
          newChat.pdUrl = getS3Url(fileKey);
          newChat.fileType = fileName?.split('.')?.pop() || 'pdf';
        } else if (url) {
          newChat.webUrl = url;
          newChat.fileKey = url;
          newChat.fileType = 'url';
        }

        const chatInsert = await db
          .insert(chats)
          .values(newChat)
          .returning({ insertedId: chats.id });
        const chatId = chatInsert[0].insertedId;

        send({ stage: 'Generating flashcards...' });

        const res = await createFlashCards(fileKey!, chatId, userId, vectors);

        if (res.error) {
          send({ stage: 'Error creating flashcards', error: res.error, chatId });
        }

        send({ stage: 'done', chatId });
        controller.close();
      } catch (err) {
        console.error(err);
        send({ stage: 'error', error: 'Something went wrong.' });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
