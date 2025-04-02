import { db } from '@/lib/db';
import { guests, messages } from '@/lib/db/schema';
import { getQueryParams } from '@/utils/query';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const handler = async (req: Request) => {
  try {
    const { userId } = await auth();
    const guestSessionId = getQueryParams(req, 'guestSessionId');

    if (!userId) {
      if (!guestSessionId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const guest = await db
        .select()
        .from(guests)
        .where(eq(guests.id, guestSessionId));

      if (guest.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }

    const body = await req.json();
    const { chatId } = body;

    const _messages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId));
    return NextResponse.json(_messages);
  } catch (error: any) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json({ error: error.message });
  }
};

export const POST = handler;
