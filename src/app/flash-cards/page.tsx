'use client';
import SidebarWrapper from '@/components/SidebarWrapper'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const FlashCardsPage = () => {
    const [flashCardSets, setFlashCardSets] = useState<any>([]);

    useEffect(() => {
        handleGetFlashCardSets();
    }, []);

    const handleGetFlashCardSets = async () => {
        try {
            const response = await axios.get('/api/flashcard-set/get');
            
            if (response.data.error) {
                toast.error('Error fetching flash card sets: ' + response.data.error);
                return;
            }

            setFlashCardSets(response.data.flashCardSets);
        } catch (error: any) { 
            console.log(error);
            toast.error('Error fetching flash card sets: ' + error.message);
        }
    }

  return (
    <SidebarWrapper>
      <h1 className="text-3xl font-bold ">Flash Cards</h1>
      <h6 className="text-md font-bold text-gray-400">
        Enhanced reading and learning experience with flash cards
      </h6>
    </SidebarWrapper>
  )
}

export default FlashCardsPage