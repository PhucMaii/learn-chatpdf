import React from 'react';
import { Input } from '../ui/input';

export default function FlashCardEdit() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Example of a flashcard */}
      <div className="shadow-sm gap-4 p-4">
        <h4 className="font-bold text-xl">1.</h4>
        <div className="flex w-full gap-4">
          <div className="flex-[1] flex-col gap-1">
            <h6>Question</h6>
            <Input type="text" placeholder="Question" className="w-full" />
          </div>
          <div className="flex-[1] flex-col gap-1">
            <h6>Answer</h6>
            <Input type="text" placeholder="Answer" className="w-full" />
          </div>
        </div>
      </div>

      <div className="shadow-sm gap-4 p-4">
        <h4 className="font-bold text-xl">1.</h4>
        <div className="flex w-full gap-4">
          <div className="flex-[1] flex-col gap-1">
            <h6>Question</h6>
            <Input type="text" placeholder="Question" className="w-full" />
          </div>
          <div className="flex-[1] flex-col gap-1">
            <h6>Answer</h6>
            <Input type="text" placeholder="Answer" className="w-full" />
          </div>
        </div>
      </div>

      <div className="shadow-sm gap-4 p-4">
        <h4 className="font-bold text-xl">1.</h4>
        <div className="flex w-full gap-4">
          <div className="flex-[1] flex-col gap-1">
            <h6>Question</h6>
            <Input type="text" placeholder="Question" className="w-full" />
          </div>
          <div className="flex-[1] flex-col gap-1">
            <h6>Answer</h6>
            <Input type="text" placeholder="Answer" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
