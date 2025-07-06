import { handleAuthGuard } from '@/utils/auth';
import { getQueryParams } from '@/utils/query';
import { NextResponse } from 'next/server';
import { getMedias } from '../utils/medias';
import { createQuiz } from '../utils/quiz';

const handler = async (req: Request) => {
  try {
    const guestSessionId = getQueryParams(req, 'guestSessionId');
    const authRes: any = await handleAuthGuard(guestSessionId || undefined);

    if (!authRes.ok) {
      return NextResponse.json({ error: authRes.error }, { status: 401 });
    }

    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        {
          error: 'Project ID is required',
        },
        { status: 404 },
      );
    }

    // Check project exist
    const { medias: projectMedias } = await getMedias(Number(projectId));

    await createQuiz(
      projectMedias,
      Number(projectId),
      authRes.id,
      authRes.type === 'guest',
    );

    return NextResponse.json(
      { message: 'Quiz created successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
};

export default handler;
