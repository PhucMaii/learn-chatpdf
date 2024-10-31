import { db } from '@/lib/db';
import { chats, flashCard, flashCardSet } from '@/lib/db/schema';
import { withAuthGuard } from '@/utils/guard';
import { getQueryParams } from '@/utils/query';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const flashCardSetId = getQueryParams(req, 'id');

    if (flashCardSetId) {
      const flashCardSetsWithChatsAndFlashCards = await db
        .select({
          flashCardSet,
          chat: chats,
          flashCard,
        })
        .from(flashCardSet)
        .innerJoin(chats, eq(flashCardSet.chatId, chats.id))
        .leftJoin(flashCard, eq(flashCard.flashCardSetId, flashCardSet.id))
        .where(eq(flashCardSet.id, Number(flashCardSetId)));

      if (flashCardSetsWithChatsAndFlashCards.length === 0) {
        return NextResponse.json(
          { error: 'No flash card set found' },
          { status: 404 },
        );
      }
      const groupedResult = groupChatToFlashCards(
        flashCardSetsWithChatsAndFlashCards,
      );
      console.log(groupedResult, 'flashCardSetsWithChatsAndFlashCards');
      return NextResponse.json({
        flashCardSetsWithChatsAndFlashCards: Object.values(groupedResult),
      });
    }

    const flashCardSetsWithChatsAndFlashCards = await db
      .select({
        flashCardSet,
        chat: chats,
        flashCard,
      })
      .from(flashCardSet)
      .innerJoin(chats, eq(flashCardSet.chatId, chats.id))
      .leftJoin(flashCard, eq(flashCard.flashCardSetId, flashCardSet.id))
      .where(eq(flashCardSet.userId, userId));

    // Grouping the flashCards by flashCardSet
    const groupedResult = groupChatToFlashCards(
      flashCardSetsWithChatsAndFlashCards,
    );

    // const knownCards = flashCardSetsWithChatsAndFlashCards.flashCardSet.flashCard.filter((card: any) => card.isKnown === 1);
    return NextResponse.json({
      flashCardSetsWithChatsAndFlashCards: Object.values(groupedResult),
    });
  } catch (error: any) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error },
      { status: 500 },
    );
  }
};

export const GET = withAuthGuard(handler);

const groupChatToFlashCards = (flashCardSetsWithChatsAndFlashCards: any) => {
  return flashCardSetsWithChatsAndFlashCards.reduce((acc: any, row: any) => {
    const { flashCardSet, chat, flashCard } = row;
    const setId = flashCardSet.id;

    // Initialize the flashCardSet if not already added
    if (!acc[setId]) {
      acc[setId] = { ...flashCardSet, chat, flashCards: [] };
    }

    // Add each flashCard to the flashCards array for the flashCardSet
    if (flashCard) {
      acc[setId].flashCards.push(flashCard);
    }

    return acc;
  }, {});
};
