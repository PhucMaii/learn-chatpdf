import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { withAuthGuard } from '@/utils/guard';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

const handler = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await db.select().from(users).where(eq(users.id, userId));

    if (dbUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: dbUser[0] }, { status: 200 });
  } catch (error: any) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error },
      { status: 500 },
    );
  }
};

export const GET = withAuthGuard(handler);
