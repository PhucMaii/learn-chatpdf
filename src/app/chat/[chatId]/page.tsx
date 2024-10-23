import ChatComponent from '@/components/ChatComponent';
import ChatSidebar from '@/components/ChatSidebar';
import PDFViewer from '@/components/PDFViewer';
import { db } from '@/lib/db';
import { chats, DrizzleChat } from '@/lib/db/schema';
import { checkSubscription } from '@/lib/subscription';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { UserContext } from '../../../../context/UserProvider';
import toast from 'react-hot-toast';

type Props = {
  params: {
    chatId: string;
  };
};

const Chat = ({ params: { chatId } }: Props) => {
  const [chat, setChat] = useState<DrizzleChat | null>(null);
  const { user }: any = useContext(UserContext);
  // const { userId } = auth();
  // const isPro = await checkSubscription();

  if (!user) {
    return redirect('/sign-in');
  }

  // const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  // if (!_chats) {
  //   return redirect('/');
  // }

  // if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
  //   return redirect('/');
  // }

  // const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  // // Update last opened
  // await db
  //   .update(chats)
  //   .set({ lastOpenedAt: new Date() })
  //   .where(eq(chats.id, parseInt(chatId)));

  const fetchChat = async () => {
    try {
      const response = await 
    } catch (error: any) {
      console.log('Internal Server Error: ', error);
      toast.error('Internal Server Error: ' + error.message);
    }
  }

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* Chats sidebar */}
        <div className="flex-[1] max-w-xs border-r-8 border-1-slate-200">
          <ChatSidebar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
        </div>
        {/* pdf viewer */}
        <div className="max-h-screen p-4 overflow-scroll flex-[5]">
          <PDFViewer pdfUrl={currentChat?.pdfUrl || ''} />
        </div>
        {/* chat component */}
        <div className="flex-[5] border-1-4 border-1-slate-200">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
