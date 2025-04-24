import { db } from '@/lib/db';
import { guests, project, users } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

export const handleAuthGuard = async (guestSessionId?: string) => {
  const { userId } = await auth();

  if (userId) {
    const user = await db.select().from(users).where(eq(users.id, userId));
    const projects = await db.select().from(project).where(eq(project.userId, userId));
    return { ok: true, userId, type: 'user', id: userId, user: {...user[0], projects: projects} };
  } else {
    if (!guestSessionId) {
      return { ok: false, error: 'Unauthorized' };
    }

    const guest = await db
      .select()
      .from(guests)
      .where(eq(guests.id, guestSessionId));

    if (guest.length === 0) {
      return { ok: false, error: 'Guest not found' };
    }
    return {
      ok: true,
      guestSessionId,
      type: 'guest',
      id: guestSessionId,
      user: guest[0],
    };
  }
};
