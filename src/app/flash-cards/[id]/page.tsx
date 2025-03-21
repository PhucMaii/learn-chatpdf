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
  const [flashCardSet, setFlashCardSet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { id } = useParams();

  const [flashCards, _mutate, isValidating] = SWRFetchData(
    `/api/flashcard-set/get?id=${id}`,
  );

  useEffect(() => {
    if (flashCards) {
      setFlashCardSet(flashCards.flashCardSetsWithChatsAndFlashCards[0]);
      setIsLoading(false);
    }

    if (!isValidating && !flashCards) {
      window.location.href = '/flash-cards';
    }
  }, [flashCards, isValidating]);

  return (
    <SidebarWrapper>
      <div className="flex flex-col items-center justify-center">
        {/* <div className="flex items-center justify-start ÷÷"> */}
          <h4 className="font-semibold text-3xl text-left mt-4">{flashCardSet?.title}</h4>
        {/* </div> */}

        {isLoading ? (
          <LoadingComponent />
        ) : (
          flashCardSet && (
            <FlashCardTrack flashCards={flashCardSet?.flashCards || []} />
          )
        )}
        {/* <FlashCardEdit flashCardSet={flashCardSet}/> */}
      </div>
    </SidebarWrapper>
  );
}
