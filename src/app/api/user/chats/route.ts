import { db } from '@/lib/db';
import { chats, flashCard, flashCardSet } from '@/lib/db/schema';
import { withAuthGuard } from '@/utils/guard';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const handler = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userChats = await db
      .select({
        chats,
        // flashCardSet,
        flashCard
      })
      .from(chats)
      .leftJoin(flashCardSet, eq(chats.id, flashCardSet?.chatId))
      .leftJoin(flashCard, eq(flashCardSet.id, flashCard.flashCardSetId))
      .where(eq(chats.userId, userId));

    
    const groupedResult = userChats.reduce((acc: any, chat) => {
      const {chats, flashCard} = chat;

      if (!acc[chats.id]) {
        acc[chats.id] = { ...chats, flashCards: [] };
      }

      if (flashCard) {
        acc[chats.id].flashCards.push(flashCard);
      }

      // if (!acc['chats']) {
      //   acc['chats'] = [];
      // }

      // if (!acc['flashCardSets']) {
      //   acc['flashCardSets'] = [];
      // }

      // if (flashCardSet) {
      //   acc['flashCardSets'].push(flashCardSet);
      // }

      // acc['chats'].push(chats);
      return acc;
    }, {});

    return NextResponse.json({ data: groupedResult }, { status: 200 });
  } catch (error: any) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error },
      { status: 500 },
    );
  }
};

export const GET = withAuthGuard(handler);
