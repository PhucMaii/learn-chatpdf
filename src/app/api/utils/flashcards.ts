import { getContext } from '@/lib/context';
import { DrizzleMedia } from '@/lib/db/drizzleType';
import { db } from '@/lib/db';
import { flashCard, flashCardSet } from '@/lib/db/schema';
import { flashCardPrompt, generatePrompt } from '@/lib/prompt';
import { openai } from './openai';

export const createFlashCards = async (
  medias: DrizzleMedia[],
  projectId: number,
  userId: string,
  vectors: any = null,
  isGuest: boolean = false,
) => {
  try {
    const context = await getContext(flashCardPrompt, medias, vectors);
    const prompt: any = generatePrompt(context, 'English');

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

    // console.log('pass json.parse')

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
