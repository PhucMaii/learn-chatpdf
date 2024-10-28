import { ChevronsRight } from 'lucide-react';
import React, { useMemo } from 'react';
import { Progress } from '../ui/progress';

type Props = {
  flashCardSetWithChat: any;
};

const FlashCardSet = ({ flashCardSetWithChat }: Props) => {
  const knownCards = useMemo(() => {
    return flashCardSetWithChat.flashCards.filter(
      (flashCard: any) => flashCard.isKnown === 1
    )
  }, [flashCardSetWithChat]);


  return (
    <div className="bg-emerald-50 rounded-3xl p-4 shadow-sm hover:shadow-xl">
      <div className="w-full flex justify-between items-center ">
        <div className="flex flex-col">
          <h6 className="text-md flex-[8] font-bold text-emerald-500">
            {flashCardSetWithChat?.title}
          </h6>
          <div className="mt-4">
            <h6 className="text-sm text-gray-600 font-bold">
              Created with {flashCardSetWithChat.chat.pdfName}
            </h6>
          </div>
        </div>

        <div>
          <ChevronsRight className="flex-[1] w-8 h-8 text-emerald-500" />
        </div>
        {/* <div className="p-2 bg-gray-200 rounded-xl w-fit mt-2">
        <h6 className="text-sm text-gray-600 font-bold">20 questions</h6>
        </div> */}
      </div>
      <div className="mt-4 w-full flex items-center gap-4">
        <Progress value={33} />
        <h6 className="text-sm text-gray-600 font-bold">{knownCards.length}/{flashCardSetWithChat.flashCards.length}</h6>
      </div>
    </div>
  );
};

export default FlashCardSet;
