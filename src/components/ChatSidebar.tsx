'use client';
import { DrizzleChat } from '@/lib/db/schema';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { MessageCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

type Props = {
    chats: DrizzleChat[];
    chatId: number
}

export default function ChatSidebar({chats, chatId}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/stripe');
      window.location.href = response.data.url;
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full h-screen p-4 text-gray-200 bg-gray-900">
      <Link href="/">
        <Button className='w-full border-dashed border-2 border-gray-700 hover:bg-gray-800/50'>
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>

      <div className="flex flex-col gap-2 mt-4">
        {
          chats.map(chat => (
            <Link href={`/chat/${chat.id}`} key={chat.id}>
              <div className={cn('rounded-lg p-3 text-slate-300 flex items-center', {'bg-blue-600': chat.id === chatId,
                'hover:text-white hover:bg-blue-600': chat.id !== chatId
              })}>
                <MessageCircle className="w-6 h-6" />
                <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">{chat.pdfName}</p>
              </div>
            </Link>
          ))
        }
      </div>

      <div className="absolute bottom-8 left-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
          <Link href="/">Home</Link>
          <Link href="/">Source</Link>
        </div>
           {/* Stripe Button */}
           <Button className="mt-2 text-wihte bg-slate-700" disabled={isLoading} onClick={handleSubscription}>
            Upgrade To Pro
           </Button>
      </div>
    </div>
  )
}
