'use client';
import FlashCardEdit from '@/components/FlashCard/FlashCardEdit';
import SidebarWrapper from '@/components/SidebarWrapper';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SWRFetchData } from '../../../../../hooks/useSWRFetch';

export default function EditCardPage() {
  const [flashCardSet, setFlashCardSet] = useState<any>(null);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  const { id } = useParams();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [flashCards, _mutate, isValidating] = SWRFetchData(
    `/api/flashcard-set/get?id=${id}`,
  );

  useEffect(() => {
    if (flashCards) {
      setFlashCardSet(flashCards.flashCardSetsWithChatsAndFlashCards[0]);
      // setIsLoading(false);
    }

    if (!isValidating && !flashCards) {
      window.location.href = '/flash-cards';
    }
  }, [flashCards, isValidating]);
  return (
    <SidebarWrapper>
      <FlashCardEdit flashCardSet={flashCardSet} />
    </SidebarWrapper>
  );
}
