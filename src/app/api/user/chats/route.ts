import { db } from '@/lib/db';
import { chats, flashCard, flashCardSet } from '@/lib/db/schema';
import { withAuthGuard } from '@/utils/guard';
import { auth } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';
import moment from 'moment';
import { NextResponse } from 'next/server';

const handler = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userChats: any = await db
      .select({
        chats,
        // flashCardSet,
        // flashCard,
      })
      .from(chats)
      .leftJoin(flashCardSet, eq(chats.id, flashCardSet?.chatId))
      .leftJoin(flashCard, eq(flashCardSet.id, flashCard.flashCardSetId))
      .where(eq(chats.userId, userId))
      .groupBy(chats.id)
      .orderBy(desc(chats.lastOpenedAt));

    const groupedChatByDate: any = userChats.reduce((acc: any, chat: any) => {
      const { chats, flashCard } = chat;
        const dateKey = moment(chat.chats?.lastOpenedAt).format('ll') || moment(chat.chats.createdAt).format('ll');
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push({...chats, flashCards: flashCard || []});
        return acc;
    }, {});


    const groupedResult = userChats.reduce((acc: any, chat: any) => {
      const { chats, flashCard } = chat;

      if (!acc[chats.id]) {
        acc[chats.id] = { ...chats, flashCards: [] };
      }

      if (flashCard) {
        acc[chats.id].flashCards.push(flashCard);
      }

      // console.log(chat, 'chat')
      // // Push to groupedChatByDate
      // const dateKey: any = chats?.lastOpenedAt?.toISOString().split('T')[0] || chats.createdAt.toISOString().split('T')[0];
      // if (!groupedChatByDate[dateKey]) {
      //   groupedChatByDate[dateKey] = [];
      // }

      // groupedChatByDate[dateKey].push({...chats, flashCards: flashCard || []});

      return acc;
    }, {});

    // console.log(groupedChatByDate, 'groupedChatByDate');
    

    return NextResponse.json({ data: groupedResult, groupedChatByDate }, { status: 200 });
  } catch (error: any) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error },
      { status: 500 },
    );
  }
};

export const GET = withAuthGuard(handler);
