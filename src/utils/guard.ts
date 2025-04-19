import { db } from '@/lib/db';
import { guests, users } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getQueryParams } from './query';

export const withAuthGuard =
  (handler: any) => async (req: Request, res: NextResponse) => {
    try {
      const { userId } = await auth();
      const guestSessionId = getQueryParams(req, 'guestSessionId');

      if (!userId) {
        if (!guestSessionId) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const guestExists = await db
          .select()
          .from(guests)
          .where(eq(guests.guestSessionId, guestSessionId));

        if (guestExists.length === 0) {
          return NextResponse.json({ error: 'Guest session not found' }, { status: 404 });
        }

        return handler(req, res);
      }

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      

      if (existingUser.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return handler(req, res);
    } catch (error: any) {
      console.log('Internal Server Error: ', error);
      return NextResponse.json(
        { error: 'Internal Server Error: ' + error },
        { status: 500 },
      );
    }
  };
