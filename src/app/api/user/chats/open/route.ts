import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { withAuthGuard } from "@/utils/guard";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const handler = async (req: Request) => {
    try {
        const { chatId } = await req.json();

        if (!chatId) {
            return NextResponse.json({ error: 'Missing chatId' }, { status: 400 });
        }

        const chat = await db.select().from(chats).where(eq(chats.id, chatId));

        if (chat.length === 0) {
            return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
        }

        await db.update(chats).set({
            lastOpenedAt: new Date(),
        }).where(eq(chats.id, chatId));

        return NextResponse.json({ message: 'Chat opened successfully' }, { status: 200 });
    } catch (error: any) {
        console.log('Internal Server Error: ', error);
        return NextResponse.json(
          { error: 'Internal Server Error: ' + error },
          { status: 500 },
        );
    }


}

export const POST = withAuthGuard(handler);