import { db } from "@/lib/db";
import { medias } from "@/lib/db/schema";
import { getQueryParams } from "@/utils/query";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export default async function DELETEMethod(req: Request) {
    try {
        const mediaId = getQueryParams(req, 'id');

        if (!mediaId) {
            return NextResponse.json(
              {
                error: 'Media ID is required',
              },
              { status: 400 },
            );
        }

        await db.delete(medias).where(eq(medias.id, Number(mediaId)));
        
        return NextResponse.json(
          {
            message: 'Media deleted successfully',
          },
          { status: 200 },
        );
    } catch (error: any) {
        console.log('Internal Server Error: ', error);
        return NextResponse.json(
          { error: 'Internal Server Error: ' + error },
          { status: 500 },
        );
    }
}