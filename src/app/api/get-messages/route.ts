import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export const POST = async (req: Request) => {
    const body = await req.json();
    const { chatId } = body;

    const _messages = await db.select().from(messages).where(eq(messages.chatId, chatId));
    return NextResponse.json(_messages);
}