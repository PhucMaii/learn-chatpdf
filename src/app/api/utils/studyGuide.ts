import { getContext } from '@/lib/context';
import { DrizzleMedia } from '@/lib/db/drizzleType';
import { studyGuidePrompt, generatePrompt } from '@/lib/prompt';
import { db } from '@/lib/db';
import { studyGuide } from '@/lib/db/schema';
import { openai } from './openai';
import { eq } from 'drizzle-orm';

export const createStudyGuide = async (
  medias: DrizzleMedia[],
  projectId: number,
  userId: string,
  isGuest: boolean,
  vectors: any = null,
) => {
  try {
    let context;
    if (vectors) {
      context = await getContext(studyGuidePrompt, medias, vectors.flat());
    } else {
      context = await getContext(studyGuidePrompt, medias);
    }

    const prompt: any = generatePrompt(context, 'English');

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            prompt,
            {
                role: 'user',
                content: studyGuidePrompt
            }
        ]
    });

    const messageContent = response.choices[0].message.content;
    if (!messageContent) {
      throw new Error('No content received from OpenAI');
    }
    const formattedMessages: any = JSON.parse(messageContent);

    console.log(formattedMessages, 'formattedMessages');

    console.log(formattedMessages, 'formattedMessages');
    // Check if study guide already exists
    const existingStudyGuide = await db.select().from(studyGuide).where(eq(studyGuide.projectId, Number(projectId)));
    
    if (existingStudyGuide.length > 0) {
      // Delete existing study guide
      await db.delete(studyGuide).where(eq(studyGuide.projectId, Number(projectId)));
    }

    const newStudyGuide = await db.insert(studyGuide).values({
      title: formattedMessages.title,
      projectId: Number(projectId),
      content: formattedMessages.studyGuide,
      createdAt: new Date(),
      userId: !isGuest ? userId : null,
      guestId: isGuest ? userId : null
    } as any).returning();

    return newStudyGuide;
  } catch (error: any) {
    console.log('Fail to create cheat sheet ', error);
    return { error: error.message };
  }
};
