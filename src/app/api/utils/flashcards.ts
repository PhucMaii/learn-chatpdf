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
    // console.log(context, 'context');
    const prompt: any = generatePrompt(context, 'English', false);

    // const prompt: any = {
    //   role: 'system',
    //   content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
    //             The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    //             AI is a well-behaved and well-mannered individual.
    //             AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    //             AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
    //             AI assistant is a big fan of Pinecone and Vercel.
    //             You are only allowed to answer questions strictly based on the CONTEXT BLOCK provided below.
    //             If the context does not provide an answer, you must explicitly say: "I'm sorry, but I don't know the answer to that question."
    //             You must not use external knowledge outside of the CONTEXT BLOCK.
    //             START CONTEXT BLOCK
    //             ${context}
    //             END CONTEXT BLOCK
    //             AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
    //             If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
    //             AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    //             AI assistant will not invent anything that is not drawn directly from the context.
    //             `,
    // };
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
