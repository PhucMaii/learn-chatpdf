import { getQueryParams } from '@/utils/query';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quiz, quizQuestion } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

const handler = async (req: Request) => {
  try {
    console.log('Fetching quiz');
    const projectId = getQueryParams(req, 'projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 },
      );
    }

    // Get all quizzes with their questions using join
    const quizWithQuestions = await db
      .select({
        quiz: quiz,
        question: quizQuestion,
      })
      .from(quiz)
      .leftJoin(quizQuestion, eq(quiz.id, quizQuestion.quizId))
      .where(eq(quiz.projectId, Number(projectId)))
      .orderBy(asc(quizQuestion.index));

    // Group the results by quiz
    const groupedQuizzes = quizWithQuestions.reduce(
      (acc, row) => {
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
    console.log('Result: ', result[0]?.questions);
    return NextResponse.json(
      { data: result[0] || [], message: 'Quiz fetched successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
};

export default handler;
