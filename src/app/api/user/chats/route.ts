import { db } from '@/lib/db';
import { chats, flashCard, flashCardSet } from '@/lib/db/schema';
import { getQueryParams } from '@/utils/query';
import { auth } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';
import moment from 'moment';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  try {
    const { userId } = await auth();

    const guestSessionId = getQueryParams(req, 'guestSessionId');

    if (!userId && !guestSessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userChats: any = [];

    if (userId) {
      userChats = await db
        .select({
          chats,
          flashCard,
        })
        .from(chats)
        .where(eq(chats.userId, userId))
        .leftJoin(flashCardSet, eq(chats.id, flashCardSet.chatId))
        .leftJoin(flashCard, eq(flashCardSet.id, flashCard.flashCardSetId))
        .groupBy(chats.id, flashCard.id)
        .orderBy(desc(chats.lastOpenedAt));
    } else if (guestSessionId) {
      userChats = await db
        .select({
          chats,
          flashCard,
        })
        .from(chats)
        .where(eq(chats.guestId, guestSessionId))
        .leftJoin(flashCardSet, eq(chats.id, flashCardSet.chatId))
        .leftJoin(flashCard, eq(flashCardSet.id, flashCard.flashCardSetId))
        .groupBy(chats.id, flashCard.id)
        .orderBy(desc(chats.lastOpenedAt));
    }

    // For displaying in /chat/[chatId] and group by date
    const groupedChatByDate: any = userChats.reduce((acc: any, chat: any) => {
      const { chats, flashCard } = chat;
      const dateKey =
        moment(chat.chats?.lastOpenedAt).format('ll') ||
        moment(chat.chats.createdAt).format('ll');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      const isChatExisted = acc[dateKey].find(
        (existedChat: any) => existedChat.id === chats.id,
      );
      if (isChatExisted) return acc;
      acc[dateKey].push({ ...chats, flashCards: flashCard || [] });
      return acc;
    }, {});

    // For displaying in /chats and also get the flashcard of each chat
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

    const chatList = Object.values(groupedResult).sort((a: any, b: any) => {
      return (
        new Date(b.lastOpenedAt).getTime() - new Date(a.lastOpenedAt).getTime()
      );
    });

    return NextResponse.json(
      { data: groupedResult, chatList, groupedChatByDate },
      { status: 200 },
    );
  } catch (error: any) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error },
      { status: 500 },
    );
  }
};

export const GET = handler;
