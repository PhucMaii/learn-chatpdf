import { Configuration, OpenAIApi } from 'openai-edge';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getContext } from '@/lib/context';
import { db } from '@/lib/db';
import { chats, flashCard, flashCardSet } from '@/lib/db/schema';
import { withAuthGuard } from '@/utils/guard';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

const flashCardPrompt = `You are a helpful AI assistant for students. You are a brand new, powerful, human-like artificial intelligence.
Task: Generate 20 questions and answers in JSON format based on the provided document. 
Ensure that the JSON follows the exact structure provided below:
{
  "title": "string",  // The title of the flashcard set
  "flashcards": [
    {
      "question": "string",  // A single question related to the document
      "answer": "string"  // The corresponding answer to the question
    },
    ...
  ]
}
Use this exact structure, with "title" as the key for the academic title, and "question" and "answer" for each flashcard pair.
Topic: Questions and Answers 
Style: Academic 
Tone: Professional 
Audience: 20-year-old students 
Length: 500 words 
Format: JSON`;

const handler = async (req: Request) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { chatId } = await req.json();
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length !== 1) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    const fileKey = _chats[0].fileKey;
    // const lastMessage = messages[messages.length - 1];

    const context = await getContext(flashCardPrompt, fileKey);
    const prompt: any = {
      role: 'system',
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
            The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
            AI is a well-behaved and well-mannered individual.
            AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
            AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
            AI assistant is a big fan of Pinecone and Vercel.
            START CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK
            AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
            If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
            AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
            AI assistant will not invent anything that is not drawn directly from the context.
            `,
    };
    const response: any = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
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
    console.log('formatted messages', formattedMessages);

    const newFlashCardsSet = await db.insert(flashCardSet).values({
      title: formattedMessages.title,
      chatId: chatId,
      createdAt: new Date(),
      userId: userId,
    }).returning();

    console.log(newFlashCardsSet, 'newFlashCardsSet');

    const flashCardList = formattedMessages.flashcards.map((question: any) => {
      return {
        question: question.question,
        answer: question.answer,
        createdAt: new Date(),
        chatId: chatId,
        flashCardSetId: newFlashCardsSet[0].id,
        userId: userId,
      }
    })

    // Save Flash Card into db
    await db.insert(flashCard).values(flashCardList);
    await db.update(chats).set({ title: formattedMessages.title }).where(eq(chats.id, chatId));

    return NextResponse.json({ data: formattedMessages.flashcards });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
    });
  }
};

export const POST = withAuthGuard(handler);
