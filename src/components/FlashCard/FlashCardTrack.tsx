import React, { useEffect, useState } from 'react';
import FlashCard from './FlashCard';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  CircleArrowLeftIcon,
  CircleArrowRightIcon,
} from 'lucide-react';
import { DrizzleFlashCard } from '@/lib/db/drizzleType';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { IFlashCardSet } from '@/lib/type';

export enum CardStatus {
  LEARNING = 'LEARNING',
  KNOWN = 'KNOWN',
}

type Props = {
  flashCards: DrizzleFlashCard[];
};

const FlashCardTrack = ({ flashCards }: Props) => {
  const [isProgressEnd, setIsProgressEnd] = useState<boolean>(false);
  const [isTrack, setIsTrack] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flashCardData, setFlashCardData] = useState<DrizzleFlashCard[]>(flashCards);
  const [learningCards, setLearningCards] = useState<DrizzleFlashCard[]>([]);
  const [knownCards, setKnownCards] = useState<DrizzleFlashCard[]>([]);

  useEffect(() => {
    setFlashCardData(flashCards);
  }, [flashCards]);

  useEffect(() => {
    if (isTrack) {
      setCurrentIndex(0);
    }
  }, [isTrack]);

  // const fetchFlashCards = async () => {
  //   try {
  //     const response = await axios.get(
  //       `/api/flashcard-set/get?id=${flashCardSetId}`,
  //     );

  //     if (response.data.error) {
  //       toast.error('Error fetching flash card sets: ' + response.data.error);
  //       return;
  //     }

  //     setFlashCardData(
  //       response.data.flashCardSetsWithChatsAndFlashCards[0].flashCards,
  //     );
  //   } catch (error: any) {
  //     console.log(error);
  //     toast.error('Error fetching flash card sets: ' + error.message);
  //   }
  // };

  // const handleCheckCard = async () => {
  //   try {
  //     setLoading({ ...loading, isChecking: true });
  //     const response = await axios.put('/api/flash-cards/update', {
  //       flashCardId: flashCardData[currentIndex].id,
  //       updatedData: {
  //         isKnown: flashCardData[currentIndex].isKnown === 0 ? 1 : 0,
  //       },
  //     });

  //     if (response.data.error) {
  //       toast.error('Error checking flash card: ' + response.data.error);
  //       setLoading({ ...loading, isChecking: false });
  //       return;
  //     }

  //     setCurrentIndex(currentIndex + 1);
  //     toast.success('Flash card checked');
  //     setLoading({ ...loading, isChecking: false });
  //   } catch (error: any) {
  //     console.log(error);
  //     toast.error('Error checking flash card: ' + error.message);
  //     setLoading({ ...loading, isChecking: false });
  //   }
  // };

  const checkCard = (status: CardStatus) => {
    if (status === CardStatus.KNOWN) {
      setKnownCards([...knownCards, flashCardData[currentIndex]]);
    } else if (status === CardStatus.LEARNING) {
      setLearningCards([...learningCards, flashCardData[currentIndex]]);
    }

    if (currentIndex < flashCardData.length - 1) {
      nextCard();
    } else {
      setIsProgressEnd(true);
    }
  };

  const nextCard = () => {
    if (currentIndex < flashCardData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(flashCardData.length - 1);
    }
  };

  return (
    <div className="mt-8">
      {/* {isTrack && (
        <div className="w-full flex items-center justify-between">
          <StatusText text={`Learning ${learningCards.length}`} type="error" />
          <StatusText text={`Known ${knownCards.length}`} type="success" />
        </div>
      )} */}

      <div className="flex flex-col gap-2">
        <div className="flex justify-center items-center">
          <FlashCard
            flashCard={flashCardData[currentIndex]}
            progress={
              isTrack ? `${currentIndex + 1}/${flashCardData.length}` : ''
            }
            checkCard={checkCard}
            learningCards={learningCards}
            knownCards={knownCards}
          />
        </div>

        <div className="flex w-full">
          <div className="flex-[1] flex items-center space-x-2">
            <Switch
              id="isTrack"
              checked={isTrack}
              onCheckedChange={() => setIsTrack(!isTrack)}
            />
            <Label htmlFor="isTrack">Start Learning</Label>
          </div>
          {!isTrack && (
            <>
              <div className="flex-[1] flex justify-center items-center gap-4">
                <CircleArrowLeftIcon
                  className="w-10 h-10 text-emerald-500"
                  onClick={previousCard}
                />
                <h6 className="text-xl font-bold">
                  {currentIndex + 1} / {flashCardData.length}
                </h6>
                <CircleArrowRightIcon
                  className="w-10 h-10 text-emerald-500"
                  onClick={nextCard}
                />
              </div>
              <div className="flex-[1]"></div>
            </>
          )}
        </div>
      </div>

      {/* {isTrack && (
        <div className="flex justify-center items-center rounded-b-3xl">
          <div
            className="flex-[1] w-full h-full flex items-center justify-center bg-red-500 rounded-bl-3xl hover:bg-red-700 hover:shadow-lg"
            onClick={() => checkCard(CardStatus.LEARNING)}
          >
            <h6 className="text-xl font-bold text-emerald-100 text-center">
              <X className="w-8 h-8 font-bold text-white" />
            </h6>
          </div>
          <div
            className="flex-[1] w-full h-full flex items-center justify-center bg-emerald-400 rounded-br-3xl hover:bg-emerald-600 hover:shadow-lg"
            onClick={() => checkCard(CardStatus.KNOWN)}
          >
            <h6 className="text-xl font-bold text-emerald-100 text-center">
              <CheckIcon className="w-8 h-8 font-bold text-white" />
            </h6>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default FlashCardTrack;
