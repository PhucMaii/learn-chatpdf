import { db } from "@/lib/db";
import { quiz, quizAttempt, quizQuestion } from "@/lib/db/schema";
import { withAuthGuard } from "@/utils/guard";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
    try {
        const { questionCount, duration, quizId} = await req.json();

        // Check if quiz exists
        const existingQuiz = await db.select().from(quiz).where(eq(quiz.id, quizId));
        if (!existingQuiz) {
            return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
        }

        const dbQuestions = await db.select().from(quizQuestion).where(eq(quizQuestion.quizId, quizId));

        if (dbQuestions.length < questionCount) {
            return NextResponse.json({ error: "Not enough questions in the quiz" }, { status: 400 });
        }

        // Initialize quiz attempt
        const newAttempt = await db.insert(quizAttempt).values({
            quizId,
            projectId: existingQuiz[0].projectId,
            userId: existingQuiz[0].userId,
            guestId: existingQuiz[0].guestId,
            startedAt: new Date(),
            totalQuestions: questionCount,
            correctAnswers: 0,
            incorrectAnswers: 0,
            skippedQuestions: 0,
            totalTime: 0,
            quizDuration: duration,
        });

        return NextResponse.json({ quiz: newAttempt }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to start quiz: " + error.message }, { status: 500 });
    }
}

export const POST = withAuthGuard(handler);