import { db } from '@/lib/db';
import { studyGuide } from '@/lib/db/schema';
import { getQueryParams } from '@/utils/query';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export default async function GETMethod(req: Request) {
  try {
    const projectId = getQueryParams(req, 'projectId');

    if (!projectId) {
      return NextResponse.json(
        {
          error: 'Project ID is required',
        },
        { status: 400 },
      );
    }

    const studyGuideList = await db
      .select()
      .from(studyGuide)
      .where(eq(studyGuide.projectId, Number(projectId)));

    if (studyGuideList.length === 0) {
      return NextResponse.json(
        { error: 'No cheat sheet found' },
        { status: 200 },
      );
    }

    return NextResponse.json({ data: studyGuideList[0] || null });
  } catch (error: any) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error },
      { status: 500 },
    );
  }
}
