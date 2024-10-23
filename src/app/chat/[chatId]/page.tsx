'use client';
import ChatComponent from '@/components/ChatComponent';
import ChatSidebar from '@/components/ChatSidebar';
import PDFViewer from '@/components/PDFViewer';
import { DrizzleChat } from '@/lib/db/schema';
import { checkSubscription } from '@/lib/subscription';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '@/lib/type';
import LoadingComponent from '@/components/LoadingComponent';
import { useRouter } from 'next/navigation';

type Props = {
  params: {
    chatId: string;
  };
};

const Chat = ({ params: { chatId } }: Props) => {
  const [chat, setChat] = useState<DrizzleChat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [subscription, setSubscription] = useState<any>({});
  const [userChatlist, setUserChatList] = useState<DrizzleChat[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchChats();
    const checkIsPro = async () => {
      setIsLoading(true);
      const fetchedSubscription = await checkSubscription();
      
      setSubscription(fetchedSubscription);

      if (!fetchedSubscription?.isAbleToAddMoreChats && !fetchedSubscription?.isPro && !fetchedSubscription?.isTrial) {
        router.push('/pricing');
        return;
      }
      setIsLoading(false);
    }

    checkIsPro();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${API_URL.USER}/chats`);

      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }

      const currentChat = response.data.chats.find((chat: DrizzleChat) => chat.id === parseInt(chatId));

      if (!currentChat) {
        toast.error('Chat not found');
        return;
      }
      
      setChat(currentChat);
      setUserChatList(response.data.chats);
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
          <ChatSidebar chats={userChatlist} chatId={parseInt(chatId)} subscription={subscription} />
        </div>
        {isLoading ? <LoadingComponent /> : 
        (
          <>
            {/* pdf viewer */}
          <div className="max-h-screen p-4 overflow-scroll flex-[5]">
            <PDFViewer pdfUrl={chat?.pdfUrl || ''} />
          </div>
          {/* chat component */}
          <div className="flex-[5] border-1-4 border-1-slate-200">
            <ChatComponent chatId={parseInt(chatId)} />
          </div>
          </>
      )}
      </div>
    </div>
  );
};

export default Chat;
