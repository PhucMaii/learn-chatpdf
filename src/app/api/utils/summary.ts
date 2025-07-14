import { getContext } from '@/lib/context';
import { summaryPrompt } from '@/lib/prompt';
import { NextResponse } from 'next/server';
import { openai } from './openai';
import { db } from '@/lib/db';
import { summary } from '@/lib/db/schema';

export const createSummary = async (
  projectMedias: any,
  projectId: number,
  userId: string,
  isGuest: boolean,
  vectors: any = null,
) => {
  try {
    let context;
    if (vectors) {
      context = await getContext(summaryPrompt, projectMedias, vectors.flat());
    } else {
      context = await getContext(summaryPrompt, projectMedias);
    }

    // Insert initial "generating" record
    await db.insert(summary).values({
      projectId: Number(projectId),
      title: 'Generating...',
      text: 'Generating...',
      createdAt: new Date(),
      userId: !isGuest ? userId : null,
      guestId: isGuest ? userId : null,
    } as any);

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

    const encoder = new TextEncoder();
    let fullContent = '';

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullContent += content;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
              );
            }
          }

          // Process the completed response
          try {
            const data = JSON.parse(fullContent);
            // Save completed summary to db
            await db.insert(summary).values({
              projectId: Number(projectId),
              title: data.title,
              text: data.summary,
              createdAt: new Date(),
              userId: !isGuest ? userId : null,
              guestId: isGuest ? userId : null,
            } as any);
          } catch (parseError) {
            console.log('Error parsing completion:', parseError);
          }

          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

    // const completionData = await response.json();
    // const jsonData = completionData.choices[0].message.content;
    // const data = JSON.parse(jsonData);

    // // Check if summary already exists
    // const existingSummary = await db
    //   .select()
    //   .from(summary)
    //   .where(eq(summary.projectId, Number(projectId)));

    // if (existingSummary.length > 0) {
    //   // Delete existing summary
    //   await db.delete(summary).where(eq(summary.projectId, Number(projectId)));
    // }

    // const newSummary = await db
    //   .insert(summary)
    //   .values({
    //     title: data.title,
    //     projectId: Number(projectId),
    //     text: data.summary,
    //     createdAt: new Date(),
    //     userId: !isGuest ? userId : null,
    //     guestId: isGuest ? userId : null,
    //   } as any)
    //   .returning();

    // return newSummary;
  } catch (error: any) {
    console.log('Internal Server Error: ', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
