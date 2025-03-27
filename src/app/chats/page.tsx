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
import useDebounce from '../../../hooks/useDebounce';
import ChatsTable from '@/components/Chats/ChatsTable';
import { checkSubscription } from '@/lib/subscription';
import LoadingComponent from '@/components/LoadingComponent';

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
    };

    checkIsPro();
    fetchUserChats();
  }, [userChats.baseData.length]);

  useEffect(() => {
    if (debouncedKeywords) {
      const newChats = userChats.baseData.filter((chat: DrizzleChat) => {
        return (chat?.pdfName || '')
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
        toast.error('Something went wrong in fetching user chats');
        return;
      }

      setUserChats({
        baseData: response.data.chatList,
        displayData: response.data.chatList,
      });

      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      toast.error('Something went wrong in fetching user chats');
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
      <div className="flex gap-2 mt-6 rounded-lg">
        <Input
          placeholder="Search chats..."
          value={searchKeywords}
          onChange={(e) => setSearchKeywords(e.target.value)}
          className="rounded-md border-1 border-gray-300"
        />
        {subscription?.isPro || subscription?.isAbleToAddMoreChats ? (
          <Link href="/create-chat">
            <Button className="bg-black text-white font-semibold transition-all duration-300 active:scale-90">
              + New Chat
            </Button>
          </Link>
        ) : (
          <Button
            disabled
            className="bg-[#1E1E1E] text-white cursor-not-allowed"
          >
            + New Chat
          </Button>
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
