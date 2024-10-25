import React, { useEffect, useState } from 'react';
import FlashCard from './FlashCard';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  CheckIcon,
  CircleArrowLeftIcon, 
  CircleArrowRightIcon,
  Loader2,
  SquarePenIcon,
} from 'lucide-react';
import ErrorComponent from '../ErrorComponent';
import LoadingComponent from '../LoadingComponent';
import { Button } from '../ui/button';

type Props = {
  chatId: number;
};

const FlashCardsTab = ({ chatId }: Props) => {
  const [currentFlashCardIndex, setCurrentFlashCardIndex] = useState<number>(0);
  const [flashCardData, setFlashCardData] = useState<any>([]);
  const [loading, setLoading] = useState<any>({});

  useEffect(() => {
    handleGetFlashCards();
  }, [])

  const generateFlashCards = async () => {
    setLoading({...loading, isAdding: true});
    try {
      const response = await axios.post('/api/flash-cards', { chatId });

      if (response.data.error) {
        toast.error('Error generating flash cards: ' + response.data.error);
        setLoading({...loading, isAdding: false});
        return;
      }

      setFlashCardData(response.data.data);
      setLoading({...loading, isAdding: false});
      return response.data.data;
    } catch (error: any) {
      console.log(error);
      toast.error('Error fetching flash cards: ' + error.message);
      setLoading({...loading, isAdding: false});
    }
  };

  const handleCheckCard = async () => {
    try {
      setLoading({...loading, isChecking: true});
      const response = await axios.put('/api/flash-cards/update', {
        flashCardId: flashCardData[currentFlashCardIndex].id,
        updatedData: {
          isKnown: 1,
        }
      }); 

      if (response.data.error) {
        toast.error('Error checking flash card: ' + response.data.error);
        setLoading({...loading, isChecking: false});
        return;
      }

      setCurrentFlashCardIndex(currentFlashCardIndex + 1);
      toast.success('Flash card checked');
      setLoading({...loading, isChecking: false});
    } catch (error: any) {
      console.log(error);
      toast.error('Error checking flash card: ' + error.message);
      setLoading({...loading, isChecking: false});
    }
  }

  const handleGetFlashCards = async () => {
    try {
      setLoading({...loading, isFetching: true});
      const response = await axios.get(`/api/flash-cards/get?chatId=${chatId}`);

      setFlashCardData(response?.data?.flashCards || []);
      setLoading({...loading, isFetching: false});
    }
     catch (error: any) {
      console.log(error);
      // toast.error('Error fetching flash cards: ' + error.message);
      setLoading({...loading, isFetching: false});
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
{       flashCardData.length === 0 && <Button
          onClick={generateFlashCards}
          className="bg-white text-emerald-500 border-dashed border-2 border-emerald-500 hover:bg-emerald-500 hover:text-white flex gap-2"
        >
          Generate Flash Cards{' '}
          {loading.isAdding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <SquarePenIcon className="w-4 h-4" />
          )}
        </Button>}
      </div>

      {/* flash card list */}
      {loading.isFetching ?
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
        <div 
          className='absolute flex justify-center items-center top-[400px] w-[500px] left-1/2 transform -translate-x-1/2 rounded-b-3xl h-[50px] bg-indigo-500 hover:shadow-xl'
          onClick={handleCheckCard}
        >
          {loading.isChecking ? <Loader2 className="w-10 h-10 animate-spin text-emerald-100" /> : <CheckIcon className='w-10 h-10 text-emerald-100 text-center' />}
        </div>
      <div className="absolute top-[480px] flex justify-center items-center w-full gap-4">
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
