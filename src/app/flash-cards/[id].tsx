'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function FlashCardPage() {
  const [flashCardSets, setFlashCardSets] = useState<any>(null);

  const { id } = useParams();

  useEffect(() => {
    fetchFlashcardSet();
  }, []);

  const fetchFlashcardSet = async () => {
    try {
      const response = await axios.get(`/api/flashcard-set/get?id=${id}`);

      if (response.data.error) {
        toast.error('Error fetching flash card sets: ' + response.data.error);
        return;
      }

      setFlashCardSets(response.data.flashCardSetsWithChatsAndFlashCards);
    } catch (error: any) {
      console.log(error);
      toast.error('Error fetching flash card sets: ' + error.message);
    }
  };

  return <div>FlashCardPage</div>;
}
