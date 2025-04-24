import { db } from '@/lib/db';
import { guests, project, users } from '@/lib/db/schema';
import { handleAuthGuard } from '@/utils/auth';
import { getQueryParams } from '@/utils/query';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  try {
    const { userId }: any = await auth();
    const guestSessionId: any = getQueryParams(req, 'guestSessionId');

    const authRes: any = await handleAuthGuard(guestSessionId);

    if (!authRes.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (authRes.type === 'guest') {
      const dbUser = await db
        .select()
        .from(guests)
        .where(eq(guests.id, authRes.id));

      if (dbUser.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ user: dbUser[0] }, { status: 200 });
    }

    if (userId) {
      const dbUser = await db.select().from(users).where(eq(users.id, userId));
      const userProjects = await db.select().from(project).where(eq(project.userId, userId));

      return NextResponse.json({ user: {...(dbUser[0] || {}), projects: userProjects} }, { status: 200 });
    }

    return NextResponse.json({ user: null }, { status: 200 });
  } catch (error: any) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error },
      { status: 500 },
    );
  }
};

export const GET = handler;
