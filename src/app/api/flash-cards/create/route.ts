import { db } from '@/lib/db';
import { flashCard } from '@/lib/db/schema';
import { withAuthGuard } from '@/utils/guard';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

type Body = {
  question: string;
  answer: string;
  flashCardSetId: number;
  chatId: number;
};

const postHandler = async (req: Request) => {
  try {
    const { question, answer, flashCardSetId, chatId }: Body = await req.json();

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Missing question or answer' },
        { status: 400 },
      );
    }

    const { userId }: any = await auth();

    await db.insert(flashCard).values({
      question,
      answer,
      isKnown: 0,
      flashCardSetId,
      userId,
      chatId,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: 'Flash card created successfully' },
      { status: 201 },
    );
  } catch (error: any) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
};

export const POST = withAuthGuard(postHandler);
