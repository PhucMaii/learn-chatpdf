// /api/public-projects/route.ts
import { db } from '@/lib/db';
import { project } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getQueryParams } from '@/utils/query';

export async function GET(req: Request) {
  try {
    const id = getQueryParams(req, 'id');

    if (id) {
      const targetProject = await db
        .select()
        .from(project)
        .where(eq(project.id, Number(id)));
      return NextResponse.json(
        { message: 'Project fetched successfully', project: targetProject },
        { status: 200 },
      );
    }

    const limit = getQueryParams(req, 'limit');
    const offset = getQueryParams(req, 'offset');

    const projects = await db
      .select()
      .from(project)
      .limit(Number(limit))
      .offset(Number(offset));

    // const projectMedias = await db
    //   .select()
    //   .from(medias)
    //   .where(
    //     inArray(
    //       medias.projectId,
    //       projects.map((p) => p.id),
    //     ),
    //   );
    // const projectsWithMedias = projects.map((project) => {
    //   const projectMedia = projectMedias.filter(
    //     (media) => media.projectId === project.id,
    //   );
    //   return { ...project, medias: projectMedia };
    // });

    return NextResponse.json(
      {
        message: 'Projects fetched successfully',
        projects,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
