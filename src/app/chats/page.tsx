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

const Chats = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [isTrial, setIsTrial] = useState<boolean>(false);
  const [searchKeywords, setSearchKeywords] = useState<string>('');
  const [userChats, setUserChats] = useState<any>({
    baseData: [],
    displayData: [],
  });

  const debouncedKeywords = useDebounce(searchKeywords, 1000);

  useEffect(() => {
    fetchUserChats();
  }, []);

  useEffect(() => {
    getSubscription();
  }, [userChats]);

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


  const getIsTrial = async () => {
    try {
      const response = await axios.get(`${API_URL.USER}/subscription/is-trial`);
      
      if (response.data.error) {
        toast.error('Error fetching subscription: ' + response.data.error);
        return;
      }

      console.log(response.data.isTrial, 'istrial from response');
      setIsTrial(response.data.isTrial);
      return response.data.isTrial;
    } catch (error) {
      console.log(error);
      toast.error('Error fetching subscription: ' + error);
    }
  }

  const getSubscription = async () => {
    try {
      const response = await axios.get(`${API_URL.USER}/subscription/is-pro`);
      
      if (response.data.error) {
        toast.error('Error fetching subscription: ' + response.data.error);
        return;
      }

      if (response.data.isPro) {
        setIsPro(true);
        return;
      }

      const isTrial = await getIsTrial();
      if (userChats.baseData.length < 2 && isTrial) {
        setIsPro(true);
        return;
      }

      setIsPro(false);
    } catch (error) {
      console.log(error);
      toast.error('Error fetching subscription: ' + error);
    }
  }

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
        {isPro ? (
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
          isPro={isTrial}
        />
      )}
    </SidebarWrapper>
  );
};

export default Chats;
