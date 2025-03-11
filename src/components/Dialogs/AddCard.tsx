import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import toast from 'react-hot-toast';
import axios from 'axios';

type Props = {
  flashCardSetId: number;
  chatId: number;
};

const AddCard = ({ flashCardSetId, chatId }: Props) => {
  const [newCard, setNewCard] = useState<{ question: string; answer: string }>({
    question: '',
    answer: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddCard = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/flash-cards/create', {
        question: newCard.question,
        answer: newCard.answer,
        flashCardSetId,
        chatId,
      });

      if (response.data.error) {
        toast.error(response.data.error);
        setIsLoading(false);
        return;
      }

      setNewCard({ question: '', answer: '' });
      toast.success(response.data.message);

      setIsLoading(false);
    } catch (error: any) {
      console.log('Fail to add card: ', error);
      toast.error('Fail to add card');
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-black text-white font-semibold transition-all duration-300 hover:scale-102 hover:bg-black hover:text-white">
          + New Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-white">
        <DialogHeader>
          <DialogTitle>New Card</DialogTitle>
          <DialogDescription>
            Make it easy for your learning journey.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              value={newCard.question}
              onChange={(e) =>
                setNewCard({ ...newCard, question: e.target.value })
              }
              placeholder="Enter your question here..."
              className="border-gray-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              value={newCard.answer}
              onChange={(e) =>
                setNewCard({ ...newCard, answer: e.target.value })
              }
              placeholder="Enter your answer here..."
              className="border-gray-400"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddCard} type="submit" className="text-white font-semibold hover:bg-emerald-600 hover:scale-102 hover:text-white transition-all duration-300 text-white ">
            {isLoading ? 'Adding...' : 'Add Card'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCard;
