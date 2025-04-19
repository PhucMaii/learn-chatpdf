import { db } from '@/lib/db';
import { flashCard, flashCardSet } from '@/lib/db/schema';
import { withAuthGuard } from '@/utils/guard';
import { getQueryParams } from '@/utils/query';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  try {
    const projectId = getQueryParams(req, 'projectId');

    if (projectId) {
      const flashCardSetsWithChatsAndFlashCards = await db
        .select({
          flashCardSet,
          flashCard,
        })
        .from(flashCardSet)
        .leftJoin(flashCard, eq(flashCard.flashCardSetId, flashCardSet.id))
        .where(eq(flashCardSet.projectId, Number(projectId)))
        .orderBy(flashCard.id);

      if (flashCardSetsWithChatsAndFlashCards.length === 0) {
        return NextResponse.json(
          { flashCardSetsWithChatsAndFlashCards: [] },
          { status: 200 },
        );
      }
      const groupedResult = groupChatToFlashCards(
        flashCardSetsWithChatsAndFlashCards,
      );
      return NextResponse.json({
        flashCardSetsWithChatsAndFlashCards: Object.values(groupedResult),
      });
    }

    // const flashCardSetsWithChatsAndFlashCards = await db
    //   .select({
    //     flashCardSet,
    //     chat: chats,
    //     flashCard,
    //   })
    //   .from(flashCardSet)
    //   .innerJoin(chats, eq(flashCardSet.chatId, chats.id))
    //   .leftJoin(flashCard, eq(flashCard.flashCardSetId, flashCardSet.id))
    //   .where(eq(flashCardSet.projectId, Number(projectId)));

    // // Grouping the flashCards by flashCardSet
    // const groupedResult = groupChatToFlashCards(
    //   flashCardSetsWithChatsAndFlashCards,
    // );

    // return NextResponse.json({
    //   flashCardSetsWithChatsAndFlashCards: Object.values(groupedResult),
    // });
    return NextResponse.json({
      flashCardSetsWithChatsAndFlashCards: [],
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
