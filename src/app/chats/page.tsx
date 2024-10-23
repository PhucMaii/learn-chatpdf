'use client';
import SidebarWrapper from '@/components/SidebarWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DrizzleChat } from '@/lib/db/schema';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import axios from 'axios';
import { API_URL } from '@/lib/type';
import LoadingComponent from '@/components/LoadingComponent';
import useDebounce from '../../../hooks/useDebounce';
import ChatsTable from '@/components/Chats/ChatsTable';
import { checkSubscription } from '@/lib/subscription';

const Chats = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [searchKeywords, setSearchKeywords] = useState<string>('');
  const [userChats, setUserChats] = useState<any>({
    baseData: [],
    displayData: [],
  });

  const debouncedKeywords = useDebounce(searchKeywords, 1000);


  useEffect(() => {
    const checkIsPro = async () => {
      const fetchedSubscription = await checkSubscription();
      
      setSubscription(fetchedSubscription);
    }

    checkIsPro();
    fetchUserChats();
  }, []);

  useEffect(() => {
    if (debouncedKeywords) {
      const newChats = userChats.baseData.filter((chat: DrizzleChat) => {
        return chat.pdfName
          .toLowerCase()
          .includes(debouncedKeywords.toLowerCase());
      });

      setUserChats({ ...userChats, displayData: newChats });
    } else {
      setUserChats({ ...userChats, displayData: userChats.baseData });
    }
  }, [debouncedKeywords]);

  const fetchUserChats = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL.USER}/chats`);

      if (response.data.error) {
        toast.error('Error fetching user chats: ' + response.data.error);
        return;
      }

      setUserChats({
        baseData: response.data.chats,
        displayData: response.data.chats,
      });

      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      toast.error('Error fetching user chats: ' + error.message);
      setIsLoading(false);
    }
  };

  return (
    <SidebarWrapper>
      {/* Header */}
      <h1 className="text-3xl font-bold ">Chats</h1>
      <h6 className="text-md font-bold text-gray-400">
        Make conversations with your PDFs
      </h6>

      {/* Search bar */}
      <div className="flex gap-2 w-full mt-6">
        <Input
          placeholder="Search chats..."
          value={searchKeywords}
          onChange={(e) => setSearchKeywords(e.target.value)}
        />
        {subscription?.isPro || subscription?.isAbleToAddMoreChats ? (
          <Link href="/create-chat">
            <Button className="bg-black">+ New Chat</Button>
          </Link>
        ) : (
          <Button disabled className="bg-black cursor-not-allowed">+ New Chat</Button>
        )}
      </div>

      {/* Chats */}
      <h4 className="text-lg mt-6 font-bold">Recent chats</h4>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <ChatsTable
          userChats={userChats.displayData}
          setUserChats={setUserChats}
          subscription={subscription}
        />
      )}
    </SidebarWrapper>
  );
};

export default Chats;
