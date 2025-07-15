import { essays } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { withAuthGuard } from "@/utils/guard";
import { auth } from "@clerk/nextjs/server";

const handler = async (req: NextRequest) => {
    try {
        const { essayId, updatedFields, projectId } = await req.json();

        const { userId }: any = await auth();

        const existingEssay = await db.select().from(essays).where(eq(essays.id, essayId));

        if (!existingEssay || existingEssay.length === 0) {
            // Create new essay
            const newEssay = await db.insert(essays).values({
                projectId: projectId,
                userId: userId,
                content: updatedFields.content,
                title: updatedFields?.title || '',
                createdAt: new Date(),
                aiCheckScore: Math.ceil(Number(updatedFields.aiCheckScore)) || 0,
            }).returning();

            return NextResponse.json({ data: newEssay[0] }, { status: 200 });
        }

        const updatedEssay = {
            ...updatedFields,
        }

        if (updatedFields.aiCheckScore) {
            updatedEssay.aiCheckScore = Math.ceil(Number(updatedFields.aiCheckScore));
        }

        const essay = await db.update(essays).set(updatedEssay).where(eq(essays.id, essayId)).returning();

        return NextResponse.json({ data: essay[0] }, { status: 200 });
    } catch (error) {
        console.error('Error saving essay: ' + error);
        return NextResponse.json({ error: 'Failed to save essay' }, { status: 500 });
    }
}

export const PUT = withAuthGuard(handler);