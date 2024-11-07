import { db } from '@/lib/db';
import { flashCard } from '@/lib/db/schema';
import { withAuthGuard } from '@/utils/guard';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

interface IBody {
  flashCards: {
    id: number;
    isKnown: number;
  }[];
}

const handler = async (req: Request) => {
  try {
    const { flashCards }: IBody = await req.json(); // In format: [{ id: 1, isKnown: 1 }, { id: 2, isKnown: 0 }]

    const cases = flashCards
      .map((flashCard) => {
        return `WHEN id = ${flashCard.id} THEN ${flashCard.isKnown}`;
      })
      .join(' ');

    const ids = flashCards.map((flashCard) => {
      return flashCard.id;
    });

    const updateQuery = sql`
            UPDATE ${flashCard}
            SET is_known = CASE 
                ${sql.raw(cases)} 
                ELSE is_known 
            END
            WHERE id IN (${sql.join(ids, sql`, `)});
        `;

    await db.execute(updateQuery);

    return NextResponse.json({ message: 'Flash cards updated successfully' });
  } catch (error: any) {
    console.log('Internal Server Error: ', error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error },
      { status: 500 },
    );
  }
};

export const PUT = withAuthGuard(handler);
