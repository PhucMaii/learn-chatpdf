import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ArrowLeftIcon, Trash2Icon } from 'lucide-react';
import { Separator } from '../ui/separator';
import { DrizzleFlashCard, DrizzleFlashCardSet } from '@/lib/db/drizzleType';
import { Textarea } from '../ui/textarea';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';

const SingleCardEdit = ({
  flashCard,
  index,
  onChange,
  onRemove
}: {
  flashCard: DrizzleFlashCard;
  index: number;
  onRemove: (index: number) => void,
  onChange: (
    index: number,
    newText: string,
    type: 'question' | 'answer',
  ) => void;
}) => {
  // const [front, setFront] = useState<string>('');
  // const [back, setBack] = useState<string>('');

  // useEffect(() => {
  //   if (flashCard) {
  //     setFront(flashCard.question);
  //     setBack(flashCard.answer);
  //   }
  // }, [flashCard]);

  return (
    <div className=" gap-4 p-4 border-1 border-gray-200 rounded-2xl">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-xl">{index + 1}.</h4>
        <div className="flex items-center gap-2">
          <Button className="bg-red-100 hover:bg-red-200 text-red-600" onClick={() => onRemove(index)}>
            <Trash2Icon />
          </Button>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex w-full gap-4 mt-2">
        <div className="flex-[1] flex-col gap-1">
          <h6>Front</h6>
          <Textarea
            // type="text"
            style={{ fontSize: '1.2rem' }}
            placeholder="Your front card text..."
            className="w-full border-none bg-emerald-50 text-emerald-800 font-medium"
            aria-rowspan={5}
            value={flashCard?.question || ''}
            onChange={(e) => onChange(index, e.target.value, 'question')}
            aria-rowcount={5}
          />
        </div>
        <div className="flex-[1] flex-col gap-1">
          <h6>Back</h6>
          <Textarea
            style={{ fontSize: '1.2rem' }}
            // type="text"
            placeholder="Your back card text..."
            className="w-full border-none bg-emerald-50 text-emerald-800 font-medium text-3xl"
            aria-rowspan={5}
            value={flashCard?.answer || ''}
            onChange={(e) => onChange(index, e.target.value, 'answer')}
          />
        </div>
      </div>
    </div>
  );
};

interface IProps {
  flashCardSet: DrizzleFlashCardSet;
}

export default function FlashCardEdit({ flashCardSet }: IProps) {
  const [cardDeck, setCardDeck] = useState<any>(flashCardSet);
  const [newTitle, setNewTitle] = useState<string>(flashCardSet?.title);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (flashCardSet) {
      setCardDeck(flashCardSet);

      setNewTitle(flashCardSet?.title);
    }
  }, [flashCardSet]);

  const handleSaveCard = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(`/api/flashcard-set`, {
        id: flashCardSet.id,
        title: newTitle,
        flashcards: cardDeck.flashCards,
      });

      toast.success(response.data.message);
    } catch (error: any) {
      console.log('There was an error: ', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeFlashCard = (
    index: number,
    newText: string,
    type: 'question' | 'answer',
  ) => {
    const newFlashCards = cardDeck.flashCards.map(
      (flashCard: DrizzleFlashCard, i: number) => {
        if (i === index) {
          return { ...flashCard, [type]: newText };
        }
        return flashCard;
      },
    );

    setCardDeck({ ...cardDeck, flashCards: newFlashCards });
  };

  const onRemoveFlashCard = (index: number) => {
    const newFlashCards = cardDeck.flashCards.filter(
      (flashCard: DrizzleFlashCard, i: number) => i !== index,
    );

    setCardDeck({ ...cardDeck, flashCards: newFlashCards });
  };

  return (
    <div className="flex flex-col gap-4 w-full mx-auto max-w-[2000px]">
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <Link
            href={`/flash-cards/${flashCardSet?.id}`}
            className="hover:scale-105 active:scale-90 transition-all duration-300"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-500" />
          </Link>
          <h4 className="font-semibold text-3xl">Edit Flashcards</h4>
        </div>
        <Button
          disabled={isLoading}
          onClick={handleSaveCard}
          className="text-white text-lg"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
      <div>
        <Input
          style={{ fontSize: '1.2rem' }}
          type="text"
          placeholder="Flashcard title... ex: My first flashcard"
          className="w-full border-none bg-emerald-50 text-emerald-800 font-medium text-3xl"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
      </div>

      {cardDeck?.flashCards?.map(
        (flashCard: DrizzleFlashCard, index: number) => (
          <SingleCardEdit
            key={flashCard.id}
            index={index}
            flashCard={flashCard}
            onChange={onChangeFlashCard}
            onRemove={onRemoveFlashCard}

          />
        ),
      )}
    </div>
  );
}
