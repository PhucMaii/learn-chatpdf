import { db } from '@/lib/db';
import { flashCard, flashCardSet } from '@/lib/db/schema';
import { withAuthGuard } from '@/utils/guard';
import { getQueryParams } from '@/utils/query';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  try {
    const chatId = getQueryParams(req, 'chatId');
    const projectId = getQueryParams(req, 'projectId');

    // if (!chatId || !projectId) {
    //   return NextResponse.json({ error: 'Missing chatId' }, { status: 400 });
    // }

    if (chatId) {
      const flashCards = await db
        .select()
        .from(flashCard)
        .where(eq(flashCard.chatId, Number(chatId)));
  
      if (flashCards.length === 0 || !flashCards) {
        return NextResponse.json(
          { error: 'No flash cards found' },
          { status: 404 },
        );
      }
  
      return NextResponse.json({ flashCards });
    }

    if (projectId) {
      const flashcardSet = await db.select().from(flashCardSet).where(eq(flashCardSet.projectId, Number(projectId)));

      if (flashcardSet.length === 0 || !flashcardSet) {
        return NextResponse.json( 
          { error: 'No flash card set found', flashcards: [] }
        );
      }

      const flashcards = await db.select().from(flashCard).where(eq(flashCard.flashCardSetId, flashcardSet[0].id));

      return NextResponse.json({ flashcards });
    }

    return NextResponse.json({ error: 'Missing chatId' }, { status: 400 });

  } catch (error: any) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error },
      { status: 500 },
    );
  }
};

export const GET = withAuthGuard(handler);
