'use client';
import { DrizzleChat } from '@/lib/db/schema';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { ArrowLeftIcon, MessageCircle, MessageCircleMoreIcon, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import SubscriptionButton from './SubscriptionButton';
import NavBar from './NavBar';

type Props = {
    chats: DrizzleChat[];
    chatId: number;
    isPro: boolean;
}


export default function ChatSidebar({chats, chatId, isPro}: Props) {

  return (
    <div className="w-full h-screen p-4 text-gray-200 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/chats">
            <ArrowLeftIcon className="w-8 h-8 text-black" />
        </Link>
        <h6 className="text-lg font-semibold text-black">
          Chats
        </h6>

        {!isPro && <SubscriptionButton isPro={isPro} />}

      </div>
      <Link href="/create-chat">
        <Button className='w-full border-dashed border-2 border-black text-black bg-white hover:bg-emerald-500 hover:text-white'>
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>

      <div className="flex flex-col gap-2 mt-4">
        {
          chats.map(chat => (
            <Link href={`/chat/${chat.id}`} key={chat.id}>
              <div className={cn('rounded-lg p-3 text-slate-400 flex items-center gap-2 font-semibold', {'text-emerald-500': chat.id === chatId,
                'hover:text-emerald-500': chat.id !== chatId
              })}>
                <MessageCircleMoreIcon className="w-6 h-6" />
                <p className="w-full overflow-hidden text-md truncate whitespace-nowrap text-ellipsis">{chat.pdfName}</p>
              </div>
            </Link>
          ))
        }
      </div>
      

    </div>
  )
}
