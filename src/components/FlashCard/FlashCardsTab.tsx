import React, { useEffect, useState } from 'react';
import FlashCard from './FlashCard';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  CircleArrowLeftIcon, 
  CircleArrowRightIcon,
} from 'lucide-react';
import ErrorComponent from '../ErrorComponent';
import LoadingComponent from '../LoadingComponent';

type Props = {
  chatId: number;
};

const FlashCardsTab = ({ chatId }: Props) => {
  const [currentFlashCardIndex, setCurrentFlashCardIndex] = useState<number>(0);
  const [flashCardData, setFlashCardData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    handleGetFlashCards();
  }, [])

  const generateFlashCards = async () => {
    try {
      const response = await axios.post('/api/flash-cards', { chatId });

      if (response.data.error) {
        toast.error('Error generating flash cards: ' + response.data.error);
        return;
      }

      setFlashCardData(response.data.data);
      return response.data.data;
    } catch (error: any) {
      console.log(error);
      toast.error('Error fetching flash cards: ' + error.message);
      setIsLoading(false);
    }
  };

  const handleGetFlashCards = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/flash-cards/get?chatId=${chatId}`);

      if (response.data.error && response.status == 404) {
        const newFlashCards = await generateFlashCards();

        if (!newFlashCards) {
          setIsLoading(false);
          return;
        }

        setFlashCardData(newFlashCards);
        setIsLoading(false);
        return;
      }

      setFlashCardData(response.data.flashCards);
      setIsLoading(false);
    }
     catch (error: any) {
      console.log(error);
      toast.error('Error fetching flash cards: ' + error.message);
      setIsLoading(false);
    }
  }

  const nextCard = () => {
    if (currentFlashCardIndex < flashCardData.length - 1) {
      setCurrentFlashCardIndex(currentFlashCardIndex + 1);
    } else {
      setCurrentFlashCardIndex(0);
    }
  }

  const previousCard = () => {
    if (currentFlashCardIndex > 0) {
      setCurrentFlashCardIndex(currentFlashCardIndex - 1);
    } else {
      setCurrentFlashCardIndex(flashCardData.length - 1);
    }
  }
  
  return (
    <div className="w-full h-full">
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit flex justify-between">
        <h3 className="text-xl font-bold">Flash Cards</h3>
        {/* <Button
          onClick={generateFlashCards}
          className="bg-white text-emerald-500 border-dashed border-2 border-emerald-500 hover:bg-emerald-500 hover:text-white flex gap-2"
        >
          Generate Flash Cards{' '}
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <SquarePenIcon className="w-4 h-4" />
          )}
        </Button> */}
      </div>

      {/* flash card list */}
      {isLoading ?
      <div className="flex justify-center items-center h-full w-full">
          <LoadingComponent /> 
      </div> 
      : flashCardData.length === 0 ? (
        <ErrorComponent errorText="No flash cards found" />
      ) : (

        <div className="mt-8">
        <div className="relative flex justify-center items-center">
          <FlashCard flashCard={flashCardData[currentFlashCardIndex]} />
        </div>
      <div className="absolute bottom-[450px] flex justify-center items-center w-full gap-4">
          <CircleArrowLeftIcon className="w-10 h-10 text-emerald-500" onClick={previousCard} />
          <h6 className="text-xl font-bold">
            {currentFlashCardIndex + 1} / {flashCardData.length}
          </h6>
          <CircleArrowRightIcon className="w-10 h-10 text-emerald-500" onClick={nextCard} />
      </div>
        </div>
      )}

    </div>
  );
};

export default FlashCardsTab;
