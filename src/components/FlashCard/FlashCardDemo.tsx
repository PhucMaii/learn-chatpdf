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
        `relative xl:w-[900px] lg:w-[700px] sm:w-[500px] w-[300px] h-[650px] flex flex-col items-center justify-center`,
        // { '2xl:w-[700px] w-[400px] h-[600px]': isInChat },
      )}
    >
      <div
        className={cn(
          `relative flipper-container flex flex-col justify-center items-center h-full w-full ${className}`,
          // { '2xl:w-[700px] w-[400px] h-[600px]': isInChat },
        )}
      >
        <div className={`flipper ${side === 'back' ? 'flip' : ''} mt-1`}>
          {/* Front Side */}
          <div
            className={cn(
              'rounded-b-xl md:rounded-b-2xl front flex justify-center items-center w-full h-full bg-emerald-50 shadow-xl p-4 md:p-6 rounded-t-xl md:rounded-t-2xl border-2 border-emerald-300 cursor-pointer',
            )}
            onClick={handleFlip}
          >
            <h6 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-black text-center font-semibold leading-relaxed">
              ✨ Real talk: What actually helps you remember stuff better:
              highlighting or testing yourself?
            </h6>
          </div>

          <div
            className={cn(
              'back flex justify-center items-center w-full h-full bg-sky-50 shadow-xl p-4 md:p-6 rounded-t-xl md:rounded-t-2xl border-2 border-sky-300 rounded-b-xl md:rounded-b-2xl cursor-pointer',
            )}
            onClick={handleFlip}
          >
            <h6 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-black text-center font-semibold leading-relaxed">
              🎯 Testing yourself! That&apos;s called active recall, and it&apos;s like a
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
