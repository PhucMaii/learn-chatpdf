import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    return NextResponse.json({ ok: true, cron: 'ok' });
}