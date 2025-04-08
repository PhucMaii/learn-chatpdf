import { db } from "@/lib/db";
import { medias } from "@/lib/db/schema";
import { getQueryParams } from "@/utils/query";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export default async function GETMethod (req: Request) {
    try {
        const projectId = getQueryParams(req, 'projectId');

        if (!projectId) {
            return NextResponse.json(
              {
                error: 'Project ID is required',
              },
              { status: 400 },
            );
        }

        const mediaList = await db
          .select()
          .from(medias)
          .where(eq(medias.projectId, Number(projectId)));
    
        // if (mediaList.length === 0) {
        //     return NextResponse.json({ error: 'No media found' }, { status: 404 });
        // }
    
        return NextResponse.json({ medias: mediaList });

    } catch (error: any) {
        console.log('Internal Server Error: ', error);
        return NextResponse.json(
          { error: 'Internal Server Error: ' + error },
          { status: 500 },
        );
    }
}