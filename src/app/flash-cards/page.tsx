'use client';
import FlashCardSet from '@/components/FlashCard/FlashCardSet';
import LoadingComponent from '@/components/LoadingComponent';
import SidebarWrapper from '@/components/SidebarWrapper';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const FlashCardsPage = () => {
  const [flashCardSetsWithChats, setFlashCardSetsWithChats] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    handleGetFlashCardSets();
  }, []);

  const handleGetFlashCardSets = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/flashcard-set/get');

      if (response.data.error) {
        toast.error('Something went wrong in fetching flash card sets');
        setIsLoading(false);
        return;
      }

      setFlashCardSetsWithChats(
        response.data.flashCardSetsWithChatsAndFlashCards,
      );

      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      toast.error('Something went wrong in fetching flash card sets');
      setIsLoading(false);
    }
  };

  return (
    <SidebarWrapper>
      <h1 className="text-3xl font-bold ">Flash Cards</h1>
      <h6 className="text-md font-bold text-gray-400">
        Enhanced reading and learning experience with flash cards
      </h6>

      <div className="flex flex-col gap-4 mt-8 flex-wrap">
        {isLoading ? (
          <LoadingComponent />
        ) : (
          flashCardSetsWithChats.length > 0 &&
          flashCardSetsWithChats.map(
            (flashCardSetsWithChat: any, index: number) => {
              return (
                <FlashCardSet
                  flashCardSetWithChat={flashCardSetsWithChat}
                  key={index}
                  onClick={() =>
                    router.push(`/flash-cards/${flashCardSetsWithChat.id}`)
                  }
                />
              );
            },
          )
        )}
      </div>
    </SidebarWrapper>
  );
};

export default FlashCardsPage;
