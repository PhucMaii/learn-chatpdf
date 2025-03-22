import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, SquarePenIcon } from 'lucide-react';
import ErrorComponent from '../ErrorComponent';
import LoadingComponent from '../LoadingComponent';
import { Button } from '../ui/button';
import { DrizzleFlashCard } from '@/lib/db/drizzleType';
import FlashCardTrack from './FlashCardTrack';

type Props = {
  chatId: number;
  flashCards: DrizzleFlashCard[];
};

const FlashCardsTab = ({ chatId, flashCards }: Props) => {
  const [flashCardData, setFlashCardData] = useState<any>(flashCards);
  const [loading, setLoading] = useState<any>({});

  useEffect(() => {
    setFlashCardData(flashCards);
  }, [flashCards]);

  const generateFlashCards = async () => {
    setLoading({ ...loading, isAdding: true });
    try {
      const response = await axios.post('/api/flash-cards', { chatId });

      if (response.data.error) {
        toast.error('Fail to generate flash cards');
        setLoading({ ...loading, isAdding: false });
        return;
      }

      setFlashCardData(response.data.data);
      setLoading({ ...loading, isAdding: false });
      return response.data.data;
    } catch (error: any) {
      console.log(error);
      toast.error('Fail to generate flash cards');
      setLoading({ ...loading, isAdding: false });
    }
  };

  return (
    <div className="w-full h-full">
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit flex justify-between">
        <h3 className="text-xl font-bold">Flash Cards</h3>
        {flashCardData.length === 0 && (
          <Button
            onClick={generateFlashCards}
            className="bg-white text-emerald-500 border-dashed border-2 border-emerald-500 hover:bg-emerald-500 hover:text-white flex gap-2"
          >
            Generate Flash Cards{' '}
            {loading.isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <SquarePenIcon className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

      {/* flash card list */}
      {loading.isFetching ? (
        <div className="flex justify-center items-center h-full w-full">
          <LoadingComponent />
        </div>
      ) : flashCardData.length === 0 ? (
        <ErrorComponent errorText="No flash cards found" />
      ) : (
        <div className="mt-8">
          {flashCardData.length > 0 && (
            <FlashCardTrack flashCards={flashCardData} isInChat />
          )}
        </div>
      )}
    </div>
  );
};

export default FlashCardsTab;
