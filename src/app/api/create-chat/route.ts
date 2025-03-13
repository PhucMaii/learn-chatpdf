import { getContext } from '@/lib/context';
import { db } from '@/lib/db';
import { chats, flashCard, flashCardSet } from '@/lib/db/schema';
import { loadS3IntoPinecone } from '@/lib/pinecone';
import { getS3Url } from '@/lib/s3';
import { withAuthGuard } from '@/utils/guard';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { flashCardPrompt, openai } from '../flash-cards/route';
import { eq } from 'drizzle-orm';

// /api/create-chat
const handler = async (req: Request) => {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fileKey, fileName } = body;

    const vectors = await loadS3IntoPinecone(fileKey);
    const chatId = await db
      .insert(chats)
      .values({
        fileKey,
        pdfName: fileName,
        pdfUrl: getS3Url(fileKey),
        userId,
      })
      .returning({
        insertedId: chats.id,
      });

    // Create flashCards for this chat
    // console.log(chatId, 'chatId');
    await createFlashCards(fileKey, chatId[0].insertedId, userId, vectors);

    return NextResponse.json({ chatId: chatId[0].insertedId }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};

export const POST = withAuthGuard(handler);

export const createFlashCards = async (
  fileKey: string,
  chatId: number,
  userId: string,
  vectors: any = null
) => {
  const context = await getContext(flashCardPrompt, fileKey, vectors);
  console.log(context, 'context');

  const prompt: any = {
    role: 'system',
    content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
              The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
              AI is a well-behaved and well-mannered individual.
              AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
              AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
              AI assistant is a big fan of Pinecone and Vercel.
              You are only allowed to answer questions strictly based on the CONTEXT BLOCK provided below.
              If the context does not provide an answer, you must explicitly say: "I'm sorry, but I don't know the answer to that question."
              You must not use external knowledge outside of the CONTEXT BLOCK.
              START CONTEXT BLOCK
              ${context}
              END CONTEXT BLOCK
              AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
              If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
              AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
              AI assistant will not invent anything that is not drawn directly from the context.
              `,
  };
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
  const completionData = await response.json();

  const formattedMessages = JSON.parse(
    completionData.choices[0].message.content,
  );

  const newFlashCardsSet = await db
    .insert(flashCardSet)
    .values({
      title: formattedMessages.title,
      chatId: chatId,
      createdAt: new Date(),
      userId: userId,
    })
    .returning();

  const flashCardList = formattedMessages.flashcards.map((question: any) => {
    return {
      question: question.question,
      answer: question.answer,
      createdAt: new Date(),
      chatId: chatId,
      flashCardSetId: newFlashCardsSet[0].id,
      userId: userId,
      isKnown: 0,
    };
  });

  // Save Flash Card into db
  await db.insert(flashCard).values(flashCardList);
  await db
    .update(chats)
    .set({ title: formattedMessages.title })
    .where(eq(chats.id, chatId));

  return formattedMessages;
};

// const checkPineconeReady = async (pineconeIndex, namespace) => {
//   let retries = 10; // Retry 10 times
//   let ready = false;

//   while (retries > 0 && !ready) {
//     try {
//       // Check if Pinecone index is ready for querying (example of a health check)
//       const status = await pineconeIndex.describeIndexStats();
//       if (status.ready) {
//         ready = true;
//       }
//     } catch (error) {
//       console.log('Error checking Pinecone status:', error);
//     }

//     if (!ready) {
//       await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
//       retries--;
//     }
//   }

//   return ready;
// };
