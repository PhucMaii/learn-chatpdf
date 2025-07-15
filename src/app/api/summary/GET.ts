import { db } from '@/lib/db';
import { summary } from '@/lib/db/schema';
import { getQueryParams } from '@/utils/query';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  try {
    const projectId = getQueryParams(req, 'projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 404 },
      );
    }

    const targetSummary = await db
      .select()
      .from(summary)
      .where(eq(summary.projectId, Number(projectId)));

    if (targetSummary.length === 0) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json({ data: targetSummary[0] }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

export default handler;
