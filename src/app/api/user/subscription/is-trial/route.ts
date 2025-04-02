import { MAX_FILE_UPLOAD_IN_TRIAL } from '@/lib/constant';
import { db } from '@/lib/db';
import { chats, users } from '@/lib/db/schema';
import { handleAuthGuard } from '@/utils/auth';
import { getQueryParams } from '@/utils/query';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  try {
    const { userId }: any = await auth();

    const guestSessionId: any = getQueryParams(req, 'guestSessionId');

    const authStatus = await handleAuthGuard(userId, guestSessionId);

    if (!authStatus.ok) {
      return NextResponse.json({ error: authStatus.error }, { status: 401 });
    }

    if (authStatus.type === 'guest') {
      return NextResponse.json(
        { isTrial: true, isAbleToAddMoreChats: false },
        { status: 200 },
      );
    }

    const dbUser = await db.select().from(users).where(eq(users.id, userId));
    const isTrialEnd = dbUser[0]?.trialEnd?.getTime() || 0 < Date.now();
    const userChats = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId));

    const isAbleToAddMoreChats = userChats.length < MAX_FILE_UPLOAD_IN_TRIAL;

    return NextResponse.json(
      { isTrial: !isTrialEnd, isAbleToAddMoreChats },
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
