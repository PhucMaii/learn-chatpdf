import { getContext } from '@/lib/context';
import { DrizzleMedia } from '@/lib/db/drizzleType';
import { generateEssayPrompt, generatePrompt } from '@/lib/prompt';
import { openai } from './openai';
import { db } from '@/lib/db';
import { essays } from '@/lib/db/schema';

export const generateEssay = async (
  medias: DrizzleMedia[],
  projectId: number,
  userId: string,
  wordCount: number,
  language: string,
) => {
  const essayPrompt = generateEssayPrompt(wordCount, language);
  const context = await getContext(essayPrompt, medias);

  const prompt: any = generatePrompt(context, language);

  const response: any = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      prompt,
      {
        role: 'user',
        content: essayPrompt,
      },
    ],
  });

  // console.log('pass prompt');
  const messageContent = response.choices[0].message.content;
  if (!messageContent) {
    throw new Error('No content received from OpenAI');
  }

  const formattedMessages = JSON.parse(messageContent);

  const newEssay = await db.insert(essays).values({
    projectId: projectId,
    userId: userId,
    content: formattedMessages.content,
    title: formattedMessages.title,
    createdAt: new Date(),
  }).returning();

  return newEssay[0];
};
