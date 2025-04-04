import { ChevronsRight } from 'lucide-react';
import React, { useMemo } from 'react';
import { Progress } from '../ui/progress';
import { IFlashCardSet } from '@/lib/type';

type Props = {
  flashCardSetWithChat: IFlashCardSet;
  onClick: any;
};

const FlashCardSet = ({ flashCardSetWithChat, onClick }: Props) => {
  const knownCards = useMemo(() => {
    const cards = flashCardSetWithChat.flashCards.filter(
      (flashCard: any) => flashCard.isKnown === 1,
    );

    const percent =
      (cards.length / flashCardSetWithChat.flashCards.length) * 100;

    return { count: cards.length, percent };
  }, [flashCardSetWithChat]);

  return (
    <div
      className="bg-gray-50 rounded-xl p-4 shadow-sm hover:bg-gray-200 active:scale-98 transition-all duration-300"
      onClick={onClick}
    >
      <div className="w-full flex justify-between items-center ">
        <div className="flex flex-col">
          <h6 className="text-md flex-8 font-semibold">
            {flashCardSetWithChat?.title}
          </h6>
          <div className="mt-2">
            <h6 className="text-sm text-gray-600 font-medium">
              Created with {flashCardSetWithChat?.chat?.pdfName}
            </h6>
          </div>
        </div>

        <div onClick={onClick}>
          <ChevronsRight className="flex-1 w-8 h-8 text-emerald-500 hover:text-blue-600 cursor-pointer" />
        </div>
      </div>
      <div className="mt-4 w-full flex items-center gap-4">
        <Progress value={knownCards.percent} />
        <h6 className="text-sm text-gray-600 font-bold">
          {knownCards.count}/{flashCardSetWithChat.flashCards.length}
        </h6>
      </div>
    </div>
  );
};

export default FlashCardSet;
