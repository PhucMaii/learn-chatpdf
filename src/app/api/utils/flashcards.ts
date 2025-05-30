import { getContext } from '@/lib/context';
import { DrizzleMedia } from '@/lib/db/drizzleType';
import { db } from '@/lib/db';
import { flashCard, flashCardSet } from '@/lib/db/schema';
import { flashCardPrompt, generatePrompt } from '@/lib/prompt';
import { openai } from './openai';
import { eq } from 'drizzle-orm';

export const createFlashCards = async (
  medias: DrizzleMedia[],
  projectId: number,
  userId: string,
  vectors: any = null,
  isGuest: boolean = false,
) => {
  try {
    const context = await getContext(flashCardPrompt, medias, vectors.flat());
    const prompt: any = generatePrompt(context, 'English');
    console.log('prompt', {prompt, medias, context, vectors});

    const response: any = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        prompt,
        {
          role: 'user',
          content: flashCardPrompt,
        },
      ],
    });

    // console.log('pass prompt');
    const completionData = await response.json();

    const formattedMessages = JSON.parse(
      completionData.choices[0].message.content,
    );

   const existingFlashCardSet = await db
    .select()
    .from(flashCardSet)
    .where(eq(flashCardSet.projectId, Number(projectId)));

    if (existingFlashCardSet.length > 0) {
      // Delete existing flash card set
      await db.delete(flashCardSet).where(eq(flashCardSet.projectId, Number(projectId)));
      await db.delete(flashCard).where(eq(flashCard.flashCardSetId, existingFlashCardSet[0].id));
    }

    // Use card title for chat title
    const newFlashCardsSet = await db
      .insert(flashCardSet)
      .values({
        title: formattedMessages.title,
        projectId: Number(projectId),
        createdAt: new Date(),
        userId: !isGuest ? userId : null,
        guestId: isGuest ? userId : null,
        // isKnown: false,
      })
      .returning();

    // console.log('pass insert');

    const flashCardList = formattedMessages.flashcards.map((question: any) => {
      return {
        question: question.question,
        answer: question.answer,
        createdAt: new Date(),
        projectId: Number(projectId),
        flashCardSetId: newFlashCardsSet[0].id,
        userId: !isGuest ? userId : null,
        guestId: isGuest ? userId : null,
        isKnown: 0,
      };
    });

    // console.log('pass map');

    // Save Flash Card into db
    await db.insert(flashCard).values(flashCardList);

    return formattedMessages;
  } catch (error: any) {
    console.log('Fail to generate flash cards', error);
    return { error: error.message };
  }
};
