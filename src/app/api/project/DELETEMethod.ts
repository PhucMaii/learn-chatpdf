import { db } from '@/lib/db';
import { project } from '@/lib/db/schema';
import { getQueryParams } from '@/utils/query';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export default async function DELETEMethod(req: Request) {
  try {
    const projectId = getQueryParams(req, 'id');

    if (!projectId) {
      return NextResponse.json(
        {
          error: 'Project ID is required',
        },
        { status: 400 },
      );
    }

    await db.delete(project).where(eq(project.id, Number(projectId)));

    return NextResponse.json(
      {
        message: 'Project deleted successfully',
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error in DELETEMethod:', error);
    return NextResponse.json(
      {
        error: 'Fail to delete project: ' + error,
      },
      { status: 500 },
    );
  }
}
