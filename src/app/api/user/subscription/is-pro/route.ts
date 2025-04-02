import { db } from '@/lib/db';
import { userSubscriptions } from '@/lib/db/schema';
import { DAY_IN_MS } from '@/lib/subscription';
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
      return NextResponse.json({ isPro: false }, { status: 200 });
    }

    const _userSubscriptions: any = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId));

    if (!_userSubscriptions[0]) {
      return NextResponse.json({ isPro: false }, { status: 200 });
    }

    const userSubscription = _userSubscriptions[0];

    const isValid =
      userSubscription.stripePriceId &&
      userSubscription?.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS >
        Date.now();

    return NextResponse.json({ isPro: isValid }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
};

export const GET = handler;
