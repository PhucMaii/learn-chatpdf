'use client';
import SidebarWrapper from '@/components/SidebarWrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DrizzleChat } from '@/lib/db/schema'
import { FileTextIcon, MoreVerticalIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import toast from 'react-hot-toast'
import Link from 'next/link'
import axios from 'axios';
import { API_URL } from '@/lib/type';
import LoadingComponent from '@/components/LoadingComponent';
import useDebounce from '../../../hooks/useDebounce';
import MoreChat from '@/components/Chats/MoreChat';


const Chats = () => {
  const [searchKeywords, setSearchKeywords] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [userChats, setUserChats] = useState<any>({baseData: [], displayData: []});

  const debouncedKeywords = useDebounce(searchKeywords, 1000);

  useEffect(() => {
    fetchUserChats();
  }, []);

  useEffect(() => {
    if (debouncedKeywords) {
      const newChats = userChats.baseData.filter((chat: DrizzleChat) => {
        return chat.pdfName.toLowerCase().includes(debouncedKeywords.toLowerCase());
      });

      setUserChats({...userChats, displayData: newChats});
    } else {
      setUserChats({...userChats, displayData: userChats.baseData});
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

      setUserChats({baseData:response.data.chats, displayData:response.data.chats});

      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      toast.error('Error fetching user chats: ' + error.message);
      setIsLoading(false);
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
        placeholder='Search chats...'
        value={searchKeywords}
        onChange={(e) => setSearchKeywords(e.target.value)}
       />
       <Link href="/create-chat">
        <Button className="bg-black ">+ New Chat</Button>
       </Link>
      </div>

      {/* Chats */}
      <h4 className="text-lg mt-6 font-bold">Recent chats</h4>
      {isLoading ? (
              <LoadingComponent />
            ) :<Table className="mt-4">
        <TableCaption>A list of your chats with your PDFs.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Type</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Last opened</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          
             {userChats.displayData.length > 0 && userChats.displayData.map((chat: DrizzleChat) => (
              <TableRow key={chat?.id}>
                <TableCell><FileTextIcon /></TableCell>
                <TableCell className="font-bold text-md">{chat?.pdfName}</TableCell>
                <TableCell className="font-bold text-md text-gray-600">{new Date(chat?.createdAt).toDateString()}</TableCell>
                <TableCell className="font-bold text-md text-gray-600">{new Date(chat.createdAt).toDateString()}</TableCell>
                <TableCell>
                  {/* <Button className="bg-transparent text-black hover:bg-gray-200 px-1">
                    <MoreVerticalIcon />
                  </Button> */}
                  <MoreChat />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
          }

    </SidebarWrapper>
  )
}

export default Chats