import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
    params: {
        chatId: string;
    }
}

const Chat = async ({params: {chatId}}: Props) => {
    const { userId} = auth();

    if (!userId) {
        return redirect('/sign-in');
    }

    const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

    if (!_chats) {
        return redirect('/');
    }

    if (!_chats.find(chat => chat.id === parseInt(chatId))) {
        return redirect('/');
    }
  return (
   <div className="flex max-h-screen overflow-scroll">
        <div className="flex w-full max-h-screen overflow-scroll">
            {/* Chats sidebar */}
            <div className="flex-[1] max-w-xs">
                <ChatSidebar />
            </div>
            {/* pdf viewer */}
            <div className="max-h-screen p-4 overflow-scroll flex-[5]">

            </div>
            {/* chat component */}
            <div className="flex-[3] border-1-4 border-1-slate-200">

            </div>
        </div>
    </div>
  )
}

export default Chat;