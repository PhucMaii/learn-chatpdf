import { db } from '@/lib/db';
import { chats, guests } from '@/lib/db/schema';
import { getQueryParams } from '@/utils/query';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
  try {
    const guestSessionId = getQueryParams(req, 'guestSessionId');
    const guestSessionSignature = getQueryParams(req, 'guestSessionSignature');

    if (!guestSessionId) {
      return NextResponse.json(
        { error: 'Missing guestSessionId' },
        { status: 400 },
      );
    }

    let guest = await db
      .select()
      .from(guests)
      .where(eq(guests.guestSessionId, guestSessionId));

    console.log('guest: ', guest);
    if (guest.length === 0) {
      // Create guest
      guest = await db
        .insert(guests)
        .values({id: guestSessionId, guestSessionId, guestSessionSignature})
        .returning();

      // return NextResponse.json({ data: newGuest[0] }, { status: 200 });
    }

    const guestChats = await db
      .select()
      .from(chats)
      .where(eq(chats.guestId, guestSessionId));

    return NextResponse.json({ data: guest[0], guestChats }, { status: 200 });
  } catch (error: any) {
    console.log('Fail to get guest: ', error);
    return NextResponse.json(
      { error: 'Fail to get guest: ' + error },
      { status: 500 },
    );
  }
};
