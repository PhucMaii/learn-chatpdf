import { db } from '@/lib/db';
import { DrizzleFlashCard } from '@/lib/db/drizzleType';
import { flashCard, flashCardSet } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { NextResponse } from 'next/server';

interface IBody {
  id: number;
  title: string;
  flashcards: DrizzleFlashCard[];
}

const PUT = async (req: Request) => {
  try {
    const { id, title, flashcards }: IBody = await req.json();

    const existingFlashCardSet = await db
      .select()
      .from(flashCardSet)
      .where(eq(flashCardSet.id, id));

    if (existingFlashCardSet.length === 0) {
      return NextResponse.json(
        { error: 'Flash card set not found' },
        { status: 404 },
      );
    }

    const cardSet = existingFlashCardSet[0];

    // Check is title different
    if (cardSet.title !== title) {
      await db
        .update(flashCardSet)
        .set({ title })
        .where(eq(flashCardSet.id, id))
        .returning();
    }

    const dbCards = await db
      .select()
      .from(flashCard)
      .where(eq(flashCard.flashCardSetId, id));

    console.log('dbCards', dbCards);
    console.log(flashcards)

    let trackDeletedCard = [...dbCards];
    // Categorize flashcard to ADD, UPDATE AND DELETE
    for (const card of flashcards) {
      const dbCard = dbCards.find((dbCard) => dbCard.id === card?.id);
      if (!dbCard) {
        const newCard: any = {
          question: card.question, // This should not cause a type error
          answer: card.answer,
          isKnown: 0,
          chatId: flashCardSet.chatId,
          userId: flashCardSet.userId,
          flashCardSetId: id,
        };
        await db.insert(flashCard).values(newCard);
      } else {
        if (
          dbCard.question !== card.question ||
          dbCard.answer !== card.answer
        ) {
          await db
            .update(flashCard)
            .set({ question: card.question, answer: card.answer })
            .where(eq(flashCard.id, card.id));
        }
        // Remove just updated card in deleted array
        trackDeletedCard = trackDeletedCard.filter(
          (card) => card.id !== dbCard.id,
        );
      }
    }

    // Delete flash cards
    // if (trackDeletedCard.length > 0) {
    //   const deletedIds = trackDeletedCard.map((flashcard) => flashcard.id);
    //   await db.delete(flashCard).where(inArray(flashCard.id, deletedIds));
    // }

    // Update flash cards
    // if (flashcards.length > 0) {
    //   const deletedIds = flashcards.map((flashcard) => flashcard.id);
    //   await db.delete(flashCard).where(inArray(flashCard.id, deletedIds));
    //   await db.insert(flashCard).values(flashcards);
    // }

    return NextResponse.json(
      { message: 'Flash card set updated successfully' },
      { status: 200 },
    );
  } catch (error: any) {
    console.log('There was an error: ', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
};

export default PUT;
