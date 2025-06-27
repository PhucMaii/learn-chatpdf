import { db } from '@/lib/db';
import {
  quiz,
  quizAttempt,
  quizAttemptQuestion,
  quizQuestion,
} from '@/lib/db/schema';
import { withAuthGuard } from '@/utils/guard';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest) => {
  try {
    const body = await req.json();
    console.log('Request body:', body);

    const { questionCount, duration, projectId } = body;

    // Validate required fields
    if (!questionCount || !duration || !projectId) {
      return NextResponse.json(
        {
          error: 'Missing required fields: questionCount, duration, projectId',
        },
        { status: 400 },
      );
    }

    // Check if quiz exists
    const existingQuizzes = await db
      .select()
      .from(quiz)
      .where(eq(quiz.projectId, projectId));

    if (!existingQuizzes || existingQuizzes.length === 0) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const quizId = existingQuizzes[0].id;

    // Get questions for this quiz
    const dbQuestions = await db
      .select()
      .from(quizQuestion)
      .where(eq(quizQuestion.quizId, quizId));

    if (dbQuestions.length < questionCount) {
      return NextResponse.json(
        {
          error: `Not enough questions in the quiz. Available: ${dbQuestions.length}, Requested: ${questionCount}`,
        },
        { status: 400 },
      );
    }

    // Convert duration from minutes to seconds
    const durationInSeconds = duration * 60;

    const attemptData = {
      quizId,
      projectId: existingQuizzes[0].projectId,
      userId: existingQuizzes[0].userId,
      guestId: existingQuizzes[0].guestId,
      startedAt: new Date(),
      endedAt: null,
      score: null,
      totalQuestions: questionCount,
      correctAnswers: 0,
      incorrectAnswers: 0,
      skippedQuestions: 0,
      totalTime: 0,
      quizDuration: durationInSeconds,
    };

    // Initialize quiz attempt
    const [newAttempt] = await db
      .insert(quizAttempt)
      .values(attemptData)
      .returning();

    let trackedQuestions = [...dbQuestions];
    // Initialize quiz attempt questions according to the question count
    const quizAttemptQuestions: any[] = [];
    while (quizAttemptQuestions.length < questionCount) {
      const randomQuestion =
        trackedQuestions[Math.floor(Math.random() * trackedQuestions.length)];
      if (
        !quizAttemptQuestions.some(
          (question) => question.questionId === randomQuestion.id,
        )
      ) {
        quizAttemptQuestions.push({
          quizAttemptId: newAttempt.id,
          questionId: randomQuestion.id,
          isCorrect: 0,
          isSkipped: 0,
        });

        trackedQuestions = trackedQuestions.filter(
          (question) => question.id !== randomQuestion.id,
        );
      }
    }

    // Insert quiz attempt questions
    await db.insert(quizAttemptQuestion).values(quizAttemptQuestions);

    return NextResponse.json(
      {
        quiz: {
          id: newAttempt.id,
          quizId: newAttempt.quizId,
          projectId: newAttempt.projectId,
          totalQuestions: newAttempt.totalQuestions,
          quizDuration: newAttempt.quizDuration,
          startedAt: newAttempt.startedAt,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error starting quiz:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      {
        error: 'Failed to start quiz. Please try again.',
        details: error.message,
      },
      { status: 500 },
    );
  }
};

export const POST = withAuthGuard(handler);
