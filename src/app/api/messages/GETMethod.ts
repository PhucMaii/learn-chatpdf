import { db } from '@/lib/db';
import { chats, guests, messages, project } from '@/lib/db/schema';
import { getQueryParams } from '@/utils/query';
import { auth } from '@clerk/nextjs/server';
import { asc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const GETMethod = async (req: Request) => {
  try {
    const { userId } = await auth();
    const guestSessionId = getQueryParams(req, 'guestSessionId');
    const projectId = getQueryParams(req, 'projectId');

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

    const exisitingProject = await db
      .select()
      .from(project)
      .where(eq(project.id, Number(projectId)));

    if (exisitingProject.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const existingChat = await db
      .select()
      .from(chats)
      .where(eq(chats.projectId, Number(projectId)));

    if (existingChat.length === 0) {
      return NextResponse.json({ message: 'Chat not found' }, { status: 200 });
    }

    const _messages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, existingChat[0].id))
      .orderBy(asc(messages.createdAt));

    return NextResponse.json({messages: _messages});
  } catch (error: any) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json({ error: error.message });
  }
};

export default GETMethod;
