import { StreamingTextResponse, OpenAIStream, Message } from 'ai';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getContext } from '@/lib/context';
import { db } from '@/lib/db';
import { chats, messages as _messages, medias } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { getQueryParams } from '@/utils/query';
import { handleAuthGuard } from '@/utils/auth';
import { generatePrompt } from '@/lib/prompt';
import { openai } from '../utils/openai';

export const runtime = 'nodejs';

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(config);

const handler = async (req: Request) => {
  try {
    const { userId }: any = await auth();
    const guestSessionId: any = getQueryParams(req, 'guestSessionId');

    const authStatus = await handleAuthGuard(guestSessionId);

    if (!authStatus.ok) {
      return NextResponse.json({ error: authStatus.error }, { status: 401 });
    }

    const { messages, projectId, language } =
      await req.json();

    const _chats = await db
      .select()
      .from(chats)
      .where(eq(chats.projectId, Number(projectId)));

      // If there is no chat, create a new one
      let chatId: any = _chats[0]?.id || null;
    if (_chats.length < 1) {
      const newChat = await db
        .insert(chats)
        .values({ projectId: Number(projectId), userId, guestId: guestSessionId })
        .returning();

      chatId = newChat[0].id;
    }

    // const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];

    const projectMedias = await db
      .select()
      .from(medias)
      .where(eq(medias.projectId, Number(projectId)))

    const context = await getContext(lastMessage.content, projectMedias);
    const prompt: any = generatePrompt(context, language);
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
