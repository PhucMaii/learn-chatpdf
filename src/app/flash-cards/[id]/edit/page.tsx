'use client';
import FlashCardEdit from '@/components/FlashCard/FlashCardEdit';
import SidebarWrapper from '@/components/SidebarWrapper';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
// import { SWRFetchData } from '../../../../../hooks/useSWRFetch';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function EditCardPage() {
  const [flashCardSet, setFlashCardSet] = useState<any>(null);
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchFlashCardSet = async () => {
      try {
        const response = await axios.get(`/api/flashcard-set/get?id=${id}`);

        if (response.data.error) {
          toast.error('Something went wrong in fetching flash card sets');
          // setIsLoading(false);
          return;
        }

        if (!response.data.flashCardSetsWithChatsAndFlashCards.length) {
          window.location.href = '/flash-cards';
          return;
        }

        setFlashCardSet(response.data.flashCardSetsWithChatsAndFlashCards[0]);
        // setIsLoading(false);
      } catch (error: any) {
        console.log(error);
        toast.error('Something went wrong in fetching flash card sets');
        // setIsLoading(false);
      }
    };

    fetchFlashCardSet();
    // const data = await response.json();x
    // setFlashCardSet(data.flashCardSetsWithChatsAndFlashCards[0]);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [flashCards, _mutate, isValidating] = SWRFetchData(
  //   `/api/flashcard-set/get?id=${id}`,
  // );

  // useEffect(() => {
  //   if (flashCards) {
  //     setFlashCardSet(flashCards.flashCardSetsWithChatsAndFlashCards[0]);
  //     // setIsLoading(false);
  //   }

  //   if (!isValidating && !flashCards) {
  //     window.location.href = '/flash-cards';
  //   }
  // }, [flashCards, isValidating]);
  return (
    <SidebarWrapper>
      <FlashCardEdit flashCardSet={flashCardSet} />
    </SidebarWrapper>
  );
}
