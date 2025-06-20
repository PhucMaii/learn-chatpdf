import { DrizzleMedia, DrizzleProject } from '@/lib/db/drizzleType';
import { db } from '@/lib/db';
import { medias, project } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export type MediasResult = {
  medias: DrizzleMedia[];
  project: DrizzleProject | null;
};

export const getMedias = async (
  projectId: number,
): Promise<MediasResult> => {
  try {
    const existingProject = await db
      .select()
      .from(project)
      .where(eq(project.id, projectId));
    if (existingProject.length !== 1) {
      throw new Error('Project not found');
    }

    const mediasData = await db
      .select()
      .from(medias)
      .where(eq(medias.projectId, projectId));
    return { medias: mediasData, project: existingProject[0] };
  } catch (error) {
    console.log('Error fetching medias: ', error);
    return { medias: [], project: null as any };
  }
};
