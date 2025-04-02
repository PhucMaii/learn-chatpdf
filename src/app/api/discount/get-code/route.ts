import { db } from '@/lib/db';
import { discountCodes, userSubscriptions } from '@/lib/db/schema';
import { withAuthGuard } from '@/utils/guard';
import { getQueryParams } from '@/utils/query';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  try {
    const code = getQueryParams(req, 'code');

    if (!code) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    }

    const existingCode = await db
      .select()
      .from(discountCodes)
      .where(eq(discountCodes.code, code));

    if (existingCode.length === 0) {
      return NextResponse.json(
        { error: 'Discount code not found' },
        { status: 404 },
      );
    }

    const userSubscription = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.stripePromotionCode, existingCode[0].id));

    if (userSubscription.length >= existingCode[0].quantity) {
      return NextResponse.json(
        { error: 'Invalid discount code' },
        { status: 400 },
      );
    }

    return NextResponse.json({ data: existingCode[0] }, { status: 200 });
  } catch (error: any) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json(
      { error: 'Invalid Discount Code: ' + error },
      { status: 500 },
    );
  }
};

export const GET = withAuthGuard(handler);
