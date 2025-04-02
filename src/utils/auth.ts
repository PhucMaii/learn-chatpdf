import { db } from '@/lib/db';
import { guests } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const handleAuthGuard = async (
  userId?: string,
  guestSessionId?: string,
) => {
  if (userId) {
    return { ok: true, userId, type: 'user' };
  }
  if (!userId) {
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
  }

  return { ok: true, guestSessionId, type: 'guest' };
};
