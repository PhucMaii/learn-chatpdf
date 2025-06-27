import { getQueryParams } from '@/utils/query';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quiz, quizAttempt, quizQuestion } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

const handler = async (req: Request) => {
  try {
    const projectId = getQueryParams(req, 'projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 },
      );
    }

    // Get all quizzes with their questions using join
    const quizWithQuestions: any = await db
      .select({
        quiz: quiz,
        question: quizQuestion,
      })
      .from(quiz)
      .leftJoin(quizQuestion, eq(quiz.id, quizQuestion.quizId))
      .where(eq(quiz.projectId, Number(projectId)))
      .orderBy(asc(quizQuestion.index));

    if (quizWithQuestions.length === 0) {
      return NextResponse.json(
        { data: {quiz: {}, quizAttempts: [], avgScore: 0}, message: 'No quiz found' },
        { status: 200 },
      );
    }

    // Group the results by quiz
    const groupedQuizzes = quizWithQuestions.reduce(
      (acc: any, row: any) => {
        const quizId = row.quiz.id;

        if (!acc[quizId]) {
          acc[quizId] = {
            ...row.quiz,
            questions: [],
          };
        }

        if (row.question) {
          acc[quizId].questions.push(row.question);
        }

        return acc;
      },
      {} as Record<number, any>,
    );

    const result = Object.values(groupedQuizzes);

    const quizAttempts = await db
      .select()
      .from(quizAttempt)
      .where(eq(quizAttempt.quizId, Number(quizWithQuestions[0].quiz.id)));

    const avgScore = quizAttempts.reduce((acc: number, attempt: any) => acc + attempt.score, 0) / quizAttempts.length;

    return NextResponse.json(
      { data: {...result[0] || {}, quizAttempts: quizAttempts, avgScore: avgScore}, message: 'Quiz fetched successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
};

export default handler;
