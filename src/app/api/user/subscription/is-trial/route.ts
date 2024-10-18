import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
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

        const dbUser = await db.select().from(users).where(eq(users.id, userId));

        const isTrialEnd = dbUser[0].trialEnd?.getTime() < Date.now();
        console.log({ isTrialEnd, trial: dbUser[0].trialEnd?.getTime(), now: Date.now(), isTrial: !isTrialEnd });

        return NextResponse.json({ isTrial: !isTrialEnd }, { status: 200 });
    } catch (error: any) {
        console.log('Internal Server Error: ', error);
        return NextResponse.json(
            { error: 'Internal Server Error: ' + error },
            { status: 500 },
        );
    }
}

export const GET = withAuthGuard(handler);