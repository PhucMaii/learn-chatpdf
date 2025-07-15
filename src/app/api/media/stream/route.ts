import { db } from '@/lib/db';
import { guests, medias, project, users } from '@/lib/db/schema';
import { loadS3IntoPinecone } from '@/lib/pinecone';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { createFlashCards } from '../../utils/flashcards';
// import { createStudyGuide } from '../../utils/studyGuide';
import { getVectorsFromMedias } from '@/lib/context';
import { createQuiz } from '../../utils/quiz';
import { createSummary } from '../../utils/summary';

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

  if (!projectId) {
    return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
  }

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
      await db
        .insert(guests)
        .values({
          id: guestSessionId,
          guestSessionId,
          guestSessionSignature,
        } as any)
        .returning();

      toUseId = {
        id: guestSessionId,
        table: guests,
        isGuest: true,
      };
    }
  }

  const encoder = new TextEncoder();
  let isClosed = false; // Track controller state
  let hasError = false; // Track if any errors occurred

  const stream = new ReadableStream({
    async start(controller) {
      // Controller health check function
      const isControllerHealthy = () => {
        try {
          // Check our state tracking
          if (isClosed || hasError) {
            console.log(
              '❌ Controller unhealthy: isClosed =',
              isClosed,
              'hasError =',
              hasError,
            );
            return false;
          }

          // Check controller's built-in state
          if (controller.desiredSize === null) {
            console.log(
              '❌ Controller unhealthy: desiredSize is null (controller closed)',
            );
            return false;
          }

          if (controller.desiredSize < 0) {
            console.log(
              '❌ Controller unhealthy: desiredSize is negative (backpressure issue)',
            );
            return false;
          }

          // All checks passed
          return true;
        } catch (error) {
          console.log('❌ Controller health check failed:', error);
          return false;
        }
      };

      const send = (obj: any) => {
        if (isControllerHealthy()) {
          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(obj)}\n\n`),
            );
            console.log(
              '📡 Sent successfully:',
              obj.stage || obj.type || 'unknown',
            );
            return true;
          } catch (error) {
            console.error('❌ Error sending data:', error);
            if (!isClosed) {
              isClosed = true;
              hasError = true;
            }
            return false;
          }
        } else {
          console.log(
            '⚠️ Controller unhealthy, skipping send:',
            obj.stage || obj.type || 'unknown',
          );
          return false;
        }
      };

      const safeClose = () => {
        if (isControllerHealthy() && !isClosed) {
          try {
            console.log('🔒 Closing controller safely');
            isClosed = true;
            controller.close();
            return true;
          } catch (error) {
            console.error('❌ Error closing controller:', error);
            hasError = true;
            return false;
          }
        } else {
          console.log(
            '⚠️ Controller already closed or unhealthy, skipping close',
          );
          return false;
        }
      };

      // Log initial controller state
      console.log('🚀 Controller initialized. Initial state:', {
        desiredSize: controller.desiredSize,
        isClosed,
        hasError,
      });

      try {
        if (!send({ stage: 'AI is learning' })) {
          throw new Error('Failed to send initial stage');
        }

        // Vector processing
        let vectors = [];
        if (parsedFileList && parsedFileList.length > 0) {
          const promiseVectors = parsedFileList.map((file: any) => {
            return loadS3IntoPinecone(file.fileKey, file.fileKey, 'fileKey');
          });
          vectors = await Promise.all(promiseVectors);
        } else if (url) {
          vectors = await loadS3IntoPinecone(url, url, 'url');
        }

        if (!send({ stage: 'Saving medias...' })) {
          throw new Error('Failed to send medias stage');
        }

        // Media data preparation
        let mediaData: any = null;
        if (parsedFileList && parsedFileList.length > 0) {
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

        const projectMediasWithoutNewFiles = await db
          .select()
          .from(medias)
          .where(eq(medias.projectId, Number(projectId)));

        const vectorsWithoutNewFiles = await getVectorsFromMedias(
          projectMediasWithoutNewFiles,
        );
        vectors = [...vectors, ...vectorsWithoutNewFiles];

        await db.insert(medias).values(mediaData as any);

        const projectMedias = await db
          .select()
          .from(medias)
          .where(eq(medias.projectId, Number(projectId)));

        if (!send({ stage: 'upload successfully' })) {
          throw new Error('Failed to send upload success stage');
        }

        // Generate content sequentially with individual error handling
        console.log('🎯 Pipeline: Starting content generation...');

        // Summary generation
        if (isControllerHealthy()) {
          try {
            if (!send({ stage: 'Generating summary...' })) {
              throw new Error('Failed to send summary stage');
            }
            console.log('🎯 Pipeline: Starting summary generation...');

            await createSummary(
              projectMedias,
              Number(projectId),
              toUseId.id,
              toUseId.isGuest,
              vectors,
            );

            if (isControllerHealthy()) {
              console.log('🎯 Pipeline: Summary generation completed');
              send({ stage: 'Summary completed' });
            }
          } catch (error) {
            console.error('❌ Summary generation failed:', error);
            if (isControllerHealthy()) {
              send({ stage: 'Summary failed, continuing...' });
            }
          }
        }

        // Flashcard generation
        if (isControllerHealthy()) {
          try {
            if (!send({ stage: 'Generating flashcards...' })) {
              throw new Error('Failed to send flashcards stage');
            }
            console.log('🎯 Pipeline: Starting flashcard generation...');

            await createFlashCards(
              projectMedias,
              Number(projectId),
              toUseId.id,
              vectors,
              toUseId.isGuest,
            );

            if (isControllerHealthy()) {
              console.log('🎯 Pipeline: Flashcard generation completed');
              send({ stage: 'Flashcards completed' });
            }
          } catch (error) {
            console.error('❌ Flashcard generation failed:', error);
            if (isControllerHealthy()) {
              send({ stage: 'Flashcards failed, continuing...' });
            }
          }
        }

        // Quiz generation
        if (isControllerHealthy()) {
          try {
            if (!send({ stage: 'Generating quiz...' })) {
              throw new Error('Failed to send quiz stage');
            }
            console.log('🎯 Pipeline: Starting quiz generation...');

            await createQuiz(
              projectMedias,
              Number(projectId),
              toUseId.id,
              toUseId.isGuest,
            );

            if (isControllerHealthy()) {
              console.log('🎯 Pipeline: Quiz generation completed');
              send({ stage: 'Quiz completed' });
            }
          } catch (error) {
            console.error('❌ Quiz generation failed:', error);
            if (isControllerHealthy()) {
              send({ stage: 'Quiz failed, continuing...' });
            }
          }
        }

        // Final completion
        if (isControllerHealthy()) {
          const finalSuccess = send({
            stage: 'done',
            projectMedias: projectMedias,
          });
          console.log(
            '🎯 Pipeline: All stages completed successfully. Final send:',
            finalSuccess,
          );
        }

        // Always try to close safely
        const closeSuccess = safeClose();
        console.log('🔒 Controller close result:', closeSuccess);
      } catch (error: any) {
        console.error('❌ Internal Server Error: ', error);
        hasError = true;

        if (!isClosed) {
          try {
            send({ stage: 'error', error: error.message || 'Unknown error' });
          } catch (sendError) {
            console.error('❌ Failed to send error message:', sendError);
          }
        }

        safeClose();
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
