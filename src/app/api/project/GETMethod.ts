import { db } from "@/lib/db";
import { project } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export default async function GETMethod() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                {
                    error: 'Unauthorized',
                },
                {
                    status: 401,
                },
            );
        }
        const projects = await db.select().from(project).where(eq(project.userId, userId));
        return NextResponse.json({
            message: 'Projects fetched successfully',
            projects,
        }, {
            status: 200,
        });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            {
                error: 'Something went wrong',
            },
            {
                status: 500,
            },
        );

    }
}