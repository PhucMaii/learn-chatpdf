import { db } from '@/lib/db';
import { project } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export default async function PUTMethod(req: Request) {
  try {
    const { projectId, name } = await req.json();

    if (!projectId || !name) {
      return NextResponse.json(
        {
          error: 'Project ID and name are required',
        },
        { status: 400 },
      );
    }

    const updatedProject = await db
      .update(project)
      .set({ name })
      .where(eq(projectId, project.id))
      .returning();

    if (!updatedProject) {
      return NextResponse.json(
        {
          error: 'Project not found',
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        message: 'Project updated successfully',
        project: updatedProject[0],
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error in PUTMethod:', error);
    return NextResponse.json(
      {
        error: 'Fail to update project: ' + error,
      },
      { status: 500 },
    );
  }
}
