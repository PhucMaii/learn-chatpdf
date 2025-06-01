import { db } from '@/lib/db';
import { project } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

const handler = async (req: Request) => {
  try {
    const { userId: authId } = await auth();
    // Fetch project based on id from params, check if project has userid or guestSessionId -> then compare with userid or guestSessionId from params
    const { projectId, guestSessionId } = await req.json();


    const targetProject = await db
      .select()
      .from(project)
      .where(eq(project.id, Number(projectId)));
    if (!targetProject || targetProject.length === 0) {
      return new Response('Project not found', { status: 404 });
    }

    const { userId, guestId } = targetProject[0];

    if (userId && authId === userId) {
      return new Response('Project found', { status: 200 });
    }

    if (guestId && guestSessionId === guestId) {
      return new Response('Project found', { status: 200 });
    }

    return new Response('Project not found', { status: 404 });
  } catch (error: any) {
    console.log(error);
  }
};

export const POST = handler;
