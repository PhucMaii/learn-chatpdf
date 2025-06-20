import { getContext } from '@/lib/context';
import { DrizzleMedia } from '@/lib/db/drizzleType';
import { generatePrompt, quizPrompt } from '@/lib/prompt';
import { openai } from './openai';
import { db } from '@/lib/db';
import { quiz, quizQuestion } from '@/lib/db/schema';

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

  const prompt: any = generatePrompt(context, 'English');

  const response = await openai.createChatCompletion({
    model: 'gpt-4o-mini',
    messages: [prompt, { role: 'user', content: quizPrompt }],
  });

  const completionData = await response.json();
  const formattedMessages: any = JSON.parse(
    completionData.choices[0].message.content,
  );

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
