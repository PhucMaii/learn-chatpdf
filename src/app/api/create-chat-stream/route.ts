// pages/api/create-chat-stream.ts

import { db } from '@/lib/db';
import { chats, guests, users } from '@/lib/db/schema';
import { loadS3IntoPinecone } from '@/lib/pinecone';
import { getS3Url } from '@/lib/s3';
import { NextRequest, NextResponse } from 'next/server';
import { createFlashCards } from '../create-chat/route';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const fileKey = searchParams.get('fileKey');
  const fileName = searchParams.get('fileName');
  const url = searchParams.get('url');
  const { userId } = await auth();

  const guestSessionId = searchParams.get('guestSessionId');
  const guestSessionSignature = searchParams.get('guestSessionSignature');

  let toUseId: any = {
    id: userId,
    table: users,
    isGuest: false,
  };

  if (!userId) {
    if (!guestSessionId || !guestSessionSignature) {
      return new NextResponse(
        JSON.stringify({
          error: 'Missing guestSessionId or guestSessionSignature',
        }),
        { status: 400 },
      );
    }

    console.log('guestSessionId', guestSessionId);

    // Find guest with session id
    const existingGuest = await db
      .select()
      .from(guests)
      .where(eq(guests.guestSessionId, guestSessionId))
      .limit(1);

    if (existingGuest && existingGuest.length > 0) {
      toUseId = {
        id: existingGuest[0]?.id,
        table: guests,
        isGuest: true,
      };
    } else {
      // Create new guest
      const newGuest = await db
        .insert(guests)
        .values({
          id: guestSessionId,
          guestSessionId,
          guestSessionSignature,
        } as any)
        .returning();

      toUseId = {
        id: newGuest[0].id,
        table: guests,
        isGuest: true,
      };
    }
  }

  console.log(userId, 'user id');
  //   const userId = 'mock-user'; // Replace with real auth if needed

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      };

      try {
        send({
          stage: 'AI is absorbing...',
        });
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
          userId: !toUseId?.isGuest ? toUseId.id : null,
          guestId: toUseId.isGuest ? toUseId.id : null,
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

        const res = await createFlashCards(
          fileKey!,
          chatId,
          toUseId.id,
          vectors,
          toUseId.isGuest,
        );

        if (res.error) {
          send({
            stage: 'Error creating flashcards',
            error: res.error,
            chatId,
          });
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
