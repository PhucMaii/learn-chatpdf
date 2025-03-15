/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import FlashCardTrack from '@/components/FlashCard/FlashCardTrack';
import SidebarWrapper from '@/components/SidebarWrapper';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SWRFetchData } from '../../../../hooks/useSWRFetch';
import LoadingComponent from '@/components/LoadingComponent';
import FlashCardEdit from '@/components/FlashCard/FlashCardEdit';

export default function FlashCardPage() {
  const [flashCardSets, setFlashCardSets] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { id } = useParams();

  const [flashCards, _mutate, isValidating] = SWRFetchData(`/api/flashcard-set/get?id=${id}`);

  useEffect(() => {
    if (flashCards) {
      setFlashCardSets(flashCards.flashCardSetsWithChatsAndFlashCards[0]);
      setIsLoading(false);
    }

    if (!isValidating && !flashCards) {
      window.location.href = '/flash-cards';
    }
  }, [flashCards, isValidating]);

  return (
    <SidebarWrapper>
      <div className="flex flex-col items-center justify-center">
        {isLoading ? (<LoadingComponent />) : flashCardSets && (
          <FlashCardTrack
            flashCards={flashCardSets?.flashCards || []}
          />
        )}
        {/* <FlashCardEdit /> */}
      </div>
    </SidebarWrapper>
  );
}
