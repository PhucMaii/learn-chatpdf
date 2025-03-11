'use client';
import ChatSidebar from '@/components/ChatSidebar';
import PDFViewer from '@/components/PDFViewer';
import { DrizzleChat } from '@/lib/db/schema';
import { checkSubscription } from '@/lib/subscription';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { API_URL } from '@/lib/type';
import LoadingComponent from '@/components/LoadingComponent';
import { useRouter } from 'next/navigation';
import InteractiveComponent from '@/components/InteractiveComponent';
import { DrizzleFlashCard } from '@/lib/db/drizzleType';
import { SWRFetchData } from '../../../../hooks/useSWRFetch';
import axios from 'axios';

type Props = {
  params: {
    chatId: string;
  };
};

const Chat = ({ params: { chatId } }: Props) => {
  const [chat, setChat] = useState<DrizzleChat | null>(null);
  const [flashCards, setFlashCards] = useState<DrizzleFlashCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [subscription, setSubscription] = useState<any>({});
  const [userChatlist, setUserChatList] = useState<DrizzleChat[]>([]);
  const router = useRouter();

  const [chats] = SWRFetchData(`${API_URL.USER}/chats`);

  useEffect(() => {
    const checkIsPro = async () => {
      setIsLoading(true);
      const fetchedSubscription = await checkSubscription();

      setSubscription(fetchedSubscription);

      if (
        !fetchedSubscription?.isAbleToAddMoreChats &&
        !fetchedSubscription?.isPro &&
        !fetchedSubscription?.isTrial
      ) {
        router.push('/pricing');
        return;
      }
      setIsLoading(false);
    };

    checkIsPro();
  }, []);

  useEffect(() => {
    if (chats) {
      const currentChat = chats?.data[chatId];
      if (!currentChat) {
        toast.error('Uh uh, you are not allowed to access this chat');
        window.location.href = '/chats';
        return;
      }
      setFlashCards(currentChat.flashCards);
      setChat(currentChat);
      setUserChatList(chats?.groupedChatByDate);
    }
  }, [chats]);

  useEffect(() => {
    if (chatId) {
      udpateOpenChat();
    }
  }, [chatId]);

  const udpateOpenChat = async () => {
    try {
      const responnse = await axios.post(
        `${API_URL.USER}/chats/open`, {chatId});

      if (responnse.data.error) {
        toast.error('There was an error in updating open chat: ' + responnse.data.error);
        return;
      }

    } catch (error: any) {
      console.log('There was an error in updating open chat: ', error);
      toast.error('There was an error in updating open chat: ' + error.message);
    }
  }

  return (
    <div className="flex max-h-screen">
      <div className="flex w-full max-h-screen">
        {/* Chats sidebar */}
        <div className="flex-1 max-w-xs border-r-8 border-1-slate-200">
          <ChatSidebar
            chats={userChatlist}
            chatId={parseInt(chatId)}
            subscription={subscription}
          />
        </div>
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <>
            {/* pdf viewer */}
            <div className="max-h-screen p-4 overflow-scroll flex-5">
              <PDFViewer pdfUrl={chat?.pdfUrl || ''} />
            </div>
            {/* chat component */}
            <div className="max-h-screen overflow-scroll flex-5 border-1-4 border-1-slate-200">
              <InteractiveComponent
                chatId={parseInt(chatId)}
                subscription={subscription}
                flashCards={flashCards}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
