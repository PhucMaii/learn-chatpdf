import { getContext } from '@/lib/context';
import { DrizzleMedia } from '@/lib/db/drizzleType';
import { studyGuidePrompt, generatePrompt } from '@/lib/prompt';
import { db } from '@/lib/db';
import { studyGuide } from '@/lib/db/schema';
import { openai } from './openai';

export const createStudyGuide = async (
  medias: DrizzleMedia[],
  projectId: number,
  userId: string,
  isGuest: boolean,
) => {
  try {
    const context = await getContext(studyGuidePrompt, medias);

    const prompt: any = generatePrompt(context, 'English', false);

    const response = await openai.createChatCompletion({
        model: 'gpt-4o-mini',
        messages: [
            prompt,
            {
                role: 'user',
                content: studyGuidePrompt
            }
        ]
    });

    const completionData = await response.json();
    // const jsonData = completionData.choices[0].message;
    console.log(completionData.choices[0].message, 'completionData');

    const formattedMessages: any = JSON.parse(completionData.choices[0].message.content);

    console.log(formattedMessages, 'formattedMessages');

    // const cleanedContent = formattedMessages.content.replaceAll('\\n', '\n');

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
