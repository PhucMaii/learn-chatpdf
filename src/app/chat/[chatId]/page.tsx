import ChatComponent from '@/components/ChatComponent';
import ChatSidebar from '@/components/ChatSidebar';
import PDFViewer from '@/components/PDFViewer';
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

    const currentChat = _chats.find(chat => chat.id === parseInt(chatId));
    
    console.log(currentChat);
  return (
   <div className="flex max-h-screen overflow-scroll">
        <div className="flex w-full max-h-screen overflow-scroll">
            {/* Chats sidebar */}
            <div className="flex-[1] max-w-xs">
                <ChatSidebar chats={_chats} chatId={parseInt(chatId)} />
            </div>
            {/* pdf viewer */}
            <div className="max-h-screen p-4 overflow-scroll flex-[5]">
                <PDFViewer pdfUrl={currentChat?.pdfUrl || ''} />
            </div>
            {/* chat component */}
            <div className="flex-[3] border-1-4 border-1-slate-200">
                <ChatComponent chatId={parseInt(chatId)} />
            </div>
        </div>
    </div>
  )
}

export default Chat;