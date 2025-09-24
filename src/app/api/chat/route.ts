import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { chats, messages as _messages, medias } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { getQueryParams } from '@/utils/query';
import { handleAuthGuard } from '@/utils/auth';
import { generateChatPrompt } from '@/lib/prompt';
import { openai } from '../utils/openai';
import { getPineconeClient } from '@/lib/pinecone';
import { getEmbeddings } from '@/lib/embedding';
import { buildPerDocTop, resolveTargetDocs, TargetDoc } from '@/utils/docs';

export const runtime = 'nodejs';

const handler = async (req: Request) => {
  try {
    const { userId }: any = await auth();
    const guestSessionId: any = getQueryParams(req, 'guestSessionId');

    const authStatus = await handleAuthGuard(guestSessionId);

    if (!authStatus.ok) {
      return NextResponse.json({ error: authStatus.error }, { status: 401 });
    }

    const { messages, projectId, language } = await req.json();

    const _chats = await db
      .select()
      .from(chats)
      .where(eq(chats.projectId, Number(projectId)));

    // If there is no chat, create a new one
    let chatId: any = _chats[0]?.id || null;
    if (_chats.length < 1) {
      const newChat = await db
        .insert(chats)
        .values({
          projectId: Number(projectId),
          userId,
          guestId: guestSessionId,
        })
        .returning();

      chatId = newChat[0].id;
    }

    const lastMessage = messages[messages.length - 1];

    const projectMedias = await db
      .select()
      .from(medias)
      .where(eq(medias.projectId, Number(projectId)));

    // Get embeddings for the last message
    const queryEmbeddings = await getEmbeddings(lastMessage.content);

    // Get vectors from Pinecone for each media
    const pinecone = await getPineconeClient();
    const index = pinecone.Index('learn-chatpdf');

    // Find best match document
    const targetDocs = resolveTargetDocs(lastMessage.content, projectMedias);

    // Query each media's namespace and combine results
    const queryPromises = targetDocs.map(async (doc: any) => {
      try {
        const queryResult = await index.namespace(doc.namespace).query({
          topK: 10,
          vector: queryEmbeddings,
          includeMetadata: true,
        });
        return queryResult.matches || [];
      } catch (error) {
        console.error(`Error querying namespace ${doc.namespace}:`, error);
        return [];
      }
    });
    
    const queryResults = await Promise.all(queryPromises);
    console.log({ targetDocs, queryResults });
    for (const queryResult of queryResults) {
      console.log({ queryResult });
    }

    const perDocTop = buildPerDocTop(targetDocs as TargetDoc[], queryResults);
    // const allMatches = queryResults.flat();

    // // Sort matches by score
    // const sortedMatches = allMatches.sort(
    //   (a, b) => (b.score || 0) - (a.score || 0),
    // );

    // // Filter and get top matches
    // const qualifyingDocs = sortedMatches
    //   .filter((match) => match.score && match.score > 0.5)
    //   .slice(0, 5); // Get top 5 matches

    // Extract text from matches
    // const contextText = qualifyingDocs
    //   .map((match) => match.metadata?.text || '')
    //   .join('\n')
    //   .substring(0, 3000);

    const prompt: any = generateChatPrompt(perDocTop, language);

    // Save user message before streaming starts
    await db.insert(_messages).values({
      chatId,
      content: lastMessage.content,
      role: 'user',
    });

    // Create OpenAI streaming request following official documentation
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      top_p: 1,
      frequency_penalty: 0.4,
      presence_penalty: 0,
      messages: [
        prompt,
        ...messages.filter((message: any) => message.role === 'user'),
      ],
      stream: true,
    });

    const encoder = new TextEncoder();
    let fullResponse = '';

    // Create ReadableStream following OpenAI streaming documentation pattern
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';

            if (content) {
              fullResponse += content;

              // Send Server-Sent Events format data
              const data = `data: ${JSON.stringify({
                content,
                type: 'content',
              })}\n\n`;

              controller.enqueue(encoder.encode(data));
            }

            // Check if stream is finished
            if (chunk.choices[0]?.finish_reason === 'stop') {
              // Send completion event
              const doneData = `data: ${JSON.stringify({
                type: 'done',
                fullResponse,
              })}\n\n`;

              controller.enqueue(encoder.encode(doneData));

              // Save AI response to database
              await db.insert(_messages).values({
                chatId,
                content: fullResponse,
                role: 'system',
              });

              // Send final SSE close
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
              return;
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);

          // Send error event
          const errorData = `data: ${JSON.stringify({
            type: 'error',
            error: 'An error occurred during streaming',
          })}\n\n`;

          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST = handler;
