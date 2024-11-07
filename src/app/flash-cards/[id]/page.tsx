'use client';
import FlashCardTrack from '@/components/FlashCard/FlashCardTrack';
import SidebarWrapper from '@/components/SidebarWrapper';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SWRFetchData } from '../../../../hooks/useSWRFetch';

export default function FlashCardPage() {
  const [flashCardSets, setFlashCardSets] = useState<any>(null);

  const { id } = useParams();

  const [flashCards] = SWRFetchData(`/api/flashcard-set/get?id=${id}`);

  console.log(flashCards, 'flashCards');
  useEffect(() => {
    if (flashCards) {
      setFlashCardSets(flashCards.flashCardSetsWithChatsAndFlashCards[0]);
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
        {flashCardSets && (
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
