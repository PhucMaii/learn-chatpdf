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
import { Button } from '@/components/ui/button';
import { TableOfContents } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';

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
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isSmDown, setIsSmDown] = useState(false);
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState<boolean>(false);
  const router = useRouter();

  const [chats] = SWRFetchData(`${API_URL.USER}/chats`);

  useEffect(() => {
    const checkScreenSize = () => setIsSmDown(window.innerWidth < 640);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
      // if (currentChat.flashCards && currentChat.flashCards.length > 0) {
      // } else {
      //   generateFlashCards();
      // }
      setIsInitializing(false);
      setChat(currentChat);
      setUserChatList(chats?.groupedChatByDate);
    }
  }, [chats]);

  useEffect(() => {
    if (chatId) {
      udpateOpenChat();
    }
  }, [chatId]);

  // const generateFlashCards = async () => {
  //   setIsInitializing(true);
  //   try {
  //     const response = await axios.post('/api/flash-cards', { chatId });

  //     if (response.data.error) {
  //       toast.error('Fail to generate flash cards');
  //       return;
  //     }

  //     setFlashCards(response.data.data);
  //     return response.data.data;
  //   } catch (error: any) {
  //     console.log(error);
  //     toast.error('Fail to generate flash cards');
  //   } finally {
  //     setIsInitializing(false);
  //   }
  // }

  const udpateOpenChat = async () => {
    try {
      const responnse = await axios.post(`${API_URL.USER}/chats/open`, {
        chatId,
      });

      if (responnse.data.error) {
        toast.error('Something went wrong');
        return;
      }
    } catch (error: any) {
      console.log('There was an error in updating open chat: ', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <>
      <Sheet open={isChatSidebarOpen} onOpenChange={setIsChatSidebarOpen}>
        <SheetContent
          side="left"
          className="flex flex-col h-full w-full max-w-xs border-r-1 border-1-slate-200"
        >
          <ChatSidebar
            chats={userChatlist}
            chatId={parseInt(chatId)}
            subscription={subscription}
          />
        </SheetContent>
      </Sheet>
      <div className="flex flex-col max-h-screen">
        {isSmDown && (
          <div>
            <Button
              variant="ghost"
              className="h-fit"
              onClick={() => setIsChatSidebarOpen(true)}
            >
              <TableOfContents style={{ width: '24px', height: '24px' }} />
            </Button>
          </div>
        )}
        <div className="flex flex-col-reverse md:flex-row w-full max-h-screen">
          {/* Chats sidebar */}
          {!isSmDown && (
            <div className="flex-1 max-w-xs border-r-1">
              <ChatSidebar
                chats={userChatlist}
                chatId={parseInt(chatId)}
                subscription={subscription}
              />
            </div>
          )}
          {isLoading || isInitializing ? (
            <LoadingComponent />
          ) : (
            <>
              {/* chat component */}
              <div className="max-h-screen overflow-scroll flex-3 border-1-4 border-1-slate-200">
                <InteractiveComponent
                  chatId={parseInt(chatId)}
                  subscription={subscription}
                  flashCards={flashCards}
                />
              </div>
              {/* pdf viewer */}
              <div className="max-h-screen p-4 overflow-scroll flex-1 md:flex-2">
                <PDFViewer pdfUrl={chat?.pdfUrl || ''} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
