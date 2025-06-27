import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
    quiz,
  quizAttempt,
  quizAttemptQuestion,
  quizQuestion,
} from '@/lib/db/schema';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const attemptId = searchParams.get('attemptId');

    if (!attemptId) {
      return NextResponse.json(
        { error: 'Attempt ID is required' },
        { status: 400 },
      );
    }

    const attempt = await db
      .select()
      .from(quizAttempt)
      .where(eq(quizAttempt.id, Number(attemptId)))
      .leftJoin(
        quiz,
        eq(quizAttempt.quizId, quiz.id),
      )
      .leftJoin(
        quizAttemptQuestion,
        eq(quizAttempt.id, quizAttemptQuestion.quizAttemptId),
      )
      .leftJoin(
        quizQuestion,
        eq(quizAttemptQuestion.questionId, quizQuestion.id),
      );
    // console.log(attempt);

    if (!attempt || attempt.length === 0) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    const questions = attempt.map((attempt) => {
      return attempt.quiz_question;
    });

    console.log({ questions, attempt: attempt[0].quiz_attempt });

    return NextResponse.json(
      { attempt: attempt[0].quiz_attempt, questions, quiz: attempt[0].quiz },
      { status: 200 },
    );
  } catch (error: any) {
    console.log('Error in GET /api/quiz-attempt', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
};

export default handler;
