import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface IBody {
    name: string;
    email: string;
    message: string;
}

const handler = async (req: Request) => {
    try {
        const { userId } = await auth();
        const { name, email, message }: IBody = await req.json();

        const newContacts = await db.insert(contacts).values({
            name,
            userId,
            email,
            message,
        });

        return NextResponse.json({ data: newContacts, message: 'Submitted successfully. We will get back to you soon!' }, { status: 200 });

    } catch (error: any) {
        console.log('Internal Server Error: ', error);
        return NextResponse.json(
            { error: 'Internal Server Error: ' + error },
            { status: 500 },
        );
    }
}

export const POST = handler;