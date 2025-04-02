/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import FlashCardTrack from '@/components/FlashCard/FlashCardTrack';
import SidebarWrapper from '@/components/SidebarWrapper';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SWRFetchData } from '../../../../hooks/useSWRFetch';
import LoadingComponent from '@/components/LoadingComponent';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function FlashCardPage() {
  const [flashCardSet, setFlashCardSet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { id } = useParams();

  // const [flashCards, _mutate, isValidating] = SWRFetchData(
  //   `/api/flashcard-set/get?id=${id}`,
  // );

  useEffect(() => {
    const fetchFlashCardSet = async () => {
      try {
        const response = await axios.get(`/api/flashcard-set/get?id=${id}`);

        if (response.data.error) {
          toast.error('Something went wrong in fetching flash card sets');
          setIsLoading(false);
          return;
        }

        if (!response.data.flashCardSetsWithChatsAndFlashCards.length) {
          window.location.href = '/flash-cards';
          return;
        }

        setFlashCardSet(response.data.flashCardSetsWithChatsAndFlashCards[0]);
        setIsLoading(false);
      } catch (error: any) {
        console.log(error);
        toast.error('Something went wrong in fetching flash card sets');
        setIsLoading(false);
      }
    };

    fetchFlashCardSet();
    // const data = await response.json();x
    // setFlashCardSet(data.flashCardSetsWithChatsAndFlashCards[0]);
  }, []);

  // useEffect(() => {
  //   if (flashCards) {
  //     setFlashCardSet(flashCards.flashCardSetsWithChatsAndFlashCards[0]);
  //     setIsLoading(false);
  //   }

  //   if (!isValidating && !flashCards) {
  //     window.location.href = '/flash-cards';
  //   }
  // }, [flashCards, isValidating]);

  return (
    <SidebarWrapper>
      <div className="flex flex-col items-center justify-center">
        {/* <div className="flex items-center justify-start ÷÷"> */}
        <h4 className="font-semibold text-3xl text-left mt-4">
          {flashCardSet?.title}
        </h4>
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
