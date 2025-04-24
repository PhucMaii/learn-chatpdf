import { db } from '@/lib/db';
import { medias, project } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { createStudyGuide } from '../utils/studyGuide';
import { handleAuthGuard } from '@/utils/auth';
import { getQueryParams } from '@/utils/query';

export default async function POSTMethod(req: Request) {
  try {
    const guestSessionId = getQueryParams(req, 'guestSessionId');
    const authRes: any = await handleAuthGuard(guestSessionId || undefined);

    if (!authRes.ok) {
      return NextResponse.json({ error: authRes.error }, { status: 401 });
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
      authRes.id,
      authRes.type === 'guest',
    );

    return NextResponse.json({
      data: newStudyGuide,
      message: 'Generate Cheat Sheet Successfully',
    });
  } catch (error: any) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error },
      { status: 500 },
    );
  }
}
