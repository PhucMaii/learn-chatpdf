import { db } from '@/lib/db';
import { medias, project } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createStudyGuide } from '../utils/studyGuide';

export default async function POSTMethod(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        {
          error: 'Project ID is required',
        },
        { status: 400 },
      );
    }

    // Check project exist
    const targetProject = await db
      .select()
      .from(project)
      .where(eq(project.id, Number(projectId)));

    if (targetProject.length !== 1) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Get all medias from the project
    const projectMedias = await db
      .select()
      .from(medias)
      .where(eq(medias.projectId, projectId));

    const newStudyGuide = await createStudyGuide(
      projectMedias,
      projectId,
      userId,
      false,
    );

    return NextResponse.json({ data: newStudyGuide, message: 'Generate Cheat Sheet Successfully' });
  } catch (error: any) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error },
      { status: 500 },
    );
  }
}
