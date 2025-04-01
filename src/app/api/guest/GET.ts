import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getQueryParams } from "@/utils/query";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export default async function GET(req: Request) {
    try {
        const guestSessionId = getQueryParams(req, 'guestSessionId');

        if (!guestSessionId) {
            return NextResponse.json({ error: 'Missing guestSessionId' }, { status: 400 });
        }

        const guest = await db.select().from(users).where(eq(users.guestSessionId, guestSessionId));

        if (guest.length === 0) {
            return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
        }

        return NextResponse.json({ data: guest[0] }, { status: 200 });
    } catch (error: any) {
        console.log('Fail to get guest: ', error);
        return NextResponse.json(
            { error: 'Fail to get guest: ' + error },
            { status: 500 },
        );
    }
}