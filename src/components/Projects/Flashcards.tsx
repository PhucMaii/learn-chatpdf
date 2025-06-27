'use client';
import React, { useEffect, useState } from 'react';
import FlashCardTrack from '../FlashCard/FlashCardTrack';
import { DrizzleFlashCard } from '@/lib/db/drizzleType';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams } from 'next/navigation';
import LoadingComponent from '../LoadingComponent';
import EmptyDisplay from '../EmptyDisplay';
import { Button } from '../ui/button';
import FlashCardEdit from '../FlashCard/FlashCardEdit';
import useLocalStorage from '../../../hooks/useLocalStorage';
import Image from 'next/image';
import GeneratingDisplay from '../GeneratingDisplay';

interface IProps {
  loading: boolean;
}

export default function Flashcards({ loading }: IProps) {
  const { id: projectId } = useParams() ?? { id: null };
  console.log(loading, 'loading');

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [flashcards, setFlashcards] = useState<DrizzleFlashCard[]>([]);
  const [flashCardSet, setFlashCardSet] = useState<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [guestSession, setGuestSession, isInitialized] = useLocalStorage(
    'guest-session',
    {},
  );

  useEffect(() => {
    if (isInitialized) {
      fetchFlashcards();
      fetchFlashCardSet();
    }

    if (!loading && flashcards.length === 0) {
      fetchFlashcards();
    }
  }, [isInitialized, loading]);

  const fetchFlashCardSet = async () => {
    try {
      const response = await axios.get(
        `/api/flashcard-set/get?projectId=${projectId}&guestSessionId=${guestSession?.sessionId}`,
      );

      setFlashCardSet(response.data.flashCardSetsWithChatsAndFlashCards[0]);
      // setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      toast.error('Something went wrong in fetching flash card sets');
      // setIsLoading(false);
    }
  };

  // const data = await response.json();x

  const fetchFlashcards = async () => {
    try {
      const response = await axios.get(
        `/api/flash-cards/get?projectId=${projectId}&guestSessionId=${guestSession?.sessionId}`,
      );

      // if (response.data.error) {
      //   toast.error('Something went wrong in fetching flash card sets');
      //   return;
      // }

      // if (!response.data.flashCardSetsWithChatsAndFlashCards.length) {
      //   window.location.href = '/flash-cards';
      //   return;
      // }

      setFlashcards(response.data.flashcards);
    } catch (error: any) {
      console.log('There was an error in fetching flashcards: ', error);
      toast.error('Something went wrong in fetching flashcards');
    } finally {
      setIsLoading(false);
    }
  };

  const generateFlashCards = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(
        `/api/flash-cards?guestSessionId=${guestSession?.sessionId}`,
        { projectId },
      );

      if (response.data.error) {
        toast.error('Fail to generate flash cards');
        return;
      }

      await fetchFlashcards();
      await fetchFlashCardSet();
      return response.data.data;
    } catch (error: any) {
      console.log(error);
      toast.error('Fail to generate flash cards');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isEditMode) {
    return (
      <div className="flex flex-col">
        <h1 className="text-2xl justify-start">Flashcards</h1>
        <FlashCardEdit
          flashCardSet={flashCardSet}
          refresh={() => {
            fetchFlashcards();
            fetchFlashCardSet();
          }}
          onEditOff={() => setIsEditMode(false)}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <GeneratingDisplay text="Flashcards are being initialized, please give us a moment. Good things are coming..." />
    );
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-semibold justify-start">
        {flashCardSet?.title}
      </h1>

      {isLoading ? (
        <>
          <LoadingComponent />
        </>
      ) : flashcards.length === 0 ? (
        <>
          <div className="flex flex-col gap-4 items-center">
            {isGenerating ? (
              <div className="flex flex-col gap-4 items-center">
                <Image
                  src="/images/loading.png"
                  alt="loading"
                  width={200}
                  height={200}
                  loading="lazy"
                />
                <h6 className="text-lg text-center text-gray-600">
                  Give us a moment, your flashcards are on the way...
                </h6>
              </div>
            ) : (
              <EmptyDisplay
                src="/images/no-flashcard.png"
                text="You haven't had your own flashcards yet. Let's generate some!"
              />
            )}

            <Button
              onClick={generateFlashCards}
              disabled={isGenerating}
              className="px-6 py-4 text-lg font-semibold"
              name="generate-flashcards"
            >
              {isGenerating ? 'Generating...' : 'Generate Flashcards'}
            </Button>
          </div>
        </>
      ) : (
        <FlashCardTrack
          flashCards={flashcards}
          onEdit={() => setIsEditMode(true)}
        />
      )}
    </div>
  );
}
