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
let returnChatId: any;
const handler = async (req: Request) => {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fileKey, fileName, url } = body;

    let vectors = [];
    // const vectors = await loadS3IntoPinecone(fileKey);
    if (fileKey) {
      vectors = await loadS3IntoPinecone(fileKey, 'fileKey');
    } else if (url) {
      vectors = await loadS3IntoPinecone(url, 'url');
    }

    const newChat: any = {
      userId: userId,
    };

    if (fileKey) {
      newChat.fileKey = fileKey;
      newChat.pdfName = fileName;
      newChat.pdUrl = getS3Url(fileKey);
      newChat.fileType = fileName.split('.').pop();
    } else if (url) {
      newChat.webUrl = url;
      newChat.fileKey = url;
      newChat.fileType = 'url';
    }

    console.log(newChat, 'newChat');

    const chatId = await db.insert(chats).values(newChat).returning({
      insertedId: chats.id,
    });

    returnChatId = chatId[0].insertedId;
    console.log({ returnChatId, chatId }, 'returnChatId');

    // console.log('Create Chat Successfully');

    // Create flashCards for this chat
    // console.log(chatId, 'chatId');
    new Response('data: generating flashcards\n\n', {
      headers: { 'Content-Type': 'text/event-stream' },
    });

    const res = await createFlashCards(
      fileKey || url,
      returnChatId,
      userId,
      vectors,
    );

    // console.log(res, 'res');
    // If fail to create flash card, still return chatId
    if (res.error) {
      return NextResponse.json({ chatId: returnChatId }, { status: 200 });
    }

    return NextResponse.json({ chatId: returnChatId }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error, chatId: returnChatId }, { status: 500 });
  }
};

export const POST = withAuthGuard(handler);

export const createFlashCards = async (
  input: string,
  chatId: number,
  userId: string,
  vectors: any = null,
  isGuest: boolean = false,
) => {
  try {
    const context = await getContext(flashCardPrompt, input, vectors);
    // console.log(context, 'context');

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

    // console.log('pass prompt');
    const completionData = await response.json();

    const formattedMessages = JSON.parse(
      completionData.choices[0].message.content,
    );

    // console.log('pass json.parse')

    // Use card title for chat title
    await db
      .update(chats)
      .set({ title: formattedMessages.title })
      .where(eq(chats.id, chatId));

    const newFlashCardsSet = await db
      .insert(flashCardSet)
      .values({
        title: formattedMessages.title,
        chatId: chatId,
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
        chatId: chatId,
        flashCardSetId: newFlashCardsSet[0].id,
        userId: !isGuest ? userId : null,
        guestId: isGuest ? userId : null,
        isKnown: 0,
      };
    });

    // console.log('pass map');

    // Save Flash Card into db
    await db.insert(flashCard).values(flashCardList);
    await db
      .update(chats)
      .set({ title: formattedMessages.title })
      .where(eq(chats.id, chatId));

    return formattedMessages;
  } catch (error: any) {
    console.log('Fail to generate flash cards', error);
    return { error: error.message, chatId: chatId };
  }
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
