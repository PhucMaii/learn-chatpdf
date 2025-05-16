import { db } from '@/lib/db';
import { medias, project } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { generateEssay } from '../utils/essay';
import { auth } from '@clerk/nextjs/server';

export default async function POSTMethod(req: NextRequest) {
  try {
    const { wordCount, language, projectId } = await req.json();

    const { userId }: any = await auth();

    const existingProject = await db.select().from(project).where(eq(project.id, projectId));

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const projectMedias = await db.select().from(medias).where(eq(medias.projectId, projectId));


    const newEssay = await generateEssay(projectMedias, Number(projectId), userId, Number(wordCount), language);

    console.log(newEssay);

    return NextResponse.json({ data: newEssay }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create essay' },
      { status: 500 },
    );
  }
}
