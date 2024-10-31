import React, { memo, useEffect, useState } from 'react';
import '../../../styles/FlashCard.css';
import { CheckIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusText from '../StatusText';
import { DrizzleFlashCard } from '@/lib/db/drizzleType';
import { CardStatus } from './FlashCardTrack';

type Props = {
  flashCard: any;
  progress?: string;
  className?: string;
  checkCard: (status: CardStatus) => void;
  learningCards: DrizzleFlashCard[];
  knownCards: DrizzleFlashCard[];
};

const FlashCard = ({
  flashCard,
  progress,
  className,
  checkCard,
  learningCards,
  knownCards,
}: Props) => {
  const [side, setSide] = useState<'front' | 'back'>('front');

  useEffect(() => {
    if (flashCard) {
      setSide('front');
    }
  }, [flashCard]);

  const handleFlip = () => {
    setSide(side === 'front' ? 'back' : 'front');
  };


  return (
    <div
      onClick={handleFlip}
      className={`relative flipper-container flex flex-col justify-center items-center w-[500px] h-[600px] ${className}`}
    >
      {progress && (
        <>
        <div className="w-full flex items-center justify-between mb-2">
          <StatusText
            text={`Learning ${learningCards?.length || 0}`}
            type="error"
          />
          <StatusText
            text={`Known ${knownCards?.length || 0}`}
            type="success"
          />
        </div>
        <div className="absolute flex items-center gap-1 right-10 top-14 w-fit p-2 z-10 bg-transparent border-2 border-white text-white rounded-xl">
          <h6>{progress}</h6>
        </div>
        </>
      )}
      <div className={`flipper ${side === 'back' ? 'flip' : ''}`}>
        {/* Front Side */}
        <div
          className={cn(
            'front flex justify-center items-center w-full h-full bg-emerald-500 shadow-xl p-6 rounded-t-2xl border-2 border-emerald-500',
            { 'rounded-b-2xl': !progress },
          )}
        >
          <h6 className="text-xl text-white text-center font-bold ">
            {flashCard?.question}
          </h6>
        </div>

        {/* Back Side */}
        <div
          className={cn(
            'back flex justify-center items-center w-full h-full bg-blue-500 shadow-xl p-6 rounded-t-2xl border-2 border-blue-500',
            { 'rounded-b-2xl': !progress },
          )}
        >
          <h6 className="text-xl text-white text-center font-bold overflow-y-scroll">
            {flashCard?.answer}
          </h6>
        </div>
      </div>

      {progress && (
        <div className="flex justify-center items-center w-full rounded-b-2xl ">
          <div
            className="flex-[1] w-full h-full flex items-center justify-center bg-red-500 rounded-bl-2xl hover:bg-red-700 shadow-xl"
            onClick={() => checkCard(CardStatus.LEARNING)}
          >
            <h6 className="text-xl font-bold text-emerald-100 text-center">
              <X className="w-8 h-8 font-bold text-white" />
            </h6>
          </div>
          <div
            className="flex-[1] w-full h-full flex items-center justify-center bg-emerald-400 rounded-br-2xl hover:bg-emerald-600 shadow-xl"
            onClick={() => checkCard(CardStatus.KNOWN)}
          >
            <h6 className="text-xl font-bold text-emerald-100 text-center">
              <CheckIcon className="w-8 h-8 font-bold text-white" />
            </h6>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(FlashCard, (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});
