import { db } from "@/lib/db";
import { chats, flashCardSet } from "@/lib/db/schema";
import { withAuthGuard } from "@/utils/guard";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const handler = async () => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const flashCardSetsWithChats = await db
        .select({
          flashCardSet: flashCardSet,
          chat: chats,
        })
        .from(flashCardSet)
        .innerJoin(chats, eq(flashCardSet.chatId, chats.id))
        .where(eq(flashCardSet.userId, userId));

        console.log(flashCardSetsWithChats, 'flash card set with chats');
      

        return NextResponse.json({flashCardSetsWithChats});
    } catch (error: any) {
        console.log('Internal Server Error: ', error);
        return NextResponse.json(
            { error: 'Internal Server Error: ' + error },
            { status: 500 },
        );
    }
}

export const GET = withAuthGuard(handler);