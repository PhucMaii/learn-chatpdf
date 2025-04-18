import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import '../../../styles/FlashCard.css';

export default function FlashCardDemo({ className }: { className?: string }) {
  const [side, setSide] = useState<'front' | 'back'>('front');

  const handleFlip = () => {
    setSide(side === 'front' ? 'back' : 'front');
  };

  return (
    <div
      className={cn(
        `relative xl:w-[900px] lg:w-[700px] w-[500px] h-[600px] flex flex-col items-center justify-center`,
        // { '2xl:w-[700px] w-[400px] h-[600px]': isInChat },
      )}
    >
      <div
        className={cn(
          `relative flipper-container flex flex-col justify-center items-center h-[600px] ${className}`,
          // { '2xl:w-[700px] w-[400px] h-[600px]': isInChat },
        )}
      >
        <div className={`flipper ${side === 'back' ? 'flip' : ''} mt-1`}>
          {/* Front Side */}
          <div
            className={cn(
              ' rounded-b-2xl front flex justify-center items-center xl:w-[900px] lg:w-[500px] w-[400px] h-[600px] bg-emerald-500 shadow-xl p-6 rounded-t-2xl border-2 border-emerald-500',
            )}
            onClick={handleFlip}
          >
            <h6 className="text-3xl text-white text-center font-semibold leading-[2.5rem]">
              ✨ Real talk: What actually helps you remember stuff better:
              highlighting or testing yourself?
            </h6>
          </div>

          <div
            className={cn(
              'back flex justify-center items-center xl:w-[900px] lg:w-[500px] w-[400px] h-[600px] bg-sky-600 shadow-xl p-6 rounded-t-2xl border-2 border-blue-500 rounded-b-2xl',
            )}
            onClick={handleFlip}
          >
            <h6 className="text-3xl text-white text-center font-semibold leading-[2.5rem]">
              🎯 Testing yourself! That’s called active recall, and it’s like a
              workout for your brain. Highlighting feels productive, but
              flashcards actually train your memory. So yeah, your brain called.
              It wants more flashcards. 😄
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
}
