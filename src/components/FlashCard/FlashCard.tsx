import React, { memo, useEffect, useState } from 'react';
import '../../../styles/FlashCard.css';
import { CheckIcon, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusText from '../StatusText';
import { DrizzleFlashCard } from '@/lib/db/drizzleType';
import { CardStatus } from './FlashCardTrack';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import toast from 'react-hot-toast';
import axios from 'axios';
import AddCard from '../Dialogs/AddCard';

type Props = {
  flashCard: any;
  progress?: string;
  className?: string;
  checkCard: (status: CardStatus) => void;
  learningCards: DrizzleFlashCard[];
  knownCards: DrizzleFlashCard[];
  isEdit: boolean;
  setIsEdit: any;
};

const FlashCard = ({
  flashCard,
  progress,
  className,
  checkCard,
  learningCards,
  knownCards,
  isEdit,
  setIsEdit,
}: Props) => {
  const [card, setCard] = useState<any>(flashCard);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [side, setSide] = useState<'front' | 'back'>('front');

  useEffect(() => {
    if (flashCard) {
      setSide('front');
      setCard(flashCard);
    }
  }, [flashCard]);

  const handleFlip = () => {
    setSide(side === 'front' ? 'back' : 'front');
  };

  const deleteCard = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete('/api/flash-cards', {data: {
        id: flashCard.id
      }});

      if (response.data.error) {
        toast.error('Fail to delete card');
        setIsDeleting(false);
        return;
      }

      toast.success('Delete card successfully');
      setIsDeleting(false);
    } catch (error: any) {
      console.log('Fail to delete card', error);
      toast.error('Fail to delete card');
      setIsDeleting(false);
    }
  }

  const handleUpdateCard = async (e: any) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const response: any = await axios.put('/api/flash-cards', {
        id: card.id,
        newFlashCard: {
          question: card.question,
          answer: card.answer,
          isKnown: 0
        },
      });

      if (response.data.error) {
        toast.error('Error updating card: ' + response.data.error);
        setIsLoading(false);
        return;
      }

      setCard(response.data.data);

      toast.success(response.data.message);

      setIsLoading(false);
    } catch (error: any) {
      console.log('Error updating card: ', error);
      toast.error('Error updating card: ' + error?.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {!progress && (
        <div className="w-full flex items-center justify-end space-x-2 mb-2">
          <Switch
            id="isTrack"
            checked={isEdit}
            onCheckedChange={() => setIsEdit(!isEdit)}
          />
          <Label htmlFor="isTrack">Edit Mode</Label>
        </div>
      )}

      {isEdit && !progress && (
        <div className="flex justify-between w-full items-center">
          <div className="self-end">
            <Button onClick={deleteCard} className="p-3 w-15 h-15 bg-red-500 shadow-md font-bold">
              {isDeleting ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : "Delete" }
            </Button>
          </div>
          <div className="self-start">
            {/* <Button className="bg-black text-white font-bold">+ New Card</Button> */}
            <AddCard flashCardSetId={flashCard.flashCardSetId} chatId={flashCard.chatId}/>
          </div>
        </div>
      )}
      <div
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
        <div className={`flipper ${side === 'back' ? 'flip' : ''} mt-1`}>
          {/* Front Side */}
          <div
            className={cn(
              'front flex justify-center items-center w-full h-full bg-emerald-500 shadow-xl p-6 rounded-t-2xl border-2 border-emerald-500',
              { 'rounded-b-2xl': !progress },
            )}
            onClick={handleFlip}
          >
            {isEdit && !progress ? (
              <div className="flex flex-col w-full gap-2">
              <Textarea
                value={card?.question}
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCard({...card, question: e.target.value});
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                style={{ fontSize: '1.2rem', fontWeight: 'bold' }} 
                className="bg-white shadow-xl p-6 rounded-2xl border-2 border-emerald-500 text-emerald-500 text-center text-2xl font-bold"
                placeholder="Question"
                />

                <Button className="bg-white self-end shadow-xl font-bold text-emerald-500" onClick={handleUpdateCard}>
                  {isLoading ? (<Loader2 className="w-6 h-6 animate-spin" />) : 'Save'}
                </Button>
                </div>
              ) : (
              <h6 className="text-xl text-white text-center font-bold ">
                {card?.question}
              </h6>
            )}
          </div>

          {/* Back Side */}
          <div
            className={cn(
              'back flex justify-center items-center w-full h-full bg-blue-500 shadow-xl p-6 rounded-t-2xl border-2 border-blue-500',
              { 'rounded-b-2xl': !progress },
            )}
            onClick={handleFlip}
          >
            {
              isEdit && !progress ? (
                <div className="flex flex-col w-full gap-2">
                <Textarea
                  value={card?.answer}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCard({...card, answer: e.target.value});
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  style={{ fontSize: '1.2rem', fontWeight: 'bold' }} 
                  className="bg-white shadow-xl p-6 rounded-2xl border-2 border-blue-500 text-blue-500 text-center text-2xl font-bold"
                  placeholder='Answer'
                />
                <Button className="bg-white self-end shadow-xl font-bold text-blue-500" onClick={handleUpdateCard}>
                  {isLoading ? (<Loader2 className="w-6 h-6 animate-spin" />) : 'Save'}
                </Button>
                </div>
              ) : (
                <h6 className="text-xl text-white text-center font-bold overflow-y-scroll">
              {card?.answer}
                </h6>
              )
            }
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
    </div>
  );
};

export default memo(FlashCard, (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});
