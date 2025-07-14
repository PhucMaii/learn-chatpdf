import { handleAuthGuard } from '@/utils/auth';
import { getQueryParams } from '@/utils/query';
import { NextResponse } from 'next/server';
import { createSummary } from '../utils/summary';
import { getMedias } from '../utils/medias';

interface IBody {
  projectId: number;
}

const handler = async (req: Request) => {
  try {
    const guestSessionId = getQueryParams(req, 'guestSessionId');
    const authRes: any = await handleAuthGuard(guestSessionId || undefined);
    console.log(authRes, 'authRes');

    if (!authRes.ok) {
      return NextResponse.json({ error: authRes.error }, { status: 401 });
    }

    const { projectId } = (await req.json()) as IBody;
    console.log(projectId, 'projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 404 },
      );
    }

    const { medias: projectMedias } = await getMedias(projectId);

    const newSummary = await createSummary(
      projectMedias,
      projectId,
      authRes.id,
      authRes.type === 'guest',
      authRes.vectors,
    );
    
    return newSummary;

    // return NextResponse.json({
    //   data: newSummary,
    //   message: 'Generate Summary Successfully',
    // });
  } catch (error: any) {
    console.log(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

export default handler
