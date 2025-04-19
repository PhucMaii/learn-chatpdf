import { db } from '@/lib/db';
import { studyGuide } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export default async function PUTMethod(req: Request) {
  if (req.method !== 'PUT') {
    return NextResponse.json(
      { error: `Method ${req.method} Not Allowed` },
      { status: 405 },
    );
  }

  const { projectId, updatedContent } = await req.json();

  if (!projectId || !updatedContent) {
    return NextResponse.json(
      { error: 'Missing projectId or updatedContent' },
      { status: 400 },
    );
  }

  try {
    const targetStudyGuide = await db
      .select()
      .from(studyGuide)
      .where(eq(studyGuide.projectId, projectId));

    if (targetStudyGuide.length !== 1) {
      return NextResponse.json(
        { error: 'Study guide not found' },
        { status: 404 },
      );
    }

    const updatedStudyGuide = await db
      .update(studyGuide)
      .set({ content: updatedContent })
      .where(eq(studyGuide.projectId, projectId));

    return NextResponse.json({
      data: updatedContent,
      message: 'Study guide updated successfully',
    });
  } catch (error) {
    console.error('Error updating study guide:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
