import { getContext } from '@/lib/context';
import { DrizzleMedia } from '@/lib/db/drizzleType';
import { generatePrompt, quizPrompt } from '@/lib/prompt';
import { openai } from './openai';
import { db } from '@/lib/db';
import { flashCard, flashCardSet, quiz, quizQuestion } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const createQuiz = async (
  medias: DrizzleMedia[],
  projectId: number,
  userId: string,
  vectors: any = null,
  isGuest: boolean = false,
) => {
  let context;
  if (vectors) {
    context = await getContext(quizPrompt, medias, vectors.flat());
  } else {
    context = await getContext(quizPrompt, medias);
  }

  // Get flashcards from db
  const cardSet = await db
    .select()
    .from(flashCardSet)
    .where(eq(flashCardSet.projectId, projectId));
  const flashcards = await db
    .select()
    .from(flashCard)
    .where(eq(flashCard.flashCardSetId, cardSet[0].id));

  // Merge flashcards to a string to be used in the prompt as question and answer
  const flashcardsString = flashcards
    .map(
      (flashcard) =>
        `Review Question: ${flashcard.question} - Review Answer: ${flashcard.answer}`,
    )
    .join('\n');

  const prompt: any = generatePrompt(context, 'English');

  const response = await openai.createChatCompletion({
    model: 'gpt-4o-mini',
    messages: [
      prompt,
      { role: 'user', content: quizPrompt },
      { role: 'user', content: flashcardsString },
    ],
  });

  const completionData = await response.json();
  const formattedMessages: any = JSON.parse(
    completionData.choices[0].message.content,
  );

  // Check if quiz already exists
  const existingQuiz = await db.select().from(quiz).where(eq(quiz.projectId, projectId));
  if (existingQuiz.length > 0) {
    await db.delete(quiz).where(eq(quiz.projectId, projectId));
    await db.delete(quizQuestion).where(eq(quizQuestion.quizId, existingQuiz[0].id));
  }

  // Create quiz in db
  const newQuiz = await db
    .insert(quiz)
    .values({
      projectId,
      userId: !isGuest ? userId : null,
      guestId: isGuest ? userId : null,
      title: formattedMessages.title,
    })
    .returning();

  // Create questions in db
  const newQuestions = await db.insert(quizQuestion).values(
    formattedMessages.quizzes.map((quiz: any, index: number) => {
      return {
        quizId: newQuiz[0].id,
        index: index + 1,
        question: quiz.question,
        optionA: quiz.options[0],
        optionB: quiz.options[1],
        optionC: quiz.options[2],
        optionD: quiz.options[3],
        correctAnswer: quiz.correctAnswer,
        explanation: quiz.explanation,
      };
    }),
  );

  return {
    quiz: newQuiz[0],
    questions: newQuestions,
  };
};
