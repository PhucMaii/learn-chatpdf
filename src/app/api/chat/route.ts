import { Configuration, OpenAIApi } from 'openai-edge';
import { StreamingTextResponse, OpenAIStream, Message } from 'ai';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getContext } from '@/lib/context';
import { db } from '@/lib/db';
import { chats, messages as _messages } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { getQueryParams } from '@/utils/query';
import { handleAuthGuard } from '@/utils/auth';

export const runtime = 'nodejs';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

const handler = async (req: Request) => {
  try {
    const { userId }: any = await auth();
    const guestSessionId: any = getQueryParams(req, 'guestSessionId');

    const authStatus = await handleAuthGuard(userId, guestSessionId);

    if (!authStatus.ok) {
      return NextResponse.json({ error: authStatus.error }, { status: 401 });
    }

    const { messages, chatId, language, isAnswerOutOfContext } =
      await req.json();
    console.log(language, 'language');
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length !== 1) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];

    const context = await getContext(lastMessage.content, fileKey);
    const prompt = {
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
            ${
              isAnswerOutOfContext
                ? 'If the context does not provide the answer to question, the AI assitant will try to answer the question from what AI assistant know outside of the context.'
                : `If the context does not provide the answer to question, the AI assistant will try the best to answer the question from what AI assistant know outside of the context.`
            }
            AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
            AI assistant will not invent anything that is not drawn directly from the context.
            AI will always respond in ${language}.
            `,
    };
    const response: any = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === 'user'),
      ],
      stream: true,
    });

    const stream = OpenAIStream(response, {
      onStart: async () => {
        // Save user message into db
        await db.insert(_messages).values({
          chatId,
          content: lastMessage.content,
          role: 'user',
        });
      },
      onCompletion: async (completion) => {
        // Save ai message into db
        await db.insert(_messages).values({
          chatId,
          content: completion,
          role: 'system',
        });
      },
    });
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
    });
  }
};

export const POST = handler;
