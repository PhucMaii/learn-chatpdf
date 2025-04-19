import { db } from '@/lib/db';
import { guests, medias, project } from '@/lib/db/schema';
import { loadS3IntoPinecone } from '@/lib/pinecone';
import { getQueryParams } from '@/utils/query';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  try {
    const fileList = getQueryParams(req, 'fileList');
    const guestSessionId = getQueryParams(req, 'guestSessionId');
    const guestSessionSignature = getQueryParams(req, 'guestSessionSignature');

    const { user }: any = await auth();

    if (user) {
      return NextResponse.json(
        {
          error: 'User already logged in',
          data: null,
        },
        { status: 404 },
      );
    }

    if (!fileList || !guestSessionId || !guestSessionSignature) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required parameters',
        },
        { status: 400 },
      );
    }

    // Check if guest is already in the database
    let existingGuest = await db
      .select()
      .from(guests)
      .where(eq(guests.guestSessionId, guestSessionId));

    // If guest is already exists, check if they have any project yet
    if (existingGuest.length > 0) {
      // Check if the guest has any project
      const existingProject = await db
        .select()
        .from(project)
        .where(eq(project.guestId, existingGuest[0].id));

      if (existingProject.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: 'Guest already has a project',
          },
          { status: 400 },
        );
      }
    }

    if (existingGuest.length === 0) {
      // Create a new guest
      existingGuest = await db
        .insert(guests)
        .values({
          id: guestSessionId,
          guestSessionId,
          guestSessionSignature,
        })
        .returning();
    }

    // Create a new project
    const newProject = await db
      .insert(project)
      .values({
        name: 'First Project',
        guestId: existingGuest[0].id,
      })
      .returning();

    // Create a new project media
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (obj: any) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(obj)}\n\n`),
          );
        };

        try {
          send({
            stage: 'AI is learning',
          });

          let vectors = [];

          const parsedFileList = JSON.parse(fileList);

          if (parsedFileList) {
            const promiseVectors = parsedFileList.map((file: any) => {
              return loadS3IntoPinecone(file.fileKey, file.fileKey, 'fileKey');
            });

            vectors = await Promise.all(promiseVectors);
            console.log('vectors', vectors);
          }

          send({ stage: 'Saving medias...' });

          let mediaData: any = null;
          if (parsedFileList) {
            mediaData = parsedFileList.map((file: any) => {
              return {
                projectId: newProject[0].id,
                type: file.fileName.split('.')[1].toLowerCase(),
                userId: null,
                guestId: existingGuest[0].id,
                fileKey: file.fileKey,
                fileName: file.fileName,
              };
            });
          }

        await db.insert(medias).values(mediaData).returning();

          const projectMedias = await db.select().from(medias).where(eq(medias.projectId, Number(newProject[0].id)));

          send({
            stage: 'done',
            projectMedias: projectMedias,
            projectId: newProject[0].id,
          });
          controller.close();
        } catch (error: any) {
          console.error('SSE error:', error);
          controller.error(error);
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
  } catch (error: any) {
    console.log('Internal Server Error', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      },
      { status: 500 },
    );
  }
};

export const GET = handler;