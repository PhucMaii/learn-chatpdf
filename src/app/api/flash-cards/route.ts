import { Configuration, OpenAIApi } from 'openai-edge';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { flashCard, medias, project } from '@/lib/db/schema';
import { withAuthGuard } from '@/utils/guard';
import { auth } from '@clerk/nextjs/server';
import { createFlashCards } from '../utils/flashcards';
import { getQueryParams } from '@/utils/query';

export const runtime = 'nodejs';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(config);

const handler = async (req: Request) => {
  try {
    const { userId } = await auth();

    const guestSessionId = getQueryParams(req, 'guestSessionId');
    const isGuest = guestSessionId ? true : false;

    const userData: any = {
      id: userId ? userId : guestSessionId,
      isGuest,
      guestSessionId,
    }

    const { projectId } = await req.json();
    const targetProject = await db
      .select()
      .from(project)
      .where(eq(project.id, Number(projectId)));

    if (targetProject.length !== 1) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // const fileKey = _chats[0].fileKey;
    const projectMedias = await db.select().from(medias).where(eq(medias.projectId, projectId));

    const formattedMessages = await createFlashCards(projectMedias, projectId, userData.id, null, userData.isGuest);
    return NextResponse.json({ data: formattedMessages.flashcards });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
    });
  }
};

export const POST = withAuthGuard(handler);

// PUT
const putHandler = async (req: Request) => {
  try {
    const { id, newFlashCard } = await req.json();

    const existingFlashCard = await db
      .select()
      .from(flashCard)
      .where(eq(flashCard.id, id));

    if (existingFlashCard.length === 0) {
      return NextResponse.json(
        { error: 'Flash card not found' },
        { status: 404 },
      );
    }

    const updatedFlashCard = await db
      .update(flashCard)
      .set(newFlashCard)
      .where(eq(flashCard.id, id))
      .returning();

    return NextResponse.json({
      data: updatedFlashCard[0],
      message: 'Flash card updated successfully',
    });
  } catch (error: any) {
    console.log('Internal Server Error: ', error);

    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
};

export const PUT = withAuthGuard(putHandler);

const deleteHandler = async (req: Request) => {
  try {
    const { id } = await req.json();

    const existingFlashCard = await db
      .select()
      .from(flashCard)
      .where(eq(flashCard.id, id));

    if (existingFlashCard.length === 0) {
      return NextResponse.json(
        { error: 'Flash card not found' },
        { status: 404 },
      );
    }

    await db.delete(flashCard).where(eq(flashCard.id, id));
    return NextResponse.json({ message: 'Flash card deleted successfully' });
  } catch (error: any) {
    console.log('Internal Server Error: ', error);

    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
};

export const DELETE = withAuthGuard(deleteHandler);
