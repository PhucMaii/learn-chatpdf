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

const flashCardPrompt = `You are an AI assistant specializing in generating flashcards for students. 
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
            You are only allowed to answer questions strictly based on the CONTEXT BLOCK provided below.
            If the context does not provide an answer, you must explicitly say: "I'm sorry, but I don't know the answer to that question."
            You must not use external knowledge outside of the CONTEXT BLOCK.
            START CONTEXT BLOCK
            ${context}
            END CONTEXT BLOCK
            AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
            If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
            AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
            AI assistant will not invent anything that is not drawn directly from the context.
            `,
    };
    const response: any = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        prompt,
        {
          role: 'user',
          content: flashCardPrompt,
        },
      ],
    });
    console.log(response, 'response');
    const completionData = await response.json();
    console.log(completionData.choices, 'completiojn data');
    // const formattedMessages = JSON.parse(
    //   completionData.choices[0].message.content,
    // );

    const formattedMessages = JSON.parse(completionData.choices[0].message.content);
    console.log(formattedMessages);
    // Delete the current flash card set if there is any
    // const existingFlashCardSet = (await db
    //   .select()
    //   .from(flashCardSet)
    //   .where(eq(flashCardSet.chatId, Number(chatId)))) ?? [];

    // if (existingFlashCardSet.length > 0) {
    //   await db
    //   .delete(flashCardSet)
    //   .where(inArray(flashCardSet.id, existingFlashCardSet.map((set) => set.id)));
    // }

    const newFlashCardsSet = await db
      .insert(flashCardSet)
      .values({
        title: formattedMessages.title,
        chatId: chatId,
        createdAt: new Date(),
        userId: userId,
      })
      .returning();

    const flashCardList = formattedMessages.flashcards.map((question: any) => {
      return {
        question: question.question,
        answer: question.answer,
        createdAt: new Date(),
        chatId: chatId,
        flashCardSetId: newFlashCardsSet[0].id,
        userId: userId,
        isKnown: 0,
      };
    });

    // Save Flash Card into db
    await db.insert(flashCard).values(flashCardList);
    await db
      .update(chats)
      .set({ title: formattedMessages.title })
      .where(eq(chats.id, chatId));
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
