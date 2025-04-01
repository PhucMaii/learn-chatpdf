import { NextResponse } from "next/server";
import GET from "./GET";

const handler = async (req: Request) => {
    try {
        if (req.method === 'GET') {
            const response = await GET(req);
            return response;
        }

        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    } catch (error: any) {
        console.log('Internal Server Error: ', error);
        return NextResponse.json(
            { error: 'Internal Server Error: ' + error },
            { status: 500 },
        );
    }
}

export default handler;