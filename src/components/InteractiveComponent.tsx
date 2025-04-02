'use client';
import React, { useState } from 'react';
import { Message, useChat } from 'ai/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ChatComponent from './ChatComponent';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import FlashCardsTab from './FlashCard/FlashCardsTab';
import { SubscriptionType } from '@/lib/type';
import { CrownIcon } from 'lucide-react';
import { DrizzleFlashCard } from '@/lib/db/drizzleType';
import useLocalStorage from '../../hooks/useLocalStorage';

type Props = {
  chatId: number;
  subscription: SubscriptionType;
  flashCards: DrizzleFlashCard[];
};

const InteractiveComponent = ({ chatId, subscription, flashCards }: Props) => {
  const [language, setLanguage] = useState<string>('English');
  const [guestSession] = useLocalStorage('guest-session', {});

  const { data, isLoading } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>(
        `/api/get-messages?guestSessionId=${guestSession?.sessionId}`,
        {
          chatId,
        },
      );
      return response.data;
    },
  });
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: `/api/chat?guestSessionId=${guestSession?.sessionId}`,
    body: {
      chatId,
      language,
      isAnswerOutOfContext: false,
    },
    initialMessages: data || [],
  });

  return (
    <div className="relative flex flex-col" id="message-container">
      <Tabs defaultValue="chat" className="w-full p-4">
        <TabsList className="w-full flex justify-center">
          <TabsTrigger
            value="chat"
            className="flex-1 text-center text-lg data-[state=active]:text-emerald-500 data-[state=active]:border-emerald-500 border-b-2 border-gray-100 hover:bg-gray-300 active:scale-90 transition-all duration-300"
          >
            Chat
          </TabsTrigger>
          <TabsTrigger
            disabled={!subscription?.isPro && !subscription?.isTrial}
            value="flash-cards"
            className="flex-1 text-center text-lg data-[state=active]:text-emerald-500 data-[state=active]:border-emerald-500 border-b-2 border-gray-100 hover:bg-gray-300 active:scale-90 transition-all duration-300"
          >
            Flash Cards{' '}
            {!subscription?.isPro && !subscription?.isTrial && (
              <CrownIcon className="w-4 h-4 text-yellow-600" />
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <ChatComponent
            messages={messages}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            input={input}
            language={language}
            setLanguage={setLanguage}
          />
        </TabsContent>
        <TabsContent value="flash-cards">
          <FlashCardsTab chatId={chatId} flashCards={flashCards} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractiveComponent;
