import React, { useEffect, useState } from 'react';
import '../../../styles/FlashCard.css';
import { CheckIcon } from 'lucide-react';

type Props = {
  flashCard: any;
};

const FlashCard = ({ flashCard }: Props) => {
  const [side, setSide] = useState<'front' | 'back'>('front');

  useEffect(() => {
    setSide('front');
  }, [flashCard]);

  const handleFlip = () => {
    setSide(side === 'front' ? 'back' : 'front');
  };

  return (
    <div
      onClick={handleFlip}
      className="relative flex flex-col justify-center items-center w-[500px]"
    >
      {flashCard?.isKnown === 1 && (
        <div className="absolute flex items-center gap-1 right-0 w-fit p-2 z-10 bg-green-500 text-white rounded-xl">
          <h6>Known</h6>
          <CheckIcon className="w-6 h-6" />
        </div>
      )}
      <div className={`flipper ${side === 'back' ? 'flip' : ''}`}>
        {/* Front Side */}
        <div className="front flex justify-center items-center w-[500px] min-h-[300px] bg-emerald-500 shadow-xl p-6 rounded-3xl border-2 border-emerald-500">
          <h6 className="text-xl text-white text-center font-bold">
            {flashCard?.question}
          </h6>
        </div>

        {/* Back Side */}
        <div className="back flex justify-center items-center w-[500px] min-h-[300px] bg-blue-500 shadow-xl p-6 rounded-3xl border-2 border-blue-500">
          <h6 className="text-xl text-white text-center font-bold">
            {flashCard?.answer}
          </h6>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
