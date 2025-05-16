import { essays } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { withAuthGuard } from "@/utils/guard";

const handler = async (req: NextRequest) => {
    try {
        const { essayId, updatedFields } = await req.json();

        const existingEssay = await db.select().from(essays).where(eq(essays.id, essayId));

        if (!existingEssay || existingEssay.length === 0) {
            return NextResponse.json({ error: 'Essay not found' }, { status: 404 });
        }

        const updatedEssay = {
            ...updatedFields,
        }

        if (updatedFields.aiCheckScore) {
            updatedEssay.aiCheckScore = Math.ceil(Number(updatedFields.aiCheckScore));
        }

        const essay = await db.update(essays).set(updatedEssay).where(eq(essays.id, essayId)).returning();

        console.log(essay, 'ESSAY');

        return NextResponse.json({ data: essay[0] }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save essay' }, { status: 500 });
    }
}

export const PUT = withAuthGuard(handler);