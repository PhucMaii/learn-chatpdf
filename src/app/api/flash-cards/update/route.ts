import { db } from "@/lib/db";
import { flashCard } from "@/lib/db/schema";
import { withAuthGuard } from "@/utils/guard";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

interface IBody {
    flashCardId: number;
    updatedData: any;
}

const handler = async (req: Request) => {
    try {
        const {flashCardId, updatedData}: IBody = await req.json();
        console.log(flashCardId, updatedData);

        if (!flashCardId || !updatedData) {
            return NextResponse.json({ error: 'Missing flashCardId or updatedData' }, { status: 400 });
        }

        const updatedFlashCard = await db.update(flashCard).set(updatedData).where(eq(flashCard.id, flashCardId));

        if (!updatedFlashCard) {
            return NextResponse.json({ error: 'Flash card not found' }, { status: 404 });
        }

        return NextResponse.json({updatedFlashCard});
    } catch (error: any) {
        console.log('Internal Server Error: ', error);
        return NextResponse.json(
            { error: 'Internal Server Error: ' + error },
            { status: 500 },
        );
    }
}

export const PUT = withAuthGuard(handler);