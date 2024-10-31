import React, { useEffect, useState } from 'react';
import FlashCard from './FlashCard';
import {
  ArrowLeft,
  ArrowRight,
  CircleArrowLeftIcon,
  CircleArrowRightIcon,
  Loader2,
} from 'lucide-react';
import { DrizzleFlashCard } from '@/lib/db/drizzleType';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import StatusText from '../StatusText';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

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
  const [isCheckingCards, setIsCheckingCards] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flashCardData, setFlashCardData] = useState<DrizzleFlashCard[]>(flashCards);
  const [learningCards, setLearningCards] = useState<DrizzleFlashCard[]>([]);
  const [knownCards, setKnownCards] = useState<DrizzleFlashCard[]>([]);

  const router = useRouter();

  useEffect(() => {
    setFlashCardData(flashCards);
  }, [flashCards]);

  useEffect(() => {
    if (isTrack) {
      setCurrentIndex(0);
    }
  }, [isTrack]);

  useEffect(() => {
    if (isProgressEnd) {
      handleProgressEnd();
    }
  }, [isProgressEnd]);

  const checkCard = (status: CardStatus) => {
    if (status === CardStatus.KNOWN) {
      setKnownCards([...knownCards, flashCardData[currentIndex]]);
      const newFlashCards = flashCardData.map((card: DrizzleFlashCard, index: number)  => {
          if (index === currentIndex) {
            return {
              ...card,
              isKnown: 1,
            }
          } 
          return card;
      });
      setFlashCardData(newFlashCards);
    } else if (status === CardStatus.LEARNING) {
      setLearningCards([...learningCards, flashCardData[currentIndex]]);
      const newFlashCards = flashCardData.map((card: DrizzleFlashCard, index: number)  => {
        if (index === currentIndex) {
          return {
            ...card,
            isKnown: 0,
          }
        } 
        return card;
    });
    setFlashCardData(newFlashCards);
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
  

  // When progress end -> show number of learning cards and known cards
  // Then insert data into db
  // Ask if user want to restart learning
  // Then reset data into db
  const handleProgressEnd = async (isReset?: boolean) => {
    setIsCheckingCards(true);
      try {
        const formattedFlashCards = flashCardData.map((card: DrizzleFlashCard) => {
          return {
            id: card.id,
            isKnown: isReset ? 0 : card.isKnown
          }
        })
        const response = await axios.put('/api/flash-cards/update/many', {
          flashCards: formattedFlashCards
        });

        if (response.data.error) {
          toast.error('Error checking flash card: ' + response.data.error);
          setIsCheckingCards(false);
          return;
        }

        // toast.success('All flash cards have been checked!');
        setIsCheckingCards(false);
        if (isReset) {
          resetFlashCards();
        }
      } catch (error: any) {
        console.log('There was an error', error);
        toast.error('Error checking flash card: ' + error.message);
        setIsCheckingCards(false);
      }
  }

  const resetFlashCards = () => {
    const newFlashCards = flashCardData.map((card: DrizzleFlashCard) => {
      return {
        ...card,
        isKnown: 0
      }
    });

    setFlashCardData(newFlashCards);
    setIsProgressEnd(false);
    setIsTrack(false);
    setCurrentIndex(0);
    setLearningCards([]);
    setKnownCards([]);
  }

  if (isProgressEnd) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-2">
          <h6 className="text-xl font-bold text-emerald-600">Congratulations, you have aced all the flash cards!</h6>
          <h1 className="text-3xl">🎉</h1>
        </div>

        <div className="flex flex-col gap-4">
          <div className="mt-4 w-full flex flex-col gap-2">
            <StatusText text={`Known: ${knownCards.length} / ${flashCardData.length}`} type="success" />
            <Progress value={Math.ceil((knownCards.length / flashCardData.length) * 100)} />
          </div>

          <div className="mt-4 w-full flex flex-col gap-2">
            <StatusText text={`Learning: ${learningCards.length} / ${flashCardData.length}`} type="error" />
            <Progress value={Math.floor((learningCards.length / flashCardData.length) * 100)} />
          </div>
        </div>

        <div className="flex items-center justify-between w-full">
          <Button onClick={() => {
            handleProgressEnd(true);
          }} className="bg-transparent text-emerald-500 flex items-center gap-2 text-md font-bold hover:text-blue-600 hover:bg-transparent">
           {isCheckingCards ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowLeft  className="w-6 h-6" />}
            Learn again
          </Button>
          <Button onClick={() => router.push('/flash-cards')} className="bg-transparent text-emerald-500 text-md flex items-center gap-2 font-bold hover:text-blue-600 hover:bg-transparent">
            Flash cards
            <ArrowRight className="w-6 h-6 hover:text-blue-600" />
          </Button>
        </div>
      </div>
    )
  }

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
