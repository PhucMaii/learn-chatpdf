import {
  generateGuestSessionId,
  generateSessionSignature,
  sessionOptions,
} from '@/utils/session';
import { NextResponse } from 'next/server';
import { withIronSession } from 'next-iron-session';

// export default async function POST(req: Request) {
//     try {
//         const password: string | undefined = process.env.TOKEN_SECRET;

//         if (!password) {
//             return NextResponse.json({ error: 'Token Secret not found in environment variables' }, { status: 500 });
//         }

//         const guestSessionId = generateGuestSessionId();
//     } catch (error: any) {
//         console.log('Fail to post session: ', error);
//         return NextResponse.json(
//             { error: 'Fail to post session: ' + error },
//             { status: 500 },
//         );
//     }
// }

const handler = async () => {
    try {
        const password: string | undefined = process.env.TOKEN_SECRET;
    
        if (!password) {
          return NextResponse.json(
            { error: 'Token Secret not found in environment variables' },
            { status: 500 },
          );
        }
    
        const guestSessionId = generateGuestSessionId();
    
        const guestSessionSignature = generateSessionSignature(guestSessionId);
    
        return NextResponse.json(
          { guestSessionId, guestSessionSignature },
          { status: 200 },
        );
      } catch (error: any) {
        console.log('Fail to post session: ', error);
        return NextResponse.json(
          { error: 'Fail to post session: ' + error },
          { status: 500 },
        );
      }
}

export const POST = withIronSession(handler, sessionOptions);
