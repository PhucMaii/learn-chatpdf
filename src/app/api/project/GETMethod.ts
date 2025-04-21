import { db } from '@/lib/db';
import { medias, project } from '@/lib/db/schema';
import { handleAuthGuard } from '@/utils/auth';
import { getQueryParams } from '@/utils/query';
import { auth } from '@clerk/nextjs/server';
import { eq, inArray } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export default async function GETMethod(req: Request) {
  try {
    const { userId }: any = await auth();

    const guestSessionId: any = getQueryParams(req, 'guestSessionId');
    const authRes: any = await handleAuthGuard(userId, guestSessionId);

    if (!authRes.ok) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        },
      );
    }

    // Merge project medias using join
    const projects = await db
      .select()
      .from(project)
      .where(
        eq(
          authRes.type === 'guest' ? project.guestId : project.userId,
          authRes.id,
        ),
      );

    // Merge project medias

    const projectMedias = await db.select().from(medias).where(inArray(medias.projectId, projects.map((project) => project.id)));
    const projectsWithMedias = projects.map((project) => {
      const projectMedia = projectMedias.filter((media) => media.projectId === project.id);
      return { ...project, medias: projectMedia };
    });

    return NextResponse.json(
      {
        message: 'Projects fetched successfully',
        projects: projectsWithMedias,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        error: 'Something went wrong',
      },
      {
        status: 500,
      },
    );
  }
}
