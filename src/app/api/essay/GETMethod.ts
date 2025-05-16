import { db } from "@/lib/db";
import { essays } from "@/lib/db/schema";
import { getQueryParams } from "@/utils/query";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export default async function GETMethod(req: NextRequest) {
    try {
        const projectId = getQueryParams(req, 'projectId');

        if (!projectId) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        const projectEssays = await db.select().from(essays).where(eq(essays.projectId, Number(projectId)));

        if (projectEssays.length === 0) {
            return NextResponse.json({ data: null }, { status: 200 });
        }

        return NextResponse.json({ data: projectEssays[0] }, { status: 200 });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to get essays' }, { status: 500 });
    }
}