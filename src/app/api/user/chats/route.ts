import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const {userId} = await auth();
    
        if (!userId) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});
        }
    
        const userChats = await db.select().from(chats).where(eq(chats.userId, userId));
    
        return NextResponse.json({chats: userChats}, {status: 200});
    } catch (error: any) {
        console.log('Internal Server Error: ', error);
        return NextResponse.json({error: 'Internal Server Error: ' + error}, {status: 500});
    }
}