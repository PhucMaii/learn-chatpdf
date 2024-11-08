'use client';
import FlashCardTrack from '@/components/FlashCard/FlashCardTrack';
import SidebarWrapper from '@/components/SidebarWrapper';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SWRFetchData } from '../../../../hooks/useSWRFetch';
import LoadingComponent from '@/components/LoadingComponent';

export default function FlashCardPage() {
  const [flashCardSets, setFlashCardSets] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { id } = useParams();

  const [flashCards] = SWRFetchData(`/api/flashcard-set/get?id=${id}`);

  useEffect(() => {
    if (flashCards) {
      setFlashCardSets(flashCards.flashCardSetsWithChatsAndFlashCards[0]);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [flashCards]);

  // const fetchFlashcardSet = async () => {
  //   try {
  //     const response = await axios.get(`/api/flashcard-set/get?id=${id}`);

  //     if (response.data.error) {
  //       toast.error('Error fetching flash card sets: ' + response.data.error);
  //       return;
  //     }

  //     setFlashCardSets(response.data.flashCardSetsWithChatsAndFlashCards[0]);
  //   } catch (error: any) {
  //     console.log(error);
  //     toast.error('Error fetching flash card sets: ' + error.message);
  //   }
  // };

  return (
    <SidebarWrapper>
      <div className="flex flex-col items-center justify-center">
        {/* <FlashCard flashCard={flashCardSets?.flashCards[currentCardIndex]}  /> */}
        {isLoading ? (<LoadingComponent />) : flashCardSets && (
          <FlashCardTrack
            flashCards={flashCardSets?.flashCards || []}
            // flashCardData={flashCardSets?.flashCards || []}
            // setCurrentIndex={setCurrentCardIndex}
            // currentIndex={currentCardIndex}
          />
        )}
      </div>
    </SidebarWrapper>
  );
}
