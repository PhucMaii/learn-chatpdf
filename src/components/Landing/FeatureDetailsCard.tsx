import { IFeature } from '@/lib/type';
import Image from 'next/image';
import React from 'react';
import FlashCardDemo from '../FlashCard/FlashCardDemo';
import RichTextEditor from '../RichTextEditor';

type Props = {
  feature: IFeature;
};

export default function FeatureDetailsCard({ feature }: Props) {
  // if (isReverse) {
  //   return (
  //     <div className="flex flex-col items-center justify-center sm:justify-between h-screen">
  //       <Image
  //         src={feature.image}
  //         alt={feature.title}
  //         width={300}
  //         height={100}
  //         className="flex flex-1 rounded-3xl justify-center"
  //       />
  //       <div className="flex-1 flex flex-col gap-2 p-8 justify-center">
  //         <h4 className="font-semibold text-2xl text-center ">
  //           {feature?.title}
  //         </h4>
  //         <h6 className="text-gray-700 font-medium text-lg text-center w-full sm:w-3/4">
  //           {feature?.description}
  //         </h6>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col items-center justify-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-1 p-8 justify-center">
        <h4 className="font-semibold text-4xl text-center ">{feature.title}</h4>
        <h5 className="text-gray-700 font-medium text-xl max-w-2xl text-center">
          {feature.description}
        </h5>
      </div>
      {feature?.id === 1 ? (
        <div className="flex flex-1 rounded-3xl justify-center">
          <FlashCardDemo className="w-full h-full" />
        </div>
      ) : feature.id === 3 ? (
        <div className="flex flex-1 max-w-2xl rounded-3xl justify-center">
          <RichTextEditor
            content={`
          
# 📘 Your Smart & Friendly Study Guide
*Hey there, brainiac! Let’s make studying actually enjoyable.*  
This guide will help you focus on what matters most, without the stress. Ready? Let’s go! 🚀

---

## 🧠 Big Ideas You *Need* to Know

- **Active Recall vs. Passive Review**  
  → Active recall (testing yourself) = 💪 for your brain  
  → Passive review (just re-reading) = 😴 energy gone

- **Spaced Repetition**  
  → Don’t cram. Spread your study sessions. Your memory will thank you. 🗓️

- **The Pomodoro Technique**  
  → 25 min study + 5 min break = productivity unlocked 🍅✨

---

## ✨ Must-Know Definitions

| Term | What It Means |
|------|----------------|
| **Active Recall** | Trying to remember things without looking at your notes. Your brain works harder = you remember more. |
| **Spaced Repetition** | Reviewing info over increasing intervals. Science-approved way to remember long-term. |
| **Chunking** | Breaking info into smaller, manageable pieces. Easier to absorb. Easier to slay. 💥 |

---

## 🎯 Quick Questions to Test Yourself

> ❓ *What's better for memory: rereading or self-testing?*  
> 💡 *What’s one benefit of spaced repetition?*  
> 🤔 *How does the Pomodoro technique help with focus?*

---

## 🌈 Quick Recap (TL;DR)

- Flashcards are 🔥 for memory  
- Spread out your study sessions  
- Take breaks—you’re human, not a robot  
- Review often, not all at once

---

## 💬 Bonus Tip  
You're doing great. Seriously.  
Progress > perfection. Keep showing up, and future-you will be *so* proud. 🌟
`}
          />
        </div>
      ) : (
        <Image
          src={feature.image}
          alt={feature.title}
          width={500}
          height={100}
          className="flex flex-1 rounded-3xl justify-center"
        />
      )}
    </div>
  );
}
