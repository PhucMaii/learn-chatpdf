import { getContext } from '@/lib/context';
import { summaryPrompt } from '@/lib/prompt';
import { openai } from './openai';
import { db } from '@/lib/db';
import { summary } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const createSummary = async (
  projectMedias: any,
  projectId: number,
  userId: string,
  isGuest: boolean,
  vectors: any = null,
  streaming: boolean = false, // Add streaming parameter
) => {
  try {
    let context;
    if (vectors) {
      context = await getContext(summaryPrompt, projectMedias, vectors.flat());
    } else {
      context = await getContext(summaryPrompt, projectMedias);
    }

    // Check if summary already exists and delete it
    const existingSummary = await db
      .select()
      .from(summary)
      .where(eq(summary.projectId, Number(projectId)));

    if (existingSummary.length > 0) {
      await db.delete(summary).where(eq(summary.projectId, Number(projectId)));
    }

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: summaryPrompt,
        },
        {
          role: 'user',
          content: context,
        },
      ],
      stream: true,
    });

    let fullResponse = '';

    if (streaming) {
      // Streaming mode: return ReadableStream for direct API calls
      const encoder = new TextEncoder();

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content || '';

              if (content) {
                fullResponse += content;

                // Stream the content directly as plain text
                controller.enqueue(encoder.encode(content));
              }

              // Check if stream is finished
              if (chunk.choices[0]?.finish_reason === 'stop') {
                // Save the complete markdown response to database
                await db.insert(summary).values({
                  projectId: Number(projectId),
                  title: 'Generated Summary',
                  text: fullResponse.trim(),
                  createdAt: new Date(),
                  userId: !isGuest ? userId : null,
                  guestId: isGuest ? userId : null,
                } as any);

                controller.close();
                return;
              }
            }
          } catch (error) {
            console.error('Streaming error:', error);
            controller.error(error);
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
    } else {
      // Silent mode: just complete the task for pipeline calls
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
        }

        if (chunk.choices[0]?.finish_reason === 'stop') {
          break;
        }
      }

      // Save to database
      const newSummary = await db
        .insert(summary)
        .values({
          projectId: Number(projectId),
          title: 'Generated Summary',
          text: fullResponse.trim(),
          createdAt: new Date(),
          userId: !isGuest ? userId : null,
          guestId: isGuest ? userId : null,
        } as any)
        .returning();

      return newSummary[0];
    }
  } catch (error) {
    console.error('Summary generation error:', error);
    if (streaming) {
      return new Response('Error generating summary', { status: 500 });
    } else {
      throw error;
    }
  }
};
