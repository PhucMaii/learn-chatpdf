import { db } from "@/lib/db";
import { quizAttempt } from "@/lib/db/schema";
import { QuizQuestion } from "@/types/quiz";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

interface Ibody {
    quizAttemptId: number;
    correctAnswers: QuizQuestion[];
    incorrectAnswers: QuizQuestion[];
    skippedQuestions: QuizQuestion[];
}

const handler = async (req: Request) => {
    try {
        const {
            quizAttemptId,
            correctAnswers,
            incorrectAnswers,
            skippedQuestions,
        } = await req.json() as Ibody;

        if (!quizAttemptId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingAttempt = await db.select().from(quizAttempt).where(eq(quizAttempt.id, quizAttemptId));

        if (!existingAttempt || existingAttempt.length === 0) {
            return NextResponse.json({ error: 'Quiz attempt not found' }, { status: 404 });
        }

        const totalTime = new Date().getTime() - existingAttempt[0].startedAt!.getTime();
        const totalTimeInSeconds = totalTime / 1000;

        const score = (correctAnswers.length / (existingAttempt[0].totalQuestions!)) * 100;

        console.log({ 
            correctAnswers: correctAnswers.length,
            incorrectAnswers: incorrectAnswers.length,
            skippedQuestions: skippedQuestions.length,
            endedAt: new Date(),
            totalTime: Math.floor(totalTimeInSeconds),
            score: Math.floor(score),
         });

        const updatedAttempt = await db.update(quizAttempt).set({
            correctAnswers: correctAnswers.length,
            incorrectAnswers: incorrectAnswers.length,
            skippedQuestions: skippedQuestions.length,
            endedAt: new Date(),
            totalTime: Math.floor(totalTimeInSeconds),
            score: Math.floor(score),
        }).where(eq(quizAttempt.id, quizAttemptId)).returning();

        return NextResponse.json({ message: 'Quiz attempt updated successfully', updatedAttempt }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export default handler;