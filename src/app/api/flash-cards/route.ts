import { Configuration, OpenAIApi } from 'openai-edge';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { chats, flashCard } from '@/lib/db/schema';
import { withAuthGuard } from '@/utils/guard';
import { auth } from '@clerk/nextjs/server';
import { createFlashCards } from '../create-chat/route';

export const runtime = 'nodejs';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(config);

export const flashCardPrompt = `You are an AI assistant specializing in generating flashcards for students. 
Your task is to generate **up to 20** high-quality flashcards in JSON format based on the provided document.

### **Instructions:**
- Each flashcard must be **strictly derived** from the document.
- If the content is insufficient, limit the number of flashcards accordingly.
- Ensure that the JSON output follows **exactly** the structure provided below.
- **Do not include explanations or extra information outside of this JSON format.** 

### **JSON Format (Example Output)**
{
  "title": "Document Title",
  "flashcards": [
    {
      "question": "What is [key topic]?",
      "answer": "[Concise and accurate answer]"
    },
    {
      "question": "How does [concept] work?",
      "answer": "[Detailed but clear explanation]"
    }
  ]
}

### **Additional Requirements:**
- **Title**: Extracted from the document or provide a short, relevant summary.
- **Questions**: Must be **concise**, relevant, and challenging.
- **Answers**: Must be **precise and directly supported** by the document.
- **Tone**: Professional, suitable for college-level students.
- **Format**: **Must always be valid JSON.** No additional commentary.

### **Output Guidelines:**
- **DO NOT** include markdown.
- **DO NOT** add an introduction or summary.
- **ONLY** return a valid JSON object.
  
Topic: **Questions and Answers**
Style: **Academic**
Tone: **Professional**
Audience: **20-year-old college students** 
Expected JSON Word Count: **500 words max**.
`;


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

    const formattedMessages = await createFlashCards(fileKey, chatId, userId);
    return NextResponse.json({ data: formattedMessages.flashcards });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
    });
  }
};

export const POST = withAuthGuard(handler);

// PUT
const putHandler = async (req: Request) => {
  try {
    const { id, newFlashCard } = await req.json();

    const existingFlashCard = await db
      .select()
      .from(flashCard)
      .where(eq(flashCard.id, id));

    if (existingFlashCard.length === 0) {
      return NextResponse.json(
        { error: 'Flash card not found' },
        { status: 404 },
      );
    }

    const updatedFlashCard = await db
      .update(flashCard)
      .set(newFlashCard)
      .where(eq(flashCard.id, id))
      .returning();

    return NextResponse.json({
      data: updatedFlashCard[0],
      message: 'Flash card updated successfully',
    });
  } catch (error: any) {
    console.log('Internal Server Error: ', error);

    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
};

export const PUT = withAuthGuard(putHandler);

const deleteHandler = async (req: Request) => {
  try {
    const { id } = await req.json();

    const existingFlashCard = await db
      .select()
      .from(flashCard)
      .where(eq(flashCard.id, id));

    if (existingFlashCard.length === 0) {
      return NextResponse.json(
        { error: 'Flash card not found' },
        { status: 404 },
      );
    }

    await db.delete(flashCard).where(eq(flashCard.id, id));
    return NextResponse.json({ message: 'Flash card deleted successfully' });
  } catch (error: any) {
    console.log('Internal Server Error: ', error);

    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
};

export const DELETE = withAuthGuard(deleteHandler);
