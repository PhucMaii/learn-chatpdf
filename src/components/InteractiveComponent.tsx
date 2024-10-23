'use client';
import React from 'react';
import { Message, useChat } from 'ai/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ChatComponent from './ChatComponent';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import FlashCardsTab from './FlashCard/FlashCardsTab';

type Props = { chatId: number };

const InteractiveComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>('/api/get-messages', {
        chatId,
      });
      return response.data;
    },
  });
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: '/api/chat',
    body: {
      chatId,
    },
    initialMessages: data || [],
  });

  return (
    <div
      className="relative h-screen oveflow-y-scroll flex flex-col"
      id="message-container"
    >
      <Tabs defaultValue="chat" className="w-full p-4">
        <TabsList className="w-full flex justify-center">
          <TabsTrigger value="chat"  className="flex-1 text-center">Chat</TabsTrigger>
          <TabsTrigger value="flash-cards" className="flex-1 text-center">Flash Cards</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <ChatComponent messages={messages} isLoading={isLoading} handleSubmit={handleSubmit} handleInputChange={handleInputChange} input={input} />
        </TabsContent>
        <TabsContent value="flash-cards">
          <FlashCardsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractiveComponent;