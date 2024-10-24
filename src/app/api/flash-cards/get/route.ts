import { db } from "@/lib/db";
import { flashCard } from "@/lib/db/schema";
import { withAuthGuard } from "@/utils/guard";
import { getQueryParams } from "@/utils/query";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const handler = async (req: Request) => {
    try {
        const chatId = getQueryParams(req, 'chatId');

        if (!chatId) {
            return NextResponse.json({ error: 'Missing chatId' }, { status: 400 });
        }
            
        const flashCards = await db.select().from(flashCard).where(eq(flashCard.chatId, Number(chatId)));

        if (flashCards.length === 0 || !flashCards) {
            return NextResponse.json({ error: 'No flash cards found' }, { status: 404 });
        }

        console.log(flashCards, 'flashCards');
        return NextResponse.json({flashCards});
    } catch (error: any) {
        console.log('Internal Server Error: ', error);
        return NextResponse.json(
            { error: 'Internal Server Error: ' + error },
            { status: 500 },
        );
    }
}

export const GET = withAuthGuard(handler);