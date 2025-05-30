import { db } from '@/lib/db';
import {
  guests,
  medias,
  project,
  users,
} from '@/lib/db/schema';
import { loadS3IntoPinecone } from '@/lib/pinecone';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { createFlashCards } from '../../utils/flashcards';
import { createStudyGuide } from '../../utils/studyGuide';

// interface IBody {
//   projectId: number;
//   fileList?: string[];
//   url?: string;
//   guestSessionId?: string;
//   guestSessionSignature?: string;
// }

export async function GET(req: NextRequest) {
  // try {
  const { searchParams } = req.nextUrl;
  const projectId = searchParams.get('projectId');
  const url = searchParams.get('url');
  const fileList = searchParams.get('fileList');
  const parsedFileList = fileList ? JSON.parse(fileList) : [];
  const guestSessionId = searchParams.get('guestSessionId');
  const guestSessionSignature = searchParams.get('guestSessionSignature');
  // const { projectId, fileList, url, guestSessionId, guestSessionSignature } =
  //   await req.json();

  console.log({
    projectId,
    parsedFileList,
    url,
    guestSessionId,
    guestSessionSignature,
  });

  if (!projectId) {
    return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
  }

  console.log({
    projectId,
    fileList,
    url,
    guestSessionId,
    guestSessionSignature,
  });

  if (!fileList && !url) {
    return NextResponse.json(
      { error: 'Missing fileName, fileKey or url' },
      { status: 400 },
    );
  }

  const existingProject = await db
    .select()
    .from(project)
    .where(eq(project.id, Number(projectId)));

  if (!existingProject || existingProject.length === 0) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  const { userId } = await auth();

  console.log(userId, 'userId');
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

    // HANDLE GUESTS -> Find guest with session id
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

      console.log('newGuest', newGuest);
      toUseId = {
        id: guestSessionId,
        table: guests,
        isGuest: true,
      };
    }
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      };

      try {
        send({
          stage: 'AI is learning',
        });

        // Convert the object to a JSON string and enqueue it as a data event
        let vectors = [];
        // const vectors = await loadS3IntoPinecone(fileKey);
        if (parsedFileList) {
          // vectors = await loadS3IntoPinecone(
          //   existingProject[0]?.id.toString(),
          //   'fileKey',
          // );
          const promiseVectors = parsedFileList.map((file: any) => {
            return loadS3IntoPinecone(file.fileKey, file.fileKey, 'fileKey');
          });

          vectors = await Promise.all(promiseVectors);
          console.log('vectors', vectors);
        } else if (url) {
          vectors = await loadS3IntoPinecone(url, url, 'url');
        }

        send({ stage: 'Saving medias...' });

        let mediaData: any = null;
        if (parsedFileList) {
          mediaData = parsedFileList.map((file: any) => {
            return {
              projectId: projectId,
              type: file.fileName.split('.')[1].toLowerCase(),
              userId: !toUseId.isGuest ? toUseId.id : null,
              guestId: toUseId.isGuest ? toUseId.id : null,
              fileName: file.fileName,
              fileKey: file.fileKey,
            };
          });
        } else {
          mediaData = {
            projectId: projectId,
            type: 'url',
            userId: !toUseId.isGuest ? toUseId.id : null,
            guestId: toUseId.isGuest ? toUseId.id : null,
            url: url,
          };
        }

        await db
          .insert(medias)
          .values(mediaData as any)

        const projectMedias = await db
          .select()
          .from(medias)
          .where(eq(medias.projectId, Number(projectId)));

          send({ stage: 'Generating flashcards...' });
          // create flashcard
          await createFlashCards(
            projectMedias,
            Number(projectId),
            toUseId.id,
            vectors,
            toUseId.isGuest,
          );

          send({ stage: 'Generating study guide...' });
          await createStudyGuide(
            projectMedias,
            Number(projectId),
            toUseId.id,
            toUseId.isGuest,
            vectors,
          );

        send({
          stage: 'done',
          // mediaId: mediaInsert[0]?.id,
          projectMedias: projectMedias,
        });



        // Create Study Guide
        // await createStudyGuide(
        //   mediasToFlashcards,
        //   Number(projectId),
        //   toUseId.id,
        //   toUseId.isGuest,
        // );

        // send({
        //   stage: 'done',
        // });
        controller.close();

        // return new StreamingTextResponse(stream);
      } catch (error: any) {
        console.error('Internal Server Error: ', error);
        send({ stage: 'error', error: error.message || 'Unknown error' });
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
  // } catch (error: any) {
  //   console.log('Internal Server Error: ', error);
  //   return NextResponse.json(
  //     { error: 'Internal Server Error: ' + error },
  //     { status: 500 },
  //   );
  // }
}
